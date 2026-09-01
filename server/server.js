import cors from 'cors';
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
import { authCookieName } from './utils/authCookie.js';
import { ensureCuratedTemplates } from './utils/ensureCuratedTemplates.js';
import { ensureDefaultReviews } from './utils/ensureDefaultReviews.js';
import { ensureTemplateCodes } from './utils/templateCode.js';
import { removeLegacyEngagementTemplates } from './utils/removeLegacyEngagementTemplates.js';
import Template from './models/Template.js';
import { purgeSoftDeletedTemplates } from './utils/templateDeletion.js';
import { ensureMediaRoot, getMediaRoot } from './utils/mediaStorage.js';
import { warmTemplateCatalogCache } from './controllers/templateController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const paymentConfiguration = arcaConfigurationStatus();
if (paymentConfiguration.configured) {
  console.info(`ArCa payment provider configured (${paymentConfiguration.baseHost}).`);
} else {
  console.warn(`ArCa payment provider is not fully configured. Missing: ${paymentConfiguration.missing.join(', ')}`);
}

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
  payment: {
    provider: paymentConfiguration.provider,
    configured: paymentConfiguration.configured,
    baseHost: paymentConfiguration.baseHost
  }
}));
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

const existingAmuletServer = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:${PORT}/api/health`, {
      signal: AbortSignal.timeout(1200)
    });
    const payload = await response.json();
    return response.ok && payload?.status === 'ok'
      && (!payload.service || payload.service === 'e-invite-server');
  } catch {
    return false;
  }
};

existingAmuletServer()
  .then(async (alreadyRunning) => {
    if (alreadyRunning) {
      console.log(`Amulet server is already running on port ${PORT}. Reusing the existing process.`);
      return;
    }
    await connectDB();
    await Template.updateMany({ isActive: { $exists: false } }, { $set: { isActive: true } });
    await purgeSoftDeletedTemplates();
    await Template.updateMany(
      { pagePreviewImage: { $exists: true, $nin: ['', null] }, pagePreviewAvailable: { $ne: true } },
      { $set: { pagePreviewAvailable: true } }
    );
    await removeLegacyEngagementTemplates();
    await ensureCuratedTemplates();
    await ensureTemplateCodes();
    await ensureDefaultReviews();
    try {
      await warmTemplateCatalogCache();
      console.log('Template catalog cache warmed.');
    } catch (error) {
      console.warn(`Template catalog cache warmup skipped: ${error.message}`);
    }
    startContactReminderScheduler();
    const server = app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
    server.on('error', async (error) => {
      if (error.code === 'EADDRINUSE' && await existingAmuletServer()) {
        console.log(`Amulet server is already running on port ${PORT}. Reusing the existing process.`);
        process.exit(0);
      }
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use by another application. Stop it or set a different PORT in server/.env.`);
        process.exit(1);
      }
      throw error;
    });
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
