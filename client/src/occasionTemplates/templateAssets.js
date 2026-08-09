import sacredPortrait from '../assets/importedTemplates/sacred/child-portrait.jpg';
import sacredGallery1 from '../assets/importedTemplates/sacred/gallery-1.jpg';
import sacredGallery2 from '../assets/importedTemplates/sacred/gallery-2.jpg';
import sacredGallery3 from '../assets/importedTemplates/sacred/gallery-3.jpg';
import sacredGallery4 from '../assets/importedTemplates/sacred/gallery-4.jpg';
import sacredGallery5 from '../assets/importedTemplates/sacred/gallery-5.jpg';
import birthdayPortrait from '../assets/importedTemplates/birthday/portrait.jpg';
import birthdayVenue from '../assets/importedTemplates/birthday/venue.jpg';
import birthdayGallery1 from '../assets/importedTemplates/birthday/gallery-1.jpg';
import birthdayGallery2 from '../assets/importedTemplates/birthday/gallery-2.jpg';
import birthdayGallery3 from '../assets/importedTemplates/birthday/gallery-3.jpg';
import birthdayGallery4 from '../assets/importedTemplates/birthday/gallery-4.jpg';
import birthdayGallery5 from '../assets/importedTemplates/birthday/gallery-5.jpg';
import ivoryHero from '../assets/importedTemplates/ivory/hero.jpg';
import ivoryChurch from '../assets/importedTemplates/ivory/church.jpg';
import ivoryHall from '../assets/importedTemplates/ivory/hall.jpg';
import ivoryGallery1 from '../assets/importedTemplates/ivory/gallery-1.jpg';
import ivoryGallery2 from '../assets/importedTemplates/ivory/gallery-2.jpg';
import ivoryGallery3 from '../assets/importedTemplates/ivory/gallery-3.jpg';
import ivoryGallery4 from '../assets/importedTemplates/ivory/gallery-4.jpg';

export const templateAssetSources = {
  'asset:curated/sacred/child-portrait.jpg': sacredPortrait,
  'asset:curated/sacred/gallery-1.jpg': sacredGallery1,
  'asset:curated/sacred/gallery-2.jpg': sacredGallery2,
  'asset:curated/sacred/gallery-3.jpg': sacredGallery3,
  'asset:curated/sacred/gallery-4.jpg': sacredGallery4,
  'asset:curated/sacred/gallery-5.jpg': sacredGallery5,
  'asset:curated/birthday/portrait.jpg': birthdayPortrait,
  'asset:curated/birthday/venue.jpg': birthdayVenue,
  'asset:curated/birthday/gallery-1.jpg': birthdayGallery1,
  'asset:curated/birthday/gallery-2.jpg': birthdayGallery2,
  'asset:curated/birthday/gallery-3.jpg': birthdayGallery3,
  'asset:curated/birthday/gallery-4.jpg': birthdayGallery4,
  'asset:curated/birthday/gallery-5.jpg': birthdayGallery5,
  'asset:curated/ivory/hero.jpg': ivoryHero,
  'asset:curated/ivory/church.jpg': ivoryChurch,
  'asset:curated/ivory/hall.jpg': ivoryHall,
  'asset:curated/ivory/gallery-1.jpg': ivoryGallery1,
  'asset:curated/ivory/gallery-2.jpg': ivoryGallery2,
  'asset:curated/ivory/gallery-3.jpg': ivoryGallery3,
  'asset:curated/ivory/gallery-4.jpg': ivoryGallery4
};

export const templateDefaultGalleryIds = {
  'sacred-beginnings': [
    'asset:curated/sacred/child-portrait.jpg',
    'asset:curated/sacred/gallery-1.jpg',
    'asset:curated/sacred/gallery-2.jpg',
    'asset:curated/sacred/gallery-3.jpg',
    'asset:curated/sacred/gallery-4.jpg',
    'asset:curated/sacred/gallery-5.jpg'
  ],
  'birthday-sparkle': [
    'asset:curated/birthday/portrait.jpg',
    'asset:curated/birthday/venue.jpg',
    'asset:curated/birthday/gallery-1.jpg',
    'asset:curated/birthday/gallery-2.jpg',
    'asset:curated/birthday/gallery-3.jpg',
    'asset:curated/birthday/gallery-4.jpg',
    'asset:curated/birthday/gallery-5.jpg'
  ],
  'ivory-vows': [
    'asset:curated/ivory/hero.jpg',
    'asset:curated/ivory/church.jpg',
    'asset:curated/ivory/hall.jpg',
    'asset:curated/ivory/gallery-1.jpg',
    'asset:curated/ivory/gallery-2.jpg',
    'asset:curated/ivory/gallery-3.jpg',
    'asset:curated/ivory/gallery-4.jpg'
  ]
};

export const resolveTemplateImage = (image) => templateAssetSources[image] || image;

export const resolveTemplateImages = (images = []) => images
  .map(resolveTemplateImage)
  .filter((image) => typeof image === 'string' && image.trim());

export const getConfiguredTemplateGallery = (template = {}, fallbackGallery = []) => {
  const configuredGallery = Array.isArray(template.gallery) ? template.gallery : [];
  if (template.galleryConfigured === true) {
    return [...new Set(resolveTemplateImages([...configuredGallery, ...fallbackGallery]))];
  }

  return resolveTemplateImages([
    template.mainImage,
    ...configuredGallery,
    ...fallbackGallery
  ]);
};
