import assert from 'node:assert/strict';
import test from 'node:test';
import { deleteTelegramAdminMessages } from '../controllers/telegramController.js';
import ContactMessage from '../models/ContactMessage.js';
import { notifyAdminsOfOrder, notifyAdminsOfUnansweredContactMessage } from '../utils/adminTelegram.js';
import { getTelegramAdminChatIds, isTelegramAdmin } from '../utils/telegram.js';

const ORIGINAL_ENV = {
  ids: process.env.TELEGRAM_ADMIN_CHAT_IDS,
  first: process.env.TELEGRAM_ADMIN_1_ID,
  second: process.env.TELEGRAM_ADMIN_2_ID,
  token: process.env.TELEGRAM_BOT_TOKEN
};
const ORIGINAL_FETCH = global.fetch;
const ORIGINAL_DELETE_MANY = ContactMessage.deleteMany;

const restoreEnv = (key, value) => {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
};

test.afterEach(() => {
  restoreEnv('TELEGRAM_ADMIN_CHAT_IDS', ORIGINAL_ENV.ids);
  restoreEnv('TELEGRAM_ADMIN_1_ID', ORIGINAL_ENV.first);
  restoreEnv('TELEGRAM_ADMIN_2_ID', ORIGINAL_ENV.second);
  restoreEnv('TELEGRAM_BOT_TOKEN', ORIGINAL_ENV.token);
  global.fetch = ORIGINAL_FETCH;
  ContactMessage.deleteMany = ORIGINAL_DELETE_MANY;
});

test('deletes every contact message from MongoDB for a Telegram administrator', async () => {
  process.env.TELEGRAM_ADMIN_CHAT_IDS = '111';
  let receivedFilter;
  ContactMessage.deleteMany = async (filter) => {
    receivedFilter = filter;
    return { deletedCount: 7 };
  };
  let payload;
  const response = {
    status() { return this; },
    json(value) {
      payload = value;
      return this;
    }
  };

  await deleteTelegramAdminMessages(
    { body: { chatId: '111' } },
    response,
    (error) => { throw error; }
  );

  assert.deepEqual(receivedFilter, {});
  assert.deepEqual(payload, {
    message: 'Contact messages deleted',
    deleted: 7
  });
});

test('normalizes, validates, and deduplicates configured Telegram admin IDs', () => {
  process.env.TELEGRAM_ADMIN_CHAT_IDS = '111, 222;invalid 111';
  process.env.TELEGRAM_ADMIN_1_ID = '-333';
  process.env.TELEGRAM_ADMIN_2_ID = '';

  assert.deepEqual(getTelegramAdminChatIds(), ['111', '222', '-333']);
  assert.equal(isTelegramAdmin(222), true);
  assert.equal(isTelegramAdmin('999'), false);
});

test('sends a complete paid-purchase alert to every configured administrator', async () => {
  process.env.TELEGRAM_ADMIN_CHAT_IDS = '111,222';
  process.env.TELEGRAM_ADMIN_1_ID = '';
  process.env.TELEGRAM_ADMIN_2_ID = '';
  process.env.TELEGRAM_BOT_TOKEN = 'test-token';
  const requests = [];
  global.fetch = async (url, options) => {
    requests.push({ url, body: JSON.parse(options.body) });
    return { ok: true };
  };

  const result = await notifyAdminsOfOrder({
    _id: '507f1f77bcf86cd799439011',
    fullName: 'Test Customer',
    phone: '+37400000000',
    email: 'customer@example.com',
    eventType: 'wedding',
    eventDate: new Date('2026-08-15T00:00:00.000Z'),
    eventTime: '18:00',
    eventLocation: 'Yerevan',
    mainNames: 'Anna & Armen',
    preferredLanguage: 'hy',
    amount: 25000,
    paymentStatus: 'paid',
    status: 'new',
    createdAt: new Date('2026-07-31T12:00:00.000Z'),
    templateId: { title: 'Golden Wedding', price: 25000 },
    invitationId: { names: 'Anna & Armen' }
  }, { paidPurchase: true });

  assert.deepEqual(result, { configured: true, delivered: 2, failed: 0 });
  assert.equal(requests.length, 2);
  assert.deepEqual(requests.map((request) => request.body.chat_id), ['111', '222']);
  assert.match(requests[0].body.text, /Նոր վճարված գնում/);
  assert.match(requests[0].body.text, /Test Customer/);
  assert.match(requests[0].body.text, /25[^\d]?000 ֏/);
  assert.equal(
    requests[0].body.reply_markup.inline_keyboard[0][0].callback_data,
    'admin:order:507f1f77bcf86cd799439011'
  );
});

test('sends an unanswered contact reminder with a direct reply action', async () => {
  process.env.TELEGRAM_ADMIN_CHAT_IDS = '111,222';
  process.env.TELEGRAM_BOT_TOKEN = 'test-token';
  const requests = [];
  global.fetch = async (url, options) => {
    requests.push(JSON.parse(options.body));
    return { ok: true };
  };

  const result = await notifyAdminsOfUnansweredContactMessage({
    _id: '507f1f77bcf86cd799439012',
    name: 'Contact Customer',
    email: 'contact@example.com',
    phone: '+37400000001',
    message: 'Please call me back.',
    createdAt: new Date(Date.now() - 16 * 60 * 1000)
  });

  assert.deepEqual(result, { configured: true, delivered: 2, failed: 0 });
  assert.equal(requests.length, 2);
  assert.match(requests[0].text, /Չպատասխանված նամակի հիշեցում/);
  assert.match(requests[0].text, /Contact Customer/);
  assert.equal(
    requests[0].reply_markup.inline_keyboard[0][0].callback_data,
    'admin:message:507f1f77bcf86cd799439012'
  );
});
