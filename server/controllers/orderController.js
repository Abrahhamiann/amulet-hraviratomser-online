import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Order from '../models/Order.js';

const normalizeDateValue = (value) => {
  if (!value) return value;
  const match = String(value).match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (match) return `${match[3]}-${match[2]}-${match[1]}`;
  return value;
};

export const createOrder = asyncHandler(async (req, res) => {
  const required = ['fullName', 'phone', 'email', 'eventType', 'eventDate', 'eventTime', 'eventLocation', 'mainNames'];
  const payload = Object.fromEntries(
    Object.entries(req.body || {})
      .map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
      .filter(([, value]) => value !== '')
  );

  payload.eventDate = normalizeDateValue(payload.eventDate);
  if (!payload.templateId || !mongoose.Types.ObjectId.isValid(payload.templateId)) delete payload.templateId;

  const missing = required.filter((field) => !payload[field]);
  if (missing.length) {
    res.status(400);
    throw new Error(`Missing fields: ${missing.join(', ')}`);
  }

  const order = await Order.create(payload);
  res.status(201).json(order);
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('templateId').sort({ createdAt: -1 });
  res.json(orders);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ email: req.user.email }).populate('templateId').sort({ createdAt: -1 });
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

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.status = req.body.status;
  await order.save();
  res.json(order);
});
