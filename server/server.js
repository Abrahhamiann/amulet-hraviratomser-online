import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/error.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import invitationRoutes from './routes/invitationRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import rsvpRoutes from './routes/rsvpRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import telegramRoutes from './routes/telegramRoutes.js';
import { getPublicFaq } from './controllers/adminController.js';
import { startContactReminderScheduler } from './utils/contactReminder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
// Local development can share bot credentials without duplicating secrets.
// Values defined in server/.env remain authoritative because dotenv does not override them.
const telegramBotEnv = dotenv.config({ path: path.join(__dirname, '..', 'telegram_bot', '.env') });
if (telegramBotEnv.parsed?.TELEGRAM_BOT_API_SECRET) {
  process.env.TELEGRAM_SHARED_BOT_API_SECRET = telegramBotEnv.parsed.TELEGRAM_BOT_API_SECRET;
}
if (telegramBotEnv.parsed?.TELEGRAM_BOT_TOKEN) {
  process.env.TELEGRAM_SHARED_BOT_TOKEN = telegramBotEnv.parsed.TELEGRAM_BOT_TOKEN;
}
if (telegramBotEnv.parsed?.TELEGRAM_BOT_USERNAME) {
  process.env.TELEGRAM_SHARED_BOT_USERNAME = telegramBotEnv.parsed.TELEGRAM_BOT_USERNAME;
}
['TELEGRAM_ADMIN_CHAT_IDS', 'TELEGRAM_ADMIN_1_ID', 'TELEGRAM_ADMIN_2_ID'].forEach((key) => {
  if (!process.env[key] && telegramBotEnv.parsed?.[key]) {
    process.env[key] = telegramBotEnv.parsed[key];
  }
});

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  process.env.ADMIN_URL || 'http://localhost:5174',
  'http://localhost:3000'
];
const isAllowedLocalOrigin = (origin) => {
  if (!origin) return true;
  try {
    const url = new URL(origin);
    return ['localhost', '127.0.0.1'].includes(url.hostname);
  } catch {
    return false;
  }
};

app.use(cors({
  origin(origin, callback) {
    if (allowedOrigins.includes(origin) || isAllowedLocalOrigin(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json({ limit: '15mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.get('/api/faq', getPublicFaq);
app.use('/api/templates', templateRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/rsvp', rsvpRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/telegram', telegramRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => {
    startContactReminderScheduler();
    const server = app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the existing server or set a different PORT in server/.env.`);
        process.exit(1);
      }
      throw error;
    });
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
