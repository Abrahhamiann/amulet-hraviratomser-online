import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanPromoPayload } from '../controllers/promoController.js';
import { creatorSnapshot } from '../utils/promo.js';
import { creatorPurchaseMessage, notifyCreatorOfPayment } from '../utils/creatorTelegram.js';
import Payment from '../models/Payment.js';
import PromoCode from '../models/PromoCode.js';
import Order from '../models/Order.js';
import { creatorLinkButtons } from '../utils/creatorPresentation.js';

const form = { kind: 'creator', code: 'creator10', value: 0, creatorName: 'Creator', creatorContact: '@creator', creatorCommissionPercent: 10 };

test('creator validation supports phone or username and rejects invalid commission/contact', () => {
  assert.equal(cleanPromoPayload(form).value, 0);
  assert.equal(cleanPromoPayload({ ...form, creatorContact: '+374 99 123456' }).creatorContact, '+374 99 123456');
  for (const value of [-1, 101, 'invalid', '', undefined]) {
    assert.throws(() => cleanPromoPayload({ ...form, creatorCommissionPercent: value }), { statusCode: 400 });
  }
  assert.throws(() => cleanPromoPayload({ ...form, creatorContact: 'bad' }), { statusCode: 400 });
});

test('commission uses paid amount and preserves historical checkout terms', () => {
  const promo = { ...form, _id: 'promo' };
  const snapshot = creatorSnapshot(promo, 20000);
  assert.equal(snapshot.creatorCommissionAmount, 2000);
  assert.equal(creatorSnapshot(promo, 2).creatorCommissionAmount, 0.2);
  promo.creatorCommissionPercent = 20;
  assert.equal(snapshot.creatorCommissionPercent, 10);
  assert.equal(creatorSnapshot(promo, 18000).creatorCommissionAmount, 3600);
  assert.deepEqual(creatorSnapshot({ kind: 'standard' }, 20000), {});
});

test('creator alert escapes text and shows the purchase time in Yerevan', () => {
  const message = creatorPurchaseMessage({ promoCode: '<CODE>', paidAt: '2026-09-08T20:30:00Z', amount: 20000,
    creatorCommissionPercent: 10, creatorCommissionAmount: 2000 }, { _id: 'order', mainNames: '<Names>' });
  assert.match(message, /00:30:00/);
  assert.match(message, /&lt;CODE&gt;/);
  assert.match(message, /2000/);
  assert.doesNotMatch(message, /<Names>/);
  assert.doesNotMatch(message, /Միջոցառման|Վայր/);
});

test('invitation buttons copy URLs without putting raw links in the message', () => {
  const url = 'https://example.com/invite/test';
  assert.equal(creatorLinkButtons(url)[0][0].url, url);
  assert.equal(creatorLinkButtons(url)[1][0].copy_text.text, url);
  const local = creatorLinkButtons('http://localhost:5173/invite/test');
  assert.equal(local.length, 1);
  assert.equal(local[0][0].copy_text.text, 'http://localhost:5173/invite/test');
  assert.deepEqual(creatorLinkButtons('javascript:alert(1)'), []);
  assert.deepEqual(creatorLinkButtons(''), []);
});

test('notification claims only paid unsent purchases and retries disconnected creators without marking sent', async (t) => {
  const writes = [];
  t.mock.method(Payment, 'findOneAndUpdate', async (query) => {
    assert.equal(query.status, 'PAID');
    assert.equal(query.creatorNotifiedAt, null);
    return { _id: 'payment', creatorPromoId: 'promo', orderId: 'order' };
  });
  t.mock.method(PromoCode, 'findById', async () => ({ creatorChatId: '' }));
  t.mock.method(Order, 'findById', () => ({ populate: async () => ({ _id: 'order' }) }));
  t.mock.method(Payment, 'updateOne', async (_query, update) => { writes.push(update.$set); });
  await notifyCreatorOfPayment('payment');
  assert.equal(writes.length, 1);
  assert.equal(writes[0].creatorNotificationLockAt, null);
  assert.ok(writes[0].creatorNotificationRetryAt instanceof Date);
  assert.equal(writes[0].creatorNotifiedAt, undefined);
});
