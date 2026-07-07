import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ['wedding', 'baptism', 'birth', 'corporate', 'engagement'],
      required: true
    },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    mainImage: { type: String, default: '' },
    gallery: [{ type: String }],
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Template', templateSchema);
