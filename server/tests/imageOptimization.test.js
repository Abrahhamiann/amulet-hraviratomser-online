import assert from 'node:assert/strict';
import test from 'node:test';
import sharp from 'sharp';
import Template from '../models/Template.js';
import {
  embeddedImageBuffer,
  isEmbeddedImage,
  optimizeTemplateMedia
} from '../utils/imageOptimization.js';

test('template schema persists a generated card thumbnail separately from the original image', () => {
  assert.equal(Template.schema.path('mainImageThumbnail')?.instance, 'String');
});

test('admin image optimization creates bounded WebP media and a smaller card thumbnail', async () => {
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

  assert.equal(isEmbeddedImage(optimized.mainImage), true);
  assert.match(optimized.mainImage, /^data:image\/webp;base64,/);
  assert.match(optimized.mainImageThumbnail, /^data:image\/webp;base64,/);
  assert.match(optimized.pagePreviewImage, /^data:image\/webp;base64,/);
  assert.match(optimized.gallery[0], /^data:image\/webp;base64,/);

  const thumbnailMetadata = await sharp(embeddedImageBuffer(optimized.mainImageThumbnail)).metadata();
  const previewMetadata = await sharp(embeddedImageBuffer(optimized.pagePreviewImage)).metadata();
  assert.equal(thumbnailMetadata.width, 720);
  assert.equal(previewMetadata.width, 1200);
});
