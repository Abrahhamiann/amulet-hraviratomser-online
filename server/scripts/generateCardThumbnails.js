import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const serverDirectory = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const projectDirectory = path.dirname(serverDirectory);
const outputDirectory = path.join(projectDirectory, 'client', 'src', 'assets', 'template-card-thumbnails');

const sources = {
  'sacred-beginnings': 'client/src/assets/importedTemplates/sacred/child-portrait.jpg',
  'birthday-sparkle': 'client/src/assets/importedTemplates/birthday/portrait.jpg',
  'birthday-space': 'client/src/vendorTemplates/cnund1/src/assets/final-reference.png',
  'birthday-watercolor': 'client/src/vendorTemplates/cnund2/src/assets/images/background.png',
  'birthday-crimson': 'client/src/vendorTemplates/cnund3/src/assets/images/cocktails.png',
  'ivory-vows': 'client/src/assets/importedTemplates/ivory/hero.jpg',
  'divine-blessing': 'client/src/vendorTemplates/divine/assets/baby-1.jpg',
  'elevate-invite': 'client/src/vendorTemplates/elevate/assets/hero-bg.jpg',
  'everlasting-vows': 'client/src/vendorTemplates/everlasting/assets/hero.jpg',
  'forever-vows': 'client/src/assets/morph/engagement-smile.jpg',
  'silk-vows': 'client/src/vendorTemplates/silkvows/assets/hero.jpg',
  'burgundy-roadmap': 'client/src/vendorTemplates/harsaniq1/src/assets/nkar1.jpg',
  'monochrome-envelope': 'client/src/vendorTemplates/harsaniq2/src/assets/images/hero-couple.jpg',
  'love-map-wedding': 'client/src/vendorTemplates/harsaniq4/src/assets/images/couple-one.jpg',
  'angelic-baptism': 'client/src/vendorTemplates/knunq1/src/assets/images/baby.jpg',
  'polaroid-engagement': 'client/src/vendorTemplates/nshanadrutyun1/src/assets/images/couple-1.jpg',
  'golden-heart-engagement': 'client/src/vendorTemplates/nshanadrutyun2/src/assets/images/couple-mountain.jpg',
  'cinematic-engagement': 'client/src/vendorTemplates/nshanadrutyun3/src/assets/images/couple-1.jpg',
  'last-bell': 'client/src/vendorTemplates/verjinzang1/src/assets/bell-photo.jpg'
};

await fs.mkdir(outputDirectory, { recursive: true });

for (const [designKey, relativeSource] of Object.entries(sources)) {
  const source = path.join(projectDirectory, relativeSource);
  const destination = path.join(outputDirectory, `${designKey}.webp`);
  await sharp(source)
    .rotate()
    .resize({ width: 720, withoutEnlargement: true })
    .webp({ quality: 84, effort: 6, smartSubsample: true })
    .toFile(destination);
}

console.log(`Generated ${Object.keys(sources).length} card thumbnails in ${outputDirectory}`);

const optimizedAssets = [
  {
    source: 'client/src/assets/logo.png',
    destination: 'client/src/assets/logo.webp',
    width: 360,
    quality: 90
  },
  {
    source: 'client/src/assets/home/amulet-device-suite.png',
    destination: 'client/src/assets/home/amulet-device-suite.webp',
    width: 1600,
    quality: 88
  },
  {
    source: 'client/src/assets/logo.png',
    destination: 'client/public/apple-touch-icon.png',
    width: 180,
    format: 'png'
  },
  {
    source: 'client/src/assets/logo.png',
    destination: 'client/public/favicon.png',
    width: 128,
    format: 'png'
  }
];

for (const asset of optimizedAssets) {
  const pipeline = sharp(path.join(projectDirectory, asset.source))
    .rotate()
    .resize({ width: asset.width, withoutEnlargement: true });
  if (asset.format === 'png') pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
  else pipeline.webp({ quality: asset.quality, effort: 6, smartSubsample: true });
  await pipeline.toFile(path.join(projectDirectory, asset.destination));
}

console.log(`Generated ${optimizedAssets.length} optimized site assets.`);
