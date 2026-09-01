import { arcaErrorCode, arcaErrorMessage, arcaOrderStatus, arcaResponseValue } from './arcaStatus.js';

export const sanitizeArcaResponse = (response) => {
  if (!response || typeof response !== 'object') return {};
  const fields = [
    'errorCode', 'errorMessage', 'orderId', 'orderNumber', 'orderStatus',
    'actionCode', 'actionCodeDescription', 'amount', 'depositAmount',
    'refundedAmount', 'currency', 'formUrl'
  ];
  return Object.fromEntries(fields.flatMap((field) => {
    const value = arcaResponseValue(response, field);
    return value === undefined ? [] : [[field, value]];
  }));
};

export const paymentLog = (level, operation, context = {}) => {
  const safe = {
    operation,
    paymentId: context.paymentId ? String(context.paymentId) : undefined,
    localOrderId: context.localOrderId,
    arcaOrderId: context.arcaOrderId,
    httpStatus: context.httpStatus,
    providerStatus: context.providerResponse ? arcaOrderStatus(context.providerResponse) : context.providerStatus,
    providerErrorCode: context.providerResponse ? arcaErrorCode(context.providerResponse) : context.providerErrorCode,
    providerErrorMessage: context.providerResponse ? arcaErrorMessage(context.providerResponse) : context.providerErrorMessage,
    message: context.message
  };
  Object.keys(safe).forEach((key) => safe[key] === undefined && delete safe[key]);
  const writer = level === 'error' ? console.error : level === 'warn' ? console.warn : console.info;
  writer(`[payment] ${JSON.stringify(safe)}`);
};

