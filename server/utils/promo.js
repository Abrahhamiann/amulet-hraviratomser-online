import PromoCode from '../models/PromoCode.js';

export const normalizePromoCode = (code) => String(code || '')
  .trim()
  .toUpperCase()
  .replace(/[^A-Z0-9_-]/g, '')
  .slice(0, 32);

export const resolvePromo = async (rawCode, originalAmount) => {
  const code = normalizePromoCode(rawCode);
  if (!code) return null;

  const now = new Date();
  const promo = await PromoCode.findOne({
    code,
    isActive: true,
    $and: [
      { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] },
      { $or: [{ maxUses: 0 }, { $expr: { $lt: ['$usageCount', '$maxUses'] } }] }
    ]
  });
  if (!promo) return null;

  const amount = Math.max(0, Number(originalAmount) || 0);
  const rawDiscount = promo.discountType === 'percent'
    ? amount * (Math.min(90, promo.value) / 100)
    : Math.min(amount - 1, promo.value);
  const discountAmount = Math.max(0, Math.round(rawDiscount));
  const finalAmount = Math.max(1, amount - discountAmount);

  return { promo, code, originalAmount: amount, discountAmount, finalAmount };
};
