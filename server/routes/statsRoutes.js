import express from 'express';
import { getStats } from '../controllers/statsController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, adminOnly, getStats);

export default router;
