import assert from 'node:assert/strict';
import test from 'node:test';
import { isSecureInvitationSlug } from '../utils/invitationSlug.js';

test('public invitation routes only accept long unguessable slugs', () => {
  assert.equal(isSecureInvitationSlug('12'), false);
  assert.equal(isSecureInvitationSlug('507f1f77bcf86cd799439011'), false);
  assert.equal(isSecureInvitationSlug('sample-wedding'), false);
  assert.equal(isSecureInvitationSlug('A7i_TnSwz9SkokdXA1VOMrLv_4PjQqYk'), true);
});
