import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const directory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(directory, '../.env') });

const required = (name) => {
  const value = String(process.env[name] || '').trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
};

const port = String(process.env.PORT || '5000').trim();

export const config = Object.freeze({
  token: required('TELEGRAM_BOT_TOKEN'),
  username: String(process.env.TELEGRAM_BOT_USERNAME || '').trim().replace(/^@/, ''),
  apiSecret: required('TELEGRAM_BOT_API_SECRET'),
  apiUrl: String(
    process.env.TELEGRAM_BOT_API_URL || `http://127.0.0.1:${port}/api/telegram/bot`
  ).trim().replace(/\/$/, ''),
  adminChatIds: new Set(
    [
      process.env.TELEGRAM_ADMIN_CHAT_IDS,
      process.env.TELEGRAM_ADMIN_1_ID,
      process.env.TELEGRAM_ADMIN_2_ID
    ]
      .filter(Boolean)
      .flatMap((value) => String(value).split(/[\s,;]+/))
      .map((value) => value.trim())
      .filter((value) => /^-?\d+$/.test(value))
  )
});
