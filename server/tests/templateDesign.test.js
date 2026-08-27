import assert from 'node:assert/strict';
import test from 'node:test';
import { PUBLIC_DESIGN_KEYS, templateCategoryForDesign, templateEditorTypeForCategory } from '../utils/templateDesign.js';

test('every public design has one canonical event category', () => {
  assert.equal(PUBLIC_DESIGN_KEYS.length, 19);
  assert.equal(templateCategoryForDesign('sacred-beginnings'), 'baptism');
  assert.equal(templateCategoryForDesign('birthday-sparkle'), 'birth');
  assert.equal(templateCategoryForDesign('birthday-space'), 'birth');
  assert.equal(templateCategoryForDesign('birthday-watercolor'), 'birth');
  assert.equal(templateCategoryForDesign('birthday-crimson'), 'birth');
  assert.equal(templateCategoryForDesign('ivory-vows'), 'wedding');
  assert.equal(templateCategoryForDesign('divine-blessing'), 'baptism');
  assert.equal(templateCategoryForDesign('elevate-invite'), 'corporate');
  assert.equal(templateCategoryForDesign('everlasting-vows'), 'wedding');
  assert.equal(templateCategoryForDesign('forever-vows'), 'engagement');
  assert.equal(templateCategoryForDesign('silk-vows'), 'wedding');
  assert.equal(templateCategoryForDesign('burgundy-roadmap'), 'wedding');
  assert.equal(templateCategoryForDesign('monochrome-envelope'), 'wedding');
  assert.equal(templateCategoryForDesign('love-map-wedding'), 'wedding');
  assert.equal(templateCategoryForDesign('angelic-baptism'), 'baptism');
  assert.equal(templateCategoryForDesign('polaroid-engagement'), 'engagement');
  assert.equal(templateCategoryForDesign('golden-heart-engagement'), 'engagement');
  assert.equal(templateCategoryForDesign('cinematic-engagement'), 'engagement');
  assert.equal(templateCategoryForDesign('last-bell'), 'corporate');
});

test('unknown designs do not force an unrelated event category', () => {
  assert.equal(templateCategoryForDesign('custom-design'), null);
});

test('other invitation categories use the corporate editor fields', () => {
  assert.equal(templateEditorTypeForCategory('engagement'), 'engagement');
  assert.equal(templateEditorTypeForCategory('corporate'), 'corporate');
  assert.equal(templateEditorTypeForCategory('new_year'), 'corporate');
  assert.equal(templateEditorTypeForCategory('meeting'), 'corporate');
  assert.equal(templateEditorTypeForCategory('military'), 'corporate');
});
