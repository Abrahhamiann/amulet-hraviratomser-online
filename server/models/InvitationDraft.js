import mongoose from 'mongoose';

const invitationDraftSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
    data: {
      mainNames: { type: String, default: '' },
      eventDate: { type: String, default: '' },
      eventTime: { type: String, default: '18:00' },
      eventLocation: { type: String, default: '' },
      mapLink: { type: String, default: '' },
      mapLinks: [{
        label: { type: String, default: '' },
        url: { type: String, default: '' }
      }],
      eventMessage: { type: String, default: '' },
      image: { type: String, default: '' },
      gallery: [{ type: String }],
      colors: {
        accent: { type: String, default: '#d8b98e' },
        text: { type: String, default: '#ffffff' },
        overlay: { type: String, default: '#202020' }
      }
    },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

invitationDraftSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('InvitationDraft', invitationDraftSchema);
