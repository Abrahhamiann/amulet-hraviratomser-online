import asyncHandler from 'express-async-handler';
import Invitation from '../models/Invitation.js';
import RSVP from '../models/RSVP.js';
import { notifyInvitationOwnerOfRsvp } from '../utils/telegram.js';

export const createRSVP = asyncHandler(async (req, res) => {
  const invitation = await Invitation.findById(req.params.invitationId);
  if (!invitation) {
    res.status(404);
    throw new Error('Invitation not found');
  }
  const guestName = String(req.body?.guestName || '').trim().slice(0, 120);
  const phone = String(req.body?.phone || '').trim().slice(0, 40);
  const status = ['attending', 'declined', 'unsure'].includes(req.body?.status)
    ? req.body.status
    : '';
  if (!guestName || !status) {
    res.status(400);
    throw new Error('Guest name and attendance status are required');
  }

  const requestedGuestCount = Number.parseInt(req.body?.guestCount, 10);
  const rsvp = await RSVP.create({
    invitationId: invitation._id,
    guestName,
    phone,
    status,
    guestSide: ['bride', 'groom', 'other'].includes(req.body?.guestSide) ? req.body.guestSide : 'other',
    guestCount: Number.isFinite(requestedGuestCount) ? Math.min(20, Math.max(1, requestedGuestCount)) : 1,
    message: String(req.body?.message || '').trim().slice(0, 1000)
  });
  let telegramDelivered = false;
  try {
    telegramDelivered = await notifyInvitationOwnerOfRsvp(invitation, rsvp);
    if (!telegramDelivered) {
      console.warn(`Telegram RSVP notification was not delivered for invitation ${invitation._id}`);
    }
  } catch (error) {
    console.error('Telegram RSVP notification failed:', error.message);
  }

  res.status(201).json({ ...rsvp.toObject(), telegramDelivered });
});

export const getRSVPs = asyncHandler(async (req, res) => {
  const rsvps = await RSVP.find({ invitationId: req.params.invitationId }).sort({ createdAt: -1 });
  res.json(rsvps);
});

export const getMyInvitationRSVPs = asyncHandler(async (req, res) => {
  const invitation = await Invitation.findById(req.params.invitationId).populate('orderId');
  if (!invitation) {
    res.status(404);
    throw new Error('Invitation not found');
  }

  const belongsToUser = invitation.orderId?.userId
    ? String(invitation.orderId.userId) === String(req.user._id)
    : invitation.orderId?.email === req.user.email;
  if (!belongsToUser) {
    res.status(403);
    throw new Error('This invitation does not belong to the current user');
  }

  const rsvps = await RSVP.find({ invitationId: invitation._id }).sort({ createdAt: -1 });
  res.json(rsvps);
});

export const getMyInvitationRSVPDetails = asyncHandler(async (req, res) => {
  const invitation = await Invitation.findById(req.params.invitationId)
    .populate('templateId')
    .populate({
      path: 'orderId',
      populate: { path: 'templateId' }
    });

  if (!invitation) {
    res.status(404);
    throw new Error('Invitation not found');
  }

  const belongsToUser = invitation.orderId?.userId
    ? String(invitation.orderId.userId) === String(req.user._id)
    : invitation.orderId?.email === req.user.email;
  if (!belongsToUser) {
    res.status(403);
    throw new Error('This invitation does not belong to the current user');
  }

  const rsvps = await RSVP.find({ invitationId: invitation._id }).sort({ createdAt: -1 });
  res.json({ invitation, rsvps });
});

export const getAllRSVPs = asyncHandler(async (req, res) => {
  const rsvps = await RSVP.find().populate('invitationId').sort({ createdAt: -1 });
  res.json(rsvps);
});
