import express from 'express';
import { createPreview, getPreview } from '../controllers/previewController.js';
import { optionalAuth, protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createPreview);
router.get('/:token', optionalAuth, getPreview);

export default router;
