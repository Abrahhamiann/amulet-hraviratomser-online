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
  plugins: [scopedTemplateAlias, react(), tailwindcss()]
});
