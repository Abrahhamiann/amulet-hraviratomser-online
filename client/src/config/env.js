// Single source of truth for every environment-dependent value on the public site.
// Change values in client/.env only — never hardcode a host or a contact link elsewhere.

const env = import.meta.env;

const trimTrailingSlash = (value) => String(value || '').trim().replace(/\/+$/, '');

const read = (key, fallback = '') => {
  const value = env?.[key];
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
};

// Public URL of this site (https://amulet.am). Falls back to the browser origin,
// which keeps preview deployments and local dev working without extra config.
export const SITE_URL = (() => {
  const configured = trimTrailingSlash(read('VITE_SITE_URL'));
  if (configured) return configured;
  if (typeof window !== 'undefined' && window.location?.origin) return trimTrailingSlash(window.location.origin);
  return 'http://localhost:5173';
})();

// Absolute link to a page of this site: siteUrl('/invite/abc') -> https://amulet.am/invite/abc
export const siteUrl = (path = '') => {
  const suffix = String(path || '');
  if (!suffix) return SITE_URL;
  return `${SITE_URL}${suffix.startsWith('/') ? '' : '/'}${suffix}`;
};

// REST API root (https://server.amulet.am/api).
export const API_URL = (() => {
  const configured = trimTrailingSlash(read('VITE_API_URL'));
  if (configured) {
    try {
      const apiUrl = new URL(configured);
      const pageHost = typeof window !== 'undefined' ? window.location.hostname : '';
      const isLoopbackApi = ['localhost', '127.0.0.1', '::1'].includes(apiUrl.hostname);
      // Dev only: reach the API through whichever host the page was opened with
      // (phone on the same Wi-Fi, 127.0.0.1 vs localhost, etc.).
      if (isLoopbackApi && pageHost) {
        apiUrl.hostname = pageHost;
        return trimTrailingSlash(apiUrl.toString());
      }
    } catch {
      return configured;
    }
    return configured;
  }

  if (typeof window !== 'undefined' && window.location?.hostname) {
    return `${window.location.protocol}//${window.location.hostname}:5000/api`;
  }
  return 'http://127.0.0.1:5000/api';
})();

export const apiAssetUrl = (value = '') => {
  const source = String(value || '').trim();
  if (!source || /^(?:https?:|data:|asset:)/i.test(source)) return source;
  // Vite serves bundled assets from the client origin (`/src/...` in dev and
  // `/assets/...` in production). Only persisted API media belongs to the API
  // origin; rebasing every root-relative URL made curated card images point at
  // port 5000 locally and return 404.
  if (!source.startsWith('/media/')) return source;
  try {
    return new URL(source, API_URL.replace(/\/api\/?$/, '/')).toString();
  } catch {
    return source;
  }
};

export const GOOGLE_CLIENT_ID = read('VITE_GOOGLE_CLIENT_ID');

// Contact / social links.
export const CONTACT_PHONE_DISPLAY = read('VITE_CONTACT_PHONE_DISPLAY', '041 401415');
export const CONTACT_PHONE_E164 = read('VITE_CONTACT_PHONE_E164', '+37441401415');
export const CONTACT_PHONE_DIGITS = read('VITE_CONTACT_PHONE_DIGITS', CONTACT_PHONE_E164.replace(/\D/g, ''));
export const CONTACT_TELEGRAM_HANDLE = read('VITE_CONTACT_TELEGRAM', 'amulet_invitiations').replace(/^@/, '');
export const CONTACT_INSTAGRAM_HANDLE = read('VITE_CONTACT_INSTAGRAM', 'amulet_invite').replace(/^@/, '');
export const CONTACT_EMAIL = read('VITE_CONTACT_EMAIL', 'amuletarmenia@gmail.com');
export const CONTACT_TELEGRAM_URL = `https://t.me/${CONTACT_TELEGRAM_HANDLE}`;
export const CONTACT_WHATSAPP_URL = `${trimTrailingSlash(read('VITE_WHATSAPP_BASE_URL', 'https://wa.me'))}/${CONTACT_PHONE_DIGITS}`;
export const CONTACT_INSTAGRAM_URL = `https://www.instagram.com/${CONTACT_INSTAGRAM_HANDLE}/`;

// External services.
export const QR_API_URL = trimTrailingSlash(read('VITE_QR_API_URL', 'https://api.qrserver.com/v1/create-qr-code/'));
export const CREATION_VIDEO_URL = read('VITE_CREATION_VIDEO_URL', 'https://youtu.be/WUPRFyeUwCU?si=sAyLMnUu_QknEBLF');
export const COMPANY_SITE_URL = read('VITE_COMPANY_SITE_URL', 'https://rsoft.am');

// QR image for any URL, sized in pixels.
export const qrImageUrl = (data, size = 220, margin = 12) => (
  `${QR_API_URL}?size=${size}x${size}&margin=${margin}&data=${encodeURIComponent(data)}`
);
