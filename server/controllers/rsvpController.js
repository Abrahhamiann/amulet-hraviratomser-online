import asyncHandler from 'express-async-handler';
import Invitation from '../models/Invitation.js';
import RSVP from '../models/RSVP.js';

export const createRSVP = asyncHandler(async (req, res) => {
  const rsvp = await RSVP.create({ ...req.body, invitationId: req.params.invitationId });
  res.status(201).json(rsvp);
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

  if (invitation.orderId?.email !== req.user.email) {
    res.status(403);
    throw new Error('This invitation does not belong to the current user');
  }

  const rsvps = await RSVP.find({ invitationId: invitation._id }).sort({ createdAt: -1 });
  res.json(rsvps);
});

export const getAllRSVPs = asyncHandler(async (req, res) => {
  const rsvps = await RSVP.find().populate('invitationId').sort({ createdAt: -1 });
  res.json(rsvps);
});
