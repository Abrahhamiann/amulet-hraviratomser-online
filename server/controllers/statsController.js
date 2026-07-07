import asyncHandler from 'express-async-handler';
import ContactMessage from '../models/ContactMessage.js';
import Invitation from '../models/Invitation.js';
import Order from '../models/Order.js';
import RSVP from '../models/RSVP.js';
import Template from '../models/Template.js';

export const getStats = asyncHandler(async (req, res) => {
  const [templates, orders, invitations, rsvps, contacts] = await Promise.all([
    Template.countDocuments(),
    Order.countDocuments(),
    Invitation.countDocuments(),
    RSVP.countDocuments(),
    ContactMessage.countDocuments()
  ]);
  res.json({ templates, orders, invitations, rsvps, contacts });
});
