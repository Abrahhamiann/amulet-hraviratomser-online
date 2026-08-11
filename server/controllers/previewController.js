import asyncHandler from 'express-async-handler';
import PreviewSession from '../models/PreviewSession.js';
import Template from '../models/Template.js';
import { normalizeDraft, PUBLIC_DESIGN_KEYS } from '../utils/invitationDraft.js';
import { createPreviewToken, hashPreviewToken } from '../utils/previewToken.js';

export const createPreview = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.body.templateId);
  if (!template || template.isActive === false || !PUBLIC_DESIGN_KEYS.includes(template.designKey)) {
    res.status(404);
    throw new Error('Template not found');
  }

  const requestedToken = String(req.body.previewToken || '').trim();
  if (requestedToken) {
    const existing = await PreviewSession.findOne({
      tokenHash: hashPreviewToken(requestedToken),
      userId: req.user._id,
      templateId: template._id,
      isPurchased: false
    }).select('+tokenHash');
    if (existing) {
      existing.data = normalizeDraft(req.body.draft, template);
      existing.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await existing.save();
      res.json({ token: requestedToken, path: `/preview/${requestedToken}`, expiresAt: existing.expiresAt });
      return;
    }
  }

  const token = createPreviewToken();
  const preview = await PreviewSession.create({
    tokenHash: hashPreviewToken(token),
    userId: req.user._id,
    templateId: template._id,
    data: normalizeDraft(req.body.draft, template),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  });

  res.status(201).json({ token, path: `/preview/${token}`, expiresAt: preview.expiresAt });
});

export const getPreview = asyncHandler(async (req, res) => {
  const preview = await PreviewSession.findOne({ tokenHash: hashPreviewToken(req.params.token) })
    .select('+tokenHash')
    .populate('templateId invitationId');

  if (!preview) {
    res.status(403);
    throw new Error('Preview is not available');
  }

  if (preview.isPurchased && preview.invitationId?.isPublished) {
    res.json({ mode: 'public', invitationSlug: preview.invitationId.slug });
    return;
  }

  if (!req.user || String(preview.userId) !== String(req.user._id) || (preview.expiresAt && preview.expiresAt < new Date())) {
    res.status(403);
    throw new Error('Preview is not available');
  }

  res.json({ mode: 'private', template: preview.templateId, draft: preview.data });
});
