# Amulet iOS 9 compatibility

## Status and root causes

Implemented an isolated ES5 frontend. Do not claim iOS 9 certification until the
deployed release passes BrowserStack iPad Air 2 / iOS 9.3 / Safari with a trusted
certificate. A current WebKit browser with an old user agent is NOT iOS 9.

Inspected the workspace manifests and lockfile, Vite configuration, HTML entry,
React startup/providers, routes, homepage, invitation/template views, CSS,
animation imports, media storage, public API contracts and checked-in Nginx files.

Confirmed incompatible paths:

- `TemplatesPage` and `InvitationPage` create `AbortController` without a guard.
- `ScrollingPreviewImage` and the invitation editor create `ResizeObserver`.
- Multiple invitation families use `IntersectionObserver` unconditionally. The
  homepage's observers have guards, but this does not protect the other routes.
- `TemplateLivePreviewPage` and `InvitationEditor` statically import DotLottie;
  template families import Motion. DotLottie uses WASM and modern browser APIs.
  Transpiling the imports does not implement those APIs.
- `LanguageContext` reads localStorage during initialization; old Safari private
  storage restrictions are another potential startup failure. The fallback never
  accesses storage.
- Global CSS relies on custom properties, grid, gap, clamp(), backdrop-filter and
  modern units. Tailwind 4's supported Safari baseline is 16.4, not Safari 9.
  There is no classic Tailwind configuration to downgrade independently.
- Logo, homepage device artwork, catalog thumbnails and uploaded images use WebP,
  which iOS 9 cannot decode. Uploaded media needs conversion, not renamed files.
- Optional chaining, nullish coalescing, async/generators and dynamic imports are
  compiler concerns. Promise, Map, Set, WeakMap, Symbol, Object.assign/entries/values,
  Array.from/includes and string includes/startsWith/endsWith can be polyfilled.
  They do not fix DOM APIs, WASM, Web Animations or CSS. URL/URLSearchParams are used
  by modern configuration/navigation. The ES5 frontend needs none of these.
- MutationObserver exists on iOS 9; it is not itself the main compatibility gap.
  requestIdleCallback is unnecessary in the fallback. XHR replaces Axios/fetch.
- The repository Nginx CSP blocked Vite's inline SystemJS bootstrap and detection
  scripts. **The live homepage did not send that CSP in the inspected response**;
  therefore this is a confirmed configuration defect, not a proven live failure.

No BrowserStack console trace was available to identify the first exception on
the user's exact device. The incompatible routes above and TLS trust failure are
independently established; no claim is made that a single exception explains all
white screens. See [Tailwind's browser requirements](https://tailwindcss.com/docs/compatibility).

## Files and behavior

| Files | Change |
| --- | --- |
| `client/public/browser-support.js`, `client/src/utils/browserSupport.js` | Central ES5 detector; exports `isLegacyIOS` and `needsLegacy` to React. |
| `client/index.html`, `client/src/bootstrap.js`, `client/src/main.jsx` | Blocking same-origin detection before the module entry; conditional app import, failure link; CSS remains statically loaded. |
| `client/vite.config.js` | Removes redundant `build.target`; keeps iOS/Safari 9 targets, automatic core-js polyfills and bundled SystemJS; adds globalThis. |
| `client/vite.legacy-site.js` | Builds small JPEG poster, public contact configuration and exact CSP hashes; supplies local proxy. |
| `client/public/legacy/{index.html,style.css,app.js,diagnostics.js}` | Plain HTML/CSS/ES5 homepage, catalog pagination, template details, invitation data, maps/contact, countdown, images and RSVP. |
| `server/utils/legacyImage.js` | Bounded JPEG conversion of stored/embedded images, two conversions at a time, no arbitrary URL fetches, path/symlink checks. |
| `server/controllers/{invitationController,templateController}.js`, corresponding route files | Read-only JPEG endpoints; invitation images reuse the published invitation lookup and design availability checks. Existing JSON and RSVP contracts retained. |
| `deploy/nginx/amulet.am.conf`, `amulet-legacy-locations.conf` | Isolated static fallback and same-origin public API proxy; generated CSP include. |
| `client/package.json`, `package-lock.json` | Explicit build-time sharp and ES5-parser dependencies. |
| `package.json`, `scripts/check-legacy.mjs`, `scripts/test-legacy-browser.mjs`, `server/tests/legacyImage.test.js` | Repeatable build/ES5, browser and image conversion verification. |
| `.gitignore` | Ignores generated deployment header include. |

Detection uses an Apple mobile device marker plus the complete OS major number,
so OS 19 is not mistaken for OS 9. Missing native module support also selects the
fallback. It does not classify crawlers by broad numeric UA matching. Bots that
do not execute JavaScript receive the normal HTML. Modern JS-capable crawlers
remain on React. No Nginx UA redirect or cache variation is needed.

`/invite/<slug>?x=1#rsvp` becomes
`/legacy/?x=1&route=%2Finvite%2F<slug>#rsvp`. The last `route` parameter wins;
paths, existing query parameters and fragments survive. Already-legacy paths do
not redirect. Nested `/legacy/invite/<slug>` refresh works with the Nginx include.

Old devices execute no React/Motion/Lottie/template imports. The modern bootstrap
checks before importing the app, even if navigation has not completed. Legacy
pages have no modulepreload, external fonts, audio/video, WASM, storage, CSS
variables, grid, flex gap, sticky positioning, object-fit or viewport units.
They use system fonts, block layout, px/% sizing and bounded JPEGs. Additional
photos are requested on demand. Images that cannot be converted get an Amulet
poster. External remote images are deliberately not fetched by the server.

Editing, authentication, private previews and payment remain modern-only; their
legacy URLs show a contact/help page instead of a blank screen. Template live
URLs show a static template summary. Public invitation text, locations and RSVP
remain usable. The countdown follows the existing local-calendar behavior and
is informational; the printed date/time is authoritative. Template-specific
decorative text overrides and animations are not reproduced.

The only new backend routes are GET
`/api/invitations/:slug/legacy-image/:index` and
`/api/templates/:id/legacy-image`. Existing publication, category availability,
RSVP validation, persistence and rate limits remain authoritative. No payment or
authentication logic changed. Image responses are no-store so unpublishing is
checked again on each request. Unsupported/oversized images fail to the poster.
The public proxy strips Cookie/Authorization and permits GET/HEAD/POST only;
legacy clients never borrow authenticated sessions. This also avoids Safari 9
same-origin POSTs without Origin being rejected because of unrelated cookies.

Diagnostics are off by default. Add `legacyDebug=1` on a legacy URL to see ES5
`window.onerror` details (message, source, line and column) and supported promise
rejection events. There is no production logging endpoint or persistent switch.

## Live TLS observation: 2026-09-16

Public OpenSSL inspection of `amulet.am:443` returned:

```text
Leaf: CN=amulet.am, RSA 2048, SHA256 signature
SAN: amulet.am, www.amulet.am, server.amulet.am, admin.amulet.am
Valid: 2026-08-14 11:18:50 UTC to 2026-11-12 11:18:49 UTC
Chain sent: leaf -> Let's Encrypt YR1 -> Root YR (cross-signed by ISRG Root X1)
Modern OpenSSL verification: OK
TLS 1.3: TLS_AES_256_GCM_SHA384
TLS 1.2 forced: ECDHE-RSA-AES128-GCM-SHA256 accepted
TLS 1.2 with RSA PKCS#1 SHA256 signatures and P-256 only: accepted
OCSP stapling: no response sent
```

Stock iOS 9 **does not trust ISRG Root X1**. Sending the existing full chain is
necessary but cannot add a missing trusted root. Changing between Let's Encrypt
chains will not fix this. React, redirects and Nginx cannot run before TLS trust
is established. Do not instruct guests to bypass the certificate warning.
See [Let's Encrypt compatibility](https://letsencrypt.org/docs/certificate-compatibility/)
and [Apple's exact iOS 9 trust list](https://support.apple.com/en-us/103657).

Recommended procurement target: an RSA DigiCert certificate with this exact
chain (confirm the delivered current intermediate/cross-sign with DigiCert):

```text
amulet.am leaf
  -> DigiCert G5 TLS RSA4096 SHA384 2021 CA1
  -> DigiCert TLS RSA4096 Root G5, CROSS-SIGNED by DigiCert Global Root G2
  -> DigiCert Global Root G2 (already trusted on stock iOS 9)
```

Apple lists G2 explicitly: serial `033AF1E6A711A9A0BB2864B11D09FAE5`, RSA
2048/SHA256, expiry 2038-01-15. DigiCert documents the G5-to-G2 compatibility
chain in its [current selection guide](https://knowledge.digicert.com/general-information/digicert-g5-root-and-intermediate-ca-certificate-update).
Do not install only the self-signed G5 root: it is not the iOS 9 trust anchor.
Use the current, non-revoked cross-sign supplied by DigiCert, not an old archived
bundle. Purchasing a brand name alone does not guarantee the correct chain.
The replacement leaf still requires domain validation/issuance and an actual
BrowserStack trust test; it has not been purchased or installed by this task.

Have the issued leaf cover at least `amulet.am` and `www.amulet.am`. The fallback
uses the same-origin proxy and images, avoiding a second API TLS connection.
For direct API use on old devices, also replace `server.amulet.am`'s chain.

Create `/etc/nginx/ssl/amulet-ios9/fullchain.pem` containing, in order, the issued
leaf PEM, its issuing intermediate PEM, and the G5 certificate cross-signed by
G2. Do not append the self-signed G2 root. Put the matching private key at
`/etc/nginx/ssl/amulet-ios9/privkey.pem`, owned by root with mode 600.
Inside the EXISTING HTTPS server block use:

```nginx
ssl_certificate /etc/nginx/ssl/amulet-ios9/fullchain.pem;
ssl_certificate_key /etc/nginx/ssl/amulet-ios9/privkey.pem;
ssl_protocols TLSv1.2 TLSv1.3;
```

Keep a secure TLS 1.2 ECDHE-RSA AES-GCM cipher in the existing cipher policy;
the live server already negotiates one. No SSLv3, TLS 1.0, TLS 1.1, RC4 or 3DES
is needed. Configure OCSP stapling only if the issued chain supplies an OCSP
responder; its absence here does not explain the missing root. Live Nginx files
and renewal jobs cannot be inferred from the HTTP-only repository templates.

## Local commands

Run from the repository root in PowerShell (Node >=22.12):

```powershell
npm ci --include=dev
npm run build
npm run check:legacy
npm run typecheck --workspace client
npm test --workspace server
git diff --check
git add .gitignore package.json package-lock.json client/package.json client/index.html client/vite.config.js client/vite.legacy-site.js client/src/main.jsx client/src/bootstrap.js client/src/utils/browserSupport.js client/public/browser-support.js client/public/legacy server/utils/legacyImage.js server/controllers/invitationController.js server/controllers/templateController.js server/routes/invitationRoutes.js server/routes/templateRoutes.js server/tests/legacyImage.test.js deploy/nginx/amulet.am.conf deploy/nginx/amulet-legacy-locations.conf scripts/check-legacy.mjs scripts/test-legacy-browser.mjs docs/IOS9-COMPATIBILITY.md
git commit -m "Add isolated iOS 9 invitation frontend"
git push origin main
```

`tools/` was already untracked and is intentionally not staged by these commands.
The browser script accepts `PLAYWRIGHT_MODULE` pointing to a locally installed
Playwright `index.mjs` and `PLAYWRIGHT_BROWSERS_PATH` for matching engine binaries:

```powershell
$env:PLAYWRIGHT_MODULE = 'C:/Users/Serg/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'
$env:PLAYWRIGHT_BROWSERS_PATH = 'C:/Users/Serg/Desktop/Amulet/.browser-test'
node scripts/test-legacy-browser.mjs
```

It uses local fixtures, never sends RSVP to production, and saves screenshots in
`tmp/legacy-tests/`. This is not a BrowserStack test.

## VPS rollout

No VPS credentials/session were provided. The following commands must be run on
the VPS; neither the live Nginx configuration nor certificate was changed here.
Keep the live Certbot/TLS server block. **Do not replace it wholesale with the
repository HTTP bootstrap template.** Run these commands as your deployment user:

```bash
set -euo pipefail
cd /var/www/amulet/amulet-hraviratomser-online
git pull --ff-only origin main
npm ci --include=dev
npm run check:production
npm run build
npm run check:legacy
npm test --workspace server
sudo install -d -m 755 /etc/nginx/snippets
sudo install -m 644 deploy/generated/amulet-security.conf /etc/nginx/snippets/amulet-security.conf
sudo install -m 644 deploy/nginx/amulet-legacy-locations.conf /etc/nginx/snippets/amulet-legacy-locations.conf
sudo cp -a /etc/nginx/sites-available/amulet.am /etc/nginx/sites-available/amulet.am.before-ios9
sudoedit /etc/nginx/sites-available/amulet.am
```

In the serving HTTPS block for `amulet.am` add this line once, **before** existing
regex asset locations:

```nginx
include /etc/nginx/snippets/amulet-legacy-locations.conf;
```

Replace each existing group of four security headers (X-Content-Type-Options,
X-Frame-Options, Referrer-Policy, Content-Security-Policy), including the groups
in `/assets/`, the image regex and `= /index.html`, with:

```nginx
include /etc/nginx/snippets/amulet-security.conf;
```

Retain Cache-Control headers and all existing routes/TLS settings. If the live
file has no security headers, add the security include at server level AND in
each location that sets its own add_header, including `= /index.html`. Nginx
does not inherit server add_header directives when a location sets its own.
Do not keep a second old CSP: multiple CSPs intersect and would still block
the Vite scripts. The generated include derives hashes from the installed
plugin version; reinstall it after future plugin upgrades/builds.

Then, after installing the purchased replacement certificate and updating the
two ssl_certificate directives as above:

```bash
sudo nginx -t
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save
sudo systemctl reload nginx
curl -fsS https://server.amulet.am/api/health
curl -fsS https://amulet.am/legacy/ > /dev/null
curl -fsS 'https://amulet.am/legacy-api/api/templates?limit=1' > /dev/null
openssl s_client -connect amulet.am:443 -servername amulet.am -showcerts -status </dev/null
openssl s_client -connect amulet.am:443 -servername amulet.am -tls1_2 -cipher ECDHE-RSA-AES128-GCM-SHA256 </dev/null
```

Run `nginx -t` before EVERY reload. On a failed test do not reload. To roll back
the Nginx change, restore the saved file, test it, then reload; use the previous
known-good release for application rollback. Certificate renewal must continue
to install the complete G2-compatible chain and pass the device trust test.

## Release test checklist

- BrowserStack iPad Air 2, real iOS 9.3 Safari: fresh session, no custom roots and
  no certificate-warning bypass. Record session URL and actual console output.
- Open `https://amulet.am`, templates, template detail/live URL, published
  invitation, maps, phone/contact, JPEGs and additional-photo button.
- Check URL/query/hash preservation, back/forward, nested refresh, missing or
  unpublished invitation, offline API, retry and malformed query parameters.
- Submit a dedicated TEST invitation RSVP with all fields; verify the response
  in the owner's dashboard. Test declined/unsure, validation, failed POST,
  retained values and double-click prevention. Avoid real guest notifications.
- Verify zero React/Motion/Lottie/WASM/audio/video requests on the legacy page.
- `legacyDebug=1`: force a test error and inspect message/source/line/column;
  remove the query and confirm no diagnostics panel appears normally.
- Latest real Chrome, Firefox, macOS Safari and mobile Safari: normal homepage,
  catalog, animations, editor, authentication, invitations and payment flow
  remain on the modern frontend. Use sandbox/test payment settings only.
- Verify no horizontal overflow at 375px and iPad portrait/landscape widths.
- Verify TLS trust again after certificate renewal.

The generated production HTML contains modern module scripts, legacy chunks,
`vite-legacy-polyfill`, `vite-legacy-entry`, SystemJS and matching CSP hashes.
Build success and current-engine tests are necessary but insufficient to assert
complete old-device compatibility.

## Verification performed locally

- Clean `npm ci --include=dev` succeeded with the updated lockfile.
- Production build, client typecheck and ES5/build assertions passed.
- Backend suite: 66 passing tests, one pre-existing database integration skip.
- Chromium, Firefox and WebKit: fixture-backed invitation/RSVP success and failure,
  safe links, retry, route/query/fragment preservation, nested refresh, catalog,
  mobile layout and modern React homepage passed. Unsupported browser globals
  were removed for the legacy checks. No heavy legacy-page runtime requests.
- Screenshots reviewed for phone homepage and iPad invitation layout.
- BrowserStack, actual macOS/iOS Safari, deployed RSVP persistence and VPS
  `nginx -t`/reload remain unperformed because no remote sessions were supplied.
- 21st catalog search required a login; its remote review was blocked by automatic
  approval review because it could upload project source. Local code, layout and
  browser checks were used instead. No project source was uploaded to 21st.
