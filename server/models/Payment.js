import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    provider: { type: String, enum: ['arca'], default: 'arca', required: true },
    status: {
      type: String,
      enum: ['CREATED', 'PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED'],
      default: 'CREATED',
      index: true
    },
    localOrderId: { type: String, required: true, unique: true },
    arcaOrderId: { type: String, unique: true, sparse: true },
    formUrl: { type: String, default: '' },
    activeKey: { type: String, unique: true, sparse: true },
    amount: { type: Number, required: true, min: 0 },
    providerAmount: { type: String, required: true },
    currency: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
    previewSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PreviewSession', default: null },
    draftId: { type: mongoose.Schema.Types.ObjectId, ref: 'InvitationDraft', default: null },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    originalAmount: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    promoCode: { type: String, default: '' },
    promoGift: { type: String, default: '' },
    providerStatus: { type: String, default: '' },
    providerErrorCode: { type: String, default: '' },
    providerErrorMessage: { type: String, default: '' },
    sanitizedProviderResponse: { type: mongoose.Schema.Types.Mixed, default: {} },
    registrationLockAt: { type: Date, default: null },
    finalizationLockAt: { type: Date, default: null },
    refundRequestedAt: { type: Date, default: null },
    paidAt: { type: Date, default: null },
    failedAt: { type: Date, default: null },
    refundedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

paymentSchema.index({ userId: 1, templateId: 1, status: 1, createdAt: -1 });

export default mongoose.model('Payment', paymentSchema);
