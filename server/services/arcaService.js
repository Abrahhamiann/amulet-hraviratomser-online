import { getArcaConfig } from '../config/arca.js';
import { arcaErrorCode, arcaErrorMessage } from '../utils/arcaStatus.js';

export class ArcaProviderError extends Error {
  constructor(message, { providerCode = '', httpStatus = 0, retryable = false, response = null } = {}) {
    super(message);
    this.name = 'ArcaProviderError';
    this.statusCode = 502;
    this.publicCode = 'PAYMENT_PROVIDER_ERROR';
    this.publicMessage = 'Unable to communicate with the payment provider';
    this.providerCode = providerCode;
    this.httpStatus = httpStatus;
    this.retryable = retryable;
    this.providerResponse = response;
  }
}

const endpointUrl = (baseUrl, endpoint) => `${baseUrl}/${String(endpoint).replace(/^\/+/, '')}`;

const parseResponse = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    if (text.trim().startsWith('<') || !text.includes('=')) {
      throw new ArcaProviderError('ArCa returned a malformed response', { httpStatus: response.status });
    }
    const params = new URLSearchParams(text);
    const parsed = Object.fromEntries(params.entries());
    if (Object.keys(parsed).length) return parsed;
    throw new ArcaProviderError('ArCa returned a malformed response', { httpStatus: response.status });
  }
};

const request = async (endpoint, values, operation) => {
  const config = getArcaConfig();
  const params = new URLSearchParams({
    userName: config.username,
    password: config.password
  });
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value) !== '') params.append(key, String(value));
  });

  let response;
  try {
    response = await fetch(endpointUrl(config.baseUrl, endpoint), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
      signal: AbortSignal.timeout(config.timeoutMs)
    });
  } catch (error) {
    const timeout = error?.name === 'TimeoutError' || error?.name === 'AbortError';
    throw new ArcaProviderError(timeout ? 'ArCa request timed out' : 'Unable to reach ArCa', { retryable: true });
  }

  const payload = await parseResponse(response);
  if (!response.ok) {
    throw new ArcaProviderError(`ArCa ${operation} request failed`, {
      providerCode: arcaErrorCode(payload) || '',
      httpStatus: response.status,
      retryable: response.status >= 500,
      response: payload
    });
  }

  const errorCode = arcaErrorCode(payload);
  if (errorCode !== null && errorCode !== '0') {
    throw new ArcaProviderError(arcaErrorMessage(payload) || `ArCa ${operation} was rejected`, {
      providerCode: errorCode,
      httpStatus: response.status,
      retryable: errorCode === '7',
      response: payload
    });
  }
  return payload;
};

export const registerOrder = ({ orderNumber, amount, returnUrl, failUrl, description, clientId }) => {
  const config = getArcaConfig();
  return request('register.do', {
    orderNumber,
    amount,
    currency: config.currency,
    returnUrl,
    failUrl,
    description: description || config.description,
    language: config.language,
    clientId: clientId || config.clientId
  }, 'register order');
};

export const getOrderStatus = ({ orderId, orderNumber }) => {
  const config = getArcaConfig();
  return request(config.statusEndpoint, {
    orderId,
    orderNumber: orderId ? undefined : orderNumber,
    language: config.language
  }, 'get order status');
};

export const refundOrder = ({ orderId, amount }) => {
  const config = getArcaConfig();
  return request('refund.do', { orderId, amount, language: config.language }, 'refund order');
};

export const reverseOrder = ({ orderId }) => {
  const config = getArcaConfig();
  return request('reverse.do', { orderId, language: config.language }, 'reverse order');
};
