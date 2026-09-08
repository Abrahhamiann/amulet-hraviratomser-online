import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import Setting from '../models/Setting.js';
import { getPublicFaq, updateAdminFaq } from '../controllers/adminController.js';
import { subscribeFaqUpdates } from '../utils/faqUpdates.js';

test('FAQ save publishes immediately, reads are uncached, deleting all stays empty', async (t) => {
  let saved;
  t.mock.method(Setting, 'findOneAndUpdate', async (_filter, update) => { saved = update; return update; });
  t.mock.method(Setting, 'findOne', () => ({ select: () => ({ lean: async () => saved }) }));
  const stream = new EventEmitter();
  const events = [];
  stream.set = () => {};
  stream.flushHeaders = () => {};
  stream.write = (text) => events.push(text);
  subscribeFaqUpdates({}, stream);
  t.after(() => stream.emit('close'));
  const headers = {};
  let result;
  const res = { set: (name, value) => { headers[name] = value; }, json: (data) => { result = data; } };
  await updateAdminFaq({ body: { items: [] } }, res, (e) => { throw e; });
  assert.equal(events.length, 2);
  await getPublicFaq({ query: { language: 'hy' } }, res, (e) => { throw e; });
  assert.equal(headers['Cache-Control'], 'no-store');
  assert.deepEqual(result.items, []);
});
