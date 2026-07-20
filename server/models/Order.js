import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    eventType: { type: String, required: true },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
    eventDate: { type: Date, required: true },
    eventTime: { type: String, required: true },
    eventLocation: { type: String, required: true },
    mapLink: { type: String, default: '' },
    mapLinks: [{
      label: { type: String, default: '' },
      time: { type: String, default: '' },
      address: { type: String, default: '' },
      url: { type: String, default: '' }
    }],
    mainNames: { type: String, required: true },
    eventMessage: { type: String, default: '' },
    colors: {
      accent: { type: String, default: '#d8b98e' },
      text: { type: String, default: '#ffffff' },
      overlay: { type: String, default: '#202020' }
    },
    preferredLanguage: { type: String, default: 'hy' },
    notes: { type: String, default: '' },
    amount: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid'
    },
    stripeSessionId: { type: String, unique: true, sparse: true },
    invitationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invitation' },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'completed', 'cancelled'],
      default: 'new'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
