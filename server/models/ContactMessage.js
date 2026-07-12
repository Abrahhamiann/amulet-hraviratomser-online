import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    replies: [
      {
        subject: { type: String, default: '' },
        message: { type: String, required: true },
        sentAt: { type: Date, default: Date.now }
      }
    ],
    repliedAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', contactMessageSchema);
