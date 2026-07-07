import express from 'express';
import { createContactMessage, getContactMessages } from '../controllers/contactController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(createContactMessage).get(protect, adminOnly, getContactMessages);

export default router;
