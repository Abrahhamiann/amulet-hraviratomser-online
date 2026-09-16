import fs from 'node:fs/promises';
import path from 'node:path';
import { loadEnv } from 'vite';
import sharp from 'sharp';
import { cspHashes } from '@vitejs/plugin-legacy';

// No Vite/React runtime is included in these public files.
export function legacySite() {
  let root;
  let configScript;
  return {
    name: 'amulet-legacy-site',
    config(config, { mode }) {
      const env = loadEnv(mode, process.cwd(), 'VITE_');
      configScript = 'window.AmuletLegacyConfig = ' + JSON.stringify({
        api: '/legacy-api/api',
        phone: env.VITE_CONTACT_PHONE_E164 || '+37441401415',
        phoneDisplay: env.VITE_CONTACT_PHONE_DISPLAY || '041 401415',
        email: env.VITE_CONTACT_EMAIL || 'amuletarmenia@gmail.com'
      }) + ';';
      const target = (env.VITE_API_URL || 'http://127.0.0.1:5000/api').replace(/\/api\/?$/, '');
      return { server: { proxy: { '/legacy-api': { target, changeOrigin: true, rewrite: p => p.replace(/^\/legacy-api/, '') } } } };
    },
    configResolved(config) { root = config.root; },
    configureServer(server) {
      server.middlewares.use('/legacy/config.js', (_req, res) => {
        res.setHeader('Content-Type', 'application/javascript');
        res.end(configScript);
      });
      server.middlewares.use('/legacy/poster.jpg', async (_req, res, next) => {
        try {
          res.setHeader('Content-Type', 'image/jpeg');
          res.end(await sharp(path.join(root, 'src/assets/morph/wedding-temple.jpg')).resize(800).jpeg({ quality: 72 }).toBuffer());
        } catch (error) { next(error); }
      });
    },
    async generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'legacy/config.js', source: configScript });
      this.emitFile({ type: 'asset', fileName: 'legacy/poster.jpg', source: await sharp(path.join(root, 'src/assets/morph/wedding-temple.jpg')).resize(800).jpeg({ quality: 72 }).toBuffer() });
      const policy = "base-uri 'self'; object-src 'none'; frame-ancestors 'self'; script-src 'self' https://accounts.google.com 'wasm-unsafe-eval' " + cspHashes.map(h => "'sha256-" + h + "'").join(' ');
      // Outside dist: this file is installed by the operator, not served as a page.
      await fs.mkdir(path.join(root, '../deploy/generated'), { recursive: true });
      await fs.writeFile(path.join(root, '../deploy/generated/amulet-security.conf'),
        'add_header X-Content-Type-Options "nosniff" always;\nadd_header X-Frame-Options "SAMEORIGIN" always;\nadd_header Referrer-Policy "no-referrer" always;\nadd_header Content-Security-Policy "' + policy + '" always;\n');
    }
  };
}
