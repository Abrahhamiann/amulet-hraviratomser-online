import express from 'express';
import {
  googleAuth,
  googleAuthConfig,
  login,
  logout,
  me,
  register,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  verifyPasswordResetCode
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', requestPasswordReset);
router.post('/verify-reset-code', verifyPasswordResetCode);
router.post('/reset-password', resetPassword);
router.get('/google-config', googleAuthConfig);
router.post('/google', googleAuth);
router.post('/logout', logout);
router.get('/me', protect, me);

export default router;
