import { getArcaConfig } from '../config/arca.js';

const finiteAmount = (amount) => {
  const value = Number(amount);
  if (!Number.isFinite(value) || value < 0) throw new Error('Invalid payment amount');
  return value;
};

export const toArcaAmount = (amount, multiplier = getArcaConfig().amountMultiplier) => {
  const converted = Math.round(finiteAmount(amount) * multiplier);
  if (!Number.isSafeInteger(converted) || converted <= 0) throw new Error('Payment amount must be greater than zero');
  return String(converted);
};

export const fromArcaAmount = (amount, multiplier = getArcaConfig().amountMultiplier) => {
  const converted = Number(amount);
  if (!Number.isSafeInteger(converted) || converted < 0) throw new Error('Invalid ArCa amount');
  return converted / multiplier;
};

