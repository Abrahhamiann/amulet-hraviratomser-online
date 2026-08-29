import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { ensureMediaRoot } from '../utils/mediaStorage.js';
import { optimizeLegacyTemplateMedia } from '../utils/imageOptimization.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

try {
  await connectDB();
  await ensureMediaRoot();
  const count = await optimizeLegacyTemplateMedia();
  console.log(`Migrated media for ${count} template(s).`);
} catch (error) {
  console.error(`Template media migration failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
