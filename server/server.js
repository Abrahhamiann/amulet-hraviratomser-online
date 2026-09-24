import cors from 'cors';
import { subscribeFaqUpdates } from './utils/faqUpdates.js';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { arcaConfigurationStatus } from './config/arca.js';
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
import { startCreatorNotificationScheduler } from './utils/creatorTelegram.js';
import { protect, adminOnly } from './middleware/auth.js';
import { browserRequestGuard, createRateLimiter, securityHeaders, validateRequestShape } from './middleware/security.js';
import { ensureTemplateCodes } from './utils/templateCode.js';
import Template from './models/Template.js';
import { purgeSoftDeletedTemplates } from './utils/templateDeletion.js';
import { ensureMediaRoot, getMediaRoot } from './utils/mediaStorage.js';
import { verifyTemplateCatalogQuery } from './controllers/templateController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, process.env.AMULET_DEV_ENV === '1' ? '.env.development' : '.env') });

const paymentConfiguration = arcaConfigurationStatus();
if (paymentConfiguration.configured) {
  console.info(`ArCa payment provider configured (${paymentConfiguration.baseHost}).`);
} else {
  console.warn(`ArCa payment provider is not fully configured. Missing: ${paymentConfiguration.missing.join(', ')}`);
}

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = resolveAllowedOrigins();
app.disable('x-powered-by');
app.set('query parser', 'simple');
// Only the local nginx reverse proxy may supply the client address.
app.set('trust proxy', 'loopback');
app.use(securityHeaders);
app.use(browserRequestGuard(allowedOrigins));
app.use('/api', createRateLimiter({ limit: 600, windowMs: 60000 }));
const authLimiter = createRateLimiter({ limit: 20, windowMs: 15 * 60000 });
app.use('/api/auth', (req, res, next) => req.method === 'POST' ? authLimiter(req, res, next) : next());
const writeLimiter = createRateLimiter({ limit: 30, windowMs: 10 * 60000 });
app.use(['/api/contact', '/api/orders', '/api/rsvp', '/api/previews', '/api/payments', '/api/reviews', '/api/promocodes'],
  (req, res, next) => req.method === 'POST' ? writeLimiter(req, res, next) : next());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(Object.assign(new Error('Not allowed by CORS'), { statusCode: 403 }));
  },
  credentials: true
}));
app.use(parseCookies);
const mediaJson = express.json({ limit: '15mb', inflate: false });
const smallJson = express.json({ limit: '64kb', inflate: false });
app.use((req, res, next) => {
  const mediaRoute = /^(?:\/api\/previews\/?|\/api\/payments\/arca\/create\/?|\/api\/(?:admin\/)?(?:templates|invitations)(?:\/[^/]+)?\/?)$/i.test(req.path);
  if (!mediaRoute || !['POST', 'PUT', 'PATCH'].includes(req.method)) return smallJson(req, res, next);
  protect(req, res, (error) => {
    if (error) return next(error);
    if (/\/api\/(?:admin\/)?(?:templates|invitations)/i.test(req.path)) {
      return adminOnly(req, res, () => mediaJson(req, res, next));
    }
    mediaJson(req, res, next);
  });
});
app.use(validateRequestShape);
// Do not log invitation/preview bearer URLs or query-string credentials.
app.use(morgan(':method :status :response-time ms'));

await ensureMediaRoot();
app.use('/media', express.static(getMediaRoot(), {
  immutable: true,
  maxAge: '1y',
  fallthrough: false,
  setHeaders(res) {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  service: 'e-invite-server',
  mode: process.env.AMULET_DEV_ENV === '1' ? 'development' : 'production',
  payment: {
    provider: paymentConfiguration.provider,
    configured: paymentConfiguration.configured,
    baseHost: paymentConfiguration.baseHost
  }
}));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.get('/api/faq', getPublicFaq);
app.get('/api/faq/events', subscribeFaqUpdates);
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

const startServer = async () => {
  await connectDB();
  await Template.updateMany({ isActive: { $exists: false } }, { $set: { isActive: true } });
  await purgeSoftDeletedTemplates();
  await Template.updateMany(
    { pagePreviewImage: { $exists: true, $nin: ['', null] }, pagePreviewAvailable: { $ne: true } },
    { $set: { pagePreviewAvailable: true } }
  );
  await ensureTemplateCodes();
  try {
    await verifyTemplateCatalogQuery();
    console.log('Template catalog query verified.');
  } catch (error) {
    console.warn(`Template catalog verification skipped: ${error.message}`);
  }
  startContactReminderScheduler();
  startCreatorNotificationScheduler();
  const server = app.listen(PORT, process.env.HOST || (process.env.NODE_ENV === 'production' ? '127.0.0.1' : '0.0.0.0'), () => console.log(`Server running on port ${PORT}`));
  server.requestTimeout = 30000;
  server.headersTimeout = 15000;
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use by another application. Stop it or set a different PORT in server/.env.`);
      process.exit(1);
    }
    throw error;
  });
};

startServer().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
