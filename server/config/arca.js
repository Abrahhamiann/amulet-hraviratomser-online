const trimTrailingSlash = (value) => String(value || '').trim().replace(/\/+$/, '');

const requiredKeys = [
  'ARCA_API_BASE_URL',
  'ARCA_USERNAME',
  'ARCA_PASSWORD',
  'ARCA_CURRENCY',
  'FRONTEND_URL'
];

const configurationError = (message) => {
  const error = new Error(message);
  error.statusCode = 503;
  error.publicCode = 'PAYMENT_CONFIGURATION_ERROR';
  return error;
};

const readPositiveInteger = (key, fallback) => {
  const raw = String(process.env[key] || '').trim();
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw configurationError(`${key} must be a positive integer`);
  }
  return value;
};

const readUrl = (key, required = false) => {
  const value = trimTrailingSlash(process.env[key]);
  if (!value && !required) return '';
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported protocol');
    if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') throw new Error('HTTPS required');
    return trimTrailingSlash(url.href);
  } catch {
    throw configurationError(`${key} must be a valid HTTP(S) URL`);
  }
};

export const getArcaConfig = () => {
  const provider = String(process.env.PAYMENT_PROVIDER || 'arca').trim().toLowerCase();
  if (provider !== 'arca') throw configurationError('PAYMENT_PROVIDER must be arca');
  const missing = requiredKeys.filter((key) => !String(process.env[key] || '').trim());
  if (missing.length) {
    throw configurationError(`Missing ArCa payment configuration: ${missing.join(', ')}`);
  }

  const currency = String(process.env.ARCA_CURRENCY).trim();
  if (!/^\d{3}$/.test(currency)) {
    throw configurationError('ARCA_CURRENCY must be a three-digit ISO 4217 numeric currency code');
  }

  const statusEndpoint = String(process.env.ARCA_STATUS_ENDPOINT || 'getOrderStatusExtended.do').trim();
  if (!['getOrderStatusExtended.do', 'getOrderStatus.do'].includes(statusEndpoint)) {
    throw configurationError('ARCA_STATUS_ENDPOINT must be getOrderStatusExtended.do or getOrderStatus.do');
  }

  return {
    provider,
    baseUrl: readUrl('ARCA_API_BASE_URL', true),
    username: String(process.env.ARCA_USERNAME).trim(),
    password: String(process.env.ARCA_PASSWORD),
    currency,
    language: String(process.env.ARCA_LANGUAGE || 'hy').trim().slice(0, 2) || 'hy',
    frontendUrl: readUrl('FRONTEND_URL', true),
    backendUrl: readUrl('BACKEND_URL'),
    description: String(process.env.ARCA_PAYMENT_DESCRIPTION || '').trim().slice(0, 512),
    clientId: String(process.env.ARCA_CLIENT_ID || '').trim().slice(0, 255),
    merchantId: String(process.env.ARCA_MERCHANT_ID || '').trim(),
    terminalId: String(process.env.ARCA_TERMINAL_ID || '').trim(),
    amountMultiplier: readPositiveInteger('ARCA_AMOUNT_MULTIPLIER', 100),
    timeoutMs: readPositiveInteger('ARCA_REQUEST_TIMEOUT_MS', 15000),
    statusEndpoint
  };
};

export const arcaConfigurationStatus = () => {
  const provider = String(process.env.PAYMENT_PROVIDER || 'arca').trim().toLowerCase();
  const missing = requiredKeys.filter((key) => !String(process.env[key] || '').trim());
  if (provider !== 'arca') missing.unshift('PAYMENT_PROVIDER=arca');
  let baseHost = '';
  try {
    baseHost = process.env.ARCA_API_BASE_URL ? new URL(process.env.ARCA_API_BASE_URL).host : '';
  } catch {
    baseHost = 'invalid';
  }
  return { provider, configured: provider === 'arca' && missing.length === 0, baseHost, missing };
};
