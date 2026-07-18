import defaultHeroImage from '../assets/occasion/test-wedding-hero.jpg';
import midnightVowsDefault from '../assets/occasion/midnight-vows-default.jpg';
import engagementRoses from '../assets/morph/engagement-roses.jpg';
import weddingChurchRed from '../assets/morph/wedding-church-red.jpg';
import weddingForest from '../assets/morph/wedding-forest-optimized.jpg';
import weddingSunset from '../assets/morph/wedding-sunset.jpg';
import weddingTemple from '../assets/morph/wedding-temple.jpg';
import weddingWhiteHall from '../assets/morph/wedding-white-hall.jpg';

export const templateAssetSources = {
  'asset:occasion/test-wedding-hero.jpg': defaultHeroImage,
  'asset:occasion/midnight-vows-default.jpg': midnightVowsDefault,
  'asset:morph/engagement-roses.jpg': engagementRoses,
  'asset:morph/wedding-church-red.jpg': weddingChurchRed,
  'asset:morph/wedding-forest-optimized.jpg': weddingForest,
  'asset:morph/wedding-sunset.jpg': weddingSunset,
  'asset:morph/wedding-temple.jpg': weddingTemple,
  'asset:morph/wedding-white-hall.jpg': weddingWhiteHall
};

export const templateDefaultGalleryIds = {
  'test-wedding': [
    'asset:occasion/test-wedding-hero.jpg',
    'asset:morph/wedding-sunset.jpg',
    'asset:morph/wedding-forest-optimized.jpg',
    'asset:morph/wedding-temple.jpg',
    'asset:morph/wedding-white-hall.jpg',
    'asset:morph/wedding-church-red.jpg',
    'asset:morph/engagement-roses.jpg'
  ],
  'romantic-gold': [
    'asset:morph/wedding-sunset.jpg',
    'asset:morph/wedding-forest-optimized.jpg',
    'asset:morph/wedding-temple.jpg',
    'asset:morph/wedding-white-hall.jpg',
    'asset:morph/wedding-church-red.jpg',
    'asset:morph/engagement-roses.jpg'
  ],
  'midnight-vows': [
    'asset:occasion/midnight-vows-default.jpg'
  ]
};

export const resolveTemplateImage = (image) => templateAssetSources[image] || image;

export const resolveTemplateImages = (images = []) => images
  .map(resolveTemplateImage)
  .filter((image) => typeof image === 'string' && image.trim());

export const getConfiguredTemplateGallery = (template = {}, fallbackGallery = []) => {
  const configuredGallery = Array.isArray(template.gallery) ? template.gallery : [];
  if (template.galleryConfigured === true) return resolveTemplateImages(configuredGallery);

  return resolveTemplateImages([
    template.mainImage,
    ...configuredGallery,
    ...fallbackGallery
  ]);
};
