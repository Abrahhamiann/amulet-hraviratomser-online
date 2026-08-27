import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, sparse: true, uppercase: true, trim: true, match: /^[A-H][1-9]\d*$/ },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ['wedding', 'baptism', 'birth', 'engagement', 'corporate', 'new_year', 'meeting', 'military'],
      required: true
    },
    editorType: {
      type: String,
      enum: ['wedding', 'baptism', 'birth', 'corporate', 'engagement']
    },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    designKey: { type: String, default: 'ivory-vows', trim: true },
    mainImage: { type: String, default: '' },
    pagePreviewImage: { type: String, default: '' },
    pagePreviewAvailable: { type: Boolean, default: false },
    imagePosition: {
      x: { type: Number, default: 50, min: 0, max: 100 },
      y: { type: Number, default: 50, min: 0, max: 100 },
      zoom: { type: Number, default: 1, min: 1, max: 2 }
    },
    gallery: [{ type: String }],
    galleryConfigured: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null, index: true },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

templateSchema.pre('validate', function syncPagePreviewAvailability() {
  this.pagePreviewAvailable = Boolean(String(this.pagePreviewImage || '').trim());
});

templateSchema.index({ deletedAt: 1, isActive: 1, designKey: 1, category: 1, createdAt: -1 });

export default mongoose.model('Template', templateSchema);
