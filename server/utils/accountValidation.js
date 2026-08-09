export const normalizeEmail = (value = '') => String(value).trim().toLowerCase();

export const normalizePhone = (value = '') => {
  const raw = String(value).trim();
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 9 && digits.startsWith('0')) return `+374${digits.slice(1)}`;
  if (digits.length === 11 && digits.startsWith('374')) return `+${digits}`;
  if (raw.startsWith('+') && digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : '';
};

export const passwordRequirements = (value = '') => {
  const password = String(value);
  return {
    length: password.length >= 8 && password.length <= 128,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
};

export const isStrongPassword = (value = '') => (
  Object.values(passwordRequirements(value)).every(Boolean)
);

export const isValidEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value));
