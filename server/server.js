import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { allowedOrigins as resolveAllowedOrigins } from './config/env.js';
import { errorHandler, notFound } from './middleware/error.js';
import { parseCookies } from './middleware/cookies.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import invitationRoutes from './routes/invitationRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import previewRoutes from './routes/previewRoutes.js';
import promoRoutes from './routes/promoRoutes.js';
import rsvpRoutes from './routes/rsvpRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import telegramRoutes from './routes/telegramRoutes.js';
import { getPublicFaq } from './controllers/adminController.js';
import { startContactReminderScheduler } from './utils/contactReminder.js';
import { authCookieName } from './utils/authCookie.js';
import { ensureCuratedTemplates } from './utils/ensureCuratedTemplates.js';
import { ensureDefaultReviews } from './utils/ensureDefaultReviews.js';

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
const allowedOrigins = resolveAllowedOrigins();

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(parseCookies);
app.use((req, res, next) => {
  const unsafeMethod = !['GET', 'HEAD', 'OPTIONS'].includes(req.method);
  if (!unsafeMethod || !req.cookies?.[authCookieName()]) return next();

  const origin = req.get('origin');
  const fetchSite = req.get('sec-fetch-site');
  if (fetchSite === 'cross-site' || (origin && !allowedOrigins.includes(origin))) {
    res.status(403).json({ message: 'Cross-site request blocked' });
    return;
  }
  next();
});
app.use(express.json({ limit: '15mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.get('/api/faq', getPublicFaq);
app.use('/api/templates', templateRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/previews', previewRoutes);
app.use('/api/promocodes', promoRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/rsvp', rsvpRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/telegram', telegramRoutes);

app.use(notFound);
app.use(errorHandler);

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'change_this_secret' || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be configured with at least 32 characters');
}

connectDB()
  .then(async () => {
    await ensureCuratedTemplates();
    await ensureDefaultReviews();
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
