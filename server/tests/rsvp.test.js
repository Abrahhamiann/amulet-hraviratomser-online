import assert from 'node:assert/strict';
import test from 'node:test';
import { createRSVP, getMyInvitationRSVPDetails } from '../controllers/rsvpController.js';
import Invitation from '../models/Invitation.js';
import Order from '../models/Order.js';
import RSVP from '../models/RSVP.js';
import User from '../models/User.js';

const originals = {
  invitationFindById: Invitation.findById,
  orderFindById: Order.findById,
  rsvpCreate: RSVP.create,
  rsvpFind: RSVP.find,
  userFindOne: User.findOne,
  fetch: global.fetch,
  token: process.env.TELEGRAM_BOT_TOKEN
};

test.afterEach(() => {
  Invitation.findById = originals.invitationFindById;
  Order.findById = originals.orderFindById;
  RSVP.create = originals.rsvpCreate;
  RSVP.find = originals.rsvpFind;
  User.findOne = originals.userFindOne;
  global.fetch = originals.fetch;
  if (originals.token === undefined) delete process.env.TELEGRAM_BOT_TOKEN;
  else process.env.TELEGRAM_BOT_TOKEN = originals.token;
});

test('stores a native-template RSVP without a phone and notifies the owner before responding', async () => {
  process.env.TELEGRAM_BOT_TOKEN = 'test-token';
  const invitation = {
    _id: '507f1f77bcf86cd799439011',
    orderId: '507f1f77bcf86cd799439022',
    names: 'Anna & Armen'
  };
  Invitation.findById = async () => invitation;

  let stored;
  RSVP.create = async (data) => {
    stored = data;
    return { ...data, toObject: () => ({ ...data }) };
  };
  Order.findById = () => ({
    select: async () => ({
      userId: '507f1f77bcf86cd799439099',
      email: 'owner@example.com',
      mainNames: 'Anna & Armen',
      preferredLanguage: 'en'
    })
  });
  User.findOne = async () => ({
    telegram: { chatId: '555', language: 'en', notificationsEnabled: true }
  });

  let telegramFinished = false;
  global.fetch = async () => {
    telegramFinished = true;
    return { ok: true };
  };

  let statusCode;
  let responseBody;
  const response = {
    status(value) { statusCode = value; return this; },
    json(value) { responseBody = value; return this; }
  };

  await createRSVP({
    params: { invitationId: invitation._id },
    body: {
      guestName: 'Native Template Guest',
      status: 'attending',
      guestCount: 3,
      message: 'See you there!'
    }
  }, response, (error) => { throw error; });

  assert.equal(statusCode, 201);
  assert.equal(stored.phone, '');
  assert.equal(stored.guestName, 'Native Template Guest');
  assert.equal(stored.guestCount, 3);
  assert.equal(telegramFinished, true);
  assert.equal(responseBody.telegramDelivered, true);
});

test('returns stored RSVP replies on the purchased invitation owner page', async () => {
  const ownerId = '507f1f77bcf86cd799439099';
  const invitation = {
    _id: '507f1f77bcf86cd799439011',
    names: 'Anna & Armen',
    orderId: { userId: ownerId, email: 'owner@example.com' }
  };
  Invitation.findById = () => {
    const query = {
      populate() { return query; },
      then(resolve) { return Promise.resolve(resolve(invitation)); }
    };
    return query;
  };

  const storedReplies = [{
    guestName: 'Native Template Guest',
    phone: '',
    status: 'attending',
    guestCount: 3
  }];
  RSVP.find = () => ({ sort: async () => storedReplies });

  let responseBody;
  const response = { json(value) { responseBody = value; return this; } };
  await getMyInvitationRSVPDetails({
    params: { invitationId: invitation._id },
    user: { _id: ownerId, email: 'owner@example.com' }
  }, response, (error) => { throw error; });

  assert.equal(responseBody.invitation, invitation);
  assert.deepEqual(responseBody.rsvps, storedReplies);
});

test('stores the exact RSVP guest count without an arbitrary upper cap', async () => {
  const invitation = {
    _id: '507f1f77bcf86cd799439011',
    orderId: '507f1f77bcf86cd799439022',
    names: 'Anna & Armen'
  };
  Invitation.findById = async () => invitation;

  let stored;
  RSVP.create = async (data) => {
    stored = data;
    return { ...data, toObject: () => ({ ...data }) };
  };
  Order.findById = () => ({ select: async () => ({}) });

  let responseBody;
  const response = {
    status() { return this; },
    json(value) { responseBody = value; return this; }
  };

  await createRSVP({
    params: { invitationId: invitation._id },
    body: {
      guestName: 'Large party',
      status: 'attending',
      guestCount: 500
    }
  }, response, (error) => { throw error; });

  assert.equal(stored.guestCount, 500);
  assert.equal(responseBody.guestCount, 500);
});
