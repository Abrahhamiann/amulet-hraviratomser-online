const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const authCookieName = () => process.env.AUTH_COOKIE_NAME || 'amulet_auth';

// Set AUTH_COOKIE_DOMAIN=.amulet.am in production so amulet.am, admin.amulet.am
// and server.amulet.am share the same session cookie.
const authCookieDomain = () => process.env.AUTH_COOKIE_DOMAIN?.trim() || undefined;

export const authCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  domain: authCookieDomain(),
  maxAge: Number(process.env.AUTH_COOKIE_MAX_AGE_MS) || ONE_WEEK_MS
});

export const setAuthCookie = (res, token) => {
  res.cookie(authCookieName(), token, authCookieOptions());
};

export const clearAuthCookie = (res) => {
  const { maxAge, ...options } = authCookieOptions();
  res.clearCookie(authCookieName(), options);
};
