import assert from 'node:assert/strict';
import test from 'node:test';
import Setting from '../models/Setting.js';
import Template from '../models/Template.js';
import { ensureCuratedTemplates } from '../utils/ensureCuratedTemplates.js';
import { templateDeletionKey } from '../utils/templateDeletion.js';

test('template deletion metadata is persisted by the schema', () => {
  assert.equal(Template.schema.path('deletedAt')?.instance, 'Date');
  assert.equal(Template.schema.path('deletedBy')?.instance, 'ObjectId');
});

test('curated startup provisioning does not reactivate a deleted template', async () => {
  const originalUpdateOne = Template.updateOne;
  const originalSettingExists = Setting.exists;
  const deletedAt = new Date('2026-08-22T10:00:00.000Z');
  const records = new Map([['sacred-beginnings', {
    slug: 'sacred-beginnings',
    deletedAt,
    deletedBy: '507f1f77bcf86cd799439011',
    isActive: false,
    galleryConfigured: false
  }]]);

  Template.updateOne = async (filter, update, options = {}) => {
    let record = records.get(filter.slug);
    const inserted = !record && options.upsert;
    if (inserted) {
      record = { slug: filter.slug };
      records.set(filter.slug, record);
    }
    if (!record) return { matchedCount: 0, upsertedCount: 0 };
    if (filter.galleryConfigured?.$ne === true && record.galleryConfigured === true) {
      return { matchedCount: 0, upsertedCount: 0 };
    }
    if (inserted) Object.assign(record, update.$setOnInsert || {});
    Object.assign(record, update.$set || {});
    return { matchedCount: inserted ? 0 : 1, upsertedCount: inserted ? 1 : 0 };
  };
  Setting.exists = async () => null;

  try {
    await ensureCuratedTemplates();
    const template = records.get('sacred-beginnings');
    assert.equal(template.deletedAt, deletedAt);
    assert.equal(template.deletedBy, '507f1f77bcf86cd799439011');
    assert.equal(template.isActive, false);
  } finally {
    Template.updateOne = originalUpdateOne;
    Setting.exists = originalSettingExists;
  }
});

test('curated startup provisioning never recreates a template with a permanent deletion marker', async () => {
  const originalUpdateOne = Template.updateOne;
  const originalSettingExists = Setting.exists;
  const deletedSlug = 'sacred-beginnings';
  const touchedSlugs = [];

  Setting.exists = async ({ key }) => (
    key === templateDeletionKey(deletedSlug) ? { _id: 'deletion-marker' } : null
  );
  Template.updateOne = async (filter) => {
    touchedSlugs.push(filter.slug);
    return { acknowledged: true };
  };

  try {
    await ensureCuratedTemplates();
    assert.equal(touchedSlugs.includes(deletedSlug), false);
    assert.equal(touchedSlugs.length > 0, true);
  } finally {
    Template.updateOne = originalUpdateOne;
    Setting.exists = originalSettingExists;
  }
});
