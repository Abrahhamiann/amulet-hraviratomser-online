import sharp from 'sharp';
import Template from '../models/Template.js';

const DATA_IMAGE_PATTERN = /^data:image\/(png|jpe?g|webp|gif);base64,([a-z0-9+/=\s]+)$/i;

export const isEmbeddedImage = (value) => DATA_IMAGE_PATTERN.test(String(value || '').trim());

const decodeEmbeddedImage = (value) => {
  const match = String(value || '').trim().match(DATA_IMAGE_PATTERN);
  return match ? Buffer.from(match[2].replace(/\s/g, ''), 'base64') : null;
};

const encodeWebp = (buffer) => `data:image/webp;base64,${buffer.toString('base64')}`;

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
  const optimizedSources = new Map();
  const optimizeOnce = async (source, options) => {
    const key = `${options.maxWidth}:${options.quality}:${source}`;
    if (!optimizedSources.has(key)) {
      optimizedSources.set(key, optimizeEmbeddedImage(source, options));
    }
    return optimizedSources.get(key);
  };

  if (Array.isArray(data.gallery)) {
    data.gallery = await Promise.all(data.gallery.map((source) => (
      optimizeOnce(source, { maxWidth: 1920, quality: 88 })
    )));
  }

  if (Object.hasOwn(data, 'mainImage')) {
    data.mainImage = await optimizeOnce(data.mainImage, { maxWidth: 1920, quality: 88 });
    data.mainImageThumbnail = isEmbeddedImage(data.mainImage)
      ? await makeCardThumbnail(data.mainImage)
      : '';
  }

  if (Object.hasOwn(data, 'pagePreviewImage')) {
    data.pagePreviewImage = await optimizeOnce(data.pagePreviewImage, { maxWidth: 1200, quality: 84 });
  }

  return data;
};

export const optimizeLegacyTemplateMedia = async () => {
  const templates = await Template.find({
    $or: [
      { mainImage: /^data:image\//i, mainImageThumbnail: { $in: ['', null] } },
      { pagePreviewImage: /^data:image\/(?:png|jpe?g|gif)/i }
    ]
  }).select('mainImage mainImageThumbnail pagePreviewImage gallery');

  for (const template of templates) {
    const optimized = await optimizeTemplateMedia({
      mainImage: template.mainImage,
      pagePreviewImage: template.pagePreviewImage,
      gallery: template.gallery
    });
    Object.assign(template, optimized);
    await template.save();
  }

  return templates.length;
};

export const embeddedImageBuffer = (value) => decodeEmbeddedImage(value);
