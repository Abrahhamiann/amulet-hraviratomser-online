import asyncHandler from 'express-async-handler';
import Template from '../models/Template.js';
import { makeSlug } from '../utils/slug.js';

export const getTemplates = asyncHandler(async (req, res) => {
  const { category, search, sort = 'newest', featured } = req.query;
  const query = {};
  if (category) query.category = category;
  if (featured === 'true') query.isFeatured = true;
  if (search) query.title = { $regex: search, $options: 'i' };

  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 }
  };

  const templates = await Template.find(query).sort(sortMap[sort] || sortMap.newest);
  res.json(templates);
});

export const getTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }
  res.json(template);
});

export const createTemplate = asyncHandler(async (req, res) => {
  const data = req.body;
  const slug = data.slug || makeSlug(data.title);
  const template = await Template.create({ ...data, slug });
  res.status(201).json(template);
});

export const updateTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }
  Object.assign(template, req.body);
  if (req.body.title && !req.body.slug) template.slug = makeSlug(req.body.title);
  await template.save();
  res.json(template);
});

export const deleteTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }
  await template.deleteOne();
  res.json({ message: 'Template deleted' });
});
