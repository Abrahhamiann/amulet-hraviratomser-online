const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const authCookieName = () => process.env.AUTH_COOKIE_NAME || 'amulet_auth';

export const authCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: Number(process.env.AUTH_COOKIE_MAX_AGE_MS) || ONE_WEEK_MS
});

export const setAuthCookie = (res, token) => {
  res.cookie(authCookieName(), token, authCookieOptions());
};

export const clearAuthCookie = (res) => {
  const { maxAge, ...options } = authCookieOptions();
  res.clearCookie(authCookieName(), options);
};
