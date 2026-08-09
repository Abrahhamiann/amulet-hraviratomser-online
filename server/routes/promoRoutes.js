import express from 'express';
import { validatePromoCode } from '../controllers/promoController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/validate', protect, validatePromoCode);
export default router;
