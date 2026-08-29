import asyncHandler from 'express-async-handler';
import Template from '../models/Template.js';
import { makeSlug } from '../utils/slug.js';
import { nextTemplateCode, reindexTemplateCodes } from '../utils/templateCode.js';
import { clearTemplateDeletionMarker, deleteTemplatePermanently } from '../utils/templateDeletion.js';
import { PUBLIC_DESIGN_KEYS, templateCategoryForDesign, templateEditorTypeForCategory } from '../utils/templateDesign.js';
import { embeddedImageBuffer, optimizeTemplateMedia } from '../utils/imageOptimization.js';

const TEMPLATE_LIST_FIELDS = [
  'code', 'title', 'slug', 'category', 'price', 'description', 'designKey',
  'pagePreviewAvailable', 'imagePosition', 'isFeatured', 'createdAt', 'updatedAt'
].join(' ');

const mediaProjection = {
  mainImage: {
    $cond: [
      { $regexMatch: { input: { $ifNull: ['$mainImage', ''] }, regex: /^data:image\//i } },
      '',
      '$mainImage'
    ]
  },
  mainImageStored: {
    $regexMatch: { input: { $ifNull: ['$mainImage', ''] }, regex: /^data:image\//i }
  }
};

export const getTemplates = asyncHandler(async (req, res) => {
  const { category, search, sort = 'newest', featured } = req.query;
  const query = { isActive: { $ne: false }, deletedAt: null, designKey: { $in: PUBLIC_DESIGN_KEYS } };
  if (category === 'other') query.category = { $in: ['corporate', 'new_year', 'meeting', 'military'] };
  else if (category) query.category = category;
  if (featured === 'true') query.isFeatured = true;
  if (search) {
    const safeSearch = String(search).slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { code: { $regex: safeSearch, $options: 'i' } },
      { title: { $regex: safeSearch, $options: 'i' } }
    ];
  }

  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 }
  };

  const selectedFields = Object.fromEntries(TEMPLATE_LIST_FIELDS.split(' ').map((field) => [field, 1]));
  const templates = await Template.aggregate([
    { $match: query },
    { $sort: sortMap[sort] || sortMap.newest },
    { $project: { ...selectedFields, ...mediaProjection } }
  ]);
  res.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
  res.json(templates);
});

const sendEmbeddedImage = (res, source, fallbackType = 'image/webp') => {
  const buffer = embeddedImageBuffer(source);
  if (!buffer?.length) return false;
  const match = String(source).match(/^data:(image\/(?:png|jpe?g|webp|gif));base64,/i);
  res.set({
    'Content-Type': match?.[1]?.replace('image/jpg', 'image/jpeg') || fallbackType,
    'Content-Length': String(buffer.length),
    'Cache-Control': 'public, max-age=31536000, immutable'
  });
  res.send(buffer);
  return true;
};

export const getTemplateCardImage = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id)
    .select('mainImageThumbnail deletedAt isActive designKey')
    .lean();
  if (!template || template.deletedAt || template.isActive === false || !PUBLIC_DESIGN_KEYS.includes(template.designKey)) {
    res.status(404);
    throw new Error('Template image not found');
  }

  if (sendEmbeddedImage(res, template.mainImageThumbnail)) return;

  const original = await Template.findById(req.params.id).select('mainImage').lean();
  if (sendEmbeddedImage(res, original?.mainImage)) return;
  if (/^https?:\/\//i.test(original?.mainImage || '')) {
    res.redirect(302, original.mainImage);
    return;
  }
  res.status(404);
  throw new Error('Template image not found');
});

export const getTemplatePagePreview = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id)
    .select('pagePreviewImage deletedAt isActive designKey updatedAt')
    .lean();
  if (!template || template.deletedAt || template.isActive === false || !PUBLIC_DESIGN_KEYS.includes(template.designKey)) {
    res.status(404);
    throw new Error('Template preview not found');
  }

  const source = String(template.pagePreviewImage || '').trim();
  if (sendEmbeddedImage(res, source)) return;
  if (/^https?:\/\//i.test(source)) {
    res.redirect(302, source);
    return;
  }
  res.status(404);
  throw new Error('Template preview not found');
});

export const getTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id).select('-pagePreviewImage -mainImageThumbnail');
  if (!template || template.deletedAt || !PUBLIC_DESIGN_KEYS.includes(template.designKey) || template.isActive === false) {
    res.status(404);
    throw new Error('Template not found');
  }
  res.json(template);
});

export const createTemplate = asyncHandler(async (req, res) => {
  const data = await optimizeTemplateMedia(req.body);
  const slug = data.slug || makeSlug(data.title);
  const category = data.category || templateCategoryForDesign(data.designKey);
  const template = await Template.create({
    ...data,
    category,
    editorType: data.editorType || templateEditorTypeForCategory(category),
    code: await nextTemplateCode(category),
    slug
  });
  await clearTemplateDeletionMarker(slug);
  res.status(201).json(template);
});

export const updateTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }
  const previousCategory = template.category;
  const { code: _ignoredCode, ...rawUpdates } = req.body;
  const updates = await optimizeTemplateMedia(rawUpdates);
  updates.category = updates.category || template.category;
  updates.editorType = updates.editorType || (
    updates.category === template.category
      ? (template.editorType || templateEditorTypeForCategory(updates.category))
      : templateEditorTypeForCategory(updates.category)
  );
  if (updates.category !== template.category) updates.code = await nextTemplateCode(updates.category);
  Object.assign(template, updates);
  if (req.body.title && !req.body.slug) template.slug = makeSlug(req.body.title);
  await template.save();
  if (previousCategory !== template.category) await reindexTemplateCodes(previousCategory);
  res.json(template);
});

export const deleteTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }
  const category = template.category;
  await deleteTemplatePermanently(template, req.user?._id || null);
  await reindexTemplateCodes(category);
  res.json({ message: 'Template deleted' });
});
