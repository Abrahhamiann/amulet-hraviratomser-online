import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, unique: true, sparse: true, default: undefined },
    password: { type: String, select: false },
    tokenVersion: { type: Number, default: 0, select: false },
    role: { type: String, enum: ['user', 'admin', 'super_admin'], default: 'user' },
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    passwordResetCodeHash: { type: String, select: false, default: '' },
    passwordResetCodeExpires: { type: Date, select: false, default: null },
    passwordResetAttempts: { type: Number, select: false, default: 0 },
    passwordResetTokenHash: { type: String, select: false, default: '' },
    passwordResetTokenExpires: { type: Date, select: false, default: null },
    passwordResetRequestedAt: { type: Date, select: false, default: null },
    telegram: {
      chatId: { type: String, default: '' },
      userId: { type: String, default: '' },
      username: { type: String, default: '' },
      firstName: { type: String, default: '' },
      language: {
        type: String,
        enum: ['hy', 'en', 'ru'],
        default: 'hy'
      },
      notificationsEnabled: { type: Boolean, default: true },
      connectedAt: { type: Date, default: null }
    },
    telegramLinkTokenHash: { type: String, select: false, default: '' },
    telegramLinkExpires: { type: Date, select: false, default: null },
    telegramLinkLanguage: { type: String, select: false, default: 'hy' }
  },
  { timestamps: true }
);

userSchema.index({ 'telegram.chatId': 1 }, { sparse: true });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) return next();
  if (/^\$2[aby]\$/.test(this.password)) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function matchPassword(password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
