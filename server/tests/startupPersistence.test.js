import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('production startup does not seed or run legacy cleanup on administrator-managed data', async () => {
  const source = await readFile(new URL('../server.js', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /ensureCuratedTemplates/);
  assert.doesNotMatch(source, /ensureDefaultReviews/);
  assert.doesNotMatch(source, /removeLegacyEngagementTemplates/);
  assert.match(source, /ensureTemplateCodes/);
});

test('dynamic template JSON is never cached by browsers or CDNs', async () => {
  const source = await readFile(new URL('../controllers/templateController.js', import.meta.url), 'utf8');

  assert.match(source, /DYNAMIC_TEMPLATE_CACHE_CONTROL = 'no-store'/);
  assert.match(source, /X-Amulet-Cache', 'BYPASS'/);
  assert.doesNotMatch(source, /templateListCache|templateListInflight/);
  assert.doesNotMatch(source, /s-maxage|stale-while-revalidate/);
});
