const valueFor = (response, key) => {
  if (!response || typeof response !== 'object') return undefined;
  const match = Object.keys(response).find((candidate) => candidate.toLowerCase() === key.toLowerCase());
  return match ? response[match] : undefined;
};

export const arcaResponseValue = valueFor;

export const arcaErrorCode = (response) => {
  const raw = valueFor(response, 'errorCode');
  return raw === undefined || raw === null || raw === '' ? null : String(raw);
};

export const arcaErrorMessage = (response) => String(valueFor(response, 'errorMessage') || '').trim();

export const arcaOrderStatus = (response) => {
  const raw = valueFor(response, 'orderStatus');
  if (raw === undefined || raw === null || raw === '') return null;
  const value = Number(raw);
  return Number.isInteger(value) ? value : null;
};

// Verified against the Armenian Card CJSC Merchant Manual published by ArCa.
const statusMap = new Map([
  [0, 'PENDING'],
  [1, 'PENDING'],
  [2, 'PAID'],
  [3, 'CANCELLED'],
  [4, 'REFUNDED'],
  [5, 'PENDING'],
  [6, 'FAILED']
]);

export const normalizeArcaStatus = (response) => {
  const providerStatus = arcaOrderStatus(response);
  return {
    status: statusMap.get(providerStatus) || 'PENDING',
    providerStatus,
    recognized: statusMap.has(providerStatus)
  };
};

export const isArcaPaymentSuccessful = (response) => normalizeArcaStatus(response).status === 'PAID';
export const isArcaPaymentPending = (response) => normalizeArcaStatus(response).status === 'PENDING';
export const isArcaPaymentFailed = (response) => ['FAILED', 'CANCELLED'].includes(normalizeArcaStatus(response).status);

