import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', unique: true, sparse: true },
    invitationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invitation', default: null },
    staticKey: { type: String, unique: true, sparse: true, trim: true },
    customer: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    text: { type: String, required: true, trim: true, maxlength: 1200 },
    target: { type: String, default: 'Amulet' },
    language: { type: String, default: 'hy', trim: true, lowercase: true },
    source: {
      type: String,
      enum: ['user', 'static', 'admin'],
      default: 'user'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'featured'],
      default: 'pending'
    },
    publishedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
