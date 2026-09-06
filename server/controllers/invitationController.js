import asyncHandler from 'express-async-handler';
import Invitation from '../models/Invitation.js';
import Order from '../models/Order.js';
import Template from '../models/Template.js';
import { createSecureInvitationSlug, isSecureInvitationSlug } from '../utils/invitationSlug.js';
import { PUBLIC_DESIGN_KEYS } from '../utils/templateDesign.js';
import { optimizeInvitationDraftMedia } from '../utils/imageOptimization.js';

const CURRENT_DESIGN_KEYS = new Set(PUBLIC_DESIGN_KEYS);

const persistInvitationMedia = async (payload = {}) => {
  const customization = payload.customization && typeof payload.customization === 'object'
    ? { ...payload.customization }
    : {};
  const optimized = await optimizeInvitationDraftMedia({
    gallery: Array.isArray(payload.gallery) ? payload.gallery : [],
    musicUrl: customization.musicUrl || '',
    templateImageOverrides: customization.templateImageOverrides || {}
  });
  return {
    ...payload,
    gallery: optimized.gallery,
    customization: {
      ...customization,
      musicUrl: optimized.musicUrl,
      templateImageOverrides: optimized.templateImageOverrides
    }
  };
};

export const getInvitationBySlug = asyncHandler(async (req, res) => {
  const identifier = req.params.slug;
  if (!isSecureInvitationSlug(identifier)) {
    res.status(404);
    throw new Error('Invitation not found');
  }
  const invitation = await Invitation.findOne({ slug: identifier, isPublished: true })
    .select('slug templateId eventType names date time location mapLink mapLinks message gallery colors colorPaletteId language customization isPublished updatedAt')
    .populate({ path: 'templateId', select: 'title slug category editorType designKey' })
    .lean();
  if (!invitation) {
    res.status(404);
    throw new Error('Invitation not found');
  }
  if (!invitation.templateId || !CURRENT_DESIGN_KEYS.has(invitation.templateId.designKey)) {
    res.status(410);
    throw new Error('Invitation template is no longer available');
  }
  // Publication is an access decision: check it on every request, including
  // after updates through the separate admin API. Do not cache personal data.
  res.set('Cache-Control', 'no-store');
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
      mapLinks: order.mapLinks || [],
      message: order.eventMessage,
      gallery: order.templateId?.gallery || [],
      colors: order.colors,
      colorPaletteId: order.colorPaletteId || '',
      language: order.preferredLanguage,
      isPublished: true,
      ...req.body
    };
  }
  if (payload.templateId && !payload.gallery?.length) {
    const template = await Template.findById(payload.templateId);
    payload.gallery = template?.gallery || [];
  }
  payload = await persistInvitationMedia(payload);
  payload.slug = await createSecureInvitationSlug();
  const invitation = await Invitation.create(payload);
  res.status(201).json(invitation);
});

export const updateInvitation = asyncHandler(async (req, res) => {
  const invitation = await Invitation.findById(req.params.id);
  if (!invitation) {
    res.status(404);
    throw new Error('Invitation not found');
  }
  const media = await persistInvitationMedia({
    gallery: req.body.gallery || invitation.gallery,
    customization: {
      ...(invitation.customization || {}),
      ...(req.body.customization || {})
    }
  });
  Object.assign(invitation, req.body, {
    gallery: media.gallery,
    customization: media.customization
  });
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
