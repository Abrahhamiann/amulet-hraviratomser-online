import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('production startup does not seed or delete administrator-managed business data', async () => {
  const source = await readFile(new URL('../server.js', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /ensureCuratedTemplates/);
  assert.doesNotMatch(source, /ensureDefaultReviews/);
  assert.doesNotMatch(source, /removeLegacyEngagementTemplates/);
  assert.match(source, /ensureTemplateCodes/);
});
