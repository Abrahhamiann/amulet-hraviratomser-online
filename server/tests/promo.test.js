import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizePromoExpiry } from '../controllers/promoController.js';
import { isPromoUsable } from '../utils/promo.js';

test('promo date-only values expire at the end of the selected Armenia calendar day', () => {
  const expiry = normalizePromoExpiry('2026-09-08');
  assert.equal(expiry.toISOString(), '2026-09-08T19:59:59.999Z');
  assert.equal(isPromoUsable({ isActive: true, expiresAt: expiry, maxUses: 0 }, new Date('2026-09-08T19:59:59.998Z')), true);
  assert.equal(isPromoUsable({ isActive: true, expiresAt: expiry, maxUses: 0 }, new Date('2026-09-08T19:59:59.999Z')), false);
});

test('promo eligibility rejects disabled and exhausted codes', () => {
  assert.equal(isPromoUsable({ isActive: false, maxUses: 0 }), false);
  assert.equal(isPromoUsable({ isActive: true, maxUses: 2, usageCount: 2 }), false);
  assert.equal(isPromoUsable({ isActive: true, maxUses: 2, usageCount: 1 }), true);
});
