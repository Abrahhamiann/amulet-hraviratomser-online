import { isIP } from 'node:net';

export const securityHeaders = (req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cache-Control': 'no-store'
  });
  if (process.env.NODE_ENV === 'production' && req.secure) {
    res.set('Strict-Transport-Security', 'max-age=31536000');
  }
  next();
};

export const browserRequestGuard = (origins) => (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.get('origin');
  if ((origin && !origins.includes(origin))
    || (!origin && req.get('sec-fetch-site') === 'cross-site')
    || (!origin && req.headers.cookie)) {
    return res.status(403).json({ message: 'Cross-site request blocked' });
  }
  next();
};

// Reject operators instead of silently changing their meaning. Bound traversal
// so deeply nested JSON cannot exhaust the stack or monopolize the event loop.
export const validateRequestShape = (req, res, next) => {
  const pending = [[req.body, 0], [req.query, 0]];
  let count = 0;
  while (pending.length) {
    const [value, depth] = pending.pop();
    if (++count > 20000 || depth > 20) {
      return res.status(400).json({ message: 'Request structure is too complex' });
    }
    if (!value || typeof value !== 'object') continue;
    for (const [key, child] of Object.entries(value)) {
      if (key.startsWith('$') || key.includes('.') || ['__proto__', 'prototype', 'constructor'].includes(key)) {
        return res.status(400).json({ message: 'Invalid request field' });
      }
      pending.push([child, depth + 1]);
    }
  }
  next();
};

const clientKey = (req) => {
  let ip = req.ip || req.socket?.remoteAddress || 'unknown';
  if (ip.startsWith('::ffff:') && isIP(ip.slice(7)) === 4) ip = ip.slice(7);
  // Group IPv6 privacy addresses by /64 to prevent trivial address rotation.
  if (isIP(ip) === 6) {
    const [left, right = ''] = ip.split('::');
    const head = left ? left.split(':') : [];
    const tail = right ? right.split(':') : [];
    const words = [...head, ...Array(Math.max(0, 8 - head.length - tail.length)).fill('0'), ...tail];
    return words.slice(0, 4).map((word) => parseInt(word, 16).toString(16)).join(':');
  }
  return ip;
};

// The production PM2 configuration runs one API process. For multiple API
// instances replace this bounded local store with a shared Redis-backed limiter.
export const createRateLimiter = ({ limit, windowMs, maxKeys = 10000, now = Date.now }) => {
  const clients = new Map();
  let nextCleanup = 0;
  return (req, res, next) => {
    const time = now();
    if (time >= nextCleanup) {
      for (const [key, entry] of clients) if (entry.reset <= time) clients.delete(key);
      nextCleanup = time + Math.min(windowMs, 60000);
    }
    const key = clientKey(req);
    let entry = clients.get(key);
    if (!entry || entry.reset <= time) {
      if (!entry && clients.size >= maxKeys) {
        res.set('Retry-After', '60');
        return res.status(429).json({ message: 'Too many requests. Please try again later' });
      }
      entry = { count: 0, reset: time + windowMs };
      clients.set(key, entry);
    }
    if (++entry.count > limit) {
      res.set('Retry-After', String(Math.max(1, Math.ceil((entry.reset - time) / 1000))));
      return res.status(429).json({ message: 'Too many requests. Please try again later' });
    }
    next();
  };
};
