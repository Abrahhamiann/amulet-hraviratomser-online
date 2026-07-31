import asyncHandler from 'express-async-handler';
import ContactMessage from '../models/ContactMessage.js';
import { notifyAdminsOfContactMessage } from '../utils/adminTelegram.js';

export const createContactMessage = asyncHandler(async (req, res) => {
  const payload = Object.fromEntries(
    ['name', 'phone', 'email', 'message'].map((key) => [key, String(req.body?.[key] || '').trim()])
  );
  const missing = Object.entries(payload).filter(([, value]) => !value).map(([key]) => key);
  if (missing.length) {
    res.status(400);
    throw new Error(`Missing fields: ${missing.join(', ')}`);
  }
  if (payload.name.length > 160 || payload.phone.length > 80 || payload.email.length > 254 || payload.message.length > 5000) {
    res.status(400);
    throw new Error('Contact message contains an invalid field length');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    res.status(400);
    throw new Error('A valid email address is required');
  }

  payload.email = payload.email.toLowerCase();
  const message = await ContactMessage.create(payload);
  const notification = await notifyAdminsOfContactMessage(message);
  if (notification.configured && notification.failed) {
    console.error(`Contact message ${message._id}: ${notification.failed} Telegram admin notification(s) failed`);
  }
  res.status(201).json(message);
});

export const getContactMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json(messages);
});
