import assert from 'node:assert/strict';
import test from 'node:test';
import Setting from '../models/Setting.js';
import Template from '../models/Template.js';
import { reindexTemplateCodes, templateCodeForCategory } from '../utils/templateCode.js';

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

test('template codes are compacted and the next sequence is reset after deletion', async () => {
  const originals = {
    find: Template.find,
    updateMany: Template.updateMany,
    updateOne: Template.updateOne,
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
  Template.updateOne = async (filter, update) => {
    updatedCodes.push([filter._id, update.$set.code]);
    return { acknowledged: true };
  };
  Setting.findOneAndUpdate = async (_filter, update) => {
    counterSequence = update.$set.value.sequence;
    return { value: update.$set.value };
  };

  try {
    await reindexTemplateCodes('engagement');
    assert.deepEqual(updatedCodes, [['first', 'E1'], ['third', 'E2']]);
    assert.equal(counterSequence, 2);
  } finally {
    Template.find = originals.find;
    Template.updateMany = originals.updateMany;
    Template.updateOne = originals.updateOne;
    Setting.findOneAndUpdate = originals.findOneAndUpdate;
  }
});
