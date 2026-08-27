import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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

const invitationRsvpForms = [
  '../../client/src/pages/InvitationPage.jsx',
  '../../client/src/vendorTemplates/sacred/src/components/invitation/Rsvp.tsx',
  '../../client/src/vendorTemplates/birthday/src/components/birthday/RSVPSection.tsx',
  '../../client/src/occasionTemplates/BirthdaySpaceTemplate.jsx',
  '../../client/src/occasionTemplates/BirthdayWatercolorTemplate.jsx',
  '../../client/src/occasionTemplates/BirthdayCrimsonTemplate.jsx',
  '../../client/src/vendorTemplates/divine/baptism/RSVPSection.tsx',
  '../../client/src/vendorTemplates/elevate/invitation/RSVPForm.tsx',
  '../../client/src/vendorTemplates/everafter/invite/Rsvp.tsx',
  '../../client/src/vendorTemplates/everlasting/wedding/Forms.tsx',
  '../../client/src/vendorTemplates/ivory/src/components/wedding/RSVPForm.tsx'
];

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

test('every invitation RSVP form uses an uncapped numeric guest field', () => {
  invitationRsvpForms.forEach((relativePath) => {
    const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
    assert.match(source, /type=["']number["']/, `${relativePath} must use a numeric guest field`);
    assert.doesNotMatch(source, /<select\b[^>]*(?:id|name)=["'][^"']*guests/i, `${relativePath} must not use a guest-count select`);
    assert.doesNotMatch(source, /guests\s*:\s*[^\n]+\.max\s*\(/i, `${relativePath} must not cap guest validation`);
    assert.doesNotMatch(source, /Math\.min\s*\(\s*(?:5|10|20)\b/i, `${relativePath} must not clamp guest state`);
    assert.doesNotMatch(source, /(?:id|name)=["'][^"']*guests["'][^>]*\bmax=/i, `${relativePath} must not set a guest input maximum`);
  });
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

test('stores an HTML form guest count exactly without an arbitrary upper cap', async () => {
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
      guestCount: '500'
    }
  }, response, (error) => { throw error; });

  assert.equal(stored.guestCount, 500);
  assert.equal(responseBody.guestCount, 500);
});
