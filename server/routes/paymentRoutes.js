import express from 'express';
import { createPayment, getPaymentStatus } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

router.post('/arca/create', protect, createPayment);
router.get('/arca/:paymentId/status', protect, validateObjectId('paymentId'), getPaymentStatus);

export default router;
