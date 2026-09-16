import express from 'express';
import {
  createInvitation,
  deleteInvitation,
  getInvitationBySlug,
  getLegacyInvitationImage,
  getInvitations,
  updateInvitation
} from '../controllers/invitationController.js';
import { adminOnly, protect } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

router.get('/admin/all', protect, adminOnly, getInvitations);
router.get('/:slug', getInvitationBySlug);
router.get('/:slug/legacy-image/:index', getLegacyInvitationImage);
router.post('/', protect, adminOnly, createInvitation);
router.put('/:id', validateObjectId(), protect, adminOnly, updateInvitation);
router.delete('/:id', validateObjectId(), protect, adminOnly, deleteInvitation);

export default router;
