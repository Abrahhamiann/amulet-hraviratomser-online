import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Invitation from '../models/Invitation.js';
import Order from '../models/Order.js';
import RSVP from '../models/RSVP.js';
import { notifyAdminsOfOrder } from '../utils/adminTelegram.js';
import { ensureSecureInvitationSlug } from '../utils/invitationSlug.js';

const normalizeDateValue = (value) => {
  if (!value) return value;
  const match = String(value).match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (match) return `${match[3]}-${match[2]}-${match[1]}`;
  return value;
};

export const createOrder = asyncHandler(async (req, res) => {
  const required = ['fullName', 'phone', 'email', 'eventType', 'eventDate', 'eventTime', 'eventLocation', 'mainNames'];
  const allowed = new Set([
    ...required,
    'templateId', 'mapLink', 'mapLinks', 'eventMessage', 'colors', 'colorPaletteId', 'preferredLanguage', 'notes',
    'requestType', 'inspirationLink', 'budgetRange'
  ]);
  const payload = Object.fromEntries(
    Object.entries(req.body || {})
      .filter(([key]) => allowed.has(key))
      .map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
      .filter(([, value]) => value !== '')
  );

  payload.eventDate = normalizeDateValue(payload.eventDate);
  if (!payload.templateId || !mongoose.Types.ObjectId.isValid(payload.templateId)) delete payload.templateId;
  payload.requestType = payload.requestType === 'custom_design' ? 'custom_design' : 'standard';
  if (req.user?._id) payload.userId = req.user._id;

  const missing = required.filter((field) => !payload[field]);
  if (missing.length) {
    res.status(400);
    throw new Error(`Missing fields: ${missing.join(', ')}`);
  }

  const order = await Order.create(payload);
  await order.populate('templateId invitationId');
  const notification = await notifyAdminsOfOrder(order);
  if (notification.configured && notification.failed) {
    console.error(`Order ${order._id}: ${notification.failed} Telegram admin notification(s) failed`);
  }
  res.status(201).json(order);
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('templateId').sort({ createdAt: -1 });
  res.json(orders);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    $or: [{ userId: req.user._id }, { userId: null, email: req.user.email }]
  }).populate('templateId invitationId').sort({ createdAt: -1 });
  await Promise.all(orders.map((order) => ensureSecureInvitationSlug(order.invitationId)));
  res.json(orders);
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('templateId');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json(order);
});

export const deleteMyOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    $or: [{ userId: req.user._id }, { userId: null, email: req.user.email }]
  });
  if (!order) {
    res.status(404);
    throw new Error('Invitation not found');
  }

  const invitationIds = [
    order.invitationId,
    ...(await Invitation.find({ orderId: order._id }).select('_id')).map((invitation) => invitation._id)
  ].filter(Boolean);

  if (invitationIds.length) {
    await RSVP.deleteMany({ invitationId: { $in: invitationIds } });
    await Invitation.deleteMany({ _id: { $in: invitationIds } });
  }

  await order.deleteOne();
  res.json({ message: 'Invitation deleted' });
});
