import asyncHandler from 'express-async-handler';
import PromoCode from '../models/PromoCode.js';
import Payment from '../models/Payment.js';
import { clientUrl } from '../config/env.js';
import { creatorPurchaseMessage } from '../utils/creatorTelegram.js';
import { isTelegramAdmin } from '../utils/telegram.js';

const ownedPromos = async (chatId) => {
  const id = String(chatId || '');
  const promos = /^\d+$/.test(id) ? await PromoCode.find({ kind: 'creator', creatorChatId: id }).select('code creatorName creatorCommissionPercent').lean() : [];
  if (!promos.length) throw Object.assign(new Error('Creator account is not connected'), { statusCode: 403 });
  return promos;
};
const invitationUrl = (order) => order?.invitationId?.slug ? `${clientUrl()}/invite/${encodeURIComponent(order.invitationId.slug)}` : '';

const creatorDashboardData = async (promos, requestedPage) => {
  const filter = { creatorPromoId: { $in: promos.map((promo) => promo._id) }, status: { $in: ['PAID', 'REFUNDED'] } };
  const month = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Yerevan', year: 'numeric', month: '2-digit' }).format(new Date());
  const monthStart = new Date(`${month}-01T00:00:00+04:00`);
  const summary = [{ $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$amount' }, commission: { $sum: '$creatorCommissionAmount' } } }];
  const [total, aggregates] = await Promise.all([
    Payment.countDocuments(filter),
    Payment.aggregate([{ $match: filter }, { $facet: {
      all: [{ $match: { status: 'PAID' } }, ...summary],
      month: [{ $match: { status: 'PAID', paidAt: { $gte: monthStart } } }, ...summary]
    } }])
  ]);
  const pages = Math.max(1, Math.ceil(total / 5));
  const page = Math.min(pages - 1, Math.max(0, Math.floor(Number(requestedPage) || 0)));
  const payments = await Payment.find(filter).sort({ paidAt: -1, _id: -1 }).skip(page * 5).limit(5)
    .populate({ path: 'orderId', select: 'mainNames templateId', populate: { path: 'templateId', select: 'title' } }).lean();
  const empty = { count: 0, revenue: 0, commission: 0 };
  return { name: promos[0].creatorName, promos: promos.map((p) => ({ code: p.code, percent: p.creatorCommissionPercent })),
    page, pages, total, summary: aggregates[0]?.all[0] || empty, month: aggregates[0]?.month[0] || empty,
    purchases: payments.map((p) => ({ id: String(p._id), code: p.promoCode, paidAt: p.paidAt, amount: p.amount,
      commission: p.creatorCommissionAmount, percent: p.creatorCommissionPercent, status: p.status,
      title: p.orderId?.mainNames || p.orderId?.templateId?.title || 'Հրավեր' })) };
};

export const getCreatorDashboard = asyncHandler(async (req, res) => {
  res.json(await creatorDashboardData(await ownedPromos(req.query.chatId), req.query.page));
});

const requireAdmin = (chatId) => {
  if (!isTelegramAdmin(chatId)) throw Object.assign(new Error('Telegram administrator access required'), { statusCode: 403 });
};

export const getAdminCreators = asyncHandler(async (req, res) => {
  requireAdmin(req.query.chatId);
  const total = await PromoCode.countDocuments({ kind: 'creator' });
  const pages = Math.max(1, Math.ceil(total / 5));
  const page = Math.min(pages - 1, Math.max(0, Math.floor(Number(req.query.page) || 0)));
  const promos = await PromoCode.find({ kind: 'creator' }).sort({ createdAt: -1, _id: -1 }).skip(page * 5).limit(5).lean();
  const earnings = await Payment.aggregate([
    { $match: { creatorPromoId: { $in: promos.map((p) => p._id) }, status: 'PAID' } },
    { $group: { _id: '$creatorPromoId', count: { $sum: 1 }, commission: { $sum: '$creatorCommissionAmount' } } }
  ]);
  res.json({ page, pages, total, creators: promos.map((p) => ({ id: String(p._id), name: p.creatorName, code: p.code,
    contact: p.creatorContact, connected: Boolean(p.creatorChatId), usageCount: p.usageCount,
    ...(earnings.find((e) => String(e._id) === String(p._id)) || { count: 0, commission: 0 }) })) });
});

export const getAdminCreator = asyncHandler(async (req, res) => {
  requireAdmin(req.query.chatId);
  const promo = await PromoCode.findOne({ _id: req.params.promoId, kind: 'creator' }).lean();
  if (!promo) throw Object.assign(new Error('Creator not found'), { statusCode: 404 });
  const contact = promo.creatorContact || '';
  const username = contact.replace(/^@/, '');
  const telegramUrl = /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(username) ? `https://t.me/${username}`
    : promo.creatorChatId ? `tg://user?id=${promo.creatorChatId}` : '';
  res.json({ ...await creatorDashboardData([promo], req.query.page), id: String(promo._id), contact, telegramUrl,
    connected: Boolean(promo.creatorChatId), usageCount: promo.usageCount, maxUses: promo.maxUses,
    isActive: promo.isActive, expiresAt: promo.expiresAt, discountType: promo.discountType, value: promo.value });
});

export const getAdminCreatorPurchase = asyncHandler(async (req, res) => {
  requireAdmin(req.query.chatId);
  const payment = await Payment.findOne({ _id: req.params.paymentId, creatorPromoId: { $ne: null }, status: { $in: ['PAID', 'REFUNDED'] } })
    .populate({ path: 'orderId', populate: [{ path: 'templateId' }, { path: 'invitationId' }] });
  if (!payment?.orderId) throw Object.assign(new Error('Purchase not found'), { statusCode: 404 });
  res.json({ text: creatorPurchaseMessage(payment, payment.orderId), url: invitationUrl(payment.orderId),
    promoId: String(payment.creatorPromoId), orderId: String(payment.orderId._id) });
});

export const getCreatorPurchase = asyncHandler(async (req, res) => {
  const promos = await ownedPromos(req.query.chatId);
  const payment = await Payment.findOne({ _id: req.params.paymentId, creatorPromoId: { $in: promos.map((p) => p._id) },
    status: { $in: ['PAID', 'REFUNDED'] } }).populate({ path: 'orderId', populate: [{ path: 'templateId' }, { path: 'invitationId' }] });
  if (!payment?.orderId) throw Object.assign(new Error('Purchase not found'), { statusCode: 404 });
  res.json({ text: creatorPurchaseMessage(payment, payment.orderId).replace('Նոր գնում Ձեր պրոմոկոդով', 'Ձեր պրոմոկոդով գնում'), url: invitationUrl(payment.orderId) });
});
