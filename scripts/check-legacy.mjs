import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { parse } from 'acorn';
import { cspHashes } from '@vitejs/plugin-legacy';

const detector = await fs.readFile('client/public/browser-support.js', 'utf8');
function detect(ua, modules, pathname = '/invite/example') {
  let redirected;
  const window = { navigator: { userAgent: ua }, location: { pathname, search: '?x=a%26b', hash: '#rsvp', replace: url => { redirected = url; } } };
  const document = { createElement: () => modules ? { noModule: false } : {} };
  vm.runInNewContext(detector, { window, document });
  return { ...window.AmuletBrowserSupport, redirected };
}
const old = detect('Mozilla/5.0 (iPad; CPU OS 9_3_5 like Mac OS X)', false);
assert.equal(old.isLegacyIOS, true);
assert.equal(old.redirected, '/legacy/?x=a%26b&route=%2Finvite%2Fexample#rsvp');
assert.equal(detect('Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X)', true).redirected, undefined);
assert.equal(detect('Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X)', true).redirected, undefined);
assert.equal(detect('Googlebot', true).redirected, undefined);
assert.equal(detect('Mozilla/5.0 (Macintosh; Intel Mac OS X)', true).redirected, undefined);
assert.equal(detect('Mozilla/5.0 (iPad; CPU OS 9_3 like Mac OS X)', false, '/legacy/').redirected, undefined);
assert.equal(detect('Safari/601', false).needsLegacy, true);

const files = ['browser-support.js', 'legacy/app.js', 'legacy/diagnostics.js', 'legacy/config.js'];
let bytes = 0;
for (const file of [...files, 'legacy/index.html', 'legacy/style.css']) {
  const text = await fs.readFile('client/dist/' + file, 'utf8');
  if (file.endsWith('.js')) parse(text, { ecmaVersion: 5 });
  if (file.startsWith('legacy/')) bytes += Buffer.byteLength(text);
}
const html = await fs.readFile('client/dist/index.html', 'utf8');
assert.match(html, /type="module"/);
assert.match(html, /id="vite-legacy-polyfill"/);
assert.match(html, /id="vite-legacy-entry"/);
assert.match(html, /System.import/);
assert.ok(html.indexOf('/browser-support.js') < html.indexOf('type="module"'));
const assets = await fs.readdir('client/dist/assets');
const polyfills = assets.find(file => /^polyfills-legacy-.*\.js$/.test(file));
assert.ok(polyfills);
assert.match(await fs.readFile('client/dist/assets/' + polyfills, 'utf8'), /System/);
const security = await fs.readFile('deploy/generated/amulet-security.conf', 'utf8');
for (const hash of cspHashes) assert.ok(security.includes('sha256-' + hash));
const legacyHtml = await fs.readFile('client/dist/legacy/index.html', 'utf8');
assert.doesNotMatch(legacyHtml, /modulepreload|type="module"|\/assets\//);
assert.ok(bytes < 40000, `Legacy HTML/CSS/JS is ${bytes} bytes`);
console.log(`Legacy checks passed: ES5 scripts, detection, route preservation, build injection, CSP hashes. Legacy HTML/CSS/JS: ${bytes} bytes.`);
