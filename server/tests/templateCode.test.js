import assert from 'node:assert/strict';
import test from 'node:test';
import Setting from '../models/Setting.js';
import Template from '../models/Template.js';
import { ensureTemplateCodes, reindexTemplateCodes, templateCodeForCategory } from '../utils/templateCode.js';

test('template codes use a stable prefix for each event category', () => {
  assert.equal(templateCodeForCategory('wedding', 1), 'A1');
  assert.equal(templateCodeForCategory('wedding', 101), 'A101');
  assert.equal(templateCodeForCategory('baptism', 1), 'B1');
  assert.equal(templateCodeForCategory('birth', 12), 'C12');
  assert.equal(templateCodeForCategory('engagement', 9), 'D9');
  assert.equal(templateCodeForCategory('corporate', 3), 'E3');
  assert.equal(templateCodeForCategory('new_year', 4), 'F4');
  assert.equal(templateCodeForCategory('meeting', 5), 'G5');
  assert.equal(templateCodeForCategory('military', 6), 'H6');
});

test('template codes reject unsupported event categories', () => {
  assert.throws(() => templateCodeForCategory('other', 1), /Unsupported template category/);
});

test('template counters reset to zero for every empty category', async () => {
  const originals = {
    find: Template.find,
    updateMany: Template.updateMany,
    findOneAndUpdate: Setting.findOneAndUpdate
  };
  const counters = new Map();

  Template.find = () => ({
    select: () => ({ sort: async () => [] })
  });
  Template.updateMany = async () => ({ acknowledged: true });
  Setting.findOneAndUpdate = async (filter, update) => {
    counters.set(filter.key, update.$set.value.sequence);
    return { value: update.$set.value };
  };

  try {
    await ensureTemplateCodes();
    assert.equal(counters.size, 8);
    assert.deepEqual([...counters.values()], Array(8).fill(0));
  } finally {
    Template.find = originals.find;
    Template.updateMany = originals.updateMany;
    Setting.findOneAndUpdate = originals.findOneAndUpdate;
  }
});

test('template codes are compacted and the next sequence is reset after deletion', async () => {
  const originals = {
    find: Template.find,
    updateMany: Template.updateMany,
    bulkWrite: Template.bulkWrite,
    findOneAndUpdate: Setting.findOneAndUpdate
  };
  const updatedCodes = [];
  let counterSequence = null;

  Template.find = () => ({
    select: () => ({
      sort: async () => [{ _id: 'first' }, { _id: 'third' }]
    })
  });
  Template.updateMany = async () => ({ acknowledged: true });
  Template.bulkWrite = async (operations) => {
    operations.forEach(({ updateOne }) => {
      updatedCodes.push([updateOne.filter._id, updateOne.update.$set.code]);
    });
    return { acknowledged: true };
  };
  Setting.findOneAndUpdate = async (_filter, update) => {
    counterSequence = update.$set.value.sequence;
    return { value: update.$set.value };
  };

  try {
    await reindexTemplateCodes('engagement');
    assert.deepEqual(updatedCodes, [['first', 'D1'], ['third', 'D2']]);
    assert.equal(counterSequence, 2);
  } finally {
    Template.find = originals.find;
    Template.updateMany = originals.updateMany;
    Template.bulkWrite = originals.bulkWrite;
    Setting.findOneAndUpdate = originals.findOneAndUpdate;
  }
});
