import crypto from 'crypto';
import Invitation from '../models/Invitation.js';

export const isSecureInvitationSlug = (value) => /^[A-Za-z0-9_-]{32,}$/.test(String(value || ''));

export const createSecureInvitationSlug = async () => {
  let slug;
  do {
    slug = crypto.randomBytes(24).toString('base64url');
  } while (await Invitation.exists({ slug }));
  return slug;
};

export const ensureSecureInvitationSlug = async (invitation) => {
  if (!invitation || isSecureInvitationSlug(invitation.slug)) return invitation?.slug || '';
  invitation.slug = await createSecureInvitationSlug();
  await invitation.save();
  return invitation.slug;
};
