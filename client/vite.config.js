import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const clientRoot = path.dirname(fileURLToPath(import.meta.url));
const vendorRoot = path.join(clientRoot, 'src', 'vendorTemplates');

const templateRoots = [
  ...['sacred', 'birthday', 'ivory'].map((name) => ({ name, sourceDir: 'src' })),
  ...['divine', 'elevate', 'everafter', 'everlasting'].map((name) => ({ name, sourceDir: '' }))
].map(({ name, sourceDir }) => ({
  marker: path.join('vendorTemplates', name, sourceDir).replaceAll('\\', '/'),
  root: path.join(vendorRoot, name, sourceDir)
}));

const scopedTemplateAlias = {
  name: 'amulet-scoped-template-alias',
  enforce: 'pre',
  async resolveId(source, importer) {
    if (!importer || !source.startsWith('@/')) return null;

    const normalizedImporter = importer.replaceAll('\\', '/');
    const template = templateRoots.find(({ marker }) => normalizedImporter.includes(marker));
    if (!template) return null;

    return this.resolve(path.join(template.root, source.slice(2)), importer, { skipSelf: true });
  }
};

export default defineConfig({
  plugins: [scopedTemplateAlias, react(), tailwindcss()],
  build: {
    // DotLottie ships a large WASM-capable runtime, but it is isolated in its
    // own on-demand chunk (about 70 kB gzip) and no longer inflates the app shell.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replaceAll('\\', '/');
          if (normalizedId.includes('/node_modules/react/') || normalizedId.includes('/node_modules/react-dom/') || normalizedId.includes('/node_modules/react-router-dom/')) {
            return 'react-vendor';
          }
          if (normalizedId.includes('/node_modules/motion/') || normalizedId.includes('/node_modules/framer-motion/')) {
            return 'motion-vendor';
          }
          if (normalizedId.includes('/node_modules/@lottiefiles/')) return 'lottie-vendor';
          if (normalizedId.includes('/src/vendorTemplates/')) {
            const relative = normalizedId.split('/src/vendorTemplates/')[1];
            const templateFamily = relative?.split('/')[0];
            if (templateFamily) return `template-${templateFamily}`;
          }
          return undefined;
        }
      }
    }
  }
});
