import asyncHandler from 'express-async-handler';
import Template from '../models/Template.js';
import { makeSlug } from '../utils/slug.js';
import { ensureTemplateCodes, nextTemplateCode, reindexTemplateCodes } from '../utils/templateCode.js';
import { clearTemplateDeletionMarker, deleteTemplatePermanently } from '../utils/templateDeletion.js';
import { PUBLIC_DESIGN_KEYS, templateCategoryForDesign, templateEditorTypeForCategory } from '../utils/templateDesign.js';

const TEMPLATE_LIST_FIELDS = [
  'code', 'title', 'slug', 'category', 'price', 'description', 'designKey', 'mainImage',
  'pagePreviewAvailable', 'imagePosition', 'isFeatured', 'createdAt', 'updatedAt'
].join(' ');

export const getTemplates = asyncHandler(async (req, res) => {
  await ensureTemplateCodes();
  const { category, search, sort = 'newest', featured } = req.query;
  const query = { isActive: { $ne: false }, deletedAt: null, designKey: { $in: PUBLIC_DESIGN_KEYS } };
  if (category === 'other') query.category = { $in: ['corporate', 'new_year', 'meeting', 'military'] };
  else if (category) query.category = category;
  if (featured === 'true') query.isFeatured = true;
  if (search) query.$or = [
    { code: { $regex: search, $options: 'i' } },
    { title: { $regex: search, $options: 'i' } }
  ];

  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 }
  };

  const templates = await Template.find(query)
    .select(TEMPLATE_LIST_FIELDS)
    .sort(sortMap[sort] || sortMap.newest)
    .lean();
  res.set('Cache-Control', 'no-store');
  res.json(templates);
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
  const dataImage = source.match(/^data:image\/(png|jpe?g|webp);base64,([a-z0-9+/=\s]+)$/i);
  if (dataImage) {
    const buffer = Buffer.from(dataImage[2].replace(/\s/g, ''), 'base64');
    if (!buffer.length) {
      res.status(404);
      throw new Error('Template preview not found');
    }
    const subtype = dataImage[1].toLowerCase() === 'jpg' ? 'jpeg' : dataImage[1].toLowerCase();
    res.set({
      'Content-Type': `image/${subtype}`,
      'Content-Length': String(buffer.length),
      'Cache-Control': 'public, max-age=31536000, immutable'
    });
    res.send(buffer);
    return;
  }
  if (/^https?:\/\//i.test(source)) {
    res.redirect(302, source);
    return;
  }
  res.status(404);
  throw new Error('Template preview not found');
});

export const getTemplate = asyncHandler(async (req, res) => {
  await ensureTemplateCodes();
  const template = await Template.findById(req.params.id);
  if (!template || template.deletedAt || !PUBLIC_DESIGN_KEYS.includes(template.designKey) || template.isActive === false) {
    res.status(404);
    throw new Error('Template not found');
  }
  res.json(template);
});

export const createTemplate = asyncHandler(async (req, res) => {
  const data = req.body;
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
  const { code: _ignoredCode, ...updates } = req.body;
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
