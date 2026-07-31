import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import ContactMessage from '../models/ContactMessage.js';
import Invitation from '../models/Invitation.js';
import Order from '../models/Order.js';
import RSVP from '../models/RSVP.js';
import User from '../models/User.js';
import { deliverContactReply } from '../utils/contactReply.js';
import { getTelegramBotHealth, isTelegramAdmin, normalizeTelegramLanguage } from '../utils/telegram.js';

const tokenHash = (token) => crypto.createHash('sha256').update(token).digest('hex');
const cleanBotUsername = () => (
  process.env.TELEGRAM_SHARED_BOT_USERNAME
  || process.env.TELEGRAM_BOT_USERNAME
  || ''
).trim().replace(/^@/, '');
const clientUrl = () => (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');

const botUrl = () => {
  const username = cleanBotUsername();
  return username ? `https://t.me/${username}` : '';
};

const isBotConfigured = () => Boolean(
  cleanBotUsername()
  && (process.env.TELEGRAM_SHARED_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN)?.trim()
);

const requireBotConfiguration = (res) => {
  if (isBotConfigured()) return;
  res.status(503);
  throw new Error('Telegram bot is not configured');
};

const findTelegramUser = async (chatId, res) => {
  const user = await User.findOne({ 'telegram.chatId': String(chatId || '') });
  if (!user) {
    res.status(404);
    throw new Error('Telegram account is not connected');
  }
  return user;
};

const requireTelegramAdmin = (chatId, res) => {
  if (isTelegramAdmin(chatId)) return String(chatId);
  res.status(403);
  throw new Error('Telegram administrator access required');
};

const pagination = (value, fallback = 0) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const adminOrderPayload = (order) => ({
  id: String(order._id),
  customer: order.fullName,
  email: order.email,
  phone: order.phone,
  invitation: order.invitationId?.names || order.mainNames,
  invitationUrl: order.invitationId?.slug ? `${clientUrl()}/invite/${order.invitationId.slug}` : '',
  template: order.templateId?.title || order.eventType,
  eventType: order.eventType,
  amount: Number(order.amount) || Number(order.templateId?.price) || 0,
  paymentStatus: order.paymentStatus,
  eventDate: order.eventDate,
  eventTime: order.eventTime,
  eventLocation: order.eventLocation,
  mapLink: order.mapLink,
  language: order.preferredLanguage,
  notes: order.notes,
  createdAt: order.createdAt
});

const adminMessagePayload = (message) => ({
  id: String(message._id),
  name: message.name,
  email: message.email,
  phone: message.phone,
  message: message.message,
  replied: Boolean(message.repliedAt),
  repliedAt: message.repliedAt,
  replies: message.replies || [],
  createdAt: message.createdAt
});

const summarizeRsvps = (items) => items.reduce((summary, rsvp) => {
  summary.replies += 1;
  summary.guests += Number(rsvp.guestCount) || 1;
  if (Object.hasOwn(summary, rsvp.status)) summary[rsvp.status] += 1;
  return summary;
}, { replies: 0, guests: 0, attending: 0, declined: 0, unsure: 0 });

const invitationPayload = (order, rsvps = []) => {
  const invitation = order.invitationId;
  const template = order.templateId;
  const identifier = invitation?.slug || invitation?._id;
  return {
    id: invitation?._id || order._id,
    invitationId: invitation?._id || null,
    ready: Boolean(invitation?._id),
    orderId: order._id,
    title: invitation?.names || order.mainNames,
    templateTitle: template?.title || order.eventType,
    eventType: order.eventType,
    date: invitation?.date || order.eventDate,
    time: invitation?.time || order.eventTime,
    location: invitation?.location || order.eventLocation,
    image: invitation?.gallery?.[0] || template?.mainImage || template?.gallery?.[0] || '',
    url: identifier ? `${clientUrl()}/invite/${identifier}` : '',
    responsesUrl: invitation?._id
      ? `${clientUrl()}/account/invitations/${invitation._id}/responses`
      : '',
    summary: summarizeRsvps(rsvps)
  };
};

export const getTelegramStatus = asyncHandler(async (req, res) => {
  const connected = Boolean(req.user.telegram?.chatId);
  const configured = isBotConfigured();
  const available = configured ? await getTelegramBotHealth() : false;
  res.json({
    configured,
    available,
    connected,
    username: cleanBotUsername(),
    displayName: req.user.telegram?.firstName || req.user.telegram?.username || '',
    notificationsEnabled: connected ? req.user.telegram.notificationsEnabled !== false : false,
    language: normalizeTelegramLanguage(req.user.telegram?.language),
    botUrl: botUrl()
  });
});

export const createTelegramLink = asyncHandler(async (req, res) => {
  requireBotConfiguration(res);
  if (!(await getTelegramBotHealth())) {
    res.status(503);
    throw new Error('Telegram service is temporarily unavailable');
  }
  const language = normalizeTelegramLanguage(req.body?.language);
  const token = crypto.randomBytes(24).toString('base64url');

  req.user.telegramLinkTokenHash = tokenHash(token);
  req.user.telegramLinkExpires = new Date(Date.now() + 10 * 60 * 1000);
  req.user.telegramLinkLanguage = language;
  await req.user.save();

  res.json({
    botUrl: `${botUrl()}?start=${token}`,
    expiresInSeconds: 600
  });
});

export const disconnectTelegram = asyncHandler(async (req, res) => {
  req.user.telegram = {
    chatId: '',
    userId: '',
    username: '',
    firstName: '',
    language: normalizeTelegramLanguage(req.user.telegram?.language),
    notificationsEnabled: true,
    connectedAt: null
  };
  req.user.telegramLinkTokenHash = '';
  req.user.telegramLinkExpires = null;
  await req.user.save();
  res.json({ connected: false });
});

export const connectTelegramBot = asyncHandler(async (req, res) => {
  const { token, chatId, telegramUserId, username = '', firstName = '', languageCode = '' } = req.body || {};
  if (!token || !chatId || !telegramUserId) {
    res.status(400);
    throw new Error('Token, chatId and telegramUserId are required');
  }

  const user = await User.findOne({
    telegramLinkTokenHash: tokenHash(String(token)),
    telegramLinkExpires: { $gt: new Date() }
  }).select('+telegramLinkTokenHash +telegramLinkExpires +telegramLinkLanguage');

  if (!user) {
    res.status(400);
    throw new Error('Telegram connection link is invalid or expired');
  }

  const normalizedChatId = String(chatId);
  await User.updateMany(
    { _id: { $ne: user._id }, 'telegram.chatId': normalizedChatId },
    {
      $set: {
        'telegram.chatId': '',
        'telegram.userId': '',
        'telegram.username': '',
        'telegram.firstName': '',
        'telegram.connectedAt': null
      }
    }
  );

  user.telegram = {
    chatId: normalizedChatId,
    userId: String(telegramUserId),
    username: String(username).slice(0, 64),
    firstName: String(firstName).slice(0, 128),
    language: normalizeTelegramLanguage(
      user.telegramLinkLanguage,
      normalizeTelegramLanguage(String(languageCode).split('-')[0], 'en')
    ),
    notificationsEnabled: true,
    connectedAt: new Date()
  };
  user.telegramLinkTokenHash = '';
  user.telegramLinkExpires = null;
  await user.save();

  res.json({
    connected: true,
    name: user.name,
    language: user.telegram.language
  });
});

export const getTelegramBotAccount = asyncHandler(async (req, res) => {
  const user = await findTelegramUser(req.query.chatId, res);
  const orders = await Order.find({
    email: user.email,
    $or: [
      { paymentStatus: 'paid' },
      { invitationId: { $exists: true, $ne: null } }
    ]
  }).populate('templateId invitationId').sort({ createdAt: -1 });

  const invitationIds = orders.map((order) => order.invitationId?._id).filter(Boolean);
  const rsvps = invitationIds.length
    ? await RSVP.find({ invitationId: { $in: invitationIds } }).sort({ createdAt: -1 }).lean()
    : [];
  const byInvitation = new Map();
  rsvps.forEach((rsvp) => {
    const key = String(rsvp.invitationId);
    if (!byInvitation.has(key)) byInvitation.set(key, []);
    byInvitation.get(key).push(rsvp);
  });

  res.json({
    name: user.name,
    language: normalizeTelegramLanguage(user.telegram?.language),
    notificationsEnabled: user.telegram?.notificationsEnabled !== false,
    invitations: orders.map((order) => invitationPayload(
      order,
      byInvitation.get(String(order.invitationId?._id)) || []
    ))
  });
});

export const getTelegramBotInvitation = asyncHandler(async (req, res) => {
  const user = await findTelegramUser(req.query.chatId, res);
  const invitation = await Invitation.findById(req.params.invitationId);
  const order = invitation
    ? await Order.findOne({ _id: invitation.orderId, email: user.email }).populate('templateId invitationId')
    : await Order.findOne({ _id: req.params.invitationId, email: user.email }).populate('templateId invitationId');
  if (!order) {
    res.status(403);
    throw new Error('Invitation does not belong to this Telegram account');
  }

  const resolvedInvitation = invitation || order.invitationId;
  const rsvps = resolvedInvitation
    ? await RSVP.find({ invitationId: resolvedInvitation._id }).sort({ createdAt: -1 }).lean()
    : [];
  res.json({
    invitation: invitationPayload(order, rsvps),
    rsvps: rsvps.map((rsvp) => ({
      id: rsvp._id,
      guestName: rsvp.guestName,
      phone: rsvp.phone,
      guestSide: rsvp.guestSide,
      status: rsvp.status,
      guestCount: rsvp.guestCount,
      message: rsvp.message,
      createdAt: rsvp.createdAt
    }))
  });
});

export const updateTelegramBotSettings = asyncHandler(async (req, res) => {
  const user = await findTelegramUser(req.body?.chatId, res);
  if (req.body.language) {
    user.telegram.language = normalizeTelegramLanguage(req.body.language, user.telegram.language);
  }
  if (typeof req.body.notificationsEnabled === 'boolean') {
    user.telegram.notificationsEnabled = req.body.notificationsEnabled;
  }
  await user.save();
  res.json({
    language: user.telegram.language,
    notificationsEnabled: user.telegram.notificationsEnabled
  });
});

export const disconnectTelegramBot = asyncHandler(async (req, res) => {
  const user = await findTelegramUser(req.body?.chatId, res);
  user.telegram.chatId = '';
  user.telegram.userId = '';
  user.telegram.username = '';
  user.telegram.firstName = '';
  user.telegram.connectedAt = null;
  await user.save();
  res.json({ connected: false });
});

export const getTelegramAdminDashboard = asyncHandler(async (req, res) => {
  requireTelegramAdmin(req.query.chatId, res);
  const [orders, paidOrders, unpaidOrders, messages, unansweredMessages] = await Promise.all([
    Order.find().populate('templateId').lean(),
    Order.countDocuments({ paymentStatus: 'paid' }),
    Order.countDocuments({ paymentStatus: 'unpaid' }),
    ContactMessage.countDocuments(),
    ContactMessage.countDocuments({ $or: [{ repliedAt: null }, { repliedAt: { $exists: false } }] })
  ]);
  const revenue = orders
    .filter((order) => order.paymentStatus === 'paid')
    .reduce((sum, order) => sum + (Number(order.amount) || Number(order.templateId?.price) || 0), 0);

  res.json({
    orders: orders.length,
    paidOrders,
    unpaidOrders,
    revenue,
    messages,
    unansweredMessages
  });
});

export const getTelegramAdminOrders = asyncHandler(async (req, res) => {
  requireTelegramAdmin(req.query.chatId, res);
  const page = pagination(req.query.page);
  const pageSize = 6;
  const [orders, total] = await Promise.all([
    Order.find()
      .populate('templateId invitationId')
      .sort({ createdAt: -1 })
      .skip(page * pageSize)
      .limit(pageSize),
    Order.countDocuments()
  ]);
  res.json({
    items: orders.map(adminOrderPayload),
    page,
    pages: Math.max(1, Math.ceil(total / pageSize)),
    total
  });
});

export const getTelegramAdminOrder = asyncHandler(async (req, res) => {
  requireTelegramAdmin(req.query.chatId, res);
  const order = await Order.findById(req.params.orderId).populate('templateId invitationId');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json(adminOrderPayload(order));
});

export const getTelegramAdminMessages = asyncHandler(async (req, res) => {
  requireTelegramAdmin(req.query.chatId, res);
  const page = pagination(req.query.page);
  const pageSize = 6;
  const [messages, total] = await Promise.all([
    ContactMessage.find().sort({ createdAt: -1 }).skip(page * pageSize).limit(pageSize),
    ContactMessage.countDocuments()
  ]);
  res.json({
    items: messages.map(adminMessagePayload),
    page,
    pages: Math.max(1, Math.ceil(total / pageSize)),
    total
  });
});

export const getTelegramAdminMessage = asyncHandler(async (req, res) => {
  requireTelegramAdmin(req.query.chatId, res);
  const message = await ContactMessage.findById(req.params.messageId);
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }
  res.json(adminMessagePayload(message));
});

export const replyTelegramAdminMessage = asyncHandler(async (req, res) => {
  const adminChatId = requireTelegramAdmin(req.body?.chatId, res);
  if (!String(req.body?.message || '').trim()) {
    res.status(400);
    throw new Error('Reply message is required');
  }
  const message = await ContactMessage.findById(req.params.messageId);
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }
  const delivery = await deliverContactReply(message, {
    subject: req.body?.subject || 'Reply from Amulet',
    message: req.body?.message,
    adminChatId
  });
  res.json({ message: 'Reply sent', ...delivery });
});
