import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const canonical = Object.freeze({
  database: 'e_invite',
  clientUrl: 'https://amulet.am',
  adminUrl: 'https://admin.amulet.am',
  serverUrl: 'https://server.amulet.am'
});

const parseEnv = (file) => {
  if (!fs.existsSync(file)) throw new Error(`Missing environment file: ${path.relative(projectRoot, file)}`);
  return Object.fromEntries(fs.readFileSync(file, 'utf8').split(/\r?\n/).flatMap((line) => {
    const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) return [];
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    return [[match[1], value]];
  }));
};

const server = parseEnv(path.join(projectRoot, 'server', '.env'));
const client = parseEnv(path.join(projectRoot, 'client', '.env'));
const admin = parseEnv(path.join(projectRoot, 'admin', '.env'));
const errors = [];

const requireValue = (source, key, scope) => {
  if (!String(source[key] || '').trim()) errors.push(`${scope}: ${key} is required`);
};
const expectValue = (source, key, expected, scope) => {
  const actual = String(source[key] || '').trim().replace(/\/+$/, '');
  if (actual !== expected) errors.push(`${scope}: ${key} must be ${expected}`);
};

['MONGO_URI', 'MONGO_DB_NAME', 'JWT_SECRET', 'GOOGLE_CLIENT_ID', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS',
  'MEDIA_ROOT', 'MEDIA_PUBLIC_URL', 'TELEGRAM_BOT_TOKEN', 'TELEGRAM_BOT_API_SECRET', 'TELEGRAM_ADMIN_CHAT_IDS']
  .forEach((key) => requireValue(server, key, 'server/.env'));

expectValue(server, 'NODE_ENV', 'production', 'server/.env');
expectValue(server, 'MONGO_DB_NAME', canonical.database, 'server/.env');
expectValue(server, 'CLIENT_URL', canonical.clientUrl, 'server/.env');
expectValue(server, 'ADMIN_URL', canonical.adminUrl, 'server/.env');
expectValue(server, 'SERVER_URL', canonical.serverUrl, 'server/.env');
expectValue(server, 'FRONTEND_URL', canonical.clientUrl, 'server/.env');
expectValue(server, 'BACKEND_URL', canonical.serverUrl, 'server/.env');
expectValue(server, 'MEDIA_PUBLIC_URL', `${canonical.serverUrl}/media`, 'server/.env');
expectValue(server, 'AUTH_COOKIE_DOMAIN', '.amulet.am', 'server/.env');
expectValue(client, 'VITE_API_URL', `${canonical.serverUrl}/api`, 'client/.env');
expectValue(client, 'VITE_SITE_URL', canonical.clientUrl, 'client/.env');
expectValue(admin, 'VITE_API_URL', `${canonical.serverUrl}/api`, 'admin/.env');
expectValue(admin, 'VITE_CLIENT_URL', canonical.clientUrl, 'admin/.env');

if (String(server.JWT_SECRET || '').length < 32) errors.push('server/.env: JWT_SECRET must be at least 32 characters');
if (!/^\d+-[a-z0-9_-]+\.apps\.googleusercontent\.com$/i.test(String(server.GOOGLE_CLIENT_ID || ''))) {
  errors.push('server/.env: GOOGLE_CLIENT_ID is not a valid Google OAuth web client ID');
}

try {
  const mongoUrl = new URL(server.MONGO_URI);
  const database = decodeURIComponent(mongoUrl.pathname.replace(/^\//, ''));
  if (database !== canonical.database) {
    errors.push(`server/.env: MONGO_URI must connect to the persistent ${canonical.database} database`);
  }
} catch {
  errors.push('server/.env: MONGO_URI is not a valid MongoDB URI');
}

if (String(server.PAYMENT_PROVIDER || 'arca').trim().toLowerCase() === 'arca') {
  ['ARCA_API_BASE_URL', 'ARCA_USERNAME', 'ARCA_PASSWORD', 'ARCA_CURRENCY'].forEach((key) => (
    requireValue(server, key, 'server/.env')
  ));
}

if (errors.length) {
  console.error('Production configuration check failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Production configuration is valid (MongoDB: ${canonical.database}, Google OAuth: server-authoritative).`);
