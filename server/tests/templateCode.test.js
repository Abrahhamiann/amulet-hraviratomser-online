import assert from 'node:assert/strict';
import test from 'node:test';
import { templateCodeForCategory } from '../utils/templateCode.js';

test('template codes use a stable prefix for each event category', () => {
  assert.equal(templateCodeForCategory('wedding', 1), 'A1');
  assert.equal(templateCodeForCategory('wedding', 101), 'A101');
  assert.equal(templateCodeForCategory('baptism', 1), 'B1');
  assert.equal(templateCodeForCategory('birth', 12), 'C12');
  assert.equal(templateCodeForCategory('corporate', 3), 'D3');
  assert.equal(templateCodeForCategory('engagement', 9), 'E9');
});

test('template codes reject unsupported event categories', () => {
  assert.throws(() => templateCodeForCategory('other', 1), /Unsupported template category/);
});
