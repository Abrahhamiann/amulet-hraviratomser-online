import express from 'express';
import { googleAuth, login, me, register, verifyEmail } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/google', googleAuth);
router.get('/me', protect, me);

export default router;
