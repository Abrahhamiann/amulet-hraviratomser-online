import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isArcaPaymentFailed,
  isArcaPaymentPending,
  isArcaPaymentSuccessful,
  normalizeArcaStatus
} from '../utils/arcaStatus.js';
import { fromArcaAmount, toArcaAmount } from '../utils/paymentAmount.js';
import { sanitizeArcaResponse } from '../utils/paymentLogger.js';
import { getOrderStatus, registerOrder } from '../services/arcaService.js';

test('converts application amounts through the centralized ArCa multiplier', () => {
  assert.equal(toArcaAmount(1250, 100), '125000');
  assert.equal(fromArcaAmount('125000', 100), 1250);
  assert.throws(() => toArcaAmount(0, 100));
});

test('maps only documented ArCa order statuses', () => {
  assert.equal(isArcaPaymentSuccessful({ orderStatus: 2 }), true);
  assert.equal(isArcaPaymentPending({ OrderStatus: 0 }), true);
  assert.equal(isArcaPaymentPending({ orderStatus: 1 }), true);
  assert.equal(isArcaPaymentPending({ orderStatus: 5 }), true);
  assert.equal(isArcaPaymentFailed({ orderStatus: 3 }), true);
  assert.equal(isArcaPaymentFailed({ orderStatus: 6 }), true);
  assert.deepEqual(normalizeArcaStatus({ orderStatus: 999 }), {
    status: 'PENDING',
    providerStatus: 999,
    recognized: false
  });
});

test('provider response sanitizer excludes card and authentication data', () => {
  assert.deepEqual(sanitizeArcaResponse({
    errorCode: 0,
    orderStatus: 2,
    orderNumber: 'local-1',
    amount: 10000,
    pan: '411111**1111',
    cardholderName: 'Card Holder',
    password: 'secret'
  }), {
    errorCode: 0,
    orderNumber: 'local-1',
    orderStatus: 2,
    amount: 10000
  });
});

test('ArCa service sends documented form fields to configurable REST endpoints', async () => {
  const originalFetch = global.fetch;
  const originalEnv = { ...process.env };
  const requests = [];
  Object.assign(process.env, {
    ARCA_API_BASE_URL: 'https://payments.example.test/custom/rest/',
    ARCA_USERNAME: 'merchant_api',
    ARCA_PASSWORD: 'dummy-password',
    ARCA_CURRENCY: '051',
    ARCA_LANGUAGE: 'hy',
    ARCA_STATUS_ENDPOINT: 'getOrderStatus.do',
    FRONTEND_URL: 'https://shop.example.test'
  });
  global.fetch = async (url, options) => {
    requests.push({ url, options, params: new URLSearchParams(options.body) });
    return new Response(JSON.stringify(requests.length === 1
      ? { orderId: 'arca-order-id', formUrl: 'https://payments.example.test/form' }
      : { errorCode: 0, orderNumber: 'local-order', orderStatus: 0, amount: 10000, currency: '051' }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  };

  try {
    await registerOrder({
      orderNumber: 'local-order',
      amount: '10000',
      returnUrl: 'https://shop.example.test/payment/success?paymentId=1'
    });
    await getOrderStatus({ orderId: 'arca-order-id' });

    assert.equal(requests[0].url, 'https://payments.example.test/custom/rest/register.do');
    assert.equal(requests[0].options.method, 'POST');
    assert.equal(requests[0].params.get('userName'), 'merchant_api');
    assert.equal(requests[0].params.get('password'), 'dummy-password');
    assert.equal(requests[0].params.get('orderNumber'), 'local-order');
    assert.equal(requests[0].params.get('amount'), '10000');
    assert.equal(requests[0].params.get('currency'), '051');
    assert.equal(requests[0].params.has('merchantId'), false);
    assert.equal(requests[0].params.has('terminalId'), false);
    assert.equal(requests[1].url, 'https://payments.example.test/custom/rest/getOrderStatus.do');
    assert.equal(requests[1].params.get('orderId'), 'arca-order-id');
  } finally {
    global.fetch = originalFetch;
    Object.keys(process.env).forEach((key) => {
      if (!(key in originalEnv)) delete process.env[key];
    });
    Object.assign(process.env, originalEnv);
  }
});
