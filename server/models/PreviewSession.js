import mongoose from 'mongoose';

const previewSessionSchema = new mongoose.Schema(
  {
    tokenHash: { type: String, required: true, unique: true, select: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    invitationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invitation', default: null },
    isPurchased: { type: Boolean, default: false },
    expiresAt: { type: Date, required: false }
  },
  { timestamps: true }
);

previewSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('PreviewSession', previewSessionSchema);
