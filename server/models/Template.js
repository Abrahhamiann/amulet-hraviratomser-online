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
    designKey: { type: String, default: 'midnight-vows', trim: true },
    mainImage: { type: String, default: '' },
    desktopPreviewImage: { type: String, default: '' },
    mobilePreviewImage: { type: String, default: '' },
    imagePosition: {
      x: { type: Number, default: 50, min: 0, max: 100 },
      y: { type: Number, default: 50, min: 0, max: 100 },
      zoom: { type: Number, default: 1, min: 1, max: 2 }
    },
    gallery: [{ type: String }],
    galleryConfigured: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Template', templateSchema);
