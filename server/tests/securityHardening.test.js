import assert from 'node:assert/strict';
import test from 'node:test';
import express from 'express';
import bcrypt from 'bcryptjs';
import { browserRequestGuard, createRateLimiter, securityHeaders, validateRequestShape } from '../middleware/security.js';
import { errorHandler } from '../middleware/error.js';
import { validGoogleProfile, canLinkGoogleIdentity } from '../utils/googleIdentity.js';
import { parseCookies } from '../middleware/cookies.js';
import { createRSVP } from '../controllers/rsvpController.js';
import { getInvitationBySlug } from '../controllers/invitationController.js';
import { verifyArcaPayment } from '../services/paymentService.js';
import Payment from '../models/Payment.js';
import { createAdminUser } from '../controllers/adminController.js';
import { verifyPasswordResetCode, resetPassword } from '../controllers/authController.js';
import Invitation from '../models/Invitation.js';
import User from '../models/User.js';
import crypto from 'node:crypto';

const response = () => ({
  statusCode: 200, headers: {},
  status(code) { this.statusCode = code; return this; },
  set(key, value) { if (typeof key === 'object') Object.assign(this.headers, key); else this.headers[key] = value; return this; },
  json(body) { this.body = body; return this; }
});
const invoke = (handler, req, res = response()) => new Promise((resolve, reject) => {
  res.json = (body) => { res.body = body; resolve(res); return res; };
  handler(req, res, (error) => error ? reject(error) : resolve(res));
});

test('HTTP boundary blocks operator injection, malformed JSON and internal errors', async () => {
  const app = express();
  app.disable('x-powered-by');
  app.use(securityHeaders, express.json({ limit: '1kb' }), validateRequestShape);
  app.post('/input', (_req, res) => res.json({ ok: true }));
  app.get('/failure', () => { throw new Error('mongodb://private-database/internal'); });
  app.use(errorHandler);
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const body of ['{"email":{"$ne":null}}', '{"__proto__":{"role":"admin"}}', '{broken']) {
      const result = await fetch(`${url}/input`, { method: 'POST', headers: { 'content-type': 'application/json' }, body });
      assert.equal(result.status, 400);
      assert.equal(result.headers.get('x-content-type-options'), 'nosniff');
      assert.equal(result.headers.get('cache-control'), 'no-store');
      assert.equal(result.headers.get('x-powered-by'), null);
    }
    const oversized = await fetch(`${url}/input`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: 'a'.repeat(2000) }) });
    assert.equal(oversized.status, 413);
    const failure = await fetch(`${url}/failure`);
    assert.equal(failure.status, 500);
    assert.deepEqual(await failure.json(), { message: 'Server error' });
    const good = await fetch(`${url}/input`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"name":"Anna"}' });
    assert.equal(good.status, 200);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});

test('rate limits expire, bound memory, ignore spoofed headers and group IPv6 addresses', () => {
  let time = 0;
  const limit = createRateLimiter({ limit: 2, windowMs: 1000, maxKeys: 1, now: () => time });
  const request = (ip) => {
    const res = response();
    limit({ ip, headers: { 'x-forwarded-for': Math.random().toString() } }, res, () => {});
    return res;
  };
  assert.equal(request('2001:db8:1:2::1').statusCode, 200);
  assert.equal(request('2001:db8:1:2::2').statusCode, 200);
  assert.equal(request('2001:db8:1:2::3').statusCode, 429);
  assert.equal(request('192.0.2.1').statusCode, 429);
  time = 1001;
  assert.equal(request('192.0.2.1').statusCode, 200);
});

test('CSRF guard blocks foreign and missing cookie origins, permits configured frontend origins', () => {
  const guard = browserRequestGuard(['https://amulet.am']);
  for (const [origin, cookie, expected] of [
    ['https://evil.test', undefined, 403], ['null', undefined, 403],
    [undefined, 'amulet_auth=token', 403], ['https://amulet.am', 'amulet_auth=token', 200],
    [undefined, undefined, 200]
  ]) {
    const res = response();
    guard({ method: 'POST', headers: { cookie }, get: (key) => key === 'origin' ? origin : undefined }, res, () => {});
    assert.equal(res.statusCode, expected);
  }
});

test('shape validation rejects excessive nesting and preserves ordinary nested drafts', () => {
  let body = {};
  for (let index = 0; index < 22; index++) body = { child: body };
  const res = response();
  validateRequestShape({ body }, res, () => assert.fail('nested payload passed'));
  assert.equal(res.statusCode, 400);
  let passed = false;
  validateRequestShape({ body: { draft: { colors: { accent: '#ffffff' }, gallery: ['/safe.webp'] } } }, response(), () => { passed = true; });
  assert.equal(passed, true);
});

test('Google identity checks reject unverified, expired, wrong-issuer and mismatched accounts', () => {
  const profile = { aud: 'client', iss: 'https://accounts.google.com', sub: 'subject', email: 'owner@gmail.com', email_verified: true, exp: Date.now() / 1000 + 3600 };
  assert.equal(validGoogleProfile(profile, 'client'), true);
  for (const changes of [{ email_verified: false }, { exp: 1 }, { iss: 'https://evil.test' }, { aud: 'other' }, { sub: '' }]) {
    assert.equal(validGoogleProfile({ ...profile, ...changes }, 'client'), false);
  }
  assert.equal(canLinkGoogleIdentity({ role: 'user' }, profile), true);
  assert.equal(canLinkGoogleIdentity({ role: 'super_admin' }, profile), false);
  assert.equal(canLinkGoogleIdentity({ role: 'user', googleId: 'different' }, profile), false);
  assert.equal(canLinkGoogleIdentity({ role: 'user' }, { ...profile, email: 'owner@third-party.test' }), false);
});

test('cookie names cannot mutate the parsed cookie prototype', () => {
  const req = { headers: { cookie: '__proto__=polluted; amulet_auth=abc' } };
  parseCookies(req, {}, () => {});
  assert.equal(Object.getPrototypeOf(req.cookies), null);
  assert.equal(req.cookies.amulet_auth, 'abc');
});

test('unpublished invitation cannot accept public RSVPs', async () => {
  const original = Invitation.findById;
  Invitation.findById = async () => ({ isPublished: false });
  try {
    const res = response();
    await assert.rejects(invoke(createRSVP, { params: { invitationId: '507f1f77bcf86cd799439011' }, body: {} }, res), /Invitation not found/);
    assert.equal(res.statusCode, 404);
  } finally { Invitation.findById = original; }
});

test('unpublishing an invitation immediately revokes its API response', async () => {
  const original = Invitation.findOne;
  let published = true;
  Invitation.findOne = (query) => {
    assert.equal(query.isPublished, true);
    return { select: () => ({ populate: () => ({ lean: async () => published ? { templateId: { designKey: 'ivory-vows' } } : null }) }) };
  };
  try {
    const req = { params: { slug: 'A7i_TnSwz9SkokdXA1VOMrLv_4PjQqYk' } };
    const first = await invoke(getInvitationBySlug, req);
    assert.equal(first.headers['Cache-Control'], 'no-store');
    published = false;
    await assert.rejects(invoke(getInvitationBySlug, req), /Invitation not found/);
  } finally { Invitation.findOne = original; }
});

test('paid provider response without amount or currency cannot finalize a purchase', async () => {
  const originalFind = Payment.findById;
  const originalFetch = global.fetch;
  const previousEnv = { ...process.env };
  Object.assign(process.env, {
    ARCA_API_BASE_URL: 'https://payments.example.test/rest', ARCA_USERNAME: 'test',
    ARCA_PASSWORD: 'test', ARCA_CURRENCY: '051', FRONTEND_URL: 'https://shop.example.test'
  });
  Payment.findById = async () => ({ _id: 'payment', userId: 'owner', status: 'PENDING', arcaOrderId: 'arca', localOrderId: 'local', providerAmount: '10000', currency: '051' });
  global.fetch = async () => new Response(JSON.stringify({ orderNumber: 'local', orderStatus: 2 }), { status: 200 });
  try {
    await assert.rejects(verifyArcaPayment({ paymentId: 'payment', user: { _id: 'owner' } }), (error) => error.publicCode === 'PAYMENT_VERIFICATION_INCOMPLETE');
    await assert.rejects(verifyArcaPayment({ paymentId: 'payment', user: { _id: 'stranger' } }), (error) => error.publicCode === 'PAYMENT_FORBIDDEN');
  } finally {
    Payment.findById = originalFind; global.fetch = originalFetch;
    for (const key of Object.keys(process.env)) if (!(key in previousEnv)) delete process.env[key];
    Object.assign(process.env, previousEnv);
  }
});

test('admin cannot create accounts with missing or weak passwords', async () => {
  for (const password of [undefined, '', 'weak', { value: 'Strong123!' }]) {
    const res = response();
    await assert.rejects(invoke(createAdminUser, { body: { name: 'Test', email: 'test@example.com', password } }, res), /strong password/);
    assert.equal(res.statusCode, 400);
  }
});

test('concurrent reset-code validation issues only one reset token', async () => {
  const original = User.findOneAndUpdate;
  const hash = crypto.createHash('sha256').update('123456').digest('hex');
  let claimed = false;
  let attempts = 0;
  User.findOneAndUpdate = (query, update) => {
    if (update.$inc) {
      assert.equal(query.passwordResetAttempts.$lt, 5);
      attempts++;
      return { select: async () => ({ _id: 'id', email: 'user@example.com', passwordResetCodeHash: hash, passwordResetCodeExpires: new Date(Date.now() + 60000) }) };
    }
    assert.equal(query.passwordResetCodeHash, hash);
    if (claimed) return Promise.resolve(null);
    claimed = true;
    return Promise.resolve({ _id: 'id' });
  };
  try {
    const results = await Promise.allSettled(Array.from({ length: 2 }, () => invoke(verifyPasswordResetCode, { body: { email: 'user@example.com', code: '123456' } })));
    assert.equal(attempts, 2);
    assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
  } finally { User.findOneAndUpdate = original; }
});

test('concurrent password resets consume a token once and revoke sessions atomically', async () => {
  const originalFind = User.findOne;
  const originalUpdate = User.findOneAndUpdate;
  const token = 'random-reset-token';
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  let consumed = false;
  User.findOne = () => ({ select: async () => ({ _id: 'id', passwordResetTokenHash: hash, passwordResetTokenExpires: new Date(Date.now() + 60000) }) });
  User.findOneAndUpdate = async (query, update) => {
    assert.equal(query.passwordResetTokenHash, hash);
    assert.equal(update.$inc.tokenVersion, 1);
    assert.equal(await bcrypt.compare('StrongPassword1!', update.$set.password), true);
    if (consumed) return null;
    consumed = true;
    return { _id: 'id' };
  };
  try {
    const results = await Promise.allSettled(Array.from({ length: 2 }, () => {
      const res = response(); res.clearCookie = () => {};
      return invoke(resetPassword, { body: { email: 'user@example.com', resetToken: token, password: 'StrongPassword1!', confirmPassword: 'StrongPassword1!' } }, res);
    }));
    assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
  } finally { User.findOne = originalFind; User.findOneAndUpdate = originalUpdate; }
});
