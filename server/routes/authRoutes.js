import express from 'express';
import { login, me } from '../controllers/authController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, adminOnly, me);

export default router;
