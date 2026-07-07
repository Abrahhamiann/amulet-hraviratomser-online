import asyncHandler from 'express-async-handler';
import Invitation from '../models/Invitation.js';
import Order from '../models/Order.js';
import Template from '../models/Template.js';
import { makeSlug } from '../utils/slug.js';

export const getInvitationBySlug = asyncHandler(async (req, res) => {
  const invitation = await Invitation.findOne({ slug: req.params.slug, isPublished: true }).populate('templateId');
  if (!invitation) {
    res.status(404);
    throw new Error('Invitation not found');
  }
  res.json(invitation);
});

export const createInvitation = asyncHandler(async (req, res) => {
  let payload = { ...req.body };
  if (payload.orderId) {
    const order = await Order.findById(payload.orderId).populate('templateId');
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    payload = {
      orderId: order._id,
      templateId: order.templateId?._id,
      eventType: order.eventType,
      names: order.mainNames,
      date: order.eventDate,
      time: order.eventTime,
      location: order.eventLocation,
      mapLink: order.mapLink,
      message: order.eventMessage,
      gallery: order.templateId?.gallery || [],
      language: order.preferredLanguage,
      isPublished: true,
      ...req.body
    };
  }
  if (payload.templateId && !payload.gallery?.length) {
    const template = await Template.findById(payload.templateId);
    payload.gallery = template?.gallery || [];
  }
  payload.slug = payload.slug || makeSlug(`${payload.names}-${Date.now()}`);
  const invitation = await Invitation.create(payload);
  res.status(201).json(invitation);
});

export const updateInvitation = asyncHandler(async (req, res) => {
  const invitation = await Invitation.findById(req.params.id);
  if (!invitation) {
    res.status(404);
    throw new Error('Invitation not found');
  }
  Object.assign(invitation, req.body);
  await invitation.save();
  res.json(invitation);
});

export const deleteInvitation = asyncHandler(async (req, res) => {
  const invitation = await Invitation.findById(req.params.id);
  if (!invitation) {
    res.status(404);
    throw new Error('Invitation not found');
  }
  await invitation.deleteOne();
  res.json({ message: 'Invitation deleted' });
});

export const getInvitations = asyncHandler(async (req, res) => {
  const invitations = await Invitation.find().populate('orderId templateId').sort({ createdAt: -1 });
  res.json(invitations);
});
