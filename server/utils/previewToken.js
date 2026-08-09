import crypto from 'crypto';

export const hashPreviewToken = (token) => crypto
  .createHash('sha256')
  .update(String(token || ''))
  .digest('hex');

export const createPreviewToken = () => crypto.randomBytes(32).toString('base64url');
