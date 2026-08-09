import crypto from 'crypto';
import express from 'express';
import {
  connectTelegramBot,
  createTelegramLink,
  disconnectTelegram,
  disconnectTelegramBot,
  deleteTelegramAdminMessages,
  getTelegramBotAccount,
  getTelegramBotInvitation,
  getTelegramStatus,
  getTelegramAdminDashboard,
  getTelegramAdminMessage,
  getTelegramAdminMessages,
  getTelegramAdminOrder,
  getTelegramAdminOrders,
  replyTelegramAdminMessage,
  updateTelegramBotSettings
} from '../controllers/telegramController.js';
import { protect } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

const botOnly = (req, res, next) => {
  const received = String(req.headers['x-telegram-bot-secret'] || '');
  const expectedSecrets = [
    process.env.TELEGRAM_BOT_API_SECRET,
    process.env.TELEGRAM_SHARED_BOT_API_SECRET
  ]
    .map((value) => value?.trim() || '')
    .filter(Boolean);
  const valid = expectedSecrets.some((expected) => (
    received.length === expected.length
    && crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected))
  ));

  if (!valid) {
    res.status(401);
    next(new Error('Telegram bot authorization failed'));
    return;
  }
  next();
};

router.get('/status', protect, getTelegramStatus);
router.post('/link', protect, createTelegramLink);
router.delete('/disconnect', protect, disconnectTelegram);

router.post('/bot/connect', botOnly, connectTelegramBot);
router.get('/bot/account', botOnly, getTelegramBotAccount);
router.get('/bot/invitations/:invitationId', botOnly, validateObjectId('invitationId'), getTelegramBotInvitation);
router.patch('/bot/settings', botOnly, updateTelegramBotSettings);
router.delete('/bot/disconnect', botOnly, disconnectTelegramBot);
router.get('/bot/admin/dashboard', botOnly, getTelegramAdminDashboard);
router.get('/bot/admin/orders', botOnly, getTelegramAdminOrders);
router.get('/bot/admin/orders/:orderId', botOnly, validateObjectId('orderId'), getTelegramAdminOrder);
router.get('/bot/admin/messages', botOnly, getTelegramAdminMessages);
router.delete('/bot/admin/messages', botOnly, deleteTelegramAdminMessages);
router.get('/bot/admin/messages/:messageId', botOnly, validateObjectId('messageId'), getTelegramAdminMessage);
router.post('/bot/admin/messages/:messageId/reply', botOnly, validateObjectId('messageId'), replyTelegramAdminMessage);

export default router;
