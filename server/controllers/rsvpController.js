import asyncHandler from 'express-async-handler';
import RSVP from '../models/RSVP.js';

export const createRSVP = asyncHandler(async (req, res) => {
  const rsvp = await RSVP.create({ ...req.body, invitationId: req.params.invitationId });
  res.status(201).json(rsvp);
});

export const getRSVPs = asyncHandler(async (req, res) => {
  const rsvps = await RSVP.find({ invitationId: req.params.invitationId }).sort({ createdAt: -1 });
  res.json(rsvps);
});

export const getAllRSVPs = asyncHandler(async (req, res) => {
  const rsvps = await RSVP.find().populate('invitationId').sort({ createdAt: -1 });
  res.json(rsvps);
});
