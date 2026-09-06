export const validGoogleProfile = (profile, clientId, now = Date.now()) => Boolean(
  clientId && profile?.aud === clientId
  && ['accounts.google.com', 'https://accounts.google.com'].includes(profile.iss)
  && typeof profile.sub === 'string' && profile.sub.length > 0
  && typeof profile.email === 'string'
  && (profile.email_verified === true || profile.email_verified === 'true')
  && Number(profile.exp) > now / 1000
);

export const canLinkGoogleIdentity = (user, profile) => {
  if (user.googleId) return user.googleId === profile.sub;
  // Privileged accounts and third-party email addresses require explicit
  // account linking; a matching email alone is not sufficient proof.
  return user.role === 'user' && (
    profile.email.toLowerCase().endsWith('@gmail.com')
    || (typeof profile.hd === 'string' && profile.hd.length > 0)
  );
};
