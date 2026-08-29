import sacredBeginnings from '../assets/template-card-thumbnails/sacred-beginnings.webp';
import birthdaySparkle from '../assets/template-card-thumbnails/birthday-sparkle.webp';
import birthdaySpace from '../assets/template-card-thumbnails/birthday-space.webp';
import birthdayWatercolor from '../assets/template-card-thumbnails/birthday-watercolor.webp';
import birthdayCrimson from '../assets/template-card-thumbnails/birthday-crimson.webp';
import ivoryVows from '../assets/template-card-thumbnails/ivory-vows.webp';
import divineBlessing from '../assets/template-card-thumbnails/divine-blessing.webp';
import elevateInvite from '../assets/template-card-thumbnails/elevate-invite.webp';
import everlastingVows from '../assets/template-card-thumbnails/everlasting-vows.webp';
import foreverVows from '../assets/template-card-thumbnails/forever-vows.webp';
import silkVows from '../assets/template-card-thumbnails/silk-vows.webp';
import burgundyRoadmap from '../assets/template-card-thumbnails/burgundy-roadmap.webp';
import monochromeEnvelope from '../assets/template-card-thumbnails/monochrome-envelope.webp';
import loveMapWedding from '../assets/template-card-thumbnails/love-map-wedding.webp';
import angelicBaptism from '../assets/template-card-thumbnails/angelic-baptism.webp';
import polaroidEngagement from '../assets/template-card-thumbnails/polaroid-engagement.webp';
import goldenHeartEngagement from '../assets/template-card-thumbnails/golden-heart-engagement.webp';
import cinematicEngagement from '../assets/template-card-thumbnails/cinematic-engagement.webp';
import lastBell from '../assets/template-card-thumbnails/last-bell.webp';

const cardImages = {
  'sacred-beginnings': sacredBeginnings,
  'birthday-sparkle': birthdaySparkle,
  'birthday-space': birthdaySpace,
  'birthday-watercolor': birthdayWatercolor,
  'birthday-crimson': birthdayCrimson,
  'ivory-vows': ivoryVows,
  'divine-blessing': divineBlessing,
  'elevate-invite': elevateInvite,
  'everlasting-vows': everlastingVows,
  'forever-vows': foreverVows,
  'silk-vows': silkVows,
  'burgundy-roadmap': burgundyRoadmap,
  'monochrome-envelope': monochromeEnvelope,
  'love-map-wedding': loveMapWedding,
  'angelic-baptism': angelicBaptism,
  'polaroid-engagement': polaroidEngagement,
  'golden-heart-engagement': goldenHeartEngagement,
  'cinematic-engagement': cinematicEngagement,
  'last-bell': lastBell,
  'asset:curated/sacred/child-portrait.jpg': sacredBeginnings,
  'asset:curated/birthday/portrait.jpg': birthdaySparkle,
  'asset:curated/birthday-space/final-reference.png': birthdaySpace,
  'asset:curated/birthday-watercolor/background.png': birthdayWatercolor,
  'asset:curated/birthday-crimson/cocktails.png': birthdayCrimson,
  'asset:curated/ivory/hero.jpg': ivoryVows,
  'asset:curated/divine/baby-1.jpg': divineBlessing,
  'asset:curated/elevate/hero-bg.jpg': elevateInvite,
  'asset:curated/everlasting/hero.jpg': everlastingVows,
  'asset:curated/forever-vows/engagement-smile.jpg': foreverVows,
  'asset:curated/silk-vows/hero.jpg': silkVows,
  'asset:curated/burgundy-roadmap/hero.jpg': burgundyRoadmap,
  'asset:curated/monochrome-envelope/hero.jpg': monochromeEnvelope,
  'asset:curated/love-map-wedding/couple-one.jpg': loveMapWedding,
  'asset:curated/angelic-baptism/baby.jpg': angelicBaptism,
  'asset:curated/polaroid-engagement/couple-1.jpg': polaroidEngagement,
  'asset:curated/golden-heart-engagement/couple-mountain.jpg': goldenHeartEngagement,
  'asset:curated/cinematic-engagement/couple-1.jpg': cinematicEngagement,
  'asset:curated/last-bell/bell-photo.jpg': lastBell
};

export const resolveTemplateCardImage = (image, fallback = '') => cardImages[image] || fallback || image;
