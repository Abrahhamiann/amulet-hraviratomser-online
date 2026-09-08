import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import PromoCode from '../models/PromoCode.js';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import Template from '../models/Template.js';
import User from '../models/User.js';
import Setting from '../models/Setting.js';
import { createCreatorTelegramLink, updateAdminPromoCode, getAdminPromoCodes } from '../controllers/promoController.js';
import { connectTelegramBot, getTelegramBotAccount } from '../controllers/telegramController.js';
import { createArcaPayment, verifyArcaPayment, refundArcaPayment } from '../services/paymentService.js';
import { notifyCreatorOfPayment } from '../utils/creatorTelegram.js';
import { getCreatorDashboard, getCreatorPurchase, getAdminCreators, getAdminCreator, getAdminCreatorPurchase } from '../controllers/creatorController.js';

const invoke = async (handler, req) => {
  let result;
  const res = { status() { return this; }, json(value) { result = value; return this; } };
  await handler(req, res, (error) => { throw error; });
  return result;
};

test('creator flow: real isolated database, simulated bank and Telegram', { skip: !process.env.CREATOR_TEST_MONGO_URI }, async (t) => {
  const dbName = `amulet_creator_test_${crypto.randomBytes(8).toString('hex')}`;
  await mongoose.connect(process.env.CREATOR_TEST_MONGO_URI, { dbName, serverSelectionTimeoutMS: 5000 });
  t.after(async () => {
    assert.equal(mongoose.connection.name, dbName);
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
  const env = {
    PAYMENT_PROVIDER: 'arca', ARCA_API_BASE_URL: 'https://bank.example/rest', ARCA_USERNAME: 'test', ARCA_PASSWORD: 'test',
    ARCA_CURRENCY: '051', ARCA_AMOUNT_MULTIPLIER: '100', FRONTEND_URL: 'https://example.com', CLIENT_URL: 'https://example.com',
    TELEGRAM_BOT_TOKEN: 'fake-test-token', TELEGRAM_SHARED_BOT_TOKEN: '', TELEGRAM_BOT_USERNAME: 'test_bot',
    TELEGRAM_SHARED_BOT_USERNAME: '', TELEGRAM_ADMIN_CHAT_IDS: '', TELEGRAM_ADMIN_1_ID: '', TELEGRAM_ADMIN_2_ID: ''
  };
  const oldEnv = Object.fromEntries(Object.keys(env).map((key) => [key, process.env[key]]));
  Object.assign(process.env, env);
  t.after(() => { for (const [key, value] of Object.entries(oldEnv)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } });
  let bankOrder;
  let telegramFails = false;
  const sent = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    if (String(url).startsWith('https://api.telegram.org/')) {
      if (telegramFails) return new Response(JSON.stringify({ ok: false, description: 'test failure' }), { status: 503 });
      sent.push(JSON.parse(options.body));
      return new Response(JSON.stringify({ ok: true, result: { message_id: sent.length } }));
    }
    assert.ok(String(url).startsWith('https://bank.example/'), 'no external requests allowed');
    if (String(url).endsWith('/register.do')) {
      bankOrder = Object.fromEntries(options.body.entries());
      return new Response(JSON.stringify({ orderId: 'bank-test-order', formUrl: 'https://bank.example/pay' }));
    }
    if (String(url).endsWith('/refund.do')) return new Response(JSON.stringify({ errorCode: '0' }));
    return new Response(JSON.stringify({ orderStatus: 2, orderNumber: bankOrder.orderNumber, amount: bankOrder.amount, currency: '051' }));
  });
  const promo = await PromoCode.create({ kind: 'creator', code: 'CREATOR', creatorName: 'Test Creator', creatorContact: '@test_creator',
    creatorCommissionPercent: 10, value: 20, discountType: 'percent', maxUses: 10 });
  const req = { params: { id: String(promo._id) } };
  await assert.rejects(invoke(createCreatorTelegramLink, req), /նույն API/);
  await Setting.create({ key: 'telegram_bot_heartbeat', value: { at: new Date(), username: 'test_bot', creatorPromoLinks: true } });
  const firstLink = await invoke(createCreatorTelegramLink, req);
  const link = await invoke(createCreatorTelegramLink, req);
  const token = new URL(link.url).searchParams.get('start');
  const connect = (value = token, chatId = '111') => invoke(connectTelegramBot, { body: { token: value, chatId, telegramUserId: chatId } });
  await assert.rejects(connect(new URL(firstLink.url).searchParams.get('start')), /Creator/);
  assert.equal((await connect()).creator, true);
  assert.equal((await connect()).creator, true, 'duplicate Start and timeout retries are idempotent');
  await assert.rejects(connect(token, '222'), /Creator/);
  await assert.rejects(invoke(connectTelegramBot, { body: { token, chatId: '-1', telegramUserId: '111' } }), /private chat/);
  assert.equal((await invoke(getTelegramBotAccount, { query: { chatId: '111' } })).creator, true);
  assert.equal((await invoke(getCreatorDashboard, { query: { chatId: '111' } })).total, 0);
  await assert.rejects(invoke(getCreatorDashboard, { query: { chatId: '222' } }), { statusCode: 403 });
  const user = await User.create({ name: 'Buyer', email: 'buyer@example.com' });
  const template = await Template.create({ title: 'Test invitation', slug: 'test-invitation', category: 'wedding', price: 25000, description: 'Test', designKey: 'ivory-vows' });
  const checkout = await createArcaPayment({ user, body: { templateId: String(template._id), promoCode: 'CREATOR', draft: {} } });
  const pending = await Payment.findById(checkout.paymentId);
  assert.equal(pending.amount, 20000);
  assert.equal(pending.creatorCommissionAmount, 2000);
  assert.equal(sent.length, 0, 'pending purchases never send alerts');
  await invoke(updateAdminPromoCode, { ...req, body: { code: 'RENAMED', creatorCommissionPercent: 25 } });
  telegramFails = true;
  const result = await verifyArcaPayment({ paymentId: checkout.paymentId, user });
  assert.equal(result.status, 'PAID');
  assert.equal(result.order.creatorCommissionPercent, 10);
  assert.equal(result.order.creatorCommissionAmount, 2000);
  assert.ok(result.order.invitationId.slug);
  assert.equal((await PromoCode.findById(promo._id)).usageCount, 1, 'rename keeps redemption attribution');
  assert.equal((await Payment.findById(checkout.paymentId)).creatorNotifiedAt, null);
  telegramFails = false;
  await Promise.all([notifyCreatorOfPayment(checkout.paymentId), notifyCreatorOfPayment(checkout.paymentId)]);
  assert.equal(sent.length, 1, 'concurrent workers send once');
  assert.equal(sent[0].chat_id, '111');
  assert.match(sent[0].text, /2000/);
  assert.match(sent[0].text, /Երևան/);
  assert.ok(sent[0].reply_markup.inline_keyboard[0][0].url.includes('/invite/'));
  assert.ok(sent[0].reply_markup.inline_keyboard[1][0].copy_text.text.includes('/invite/'));
  assert.equal(sent[0].reply_markup.inline_keyboard[2][0].callback_data, 'creator:page:0');
  assert.doesNotMatch(sent[0].text, /Միջոցառման|Վայր|https?:/);
  const dashboard = await invoke(getCreatorDashboard, { query: { chatId: '111', page: '999' } });
  assert.equal(dashboard.page, 0);
  assert.equal(dashboard.summary.commission, 2000);
  assert.equal(dashboard.month.count, 1);
  assert.equal(dashboard.purchases[0].code, 'CREATOR');
  assert.equal(dashboard.purchases[0].percent, 10);
  await assert.rejects(invoke(getAdminCreators, { query: { chatId: '111' } }), { statusCode: 403 });
  await assert.rejects(invoke(getAdminCreator, { query: { chatId: '111' }, params: { promoId: String(promo._id) } }), { statusCode: 403 });
  await assert.rejects(invoke(getAdminCreatorPurchase, { query: { chatId: '111' }, params: { paymentId: checkout.paymentId } }), { statusCode: 403 });
  process.env.TELEGRAM_ADMIN_CHAT_IDS = '999';
  const adminList = await invoke(getAdminCreators, { query: { chatId: '999' } });
  assert.equal(adminList.creators[0].commission, 2000);
  const adminDetail = await invoke(getAdminCreator, { query: { chatId: '999' }, params: { promoId: String(promo._id) } });
  assert.equal(adminDetail.telegramUrl, 'https://t.me/test_creator');
  assert.equal(adminDetail.usageCount, 1);
  assert.equal(adminDetail.purchases.length, 1);
  assert.ok((await invoke(getAdminCreatorPurchase, { query: { chatId: '999' }, params: { paymentId: checkout.paymentId } })).url);
  process.env.TELEGRAM_ADMIN_CHAT_IDS = '';
  assert.ok(dashboard.purchases[0].paidAt);
  const detail = await invoke(getCreatorPurchase, { query: { chatId: '111' }, params: { paymentId: checkout.paymentId } });
  assert.ok(detail.url.includes('/invite/'));
  await PromoCode.create({ kind: 'creator', code: 'OTHER', value: 10, creatorChatId: '222' });
  await assert.rejects(invoke(getCreatorPurchase, { query: { chatId: '222' }, params: { paymentId: checkout.paymentId } }), { statusCode: 404 });
  await verifyArcaPayment({ paymentId: checkout.paymentId, user });
  await notifyCreatorOfPayment(checkout.paymentId);
  assert.equal(sent.length, 1, 'repeat verification does not resend or recount');
  assert.equal(await Order.countDocuments(), 1);
  let stats = await invoke(getAdminPromoCodes, {});
  assert.equal(stats.find((p) => String(p._id) === String(promo._id)).creatorStats.commission, 2000);
  await refundArcaPayment(checkout.paymentId);
  stats = await invoke(getAdminPromoCodes, {});
  assert.equal(stats.find((p) => String(p._id) === String(promo._id)).creatorStats.commission, 0, 'refund excluded from earnings');
  const refunded = await invoke(getCreatorDashboard, { query: { chatId: '111' } });
  assert.equal(refunded.summary.commission, 0);
  assert.equal(refunded.purchases[0].status, 'REFUNDED');
  await notifyCreatorOfPayment(checkout.paymentId);
  assert.equal(sent.length, 1);
  await invoke(updateAdminPromoCode, { ...req, body: { creatorContact: '+37499123456' } });
  assert.equal((await PromoCode.findById(promo._id)).creatorChatId, '');
  await assert.rejects(connect(), /Creator/);
});
