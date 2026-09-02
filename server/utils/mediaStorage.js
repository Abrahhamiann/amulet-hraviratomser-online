import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTION_MEDIA_ROOT = '/var/lib/amulet/media';

export const getMediaRoot = () => {
  const configured = String(process.env.MEDIA_ROOT || '').trim();
  if (process.env.NODE_ENV === 'production') {
    // The production nginx config serves /media from this persistent directory.
    // A copied development value such as MEDIA_ROOT=./media must not silently
    // store uploads inside the release checkout where nginx cannot see them.
    return configured && path.isAbsolute(configured)
      ? path.resolve(configured)
      : PRODUCTION_MEDIA_ROOT;
  }
  return path.resolve(configured || path.resolve(__dirname, '../uploads/media'));
};

const publicBase = () => String(
  process.env.MEDIA_PUBLIC_URL
  || (process.env.NODE_ENV === 'production' ? 'https://server.amulet.am/media' : '/media')
).replace(/\/+$/, '');

const safeKind = (value) => String(value || 'image').toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 40);

const atomicWrite = async (target, buffer) => {
  const directory = path.dirname(target);
  await fs.mkdir(directory, { recursive: true });
  const temporary = path.join(directory, `.${path.basename(target)}.${process.pid}.${crypto.randomUUID()}.tmp`);
  await fs.writeFile(temporary, buffer, { flag: 'wx' });
  try {
    await fs.rename(temporary, target);
  } catch (error) {
    await fs.rm(temporary, { force: true });
    if (error.code !== 'EEXIST') throw error;
  }
};

export const storeMediaBuffer = async (buffer, { kind = 'image', extension = 'webp' } = {}) => {
  if (!Buffer.isBuffer(buffer) || !buffer.length) throw new Error('Cannot store an empty media file');
  const digest = crypto.createHash('sha256').update(buffer).digest('hex');
  const folder = path.join('templates', digest.slice(0, 2), digest.slice(2, 4));
  const filename = `${digest}-${safeKind(kind)}.${String(extension).replace(/[^a-z0-9]/gi, '') || 'webp'}`;
  const relativePath = path.posix.join(folder.replaceAll('\\', '/'), filename);
  const mediaRoot = getMediaRoot();
  const absolutePath = path.resolve(mediaRoot, ...relativePath.split('/'));
  const expectedRoot = `${mediaRoot}${path.sep}`;
  if (!absolutePath.startsWith(expectedRoot)) throw new Error('Invalid media path');

  try {
    await fs.access(absolutePath);
  } catch {
    await atomicWrite(absolutePath, buffer);
  }

  return {
    url: `${publicBase()}/${relativePath}`,
    bytes: buffer.length,
    checksum: digest
  };
};

export const ensureMediaRoot = () => fs.mkdir(getMediaRoot(), { recursive: true });
