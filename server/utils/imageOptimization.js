import sharp from 'sharp';
import Invitation from '../models/Invitation.js';
import Template from '../models/Template.js';
import { storeMediaBuffer } from './mediaStorage.js';

const DATA_IMAGE_PATTERN = /^data:image\/(png|jpe?g|webp|gif);base64,([a-z0-9+/=\s]+)$/i;
const DATA_AUDIO_PATTERN = /^data:audio\/(mpeg|mp3|wav|ogg|mp4|x-m4a);base64,([a-z0-9+/=\s]+)$/i;

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

export const optimizeInvitationDraftMedia = async (input = {}) => {
  const data = { ...input };
  const storedImages = new Map();
  const storeImage = async (source, kind) => {
    if (!isEmbeddedImage(source)) return source;
    if (!storedImages.has(source)) {
      storedImages.set(source, optimizeAndStore(source, {
        maxWidth: 1600,
        quality: 82,
        kind
      }).then((stored) => stored.url));
    }
    return storedImages.get(source);
  };

  if (Object.hasOwn(data, 'image')) data.image = await storeImage(data.image, 'invitation-main');
  if (Array.isArray(data.gallery)) {
    data.gallery = await mapWithConcurrency(data.gallery, 2, (source) => storeImage(source, 'invitation-gallery'));
  }
  if (data.templateImageOverrides && typeof data.templateImageOverrides === 'object') {
    const entries = await mapWithConcurrency(Object.entries(data.templateImageOverrides), 2, async ([key, source]) => (
      [key, await storeImage(source, 'invitation-override')]
    ));
    data.templateImageOverrides = Object.fromEntries(entries);
  }

  const audioMatch = String(data.musicUrl || '').trim().match(DATA_AUDIO_PATTERN);
  if (audioMatch) {
    const extension = {
      mpeg: 'mp3', mp3: 'mp3', wav: 'wav', ogg: 'ogg', mp4: 'm4a', 'x-m4a': 'm4a'
    }[audioMatch[1].toLowerCase()] || 'mp3';
    const stored = await storeMediaBuffer(Buffer.from(audioMatch[2].replace(/\s/g, ''), 'base64'), {
      kind: 'invitation-audio',
      extension
    });
    data.musicUrl = stored.url;
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

export const optimizeLegacyInvitationMedia = async () => {
  const invitations = Invitation.find({
    $or: [
      { gallery: /^data:image\//i },
      { 'customization.musicUrl': /^data:audio\//i },
      { 'customization.templateImageOverrides': { $exists: true } }
    ]
  }).select('gallery customization').cursor();

  let count = 0;
  for await (const invitation of invitations) {
    const customization = invitation.customization && typeof invitation.customization === 'object'
      ? { ...invitation.customization }
      : {};
    const optimized = await optimizeInvitationDraftMedia({
      gallery: invitation.gallery || [],
      musicUrl: customization.musicUrl || '',
      templateImageOverrides: customization.templateImageOverrides || {}
    });
    invitation.gallery = optimized.gallery;
    invitation.customization = {
      ...customization,
      musicUrl: optimized.musicUrl,
      templateImageOverrides: optimized.templateImageOverrides
    };
    await invitation.save();
    count += 1;
    if (count % 25 === 0) console.log(`Migrated ${count} invitation media records...`);
  }

  return count;
};

export const embeddedImageBuffer = (value) => decodeEmbeddedImage(value);
