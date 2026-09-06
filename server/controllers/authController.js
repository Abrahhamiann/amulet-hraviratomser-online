import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import PendingRegistration from '../models/PendingRegistration.js';
import User from '../models/User.js';
import { clearAuthCookie, setAuthCookie } from '../utils/authCookie.js';
import { isStrongPassword, isValidEmail, normalizeEmail, normalizePhone } from '../utils/accountValidation.js';
import { emailShell, sendMail } from '../utils/mailer.js';
import { signToken } from '../utils/token.js';
import { canLinkGoogleIdentity, validGoogleProfile } from '../utils/googleIdentity.js';

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  role: user.role,
  provider: user.provider,
  isEmailVerified: user.isEmailVerified
});

const createVerificationCode = () => String(crypto.randomInt(100000, 1000000));
const hashSecret = (value) => crypto.createHash('sha256').update(String(value)).digest('hex');

const sendCodeEmail = async ({ email, code, purpose }) => {
  const isReset = purpose === 'reset';
  await sendMail({
    to: email,
    subject: isReset ? 'Amulet password reset code' : 'Amulet email verification code',
    text: `${isReset ? 'Password reset' : 'Email verification'} code: ${code}. The code is valid for 10 minutes.`,
    html: emailShell({
      title: isReset ? 'Reset your password' : 'Verify your email',
      intro: isReset ? 'Use this code to continue resetting your password.' : 'Use this code to verify your email address.',
      body: `<div style="padding:8px 0;font-size:32px;font-weight:800;letter-spacing:10px;text-align:center">${code}</div>`,
      footer: 'The code is valid for 10 minutes. If you did not request this, you can safely ignore this email.'
    })
  });
};

const deliverCodeEmail = async (options) => {
  try {
    await sendCodeEmail(options);
  } catch (error) {
    console.error('Verification email delivery failed:', error.code || error.message);
    const deliveryError = new Error('Verification email could not be sent. Please try again');
    deliveryError.statusCode = 503;
    throw deliveryError;
  }
};

export const register = asyncHandler(async (req, res) => {
  const { email, phone, password, confirmPassword, name } = req.body || {};
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);
  if (typeof name !== 'string' || name.trim().length > 160) {
    res.status(400);
    throw new Error('Name must be at most 160 characters');
  }
  if (!String(name || '').trim() || !normalizedEmail || !String(phone || '').trim() || !password || !confirmPassword) {
    res.status(400);
    throw new Error('Name, email, phone, password, and password confirmation are required');
  }
  if (!isValidEmail(normalizedEmail)) {
    res.status(400);
    throw new Error('A valid email address is required');
  }
  if (!normalizedPhone) {
    res.status(400);
    throw new Error('A valid phone number is required');
  }
  if (password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match');
  }
  if (!isStrongPassword(password)) {
    res.status(400);
    throw new Error('Password must be 8-128 characters and include uppercase, lowercase, number, and special character');
  }

  const existing = await User.findOne({ $or: [{ email: normalizedEmail }, { phone: normalizedPhone }] });
  if (existing) {
    res.status(409);
    throw new Error(existing.email === normalizedEmail ? 'Account already exists' : 'Phone number is already in use');
  }

  const pendingPhone = await PendingRegistration.findOne({ phone: normalizedPhone, email: { $ne: normalizedEmail } });
  if (pendingPhone) {
    res.status(409);
    throw new Error('Phone number is already in use');
  }

  const verificationCode = createVerificationCode();
  const passwordHash = await bcrypt.hash(password, 10);
  const pending = await PendingRegistration.findOneAndUpdate(
    { email: normalizedEmail },
    {
      name: String(name).trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      passwordHash,
      verificationCode: hashSecret(verificationCode),
      verificationExpires: new Date(Date.now() + 10 * 60 * 1000),
      attempts: 0
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await deliverCodeEmail({ email: pending.email, code: verificationCode, purpose: 'verify' });

  res.status(201).json({ message: 'Verification code sent', email: pending.email });
});

export const login = asyncHandler(async (req, res) => {
  const identifier = String(req.body?.identifier || req.body?.email || '').trim();
  const { password } = req.body || {};
  if (!identifier || typeof password !== 'string' || !password || password.length > 128 || identifier.length > 254) {
    res.status(400);
    throw new Error('Email or phone and password are required');
  }
  const normalizedEmail = normalizeEmail(identifier);
  const normalizedPhone = normalizePhone(identifier);
  if (!isValidEmail(normalizedEmail) && !normalizedPhone) {
    res.status(401);
    throw new Error('Invalid email/phone or password');
  }
  const user = await User.findOne({
    $or: [
      ...(isValidEmail(normalizedEmail) ? [{ email: normalizedEmail }] : []),
      ...(normalizedPhone ? [{ phone: normalizedPhone }] : [])
    ]
  }).select('+password +tokenVersion');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email/phone or password');
  }
  if (!user.isEmailVerified) {
    res.status(403);
    throw new Error('Please verify your email before signing in');
  }
  setAuthCookie(res, signToken(user));
  res.json({ success: true, user: publicUser(user) });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body || {};
  if (!email || !code) {
    res.status(400);
    throw new Error('Email and verification code are required');
  }

  const normalizedEmail = normalizeEmail(email);
  const pending = await PendingRegistration.findOneAndUpdate({
    email: normalizedEmail, verificationExpires: { $gt: new Date() }, attempts: { $lt: 5 }
  }, { $inc: { attempts: 1 } }, { new: true });
  if (!pending) {
    res.status(400);
    throw new Error('Verification code expired');
  }
  if (pending.verificationCode !== hashSecret(String(code).trim())) {
    res.status(400);
    throw new Error('Verification code is incorrect');
  }

  const existing = await User.findOne({ $or: [{ email: normalizedEmail }, { phone: pending.phone }] });
  if (existing) {
    await PendingRegistration.deleteOne({ _id: pending._id });
    res.status(409);
    throw new Error('Account already exists');
  }

  const consumed = await PendingRegistration.findOneAndDelete({
    _id: pending._id, verificationCode: pending.verificationCode, verificationExpires: { $gt: new Date() }
  });
  if (!consumed) {
    res.status(400);
    throw new Error('Verification code expired');
  }
  const user = new User({
    name: pending.name,
    email: pending.email,
    phone: pending.phone,
    password: pending.passwordHash,
    provider: 'local',
    isEmailVerified: true
  });
  user.$locals.passwordIsHashed = true;
  await user.save();
  setAuthCookie(res, signToken(user));
  res.json({ success: true, user: publicUser(user) });
});

export const requestPasswordReset = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  if (!isValidEmail(email)) {
    res.status(400);
    throw new Error('A valid email address is required');
  }

  const code = createVerificationCode();
  const user = await User.findOneAndUpdate({
    email,
    $or: [{ passwordResetRequestedAt: null }, { passwordResetRequestedAt: { $lt: new Date(Date.now() - 60000) } }]
  }, { $set: {
    passwordResetCodeHash: hashSecret(code), passwordResetCodeExpires: new Date(Date.now() + 10 * 60 * 1000),
    passwordResetAttempts: 0, passwordResetTokenHash: '', passwordResetTokenExpires: null,
    passwordResetRequestedAt: new Date()
  } }, { new: true });
  if (user) {
    await deliverCodeEmail({ email: user.email, code, purpose: 'reset' });
  }

  res.json({ message: 'If an account exists for this email, a reset code has been sent' });
});

export const verifyPasswordResetCode = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const code = String(req.body?.code || '').trim();
  const user = await User.findOneAndUpdate({
    email, passwordResetCodeExpires: { $gt: new Date() }, passwordResetAttempts: { $lt: 5 }, passwordResetCodeHash: { $ne: '' }
  }, { $inc: { passwordResetAttempts: 1 } }, { new: true }).select('+passwordResetCodeHash +passwordResetCodeExpires +passwordResetAttempts');
  if (!user || !/^\d{6}$/.test(code) || !user.passwordResetCodeHash || user.passwordResetCodeExpires < new Date()) {
    res.status(400);
    throw new Error('Reset code is invalid or expired');
  }
  const supplied = Buffer.from(hashSecret(code), 'hex');
  const expected = Buffer.from(user.passwordResetCodeHash, 'hex');
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
    res.status(400);
    throw new Error('Reset code is invalid or expired');
  }

  const resetToken = crypto.randomBytes(32).toString('base64url');
  const consumed = await User.findOneAndUpdate({
    _id: user._id, passwordResetCodeHash: user.passwordResetCodeHash, passwordResetCodeExpires: { $gt: new Date() }
  }, { $set: {
    passwordResetCodeHash: '', passwordResetCodeExpires: null,
    passwordResetTokenHash: hashSecret(resetToken),
    passwordResetTokenExpires: new Date(Date.now() + 15 * 60 * 1000)
  } });
  if (!consumed) {
    res.status(400);
    throw new Error('Reset code is invalid or expired');
  }
  res.json({ email: user.email, resetToken });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const resetToken = String(req.body?.resetToken || '');
  const { password, confirmPassword } = req.body || {};
  if (!resetToken || !password || password !== confirmPassword) {
    res.status(400);
    throw new Error(password !== confirmPassword ? 'Passwords do not match' : 'Reset token and password are required');
  }
  if (!isStrongPassword(password)) {
    res.status(400);
    throw new Error('Password must be 8-128 characters and include uppercase, lowercase, number, and special character');
  }

  const user = await User.findOne({ email }).select('+passwordResetTokenHash +passwordResetTokenExpires +tokenVersion');
  if (!user || !user.passwordResetTokenHash || user.passwordResetTokenExpires < new Date()) {
    res.status(400);
    throw new Error('Password reset session is invalid or expired');
  }
  const supplied = Buffer.from(hashSecret(resetToken), 'hex');
  const expected = Buffer.from(user.passwordResetTokenHash, 'hex');
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
    res.status(400);
    throw new Error('Password reset session is invalid or expired');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const consumed = await User.findOneAndUpdate({
    _id: user._id, passwordResetTokenHash: hashSecret(resetToken), passwordResetTokenExpires: { $gt: new Date() }
  }, { $set: {
    password: passwordHash, passwordResetTokenHash: '', passwordResetTokenExpires: null,
    passwordResetCodeHash: '', passwordResetCodeExpires: null, passwordResetAttempts: 0
  }, $inc: { tokenVersion: 1 } });
  if (!consumed) {
    res.status(400);
    throw new Error('Password reset session is invalid or expired');
  }
  clearAuthCookie(res);
  res.json({ success: true, message: 'Password updated successfully' });
});

export const googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body || {};
  if (typeof idToken !== 'string' || !idToken || idToken.length > 8192) {
    res.status(400);
    throw new Error('Google credential is required');
  }
  if (!process.env.GOOGLE_CLIENT_ID) {
    res.status(500);
    throw new Error('Google sign-in is not configured');
  }

  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`, {
    signal: AbortSignal.timeout(10000), redirect: 'error'
  });
  if (!response.ok) {
    res.status(401);
    throw new Error('Invalid Google credential');
  }
  const profile = await response.json();
  if (!validGoogleProfile(profile, process.env.GOOGLE_CLIENT_ID)) {
    res.status(401);
    throw new Error('Google credential is not valid for this app');
  }

  const email = normalizeEmail(profile.email);
  let user = await User.findOne({ email }).select('+tokenVersion');
  if (!user) {
    if (!canLinkGoogleIdentity({ role: 'user' }, profile)) {
      res.status(403);
      throw new Error('Register and verify this email address before signing in');
    }
    user = await User.create({
      name: profile.name || email.split('@')[0],
      email,
      provider: 'google',
      googleId: profile.sub,
      isEmailVerified: profile.email_verified === 'true' || profile.email_verified === true
    });
  } else {
    if (!canLinkGoogleIdentity(user, profile)) {
      res.status(403);
      throw new Error('Sign in with your existing account credentials');
    }
    user.provider = user.provider || 'google';
    user.googleId = user.googleId || profile.sub;
    user.isEmailVerified = true;
    await user.save();
  }

  setAuthCookie(res, signToken(user));
  res.json({ success: true, user: publicUser(user) });
});

export const googleAuthConfig = asyncHandler(async (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ clientId: String(process.env.GOOGLE_CLIENT_ID || '').trim() });
});

export const me = asyncHandler(async (req, res) => {
  res.json(publicUser(req.user));
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true });
});
