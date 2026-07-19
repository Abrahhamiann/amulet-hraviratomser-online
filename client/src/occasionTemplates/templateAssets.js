import midnightVowsDefault from '../assets/occasion/midnight-vows-default.jpg';
import baptismAngel from '../assets/baptism/baptism-angel.png';
import baptismBabyChurch from '../assets/baptism/baptism-baby-church.png';
import baptismCandle from '../assets/baptism/baptism-candle.png';
import baptismChurchIcon from '../assets/baptism/baptism-church-icon.png';
import baptismCross from '../assets/baptism/baptism-cross.png';
import baptismDove from '../assets/baptism/baptism-dove.png';
import baptismEnvelope from '../assets/baptism/baptism-envelope.png';
import baptismFamily from '../assets/baptism/baptism-family.png';
import baptismFamilyPhoto from '../assets/morph/baptism-family.jpg';
import baptismLiftPhoto from '../assets/morph/baptism-lift.jpg';
import baptismPriestPhoto from '../assets/morph/baptism-priest.jpg';
import baptismSoftPhoto from '../assets/morph/baptism-soft.webp';
import baptismVoguePhoto from '../assets/morph/baptism-vogue.jpg';
import baptismWaterPhoto from '../assets/morph/baptism-water.jpg';

export const templateAssetSources = {
  'asset:occasion/midnight-vows-default.jpg': midnightVowsDefault,
  'asset:baptism/baptism-angel.png': baptismAngel,
  'asset:baptism/baptism-baby-church.png': baptismBabyChurch,
  'asset:baptism/baptism-candle.png': baptismCandle,
  'asset:baptism/baptism-church-icon.png': baptismChurchIcon,
  'asset:baptism/baptism-cross.png': baptismCross,
  'asset:baptism/baptism-dove.png': baptismDove,
  'asset:baptism/baptism-envelope.png': baptismEnvelope,
  'asset:baptism/baptism-family.png': baptismFamily,
  'asset:morph/baptism-family.jpg': baptismFamilyPhoto,
  'asset:morph/baptism-lift.jpg': baptismLiftPhoto,
  'asset:morph/baptism-priest.jpg': baptismPriestPhoto,
  'asset:morph/baptism-soft.webp': baptismSoftPhoto,
  'asset:morph/baptism-vogue.jpg': baptismVoguePhoto,
  'asset:morph/baptism-water.jpg': baptismWaterPhoto
};

export const templateDefaultGalleryIds = {
  'midnight-vows': [
    'asset:occasion/midnight-vows-default.jpg'
  ],
  'baptism-blessing': [
    'asset:baptism/baptism-baby-church.png',
    'asset:baptism/baptism-family.png',
    'asset:morph/baptism-family.jpg',
    'asset:morph/baptism-lift.jpg',
    'asset:morph/baptism-priest.jpg',
    'asset:morph/baptism-soft.webp',
    'asset:morph/baptism-vogue.jpg',
    'asset:morph/baptism-water.jpg'
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
