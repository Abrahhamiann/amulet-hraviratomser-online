import mongoose from 'mongoose';

// Immutable checkout terms, shared by the payment and purchased order.
export const creatorFields = {
  creatorPromoId: { type: mongoose.Schema.Types.ObjectId, ref: 'PromoCode', default: null },
  creatorName: { type: String, default: '' },
  creatorCommissionPercent: { type: Number, min: 0, max: 100, default: 0 },
  creatorCommissionAmount: { type: Number, min: 0, default: 0 }
};
