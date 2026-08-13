// Single source of truth for every environment-dependent URL on the server.
// Change values in server/.env only — never hardcode a host anywhere else.

const trimTrailingSlash = (value) => String(value || '').trim().replace(/\/+$/, '');

const readUrl = (key, fallback) => trimTrailingSlash(process.env[key]) || fallback;

export const clientUrl = () => readUrl('CLIENT_URL', 'http://localhost:5173');

export const adminUrl = () => readUrl('ADMIN_URL', 'http://localhost:8080');

export const serverUrl = () => readUrl('SERVER_URL', `http://localhost:${process.env.PORT || 5000}`);

// Builds an absolute link to a page of the public site: clientLink('/account') -> https://amulet.am/account
export const clientLink = (path = '') => {
  const suffix = String(path || '');
  if (!suffix) return clientUrl();
  return `${clientUrl()}${suffix.startsWith('/') ? '' : '/'}${suffix}`;
};

export const adminLink = (path = '') => {
  const suffix = String(path || '');
  if (!suffix) return adminUrl();
  return `${adminUrl()}${suffix.startsWith('/') ? '' : '/'}${suffix}`;
};

// Every origin that may talk to the API with credentials.
// In development localhost/127.0.0.1 are treated as the same origin pair.
export const allowedOrigins = () => [clientUrl(), adminUrl(), ...extraOrigins()].flatMap((origin) => {
  try {
    const url = new URL(origin);
    if (!['localhost', '127.0.0.1'].includes(url.hostname)) return [url.origin];
    const alias = new URL(origin);
    alias.hostname = url.hostname === 'localhost' ? '127.0.0.1' : 'localhost';
    return [url.origin, alias.origin];
  } catch {
    return [];
  }
});

// Optional comma separated list, e.g. CORS_EXTRA_ORIGINS=https://www.amulet.am
const extraOrigins = () => String(process.env.CORS_EXTRA_ORIGINS || '')
  .split(',')
  .map((value) => trimTrailingSlash(value))
  .filter(Boolean);
