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
        channel: { type: String, enum: ['telegram', 'email'], default: 'email' },
        deliveredTo: { type: String, default: '' },
        adminChatId: { type: String, default: '' },
        sentAt: { type: Date, default: Date.now }
      }
    ],
    repliedAt: { type: Date },
    lastReminderAt: { type: Date, default: null },
    reminderCount: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

contactMessageSchema.index({ repliedAt: 1, createdAt: 1, lastReminderAt: 1 });

export default mongoose.model('ContactMessage', contactMessageSchema);
