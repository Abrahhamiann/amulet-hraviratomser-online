import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Template from '../models/Template.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

try {
  await connectDB();
  const indexes = await Template.createIndexes();
  console.log(`Template indexes are ready: ${indexes.join(', ')}`);
} catch (error) {
  console.error(`Template index creation failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}

