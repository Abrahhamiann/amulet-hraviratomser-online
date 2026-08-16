import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import { isStrongPassword, isValidEmail, normalizeEmail } from '../utils/accountValidation.js';

dotenv.config();

const run = async () => {
  const email = normalizeEmail(process.env.SUPER_ADMIN_EMAIL);
  const password = String(process.env.SUPER_ADMIN_PASSWORD || '');
  const name = String(process.env.SUPER_ADMIN_NAME || 'Super Admin').trim();

  if (!email || !password) {
    throw new Error('SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required');
  }
  if (!isValidEmail(email)) {
    throw new Error('SUPER_ADMIN_EMAIL must be a valid email address');
  }
  if (!isStrongPassword(password)) {
    throw new Error('SUPER_ADMIN_PASSWORD must be 8-128 characters and include uppercase, lowercase, number, and special characters');
  }

  await connectDB();

  const existingUser = await User.findOne({ email }).select('+tokenVersion');
  if (existingUser && existingUser.role !== 'super_admin') {
    throw new Error(`A non-super-admin user already exists with email ${email}; refusing to change its role`);
  }

  if (existingUser) {
    existingUser.name = name || existingUser.name;
    existingUser.password = password;
    existingUser.provider = 'local';
    existingUser.isEmailVerified = true;
    existingUser.tokenVersion = (existingUser.tokenVersion || 0) + 1;
    await existingUser.save();
    console.log(`Super admin ${email} updated; existing sessions were revoked`);
    return;
  }

  await User.create({
    name: name || 'Super Admin',
    email,
    password,
    role: 'super_admin',
    provider: 'local',
    isEmailVerified: true
  });
  console.log(`Super admin ${email} created`);
};

run()
  .catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
