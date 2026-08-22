import assert from 'node:assert/strict';
import test from 'node:test';
import { parseCookies } from '../middleware/cookies.js';
import { authCookieOptions } from '../utils/authCookie.js';
import { isAllowedImage, isAllowedMusic, normalizeDraft, normalizeMapUrl } from '../utils/invitationDraft.js';

test('Google Maps links accept raw and Markdown formats while rejecting unsafe URLs', () => {
  const url = 'https://maps.app.goo.gl/MvP87wSLXXWeeUmw8';
  assert.equal(normalizeMapUrl(url), url);
  assert.equal(normalizeMapUrl(`[${url}](${url})`), url);
  assert.equal(normalizeMapUrl('javascript:alert(1)'), '');
});
import { createPreviewToken, hashPreviewToken } from '../utils/previewToken.js';
import { isStrongPassword, normalizePhone, passwordRequirements } from '../utils/accountValidation.js';

test('authentication cookie is HttpOnly, Lax, root-scoped, and production-secure', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  const options = authCookieOptions();
  assert.equal(options.httpOnly, true);
  assert.equal(options.secure, true);
  assert.equal(options.sameSite, 'lax');
  assert.equal(options.path, '/');
  assert.ok(options.maxAge > 0);
  if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = originalNodeEnv;
});

test('cookie middleware decodes cookie values without reading authorization headers', () => {
  const req = { headers: { cookie: 'amulet_auth=abc.def; language=hy', authorization: 'Bearer ignored' } };
  let called = false;
  parseCookies(req, {}, () => { called = true; });
  assert.equal(called, true);
  assert.equal(req.cookies.amulet_auth, 'abc.def');
  assert.equal(req.cookies.language, 'hy');
});

test('preview tokens are random and only their hashes need to be persisted', () => {
  const first = createPreviewToken();
  const second = createPreviewToken();
  assert.notEqual(first, second);
  assert.equal(first.length, 43);
  assert.equal(hashPreviewToken(first).length, 64);
  assert.notEqual(hashPreviewToken(first), first);
});

test('draft normalization rejects scriptable data SVG images and limits fields', () => {
  const template = {
    title: 'Invitation',
    description: 'Description',
    mainImage: '/safe.webp',
    gallery: []
  };
  assert.equal(isAllowedImage('data:image/svg+xml;base64,PHN2Zz4='), false);
  const draft = normalizeDraft({
    mainNames: 'A'.repeat(500),
    image: 'data:image/svg+xml;base64,PHN2Zz4=',
    colors: { accent: 'javascript:alert(1)' }
  }, template);
  assert.equal(draft.mainNames.length, 120);
  assert.equal(draft.image, '/safe.webp');
  assert.equal(draft.colors.accent, '#d8b98e');
});

test('draft normalization accepts bounded audio and rejects scriptable music URLs', () => {
  const template = { title: 'Invitation', description: 'Description', mainImage: '/safe.webp', gallery: [] };
  assert.equal(isAllowedMusic('/assets/song.mp3'), true);
  assert.equal(isAllowedMusic('data:audio/mpeg;base64,SUQz'), true);
  assert.equal(isAllowedMusic('javascript:alert(1)'), false);
  assert.equal(isAllowedMusic('//evil.example/song.mp3'), false);
  const draft = normalizeDraft({ musicUrl: 'javascript:alert(1)', musicStart: -10, musicEnd: 99999, imageFilter: 'url(javascript:1)' }, template);
  assert.equal(draft.musicUrl, '');
  assert.equal(draft.musicStart, 0);
  assert.equal(draft.musicEnd, 3600);
  assert.equal(draft.imageFilter, 'none');
});

test('editor design, RSVP, and venue settings are normalized without scriptable links', () => {
  const template = { title: 'Invitation', description: 'Description', mainImage: '/safe.webp', gallery: [] };
  const draft = normalizeDraft({
    imageFilter: 'cinema',
    buttonDesign: { preset: '12', radius: 'lg' },
    textStyles: { names: { fontFamily: 'url(javascript:alert(1))', fontSize: 999, align: 'right', color: '#112233' } },
    rsvpSettings: { title: 'Մասնակցություն', askGuestCount: false, askMeal: true },
    mapLinks: [{ label: 'Եկեղեցի', url: 'javascript:alert(1)', subtitle: 'Պսակադրություն', icon: 'church', visible: false }],
    dressCodeColors: [{ name: 'Sage', hex: '#A9B49A' }, { name: 'Bad', hex: 'red' }]
  }, template);
  assert.equal(draft.imageFilter, 'cinema');
  assert.deepEqual(draft.buttonDesign, { preset: '12', radius: 'lg' });
  assert.equal(draft.textStyles.names.fontFamily, 'inherit');
  assert.equal(draft.textStyles.names.fontSize, 120);
  assert.equal(draft.textStyles.names.align, 'right');
  assert.equal(draft.rsvpSettings.title, 'Մասնակցություն');
  assert.equal(draft.rsvpSettings.askGuestCount, false);
  assert.equal(draft.rsvpSettings.askMeal, true);
  assert.equal(draft.mapLinks[0].url, '');
  assert.equal(draft.mapLinks[0].subtitle, 'Պսակադրություն');
  assert.equal(draft.mapLinks[0].icon, 'church');
  assert.equal(draft.mapLinks[0].visible, false);
  assert.deepEqual(draft.dressCodeColors, [{ name: 'Sage', hex: '#a9b49a' }, { name: 'Bad', hex: '#d8b98e' }]);
});

test('editor preserves intentional blanks and sanitizes template-wide overrides', () => {
  const template = { title: 'Fallback title', description: 'Fallback description', mainImage: '/safe.webp', gallery: [] };
  const draft = normalizeDraft({
    mainNames: '',
    eventMessage: '',
    templateTextOverrides: { 'text-12': '', 'text-13': 'Custom copy', unsafe: 'ignored' },
    templateImageOverrides: { 'image-2': '', 'image-3': '/replacement.webp', 'image-4': 'javascript:alert(1)' }
  }, template);

  assert.equal(draft.mainNames, '');
  assert.equal(draft.eventMessage, '');
  assert.deepEqual(draft.templateTextOverrides, { 'text-12': '', 'text-13': 'Custom copy' });
  assert.deepEqual(draft.templateImageOverrides, { 'image-2': '', 'image-3': '/replacement.webp' });
});

test('account validation normalizes Armenian phone numbers and rejects weak passwords', () => {
  assert.equal(normalizePhone('041 401415'), '+37441401415');
  assert.equal(normalizePhone('+374 (41) 401-415'), '+37441401415');
  assert.equal(normalizePhone('123'), '');
  assert.equal(isStrongPassword('weakpassword'), false);
  assert.equal(isStrongPassword('Amulet2026!'), true);
  assert.deepEqual(passwordRequirements('Amulet2026!'), {
    length: true,
    lowercase: true,
    uppercase: true,
    number: true,
    special: true
  });
});
