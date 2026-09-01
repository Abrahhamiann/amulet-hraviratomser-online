import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: '', trim: true },
    giftLabel: { type: String, default: '', trim: true },
    discountType: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
    value: { type: Number, required: true, min: 0 },
    maxUses: { type: Number, default: 0, min: 0 },
    usageCount: { type: Number, default: 0, min: 0 },
    redemptionPaymentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment', select: false }],
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default mongoose.model('PromoCode', promoCodeSchema);
