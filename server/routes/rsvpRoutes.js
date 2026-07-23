import express from 'express';
import {
  createRSVP,
  getAllRSVPs,
  getMyInvitationRSVPDetails,
  getMyInvitationRSVPs,
  getRSVPs
} from '../controllers/rsvpController.js';
import { adminOnly, protect } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

router.get('/admin/all', protect, adminOnly, getAllRSVPs);
router.get('/my/:invitationId/details', validateObjectId('invitationId'), protect, getMyInvitationRSVPDetails);
router.get('/my/:invitationId', validateObjectId('invitationId'), protect, getMyInvitationRSVPs);
router.route('/:invitationId').post(validateObjectId('invitationId'), createRSVP).get(validateObjectId('invitationId'), protect, adminOnly, getRSVPs);

export default router;
