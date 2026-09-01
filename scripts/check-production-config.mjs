import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

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
  const normalizedExpected = String(expected || '').trim().replace(/\/+$/, '');
  if (actual !== normalizedExpected) errors.push(`${scope}: ${key} must match ${normalizedExpected}`);
};
const requireHttpsUrl = (source, key, scope) => {
  try {
    const url = new URL(String(source[key] || '').trim());
    if (url.protocol !== 'https:') throw new Error();
  } catch {
    errors.push(`${scope}: ${key} must be a valid HTTPS URL`);
  }
};

['MONGO_URI', 'JWT_SECRET', 'GOOGLE_CLIENT_ID', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS',
  'MEDIA_ROOT', 'MEDIA_PUBLIC_URL', 'TELEGRAM_BOT_TOKEN', 'TELEGRAM_BOT_API_SECRET', 'TELEGRAM_ADMIN_CHAT_IDS']
  .forEach((key) => requireValue(server, key, 'server/.env'));

expectValue(server, 'NODE_ENV', 'production', 'server/.env');
['CLIENT_URL', 'ADMIN_URL', 'SERVER_URL', 'FRONTEND_URL', 'BACKEND_URL']
  .forEach((key) => requireHttpsUrl(server, key, 'server/.env'));
['VITE_API_URL', 'VITE_SITE_URL'].forEach((key) => requireHttpsUrl(client, key, 'client/.env'));
['VITE_API_URL', 'VITE_CLIENT_URL'].forEach((key) => requireHttpsUrl(admin, key, 'admin/.env'));

// The VPS environment is the source of truth. Cross-check duplicated values
// without forcing a particular domain, database name, or deployment layout.
expectValue(server, 'FRONTEND_URL', server.CLIENT_URL, 'server/.env');
expectValue(server, 'BACKEND_URL', server.SERVER_URL, 'server/.env');
expectValue(client, 'VITE_SITE_URL', server.CLIENT_URL, 'client/.env');
expectValue(client, 'VITE_API_URL', `${String(server.SERVER_URL || '').replace(/\/+$/, '')}/api`, 'client/.env');
expectValue(admin, 'VITE_CLIENT_URL', server.CLIENT_URL, 'admin/.env');
expectValue(admin, 'VITE_API_URL', `${String(server.SERVER_URL || '').replace(/\/+$/, '')}/api`, 'admin/.env');

const mediaPublicUrl = String(server.MEDIA_PUBLIC_URL || '').trim();
if (mediaPublicUrl && !mediaPublicUrl.startsWith('/')) {
  try {
    const url = new URL(mediaPublicUrl);
    if (url.protocol !== 'https:') throw new Error();
  } catch {
    errors.push('server/.env: MEDIA_PUBLIC_URL must be root-relative or a valid HTTPS URL');
  }
}

const cookieDomain = String(server.AUTH_COOKIE_DOMAIN || '').trim().toLowerCase();
if (cookieDomain) {
  const normalizedCookieDomain = cookieDomain.replace(/^\./, '');
  try {
    const serverHost = new URL(server.SERVER_URL).hostname.toLowerCase();
    if (!/^[a-z0-9.-]+$/i.test(normalizedCookieDomain)
      || (serverHost !== normalizedCookieDomain && !serverHost.endsWith(`.${normalizedCookieDomain}`))) {
      throw new Error();
    }
  } catch {
    errors.push('server/.env: AUTH_COOKIE_DOMAIN must be empty or a parent domain of SERVER_URL');
  }
}

if (String(server.JWT_SECRET || '').length < 32) errors.push('server/.env: JWT_SECRET must be at least 32 characters');
if (!/^\d+-[a-z0-9_-]+\.apps\.googleusercontent\.com$/i.test(String(server.GOOGLE_CLIENT_ID || ''))) {
  errors.push('server/.env: GOOGLE_CLIENT_ID is not a valid Google OAuth web client ID');
}

let databaseName = '';
try {
  const mongoUrl = new URL(server.MONGO_URI);
  if (!['mongodb:', 'mongodb+srv:'].includes(mongoUrl.protocol)) throw new Error();
  databaseName = decodeURIComponent(mongoUrl.pathname.replace(/^\//, '')).trim();
  if (!databaseName) {
    errors.push('server/.env: MONGO_URI must include a database name');
  }
  const assertedDatabase = String(server.MONGO_DB_NAME || '').trim();
  if (assertedDatabase && databaseName && assertedDatabase !== databaseName) {
    errors.push('server/.env: optional MONGO_DB_NAME must match the database in MONGO_URI');
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

console.log(`Production configuration is valid (MongoDB: ${databaseName}, Google OAuth: server-authoritative).`);
