import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { getMediaRoot } from './mediaStorage.js';

let active = 0;
export function legacyMediaPath(source, root = getMediaRoot()) {
  // Only our content-addressed storage names; no arbitrary paths or remote fetches.
  const match = /^(?:https?:\/\/[^/]+)?\/media\/(templates\/[a-f0-9]{2}\/[a-f0-9]{2}\/[a-f0-9]{64}-[a-z0-9-]+\.(?:webp|png|jpe?g))$/i.exec(String(source || ''));
  return match ? path.join(root, ...match[1].split('/')) : null;
}

export async function legacyJpeg(source) {
  if (active >= 2) throw Object.assign(new Error('Image service busy'), { statusCode: 503 });
  active += 1;
  try {
    const file = legacyMediaPath(source);
    let input;
    if (file) {
      const root = await fs.realpath(getMediaRoot());
      const resolved = await fs.realpath(file);
      if (!resolved.startsWith(root + path.sep)) throw new Error('Invalid media path');
      const info = await fs.stat(resolved);
      if (info.size > 8 * 1024 * 1024) throw new Error('Image too large');
      input = await fs.readFile(resolved);
    } else {
      const embedded = /^data:image\/(?:webp|png|jpe?g);base64,([a-z0-9+/=\s]+)$/i.exec(String(source || ''));
      if (!embedded || embedded[1].length > 11 * 1024 * 1024) throw new Error('Image unavailable');
      input = Buffer.from(embedded[1], 'base64');
    }
    return await sharp(input, { limitInputPixels: 24_000_000 })
      .rotate().resize({ width: 900, height: 1200, fit: 'inside', withoutEnlargement: true })
      .flatten({ background: '#ffffff' }).jpeg({ quality: 72 }).toBuffer();
  } catch (error) {
    throw Object.assign(error, { statusCode: error.statusCode || 404, publicMessage: 'Image unavailable' });
  } finally { active -= 1; }
}
