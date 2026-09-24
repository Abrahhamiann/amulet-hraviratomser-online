import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

const result = dotenv.config({
  path: fileURLToPath(new URL('../.env.development', import.meta.url)),
  override: true
});
if (result.error) throw new Error('Create server/.env.development before starting the local bot');
if (process.env.NODE_ENV !== 'development') throw new Error('Local bot requires NODE_ENV=development');
if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_BOT_API_SECRET) {
  throw new Error('Set local TELEGRAM_BOT_TOKEN and TELEGRAM_BOT_API_SECRET before starting the bot');
}
process.env.AMULET_DEV_ENV = '1';
await import('./bot.js');
