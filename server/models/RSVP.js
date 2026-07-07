import mongoose from 'mongoose';

const rsvpSchema = new mongoose.Schema(
  {
    invitationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invitation', required: true },
    guestName: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ['attending', 'declined', 'unsure'],
      required: true
    },
    guestCount: { type: Number, default: 1 },
    message: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('RSVP', rsvpSchema);
