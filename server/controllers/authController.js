import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import PendingRegistration from '../models/PendingRegistration.js';
import User from '../models/User.js';
import { signToken } from '../utils/token.js';

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  provider: user.provider,
  isEmailVerified: user.isEmailVerified
});

const createVerificationCode = () => String(crypto.randomInt(100000, 1000000));

const envValue = (key) => {
  const value = process.env[key];
  return typeof value === 'string' ? value.trim() : value;
};

const sendVerificationEmail = async ({ email, code }) => {
  const host = envValue('SMTP_HOST') || 'smtp.gmail.com';
  const port = Number(envValue('SMTP_PORT') || 465);
  const secure = String(envValue('SMTP_SECURE') || 'true') === 'true';
  const user = envValue('SMTP_USER');
  const rawPass = envValue('SMTP_PASS');
  const pass = host.includes('gmail.com') && rawPass ? rawPass.replace(/\s+/g, '') : rawPass;
  const from = envValue('AMULET_EMAIL_FROM') || `Amulet <${user}>`;

  if (!user || !pass) {
    throw new Error('Email verification SMTP credentials are missing');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });

  await transporter.sendMail({
    from,
    to: email,
    subject: 'Amulet email verification code',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:28px;border:1px solid #ead9bf;border-radius:16px;color:#17202b">
        <h1 style="margin:0 0 10px;color:#d8b98e;font-family:Georgia,serif">Amulet</h1>
        <p style="font-size:16px;line-height:1.6">Use this 6-digit code to verify your email address.</p>
        <div style="margin:24px 0;padding:18px 22px;border-radius:14px;background:#f7f1e8;color:#17202b;font-size:32px;font-weight:800;letter-spacing:10px;text-align:center">${code}</div>
        <p style="font-size:13px;color:#657083">The code is valid for 10 minutes. If you did not request this, you can ignore this email.</p>
      </div>
    `
  });
};

export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    res.status(409);
    throw new Error('Account already exists');
  }

  const verificationCode = createVerificationCode();
  const passwordHash = await bcrypt.hash(password, 10);
  const pending = await PendingRegistration.findOneAndUpdate(
    { email: normalizedEmail },
    {
      name: name?.trim() || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      passwordHash,
      verificationCode,
      verificationExpires: new Date(Date.now() + 1000 * 60 * 10),
      attempts: 0
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await sendVerificationEmail({ email: pending.email, code: verificationCode });

  res.status(201).json({
    message: 'Verification code sent',
    email: pending.email
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.trim().toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  if (!user.isEmailVerified) {
    res.status(403);
    throw new Error('Please verify your email before signing in');
  }
  res.json({
    token: signToken(user),
    user: publicUser(user)
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    res.status(400);
    throw new Error('Email and verification code are required');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const pending = await PendingRegistration.findOne({ email: normalizedEmail });

  if (!pending || pending.verificationExpires < new Date()) {
    res.status(400);
    throw new Error('Verification code expired');
  }
  if (pending.verificationCode !== String(code).trim()) {
    pending.attempts += 1;
    await pending.save();
    res.status(400);
    throw new Error('Verification code is incorrect');
  }

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    await PendingRegistration.deleteOne({ _id: pending._id });
    res.status(409);
    throw new Error('Account already exists');
  }

  const user = await User.create({
    name: pending.name,
    email: pending.email,
    password: pending.passwordHash,
    provider: 'local',
    isEmailVerified: true
  });
  await PendingRegistration.deleteOne({ _id: pending._id });

  res.json({
    token: signToken(user),
    user: publicUser(user)
  });
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

  const email = profile.email.toLowerCase();
  let user = await User.findOne({ email });
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

  res.json({
    token: signToken(user),
    user: publicUser(user)
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json(publicUser(req.user));
});
