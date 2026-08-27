import sacredBeginningsPage from '../assets/template-page-previews/sacred-beginnings.png';
import ivoryVowsPage from '../assets/template-page-previews/ivory-vows.png';
import birthdaySparklePage from '../assets/template-page-previews/birthday-sparkle.png';
import birthdaySpacePage from '../vendorTemplates/cnund1/src/assets/final-reference.png';
import birthdayWatercolorPage from '../vendorTemplates/cnund2/src/assets/images/background.png';
import birthdayCrimsonPage from '../vendorTemplates/cnund3/src/assets/images/cocktails.png';

const previews = {
  'sacred-beginnings': sacredBeginningsPage,
  'sacred-beginnings-invitation': sacredBeginningsPage,
  'ivory-vows': ivoryVowsPage,
  'amulet-ivory-vows': ivoryVowsPage,
  'birthday-sparkle': birthdaySparklePage,
  'birthday-sparkle-suite': birthdaySparklePage,
  'birthday-space': birthdaySpacePage,
  'space-birthday': birthdaySpacePage,
  'cnund1': birthdaySpacePage,
  'birthday-watercolor': birthdayWatercolorPage,
  'watercolor-birthday': birthdayWatercolorPage,
  'cnund2': birthdayWatercolorPage,
  'birthday-crimson': birthdayCrimsonPage,
  'emma-birthday': birthdayCrimsonPage,
  'cnund3': birthdayCrimsonPage
};

const normalize = (value) => String(value || '').trim().toLowerCase();

export const getTemplatePagePreview = (template) => (
  template?.pagePreviewImage
  || previews[normalize(template?.designKey)]
  || previews[normalize(template?.slug)]
  || ''
);
