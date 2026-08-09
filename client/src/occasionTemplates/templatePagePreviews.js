import sacredBeginningsPage from '../assets/template-page-previews/sacred-beginnings.png';
import ivoryVowsPage from '../assets/template-page-previews/ivory-vows.png';
import birthdaySparklePage from '../assets/template-page-previews/birthday-sparkle.png';

const previews = {
  'sacred-beginnings': sacredBeginningsPage,
  'sacred-beginnings-invitation': sacredBeginningsPage,
  'ivory-vows': ivoryVowsPage,
  'amulet-ivory-vows': ivoryVowsPage,
  'birthday-sparkle': birthdaySparklePage,
  'birthday-sparkle-suite': birthdaySparklePage
};

const normalize = (value) => String(value || '').trim().toLowerCase();

export const getTemplatePagePreview = (template) => (
  previews[normalize(template?.designKey)] || previews[normalize(template?.slug)] || ''
);
