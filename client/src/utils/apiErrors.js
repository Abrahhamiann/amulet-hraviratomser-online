const EXACT_API_ERROR_KEYS = {
  'Name, email, phone, password, and password confirmation are required': 'authFieldsRequired',
  'A valid email address is required': 'authEmailInvalid',
  'Passwords do not match': 'authPasswordsMismatch',
  'Password must be 8-128 characters and include uppercase, lowercase, number, and special character': 'authPasswordRulesError',
  'Account already exists': 'authAccountExists',
  'Phone number is already in use': 'authPhoneInUse',
  'Email or phone and password are required': 'authLoginRequired',
  'Invalid email/phone or password': 'authInvalidCredentials',
  'Please verify your email before signing in': 'authVerifyBeforeLogin',
  'Email and verification code are required': 'authVerificationRequired',
  'Verification code expired': 'authCodeExpired',
  'Too many verification attempts. Please register again': 'authTooManyVerificationAttempts',
  'Verification code is incorrect': 'authCodeWrong',
  'Reset code is invalid or expired': 'authResetCodeInvalid',
  'Too many reset attempts. Request a new code': 'authTooManyResetAttempts',
  'Reset token and password are required': 'authResetRequired',
  'Password reset session is invalid or expired': 'authResetSessionInvalid',
  'Google credential is required': 'authGoogleRequired',
  'Google sign-in is not configured': 'authGoogleNotConfigured',
  'Invalid Google credential': 'authGoogleInvalid',
  'Google credential is not valid for this app': 'authGoogleAppMismatch',
  'A completed purchase is required to add a review': 'reviewPurchaseRequired',
  'Review text is too short': 'reviewTooShort',
  'A review has already been submitted for this purchase': 'reviewAlreadySubmitted'
};

const PREFIX_API_ERROR_KEYS = [
  ['Missing fields:', 'orderErrorDetails']
];

export function getLocalizedApiError(error, t, { fallbackKey = 'error', networkKey } = {}) {
  if (!error?.response) {
    if (error?.request && networkKey) return t(networkKey);
    return error?.message || t(fallbackKey);
  }

  const message = String(error.response?.data?.message || '').trim();
  const exactKey = EXACT_API_ERROR_KEYS[message];
  const prefixKey = PREFIX_API_ERROR_KEYS.find(([prefix]) => message.startsWith(prefix))?.[1];
  return t(exactKey || prefixKey || fallbackKey);
}
