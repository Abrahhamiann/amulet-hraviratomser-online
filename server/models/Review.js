import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    customer: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    text: { type: String, required: true },
    target: { type: String, default: 'Amulet' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'featured'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
