import asyncHandler from 'express-async-handler';
import PromoCode from '../models/PromoCode.js';
import Template from '../models/Template.js';
import { normalizePromoCode, resolvePromo } from '../utils/promo.js';

export const normalizePromoExpiry = (value) => {
  if (!value) return null;
  const dateOnly = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const date = dateOnly
    ? new Date(`${dateOnly[1]}-${dateOnly[2]}-${dateOnly[3]}T23:59:59.999+04:00`)
    : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const cleanPromoPayload = (body = {}) => {
  const discountType = body.discountType === 'fixed' ? 'fixed' : 'percent';
  const value = Math.max(0, Number(body.value) || 0);
  return {
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
  if (!template || template.isActive === false) {
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
  res.json(await PromoCode.find().sort({ createdAt: -1 }));
});

export const createAdminPromoCode = asyncHandler(async (req, res) => {
  const payload = cleanPromoPayload(req.body);
  if (!payload.code || !payload.value) {
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
  Object.assign(promo, cleanPromoPayload(req.body));
  await promo.save();
  res.json(promo);
});

export const deleteAdminPromoCode = asyncHandler(async (req, res) => {
  const promo = await PromoCode.findById(req.params.id);
  if (!promo) {
    res.status(404);
    throw new Error('Promo code not found');
  }
  await promo.deleteOne();
  res.json({ success: true });
});
