import express from 'express';
import { confirmCheckoutSession, createCheckoutSession } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/confirm-checkout-session', protect, confirmCheckoutSession);

export default router;
