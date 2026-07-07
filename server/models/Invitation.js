import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
    eventType: { type: String, required: true },
    names: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    mapLink: { type: String, default: '' },
    message: { type: String, default: '' },
    gallery: [{ type: String }],
    language: { type: String, default: 'hy' },
    isPublished: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Invitation', invitationSchema);
