import assert from 'node:assert/strict';
import test from 'node:test';
import {
  connectTelegramBot,
  deleteTelegramAdminMessages,
  getTelegramStatus,
  registerTelegramBotHeartbeat
} from '../controllers/telegramController.js';
import ContactMessage from '../models/ContactMessage.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { notifyAdminsOfOrder, notifyAdminsOfUnansweredContactMessage } from '../utils/adminTelegram.js';
import { getTelegramAdminChatIds, isTelegramAdmin, notifyInvitationOwnerOfRsvp } from '../utils/telegram.js';

const ORIGINAL_ENV = {
  ids: process.env.TELEGRAM_ADMIN_CHAT_IDS,
  first: process.env.TELEGRAM_ADMIN_1_ID,
  second: process.env.TELEGRAM_ADMIN_2_ID,
  token: process.env.TELEGRAM_BOT_TOKEN,
  sharedToken: process.env.TELEGRAM_SHARED_BOT_TOKEN,
  username: process.env.TELEGRAM_BOT_USERNAME,
  sharedUsername: process.env.TELEGRAM_SHARED_BOT_USERNAME
};
const ORIGINAL_FETCH = global.fetch;
const ORIGINAL_DELETE_MANY = ContactMessage.deleteMany;
const ORIGINAL_USER_FIND_ONE = User.findOne;
const ORIGINAL_USER_FIND_ONE_AND_UPDATE = User.findOneAndUpdate;
const ORIGINAL_ORDER_FIND_BY_ID = Order.findById;

const restoreEnv = (key, value) => {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
};

test.afterEach(() => {
  restoreEnv('TELEGRAM_ADMIN_CHAT_IDS', ORIGINAL_ENV.ids);
  restoreEnv('TELEGRAM_ADMIN_1_ID', ORIGINAL_ENV.first);
  restoreEnv('TELEGRAM_ADMIN_2_ID', ORIGINAL_ENV.second);
  restoreEnv('TELEGRAM_BOT_TOKEN', ORIGINAL_ENV.token);
  restoreEnv('TELEGRAM_SHARED_BOT_TOKEN', ORIGINAL_ENV.sharedToken);
  restoreEnv('TELEGRAM_BOT_USERNAME', ORIGINAL_ENV.username);
  restoreEnv('TELEGRAM_SHARED_BOT_USERNAME', ORIGINAL_ENV.sharedUsername);
  global.fetch = ORIGINAL_FETCH;
  ContactMessage.deleteMany = ORIGINAL_DELETE_MANY;
  User.findOne = ORIGINAL_USER_FIND_ONE;
  User.findOneAndUpdate = ORIGINAL_USER_FIND_ONE_AND_UPDATE;
  Order.findById = ORIGINAL_ORDER_FIND_BY_ID;
});

test('reports Telegram available only after the bot heartbeat reaches the server', async () => {
  process.env.TELEGRAM_SHARED_BOT_TOKEN = 'test-token';
  process.env.TELEGRAM_SHARED_BOT_USERNAME = 'amulet_test_bot';

  let heartbeatPayload;
  await registerTelegramBotHeartbeat(
    {},
    { json(value) { heartbeatPayload = value; return this; } },
    (error) => { throw error; }
  );

  let statusPayload;
  await getTelegramStatus(
    { user: { telegram: {} } },
    { json(value) { statusPayload = value; return this; } },
    (error) => { throw error; }
  );

  assert.equal(heartbeatPayload.ok, true);
  assert.equal(statusPayload.configured, true);
  assert.equal(statusPayload.available, true);
  assert.equal(statusPayload.username, 'amulet_test_bot');
});

test('deletes every contact message from MongoDB for a Telegram administrator', async () => {
  process.env.TELEGRAM_ADMIN_CHAT_IDS = '111';
  User.findOne = () => ({ select: async () => ({ _id: 'super-admin-user' }) });
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

test('rejects a configured Telegram chat unless it belongs to a linked super administrator', async () => {
  process.env.TELEGRAM_ADMIN_CHAT_IDS = '111';
  User.findOne = () => ({ select: async () => null });
  let deleteCalled = false;
  ContactMessage.deleteMany = async () => {
    deleteCalled = true;
    return { deletedCount: 1 };
  };
  const response = {
    statusCode: 200,
    status(value) { this.statusCode = value; return this; },
    json() { return this; }
  };

  await assert.rejects(
    deleteTelegramAdminMessages(
      { body: { chatId: '111' } },
      response,
      (error) => { throw error; }
    ),
    /Telegram administrator access required/
  );
  assert.equal(response.statusCode, 403);
  assert.equal(deleteCalled, false);
});

test('rejects Telegram account linking outside a private user chat', async () => {
  let tokenLookupCalled = false;
  User.findOneAndUpdate = () => {
    tokenLookupCalled = true;
    return { select: async () => null };
  };
  const response = {
    statusCode: 200,
    status(value) { this.statusCode = value; return this; },
    json() { return this; }
  };

  await assert.rejects(
    connectTelegramBot(
      { body: { token: 'valid-looking-token', chatId: '111', telegramUserId: '222' } },
      response,
      (error) => { throw error; }
    ),
    /private chat/
  );
  assert.equal(response.statusCode, 400);
  assert.equal(tokenLookupCalled, false);
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

test('sends RSVP notifications to the purchased invitation owner by stable user id', async () => {
  process.env.TELEGRAM_BOT_TOKEN = 'test-token';
  Order.findById = () => ({
    select: async () => ({
      userId: '507f1f77bcf86cd799439099',
      email: 'old-email@example.com',
      mainNames: 'Anna & Armen',
      preferredLanguage: 'en'
    })
  });
  let ownerQuery;
  User.findOne = async (query) => {
    ownerQuery = query;
    return {
      telegram: { chatId: '555', language: 'en', notificationsEnabled: true }
    };
  };
  let requestBody;
  global.fetch = async (_url, options) => {
    requestBody = JSON.parse(options.body);
    return { ok: true };
  };

  const delivered = await notifyInvitationOwnerOfRsvp(
    {
      _id: '507f1f77bcf86cd799439011',
      orderId: '507f1f77bcf86cd799439022',
      names: 'Anna & Armen'
    },
    {
      guestName: 'Guest One',
      phone: '+37400000000',
      status: 'attending',
      guestCount: 2,
      message: 'See you there!'
    }
  );

  assert.equal(delivered, true);
  assert.equal(ownerQuery._id, '507f1f77bcf86cd799439099');
  assert.equal(requestBody.chat_id, '555');
  assert.match(requestBody.text, /Guest One/);
  assert.match(requestBody.text, /See you there!/);
});
