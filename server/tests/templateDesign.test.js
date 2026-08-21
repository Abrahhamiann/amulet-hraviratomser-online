import assert from 'node:assert/strict';
import test from 'node:test';
import { PUBLIC_DESIGN_KEYS, templateCategoryForDesign } from '../utils/templateDesign.js';

test('every public design has one canonical event category', () => {
  assert.equal(PUBLIC_DESIGN_KEYS.length, 6);
  assert.equal(templateCategoryForDesign('sacred-beginnings'), 'baptism');
  assert.equal(templateCategoryForDesign('birthday-sparkle'), 'birth');
  assert.equal(templateCategoryForDesign('ivory-vows'), 'wedding');
  assert.equal(templateCategoryForDesign('divine-blessing'), 'baptism');
  assert.equal(templateCategoryForDesign('elevate-invite'), 'corporate');
  assert.equal(templateCategoryForDesign('everlasting-vows'), 'wedding');
});

test('unknown designs do not force an unrelated event category', () => {
  assert.equal(templateCategoryForDesign('custom-design'), null);
});
