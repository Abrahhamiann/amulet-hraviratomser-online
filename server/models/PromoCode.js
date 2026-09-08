import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: '', trim: true },
    kind: { type: String, enum: ['standard', 'creator'], default: 'standard' },
    creatorName: { type: String, default: '' },
    creatorContact: { type: String, default: '' },
    creatorCommissionPercent: { type: Number, min: 0, max: 100, default: 0 },
    creatorChatId: { type: String, default: '' },
    creatorLinkTokenHash: { type: String, default: '', select: false },
    creatorLinkExpires: { type: Date, default: null },
    creatorLinkClaimedChatId: { type: String, default: '', select: false },
    creatorConnectedAt: { type: Date, default: null },
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
