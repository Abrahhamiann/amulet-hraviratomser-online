import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import Template from '../models/Template.js';
import {
  isEmbeddedImage,
  optimizeTemplateMedia
} from '../utils/imageOptimization.js';
import { getMediaRoot } from '../utils/mediaStorage.js';

test('production media storage does not use a relative development directory', () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousMediaRoot = process.env.MEDIA_ROOT;
  try {
    process.env.NODE_ENV = 'production';
    process.env.MEDIA_ROOT = './media';
    assert.equal(getMediaRoot(), '/var/lib/amulet/media');
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousNodeEnv;
    if (previousMediaRoot === undefined) delete process.env.MEDIA_ROOT;
    else process.env.MEDIA_ROOT = previousMediaRoot;
  }
});

test('template schema persists a generated card thumbnail separately from the original image', () => {
  assert.equal(Template.schema.path('mainImageThumbnail')?.instance, 'String');
});

test('admin image optimization stores bounded WebP media outside MongoDB', async () => {
  const mediaRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'amulet-media-test-'));
  process.env.MEDIA_ROOT = mediaRoot;
  process.env.MEDIA_PUBLIC_URL = '/media';
  const sourceBuffer = await sharp({
    create: {
      width: 1600,
      height: 1200,
      channels: 4,
      background: { r: 220, g: 170, b: 120, alpha: 1 }
    }
  }).png().toBuffer();
  const source = `data:image/png;base64,${sourceBuffer.toString('base64')}`;

  const optimized = await optimizeTemplateMedia({
    mainImage: source,
    pagePreviewImage: source,
    gallery: [source]
  });

  assert.equal(isEmbeddedImage(optimized.mainImage), false);
  assert.match(optimized.mainImage, /^\/media\/templates\/.+main\.webp$/);
  assert.match(optimized.mainImageThumbnail, /^\/media\/templates\/.+card-480\.webp$/);
  assert.match(optimized.pagePreviewImage, /^\/media\/templates\/.+preview-720\.webp$/);
  assert.match(optimized.pagePreviewThumbnail, /^\/media\/templates\/.+preview-480\.webp$/);
  assert.match(optimized.gallery[0], /^\/media\/templates\/.+gallery\.webp$/);

  const localFile = (url) => path.join(mediaRoot, ...url.replace(/^\/media\//, '').split('/'));
  const thumbnailMetadata = await sharp(await fs.readFile(localFile(optimized.mainImageThumbnail))).metadata();
  const previewMetadata = await sharp(await fs.readFile(localFile(optimized.pagePreviewImage))).metadata();
  assert.equal(thumbnailMetadata.width, 480);
  assert.equal(previewMetadata.width, 720);
  delete process.env.MEDIA_ROOT;
  delete process.env.MEDIA_PUBLIC_URL;
});
