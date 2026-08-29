import sharp from 'sharp';
import Template from '../models/Template.js';
import { storeMediaBuffer } from './mediaStorage.js';

const DATA_IMAGE_PATTERN = /^data:image\/(png|jpe?g|webp|gif);base64,([a-z0-9+/=\s]+)$/i;

export const isEmbeddedImage = (value) => DATA_IMAGE_PATTERN.test(String(value || '').trim());

const decodeEmbeddedImage = (value) => {
  const match = String(value || '').trim().match(DATA_IMAGE_PATTERN);
  return match ? Buffer.from(match[2].replace(/\s/g, ''), 'base64') : null;
};

const encodeWebp = (buffer) => `data:image/webp;base64,${buffer.toString('base64')}`;

const mapWithConcurrency = async (items, limit, mapper) => {
  const results = new Array(items.length);
  let cursor = 0;
  const worker = async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
};

const optimizeAndStore = async (value, {
  maxWidth = 1920,
  quality = 88,
  kind = 'image'
} = {}) => {
  const input = decodeEmbeddedImage(value);
  if (!input?.length) return value;
  const image = sharp(input, { limitInputPixels: 180_000_000 }).rotate();
  const metadata = await image.metadata();
  const output = await image
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality, effort: 5, smartSubsample: true })
    .toBuffer();
  const stored = await storeMediaBuffer(output, { kind });
  const scale = metadata.width && metadata.width > maxWidth ? maxWidth / metadata.width : 1;
  return {
    ...stored,
    width: Math.max(1, Math.round((metadata.width || maxWidth) * scale)),
    height: Math.max(1, Math.round((metadata.height || maxWidth) * scale))
  };
};

export const optimizeEmbeddedImage = async (value, {
  maxWidth = 1920,
  quality = 88
} = {}) => {
  const match = String(value || '').trim().match(DATA_IMAGE_PATTERN);
  if (match?.[1]?.toLowerCase() === 'gif') return value;
  const input = decodeEmbeddedImage(value);
  if (!input?.length) return value;

  const output = await sharp(input, { limitInputPixels: 180_000_000 })
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality, effort: 5, smartSubsample: true })
    .toBuffer();

  return encodeWebp(output);
};

export const makeCardThumbnail = async (value) => {
  const input = decodeEmbeddedImage(value);
  if (!input?.length) return '';

  const output = await sharp(input, { limitInputPixels: 180_000_000 })
    .rotate()
    .resize({ width: 720, withoutEnlargement: true })
    .webp({ quality: 84, effort: 5, smartSubsample: true })
    .toBuffer();

  return encodeWebp(output);
};

export const optimizeTemplateMedia = async (input = {}) => {
  const data = { ...input };

  if (Array.isArray(data.gallery)) {
    data.gallery = await mapWithConcurrency(data.gallery, 2, async (source) => {
      if (!isEmbeddedImage(source)) return source;
      const stored = await optimizeAndStore(source, { maxWidth: 1600, quality: 84, kind: 'gallery' });
      return stored.url;
    });
  }

  if (Object.hasOwn(data, 'mainImage')) {
    if (isEmbeddedImage(data.mainImage)) {
      const [main, card] = await Promise.all([
        optimizeAndStore(data.mainImage, { maxWidth: 1600, quality: 84, kind: 'main' }),
        optimizeAndStore(data.mainImage, { maxWidth: 480, quality: 78, kind: 'card-480' })
      ]);
      data.mainImage = main.url;
      data.mainImageThumbnail = card.url;
      data.mainImageMeta = card;
    } else if (typeof data.mainImageThumbnail !== 'string') {
      data.mainImageThumbnail = '';
    }
  }

  if (Object.hasOwn(data, 'pagePreviewImage')) {
    if (isEmbeddedImage(data.pagePreviewImage)) {
      const [modal, catalog] = await Promise.all([
        optimizeAndStore(data.pagePreviewImage, { maxWidth: 720, quality: 78, kind: 'preview-720' }),
        optimizeAndStore(data.pagePreviewImage, { maxWidth: 480, quality: 72, kind: 'preview-480' })
      ]);
      data.pagePreviewImage = modal.url;
      data.pagePreviewThumbnail = catalog.url;
      data.pagePreviewMeta = catalog;
    } else if (!data.pagePreviewImage) {
      data.pagePreviewThumbnail = '';
      data.pagePreviewMeta = null;
    }
  }

  return data;
};

export const optimizeLegacyTemplateMedia = async () => {
  const templates = Template.find({
    $or: [
      { mainImage: /^data:image\//i },
      { pagePreviewImage: /^data:image\//i },
      { gallery: /^data:image\//i }
    ]
  }).select('mainImage mainImageThumbnail pagePreviewImage pagePreviewThumbnail gallery').cursor();

  let count = 0;
  for await (const template of templates) {
    const optimized = await optimizeTemplateMedia({
      mainImage: template.mainImage,
      pagePreviewImage: template.pagePreviewImage,
      gallery: template.gallery
    });
    Object.assign(template, optimized);
    await template.save();
    count += 1;
    if (count % 25 === 0) console.log(`Migrated ${count} template media records...`);
  }

  return count;
};

export const embeddedImageBuffer = (value) => decodeEmbeddedImage(value);
