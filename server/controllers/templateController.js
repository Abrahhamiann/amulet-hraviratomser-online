import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
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

const clampLimit = (value) => Math.min(48, Math.max(1, Number.parseInt(value, 10) || 24));
const TEMPLATE_CACHE_TTL_MS = 5 * 60 * 1000;
const TEMPLATE_CACHE_STALE_MS = 60 * 60 * 1000;
const TEMPLATE_CACHE_MAX_ENTRIES = 200;
const DYNAMIC_TEMPLATE_CACHE_CONTROL = 'no-store';
const templateListCache = new Map();
const templateListInflight = new Map();

const normalizedListParams = (raw = {}) => ({
  category: String(raw.category || '').trim(),
  search: String(raw.search || '').trim().slice(0, 80),
  sort: ['newest', 'price_asc', 'price_desc'].includes(raw.sort) ? raw.sort : 'newest',
  featured: raw.featured === 'true' ? 'true' : '',
  cursor: String(raw.cursor || '').trim(),
  limit: clampLimit(raw.limit)
});

const templateCacheKey = (params) => JSON.stringify(params);

const pruneTemplateCache = () => {
  if (templateListCache.size < TEMPLATE_CACHE_MAX_ENTRIES) return;
  const oldestKey = templateListCache.keys().next().value;
  if (oldestKey) templateListCache.delete(oldestKey);
};

export const clearTemplateCatalogCache = () => {
  templateListCache.clear();
  templateListInflight.clear();
};

const decodeCursor = (value) => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(Buffer.from(String(value), 'base64url').toString('utf8'));
    if (!parsed?.id || !mongoose.isValidObjectId(parsed.id)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const encodeCursor = (template, sort) => Buffer.from(JSON.stringify({
  id: String(template._id),
  value: sort === 'newest' ? template.createdAt : template.price
})).toString('base64url');

const cursorQuery = (cursor, sort) => {
  if (!cursor) return null;
  const id = new mongoose.Types.ObjectId(cursor.id);
  if (sort === 'price_asc' || sort === 'price_desc') {
    const price = Number(cursor.value);
    if (!Number.isFinite(price)) return null;
    const operator = sort === 'price_asc' ? '$gt' : '$lt';
    return { $or: [{ price: { [operator]: price } }, { price, _id: { [operator]: id } }] };
  }
  const createdAt = new Date(cursor.value);
  if (Number.isNaN(createdAt.getTime())) return null;
  return { $or: [{ createdAt: { $lt: createdAt } }, { createdAt, _id: { $lt: id } }] };
};

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
  },
  mainImageThumbnail: {
    $cond: [
      { $regexMatch: { input: { $ifNull: ['$mainImageThumbnail', ''] }, regex: /^data:image\//i } },
      '',
      '$mainImageThumbnail'
    ]
  },
  pagePreviewImage: {
    $cond: [
      { $regexMatch: { input: { $ifNull: ['$pagePreviewImage', ''] }, regex: /^data:image\//i } },
      '',
      '$pagePreviewImage'
    ]
  },
  pagePreviewThumbnail: {
    $cond: [
      { $regexMatch: { input: { $ifNull: ['$pagePreviewThumbnail', ''] }, regex: /^data:image\//i } },
      '',
      '$pagePreviewThumbnail'
    ]
  },
  pagePreviewMeta: 1
};

const queryTemplatePage = async (rawParams = {}) => {
  const { category, search, sort, featured, cursor, limit } = normalizedListParams(rawParams);
  const query = { isActive: true, deletedAt: null, designKey: { $in: PUBLIC_DESIGN_KEYS } };
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
    newest: { createdAt: -1, _id: -1 },
    price_asc: { price: 1, _id: 1 },
    price_desc: { price: -1, _id: -1 }
  };

  const continuation = cursorQuery(decodeCursor(cursor), sort);
  if (continuation) query.$and = [continuation];

  const selectedFields = Object.fromEntries(TEMPLATE_LIST_FIELDS.split(' ').map((field) => [field, 1]));
  const templates = await Template.aggregate([
    { $match: query },
    { $sort: sortMap[sort] },
    { $limit: limit + 1 },
    { $project: { ...selectedFields, ...mediaProjection } }
  ]);
  const hasMore = templates.length > limit;
  const items = hasMore ? templates.slice(0, limit) : templates;
  return {
    items,
    hasMore,
    nextCursor: hasMore && items.length ? encodeCursor(items.at(-1), sort) : null
  };
};

const loadTemplatePage = async (rawParams = {}) => {
  const params = normalizedListParams(rawParams);
  const key = templateCacheKey(params);
  const now = Date.now();
  const cached = templateListCache.get(key);
  if (cached && cached.expiresAt > now) return { payload: cached.payload, status: 'HIT' };

  const refresh = () => {
    if (templateListInflight.has(key)) return templateListInflight.get(key);
    const request = queryTemplatePage(params)
      .then((payload) => {
        pruneTemplateCache();
        templateListCache.delete(key);
        templateListCache.set(key, {
          payload,
          expiresAt: Date.now() + TEMPLATE_CACHE_TTL_MS,
          staleUntil: Date.now() + TEMPLATE_CACHE_STALE_MS
        });
        return payload;
      })
      .finally(() => templateListInflight.delete(key));
    templateListInflight.set(key, request);
    return request;
  };

  if (cached && cached.staleUntil > now) {
    void refresh().catch(() => {});
    return { payload: cached.payload, status: 'STALE' };
  }

  return { payload: await refresh(), status: 'MISS' };
};

export const warmTemplateCatalogCache = async () => {
  await loadTemplatePage({ limit: 24, sort: 'newest' });
};

export const getTemplates = asyncHandler(async (req, res) => {
  const { payload, status } = await loadTemplatePage(req.query);
  // Prices and availability are admin-managed business data. They must not be
  // served from a browser/CDN cache after an administrator changes them.
  res.set('Cache-Control', DYNAMIC_TEMPLATE_CACHE_CONTROL);
  res.set('X-Amulet-Cache', status);
  res.json(payload);
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
    .select('pagePreviewImage pagePreviewThumbnail deletedAt isActive designKey updatedAt')
    .lean();
  if (!template || template.deletedAt || template.isActive === false || !PUBLIC_DESIGN_KEYS.includes(template.designKey)) {
    res.status(404);
    throw new Error('Template preview not found');
  }

  const source = String(
    req.query.catalog === '1'
      ? template.pagePreviewThumbnail || template.pagePreviewImage
      : template.pagePreviewImage
  ).trim();
  if (sendEmbeddedImage(res, source)) return;
  if (/^https?:\/\//i.test(source)) {
    res.redirect(302, source);
    return;
  }
  res.status(404);
  throw new Error('Template preview not found');
});

export const getTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id)
    .select('-pagePreviewImage -pagePreviewThumbnail -mainImageThumbnail -mainImageMeta -pagePreviewMeta -deletedBy')
    .lean();
  if (!template || template.deletedAt || !PUBLIC_DESIGN_KEYS.includes(template.designKey) || template.isActive === false) {
    res.status(404);
    throw new Error('Template not found');
  }
  res.set('Cache-Control', DYNAMIC_TEMPLATE_CACHE_CONTROL);
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
  clearTemplateCatalogCache();
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
  if (rawUpdates.mainImage === template.mainImage) delete rawUpdates.mainImage;
  if (rawUpdates.pagePreviewImage === template.pagePreviewImage) delete rawUpdates.pagePreviewImage;
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
  clearTemplateCatalogCache();
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
  clearTemplateCatalogCache();
  res.json({ message: 'Template deleted' });
});
