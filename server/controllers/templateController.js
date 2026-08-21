import asyncHandler from 'express-async-handler';
import Template from '../models/Template.js';
import { makeSlug } from '../utils/slug.js';
import { ensureTemplateCodes, nextTemplateCode, reindexTemplateCodes } from '../utils/templateCode.js';
import { PUBLIC_DESIGN_KEYS, templateCategoryForDesign } from '../utils/templateDesign.js';

export const getTemplates = asyncHandler(async (req, res) => {
  await ensureTemplateCodes();
  const { category, search, sort = 'newest', featured } = req.query;
  const query = { isActive: { $ne: false }, designKey: { $in: PUBLIC_DESIGN_KEYS } };
  if (category) query.category = category;
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

  const templates = await Template.find(query).sort(sortMap[sort] || sortMap.newest);
  res.json(templates);
});

export const getTemplate = asyncHandler(async (req, res) => {
  await ensureTemplateCodes();
  const template = await Template.findById(req.params.id);
  if (!template || !PUBLIC_DESIGN_KEYS.includes(template.designKey) || template.isActive === false) {
    res.status(404);
    throw new Error('Template not found');
  }
  res.json(template);
});

export const createTemplate = asyncHandler(async (req, res) => {
  const data = req.body;
  const slug = data.slug || makeSlug(data.title);
  const category = templateCategoryForDesign(data.designKey) || data.category;
  const template = await Template.create({
    ...data,
    category,
    editorType: category,
    code: await nextTemplateCode(category),
    slug
  });
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
  const designKey = updates.designKey || template.designKey;
  updates.category = templateCategoryForDesign(designKey) || updates.category || template.category;
  updates.editorType = updates.category;
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
  await template.deleteOne();
  await reindexTemplateCodes(category);
  res.json({ message: 'Template deleted' });
});
