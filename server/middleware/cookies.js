export const parseCookies = (req, res, next) => {
  req.cookies = {};
  const header = req.headers.cookie;
  if (!header) return next();

  for (const part of header.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 1) continue;
    const key = part.slice(0, separator).trim();
    const rawValue = part.slice(separator + 1).trim();
    try {
      req.cookies[key] = decodeURIComponent(rawValue);
    } catch {
      req.cookies[key] = rawValue;
    }
  }
  next();
};
