import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Set PLAYWRIGHT_MODULE to an existing Playwright index.mjs, or install Playwright.
const playwright = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const root = path.resolve('client/dist');
const security = await fs.readFile('deploy/generated/amulet-security.conf', 'utf8');
const csp = security.match(/Content-Security-Policy "([^"]+)"/)[1];
const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png' };
const server = http.createServer(async (req, res) => {
  try {
    let filename = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
    assert.ok(filename.startsWith(root));
    try { if ((await fs.stat(filename)).isDirectory()) filename = path.join(filename, 'index.html'); }
    catch { filename = path.join(root, req.url.startsWith('/legacy/') ? 'legacy/index.html' : 'index.html'); }
    res.setHeader('Content-Type', types[path.extname(filename)] || 'application/octet-stream');
    res.setHeader('Content-Security-Policy', csp);
    res.end(await fs.readFile(filename));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = 'http://127.0.0.1:' + server.address().port;
const slug = 'a'.repeat(48);
const fixture = {
  _id: '0123456789abcdef01234567', names: 'Anna & Aram', date: '2027-05-21T00:00:00.000Z', time: '18:00',
  location: 'Yerevan', message: 'Celebrate with us', templateId: { title: 'Wedding invitation', designKey: 'test' },
  mapLinks: [{ label: 'Ceremony', time: '18:00', address: 'Yerevan', url: 'https://maps.google.com/?q=Yerevan' }, { label: 'Unsafe link', url: 'javascript:alert(1)' }],
  gallery: ['/media/test.webp'], customization: {}
};
await fs.mkdir('tmp/legacy-tests', { recursive: true });
try {
  for (const engine of (process.env.LEGACY_TEST_ENGINES || 'chromium,firefox,webkit').split(',')) {
    const browser = await playwright[engine].launch({ headless: true });
    try {
      const context = await browser.newContext({ viewport: { width: 768, height: 1024 }, userAgent: 'Mozilla/5.0 (iPad; CPU OS 9_3 like Mac OS X) AppleWebKit/601.1.46 Version/9.0 Mobile/13E233 Safari/601.1' });
      const page = await context.newPage();
      await page.addInitScript(() => {
        window.fetch = undefined; window.AbortController = undefined; window.ResizeObserver = undefined;
        window.IntersectionObserver = undefined; window.WebAssembly = undefined;
        window.URL = undefined; window.URLSearchParams = undefined;
      });
      const errors = [];
      const requests = [];
      let submission;
      let fail = false;
      let postFails = false;
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => requests.push(request.url()));
      await page.route('**/legacy-api/**', async route => {
        const url = route.request().url();
        if (url.includes('legacy-image')) return route.fulfill({ status: 200, contentType: 'image/jpeg', body: await fs.readFile('client/dist/legacy/poster.jpg') });
        if (route.request().method() === 'POST') {
          submission = route.request().postDataJSON();
          return route.fulfill({ status: postFails ? 500 : 201, json: { _id: 'rsvp-test' } });
        }
        if (fail) return route.fulfill({ status: 404, json: { message: 'Not found' } });
        if (url.includes('/invitations/')) return route.fulfill({ json: fixture });
        if (url.includes('/templates?')) return route.fulfill({ json: { items: [{ _id: fixture._id, title: 'Wedding invitation', price: 10000 }], hasMore: false } });
        return route.fulfill({ json: { _id: fixture._id, title: 'Wedding invitation', description: 'A special day', price: 10000 } });
      });
      await page.goto(base + '/invite/' + slug + '?guest=test#rsvp');
      await page.waitForURL('**/legacy/**');
      await page.locator('h1').filter({ hasText: 'Anna & Aram' }).waitFor();
      assert.ok(page.url().includes('guest=test'));
      assert.ok(page.url().endsWith('#rsvp'));
      assert.equal(await page.locator('a[href^="javascript:"]').count(), 0);
      assert.equal(await page.locator('a[href^="https://maps.google.com"]').count(), 1);
      await page.locator('#rsvp-guestName').fill('Test Guest');
      await page.locator('#rsvp-status').selectOption('attending');
      await page.locator('#rsvp-guestCount').fill('2');
      postFails = true;
      await page.locator('button[type=submit]').click();
      await page.locator('form .error').waitFor();
      assert.equal(await page.locator('#rsvp-guestName').inputValue(), 'Test Guest');
      postFails = false;
      await page.locator('button[type=submit]').click();
      await page.locator('form .status').waitFor();
      assert.deepEqual(submission, { guestName: 'Test Guest', phone: '', status: 'attending', guestCount: 2, guestSide: 'other', message: '' });
      assert.equal(await page.locator('button[type=submit]').isDisabled(), true);
      await page.screenshot({ path: `tmp/legacy-tests/${engine}-invitation.png`, fullPage: true });
      await page.reload();
      await page.locator('#rsvp-guestName').waitFor();
      assert.ok(!requests.some(url => /(?:react-vendor|motion-vendor|lottie-vendor|\/main-)|\.wasm|\.mp[34]/.test(url)));
      fail = true;
      await page.reload();
      await page.locator('.error').waitFor();
      fail = false;
      await page.locator('main button').click();
      await page.locator('#rsvp-guestName').waitFor();
      await page.goto(base + '/legacy/?route=%2Ftemplates');
      await page.locator('article a').click();
      await page.getByText('A special day').waitFor();
      await page.goto(base + '/legacy/invite/' + slug);
      await page.locator('#rsvp-guestName').waitFor();
      await page.goto(base + '/legacy/');
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({ path: `tmp/legacy-tests/${engine}-home-mobile.png`, fullPage: true });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
      assert.deepEqual(errors, []);
      await page.goto(base + '/legacy/?legacyDebug=1');
      await page.evaluate(() => window.onerror('Diagnostic test', '/legacy/app.js', 12, 4));
      assert.match(await page.locator('#legacy-diagnostics').innerText(), /Diagnostic test[\s\S]*Line: 12 Column: 4/);
      await page.goto(base + '/legacy/');
      assert.equal(await page.locator('#legacy-diagnostics').count(), 0);
      await context.close();

      // Current engine, unmodified capabilities: React still renders under CSP.
      const modern = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const modernPage = await modern.newPage();
      await modernPage.addInitScript(() => window.addEventListener('vite:preloadError', event => console.error('Preload failure: ' + (event.payload && event.payload.stack || event.payload))));
      const modernErrors = [];
      modernPage.on('pageerror', error => modernErrors.push(error.message));
      modernPage.on('console', message => { if (message.type() === 'error') console.log(engine + ' console: ' + message.text()); });
      await modernPage.route('**/api/**', route => route.fulfill({ json: route.request().url().includes('/templates') ? { items: [], hasMore: false } : [] }));
      await modernPage.goto(base);
      try { await modernPage.locator('#root h1').waitFor({ timeout: 15000 }); }
      catch (error) { console.log(modernErrors, await modernPage.locator('body').innerText()); throw error; }
      assert.equal(new URL(modernPage.url()).pathname, '/');
      await modernPage.screenshot({ path: `tmp/legacy-tests/${engine}-modern.png` });
      assert.deepEqual(modernErrors, []);
      await modern.close();
      console.log(`${engine}: legacy redirect, missing APIs, invitation, RSVP success/error, links, refresh, catalog, responsive layout and modern homepage passed.`);
    } finally { await browser.close(); }
  }
} finally { await new Promise(resolve => server.close(resolve)); }
