import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { ensureMediaRoot } from '../utils/mediaStorage.js';
import { optimizeLegacyInvitationMedia, optimizeLegacyTemplateMedia } from '../utils/imageOptimization.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

try {
  await connectDB();
  await ensureMediaRoot();
  const templateCount = await optimizeLegacyTemplateMedia();
  const invitationCount = await optimizeLegacyInvitationMedia();
  console.log(`Migrated media for ${templateCount} template(s) and ${invitationCount} invitation(s).`);
} catch (error) {
  console.error(`Template media migration failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
