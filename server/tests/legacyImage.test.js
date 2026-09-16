import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { legacyJpeg, legacyMediaPath } from '../utils/legacyImage.js';

test('legacy image paths reject traversal, arbitrary files and remote fetching', () => {
  for (const value of ['https://example.com/image.jpg', '/media/../../secret.png', 'file:///etc/passwd', '/media/templates/aa/bb/short.webp', '/media/%2e%2e/private.png']) {
    assert.equal(legacyMediaPath(value), null);
  }
  assert.ok(legacyMediaPath('/media/templates/aa/bb/' + 'a'.repeat(64) + '-image.webp'));
});
test('legacy JPEG bounds dimensions and converts WebP', async () => {
  const input = await sharp({ create: { width: 1800, height: 2400, channels: 4, background: '#ff000080' } }).webp().toBuffer();
  const jpeg = await legacyJpeg('data:image/webp;base64,' + input.toString('base64'));
  const metadata = await sharp(jpeg).metadata();
  assert.equal(metadata.format, 'jpeg');
  assert.equal(metadata.width, 900);
  assert.equal(metadata.height, 1200);
  await assert.rejects(legacyJpeg('https://example.com/image.jpg'), { statusCode: 404 });
});
