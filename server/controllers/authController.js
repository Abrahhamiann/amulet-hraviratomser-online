import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import PendingRegistration from '../models/PendingRegistration.js';
import User from '../models/User.js';
import { clearAuthCookie, setAuthCookie } from '../utils/authCookie.js';
import { isStrongPassword, isValidEmail, normalizeEmail, normalizePhone } from '../utils/accountValidation.js';
import { emailShell, sendMail } from '../utils/mailer.js';
import { signToken } from '../utils/token.js';

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
  if (!String(name || '').trim() || !normalizedEmail || !normalizedPhone || !password || !confirmPassword) {
    res.status(400);
    throw new Error('Name, email, phone, password, and password confirmation are required');
  }
  if (!isValidEmail(normalizedEmail)) {
    res.status(400);
    throw new Error('A valid email address is required');
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
      verificationCode,
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
  if (!identifier || !password) {
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
  const pending = await PendingRegistration.findOne({ email: normalizedEmail });
  if (!pending || pending.verificationExpires < new Date()) {
    res.status(400);
    throw new Error('Verification code expired');
  }
  if (pending.attempts >= 5) {
    await PendingRegistration.deleteOne({ _id: pending._id });
    res.status(429);
    throw new Error('Too many verification attempts. Please register again');
  }
  if (pending.verificationCode !== String(code).trim()) {
    pending.attempts += 1;
    await pending.save();
    res.status(400);
    throw new Error('Verification code is incorrect');
  }

  const existing = await User.findOne({ $or: [{ email: normalizedEmail }, { phone: pending.phone }] });
  if (existing) {
    await PendingRegistration.deleteOne({ _id: pending._id });
    res.status(409);
    throw new Error('Account already exists');
  }

  const user = await User.create({
    name: pending.name,
    email: pending.email,
    phone: pending.phone,
    password: pending.passwordHash,
    provider: 'local',
    isEmailVerified: true
  });
  await PendingRegistration.deleteOne({ _id: pending._id });
  setAuthCookie(res, signToken(user));
  res.json({ success: true, user: publicUser(user) });
});

export const requestPasswordReset = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  if (!isValidEmail(email)) {
    res.status(400);
    throw new Error('A valid email address is required');
  }

  const user = await User.findOne({ email }).select('+passwordResetCodeHash +passwordResetCodeExpires +passwordResetAttempts +passwordResetRequestedAt');
  if (user) {
    if (user.passwordResetRequestedAt && Date.now() - user.passwordResetRequestedAt.getTime() < 60_000) {
      res.json({ message: 'If an account exists for this email, a reset code has been sent' });
      return;
    }
    const code = createVerificationCode();
    user.passwordResetCodeHash = hashSecret(code);
    user.passwordResetCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetAttempts = 0;
    user.passwordResetTokenHash = '';
    user.passwordResetTokenExpires = null;
    user.passwordResetRequestedAt = new Date();
    await user.save();
    await deliverCodeEmail({ email: user.email, code, purpose: 'reset' });
  }

  res.json({ message: 'If an account exists for this email, a reset code has been sent' });
});

export const verifyPasswordResetCode = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const code = String(req.body?.code || '').trim();
  const user = await User.findOne({ email }).select('+passwordResetCodeHash +passwordResetCodeExpires +passwordResetAttempts');
  if (!user || !/^\d{6}$/.test(code) || !user.passwordResetCodeHash || user.passwordResetCodeExpires < new Date()) {
    res.status(400);
    throw new Error('Reset code is invalid or expired');
  }
  if (user.passwordResetAttempts >= 5) {
    res.status(429);
    throw new Error('Too many reset attempts. Request a new code');
  }

  const supplied = Buffer.from(hashSecret(code), 'hex');
  const expected = Buffer.from(user.passwordResetCodeHash, 'hex');
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
    user.passwordResetAttempts += 1;
    await user.save();
    res.status(400);
    throw new Error('Reset code is invalid or expired');
  }

  const resetToken = crypto.randomBytes(32).toString('base64url');
  user.passwordResetCodeHash = '';
  user.passwordResetCodeExpires = null;
  user.passwordResetAttempts = 0;
  user.passwordResetRequestedAt = null;
  user.passwordResetTokenHash = hashSecret(resetToken);
  user.passwordResetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();
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

  user.password = password;
  user.passwordResetTokenHash = '';
  user.passwordResetTokenExpires = null;
  user.passwordResetCodeHash = '';
  user.passwordResetCodeExpires = null;
  user.passwordResetAttempts = 0;
  user.tokenVersion = (Number(user.tokenVersion) || 0) + 1;
  await user.save();
  clearAuthCookie(res);
  res.json({ success: true, message: 'Password updated successfully' });
});

export const googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    res.status(400);
    throw new Error('Google credential is required');
  }
  if (!process.env.GOOGLE_CLIENT_ID) {
    res.status(500);
    throw new Error('Google sign-in is not configured');
  }

  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
  if (!response.ok) {
    res.status(401);
    throw new Error('Invalid Google credential');
  }
  const profile = await response.json();
  if (profile.aud !== process.env.GOOGLE_CLIENT_ID || !profile.email) {
    res.status(401);
    throw new Error('Google credential is not valid for this app');
  }

  const email = normalizeEmail(profile.email);
  let user = await User.findOne({ email }).select('+tokenVersion');
  if (!user) {
    user = await User.create({
      name: profile.name || email.split('@')[0],
      email,
      provider: 'google',
      googleId: profile.sub,
      isEmailVerified: profile.email_verified === 'true' || profile.email_verified === true
    });
  } else {
    user.provider = user.provider || 'google';
    user.googleId = user.googleId || profile.sub;
    user.isEmailVerified = true;
    await user.save();
  }

  setAuthCookie(res, signToken(user));
  res.json({ success: true, user: publicUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json(publicUser(req.user));
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true });
});
