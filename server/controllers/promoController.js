import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import PromoCode from '../models/PromoCode.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Template from '../models/Template.js';
import Setting from '../models/Setting.js';
import { normalizePromoCode, resolvePromo } from '../utils/promo.js';

export const normalizePromoExpiry = (value) => {
  if (!value) return null;
  const dateOnly = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const date = dateOnly
    ? new Date(`${dateOnly[1]}-${dateOnly[2]}-${dateOnly[3]}T23:59:59.999+04:00`)
    : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const cleanPromoPayload = (body = {}) => {
  const kind = body.kind === 'creator' ? 'creator' : 'standard';
  const creatorContact = String(body.creatorContact || '').trim();
  const commission = Number(body.creatorCommissionPercent);
  if (kind === 'creator' && (!String(body.creatorName || '').trim()
    || !/^(@?[a-zA-Z][a-zA-Z0-9_]{4,31}|\+?[0-9][0-9 ()-]{6,20})$/.test(creatorContact)
    || body.creatorCommissionPercent === '' || !Number.isFinite(commission) || commission < 0 || commission > 100)) {
    throw Object.assign(new Error('Նշեք creator-ի անունը, Telegram username-ը կամ հեռախոսը և 0–100% տոկոսը'), { statusCode: 400 });
  }
  if (!normalizePromoCode(body.code) || !Number.isFinite(Number(body.value)) || Number(body.value) < (kind === 'creator' ? 0 : 1)) {
    throw Object.assign(new Error('Code and valid discount value are required'), { statusCode: 400 });
  }
  if (body.expiresAt && !normalizePromoExpiry(body.expiresAt)) {
    throw Object.assign(new Error('Invalid expiry date'), { statusCode: 400 });
  }
  const discountType = body.discountType === 'fixed' ? 'fixed' : 'percent';
  const value = Math.max(0, Number(body.value) || 0);
  return {
    kind,
    creatorName: kind === 'creator' ? String(body.creatorName).trim().slice(0, 120) : '',
    creatorContact: kind === 'creator' ? creatorContact : '',
    creatorCommissionPercent: kind === 'creator' ? commission : 0,
    code: normalizePromoCode(body.code),
    description: String(body.description || '').trim().slice(0, 240),
    giftLabel: String(body.giftLabel || '').trim().slice(0, 120),
    discountType,
    value: discountType === 'percent' ? Math.min(90, value) : value,
    maxUses: Math.max(0, Math.floor(Number(body.maxUses) || 0)),
    isActive: body.isActive !== false,
    expiresAt: normalizePromoExpiry(body.expiresAt)
  };
};

export const validatePromoCode = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.body.templateId);
  if (!template || template.deletedAt || template.isActive === false) {
    res.status(404);
    throw new Error('Template not found');
  }
  const result = await resolvePromo(req.body.code, template.price);
  if (!result) {
    res.status(400);
    throw new Error('Promo code is invalid or expired');
  }
  res.json({
    code: result.code,
    description: result.promo.description,
    giftLabel: result.promo.giftLabel,
    discountType: result.promo.discountType,
    value: result.promo.value,
    originalAmount: result.originalAmount,
    discountAmount: result.discountAmount,
    finalAmount: result.finalAmount
  });
});

export const getAdminPromoCodes = asyncHandler(async (req, res) => {
  const [promos, usageRows, creatorRows] = await Promise.all([
    PromoCode.find().sort({ createdAt: -1 }).lean(),
    Order.aggregate([
      { $match: { paymentStatus: 'paid', promoCode: { $nin: ['', null] } } },
      { $group: { _id: { $toUpper: '$promoCode' }, count: { $sum: 1 } } }
    ]),
    Order.aggregate([
      { $match: { paymentStatus: 'paid', creatorPromoId: { $ne: null } } },
      { $group: { _id: '$creatorPromoId', count: { $sum: 1 }, revenue: { $sum: '$amount' }, commission: { $sum: '$creatorCommissionAmount' } } }
    ])
  ]);
  const usageByCode = new Map(usageRows.map((item) => [item._id, item.count]));
  res.json(promos.map((promo) => ({
    ...promo,
    creatorStats: creatorRows.find((row) => String(row._id) === String(promo._id)) || { count: 0, revenue: 0, commission: 0 },
    usageCount: promo.kind === 'creator'
      ? promo.usageCount || 0
      : usageByCode.get(normalizePromoCode(promo.code)) || 0
  })));
});

export const createAdminPromoCode = asyncHandler(async (req, res) => {
  const payload = cleanPromoPayload(req.body);
  if (!payload.code || (payload.kind !== 'creator' && !payload.value)) {
    res.status(400);
    throw new Error('Code and discount value are required');
  }
  const promo = await PromoCode.create({ ...payload, createdBy: req.user._id });
  res.status(201).json(promo);
});

export const updateAdminPromoCode = asyncHandler(async (req, res) => {
  const promo = await PromoCode.findById(req.params.id);
  if (!promo) {
    res.status(404);
    throw new Error('Promo code not found');
  }
  const payload = cleanPromoPayload({ ...promo.toObject(), ...req.body });
  if (payload.kind !== promo.kind && await Payment.exists({ creatorPromoId: promo._id })) {
    throw Object.assign(new Error('Վճարումներ ունեցող creator պրոմոկոդի տեսակը չի կարող փոխվել։'), { statusCode: 409 });
  }
  if (payload.creatorContact !== promo.creatorContact || payload.kind !== promo.kind) {
    promo.creatorChatId = '';
    promo.creatorLinkTokenHash = '';
    promo.creatorLinkExpires = null;
    promo.creatorLinkClaimedChatId = '';
    promo.creatorConnectedAt = null;
  }
  Object.assign(promo, payload);
  await promo.save();
  res.json(promo);
});

export const deleteAdminPromoCode = asyncHandler(async (req, res) => {
  const promo = await PromoCode.findById(req.params.id);
  if (!promo) {
    res.status(404);
    throw new Error('Promo code not found');
  }
  if (promo.kind === 'creator' && await Payment.exists({ creatorPromoId: promo._id })) {
    throw Object.assign(new Error('Այս creator-ն ունի վճարումներ։ Պատմությունը պահպանելու համար անջատեք պրոմոկոդը։'), { statusCode: 409 });
  }
  await promo.deleteOne();
  res.json({ success: true });
});

export const createCreatorTelegramLink = asyncHandler(async (req, res) => {
  const username = (process.env.TELEGRAM_SHARED_BOT_USERNAME || process.env.TELEGRAM_BOT_USERNAME || '').trim().replace(/^@/, '');
  if (!username) throw Object.assign(new Error('Telegram bot username is not configured'), { statusCode: 503 });
  const heartbeat = await Setting.findOne({ key: 'telegram_bot_heartbeat' }).lean();
  const bot = heartbeat?.value;
  if (!bot?.creatorPromoLinks || bot.username !== username.toLowerCase()
    || !(new Date(bot.at).getTime() > Date.now() - 90000)) {
    const message = 'Այս API-ին creator-ների աջակցությամբ գործող Telegram բոտ միացված չէ։ Ադմինը և բոտը պետք է օգտագործեն նույն API-ն ու բազան։ Եթե բոտը VPS-ում է՝ օգտագործեք VPS-ի ադմինը և թարմացրեք API-ն ու բոտը միասին։';
    throw Object.assign(new Error(message), { statusCode: 503, publicMessage: message });
  }
  const token = `creator_${crypto.randomBytes(24).toString('base64url')}`;
  const promo = await PromoCode.findOneAndUpdate({ _id: req.params.id, kind: 'creator' }, { $set: {
    creatorLinkTokenHash: crypto.createHash('sha256').update(token).digest('hex'),
    creatorLinkClaimedChatId: '',
    creatorLinkExpires: new Date(Date.now() + 24 * 60 * 60 * 1000)
  } }, { new: true });
  if (!promo) throw Object.assign(new Error('Creator promo code not found'), { statusCode: 404 });
  res.json({ url: `https://t.me/${username}?start=${token}` });
});
