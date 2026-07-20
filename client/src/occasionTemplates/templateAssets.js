import midnightVowsDefault from '../assets/occasion/midnight-vows-default.jpg';
import baptismBabyChurch from '../assets/baptism/baptism-baby-church.png';
import baptismEnvelope from '../assets/baptism/baptism-envelope.png';
import baptismFamily from '../assets/baptism/baptism-family.png';
import baptismFamilyPhoto from '../assets/morph/baptism-family.jpg';
import baptismLiftPhoto from '../assets/morph/baptism-lift.jpg';
import baptismPriestPhoto from '../assets/morph/baptism-priest.jpg';
import baptismSoftPhoto from '../assets/morph/baptism-soft.webp';
import baptismVoguePhoto from '../assets/morph/baptism-vogue.jpg';
import baptismWaterPhoto from '../assets/morph/baptism-water.jpg';
import engagementBouquet from '../assets/morph/engagement-bouquet-red.jpg';
import engagementChandelier from '../assets/morph/engagement-chandelier.jpg';
import engagementHand from '../assets/morph/engagement-hand.jpg';
import engagementRing from '../assets/morph/engagement-ring.jpg';
import engagementRoses from '../assets/morph/engagement-roses.jpg';
import engagementSmile from '../assets/morph/engagement-smile.jpg';
import weddingSunset from '../assets/morph/wedding-sunset.jpg';

export const templateAssetSources = {
  'asset:occasion/midnight-vows-default.jpg': midnightVowsDefault,
  'asset:baptism/baptism-angel.png': baptismBabyChurch,
  'asset:baptism/baptism-baby-church.png': baptismBabyChurch,
  'asset:baptism/baptism-candle.png': baptismEnvelope,
  'asset:baptism/baptism-church-icon.png': baptismBabyChurch,
  'asset:baptism/baptism-cross.png': baptismEnvelope,
  'asset:baptism/baptism-dove.png': baptismFamily,
  'asset:baptism/baptism-envelope.png': baptismEnvelope,
  'asset:baptism/baptism-family.png': baptismFamily,
  'asset:morph/baptism-family.jpg': baptismFamilyPhoto,
  'asset:morph/baptism-lift.jpg': baptismLiftPhoto,
  'asset:morph/baptism-priest.jpg': baptismPriestPhoto,
  'asset:morph/baptism-soft.webp': baptismSoftPhoto,
  'asset:morph/baptism-vogue.jpg': baptismVoguePhoto,
  'asset:morph/baptism-water.jpg': baptismWaterPhoto,
  'asset:morph/engagement-bouquet-red.jpg': engagementBouquet,
  'asset:morph/engagement-chandelier.jpg': engagementChandelier,
  'asset:morph/engagement-hand.jpg': engagementHand,
  'asset:morph/engagement-ring.jpg': engagementRing,
  'asset:morph/engagement-roses.jpg': engagementRoses,
  'asset:morph/engagement-smile.jpg': engagementSmile,
  'asset:morph/wedding-sunset.jpg': weddingSunset
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
  ],
  'engagement-serenade': [
    'asset:morph/wedding-sunset.jpg',
    'asset:morph/engagement-smile.jpg',
    'asset:morph/engagement-hand.jpg',
    'asset:morph/engagement-ring.jpg',
    'asset:morph/engagement-roses.jpg',
    'asset:morph/engagement-bouquet-red.jpg',
    'asset:morph/engagement-chandelier.jpg'
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
