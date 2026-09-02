export const TEMPLATE_DESIGN_CATEGORIES = Object.freeze({
  'sacred-beginnings': 'baptism',
  'birthday-sparkle': 'birth',
  'birthday-space': 'birth',
  'birthday-watercolor': 'birth',
  'birthday-crimson': 'birth',
  'army-ceremonial': 'military',
  'army-camouflage': 'military',
  'ivory-vows': 'wedding',
  'divine-blessing': 'baptism',
  'elevate-invite': 'corporate',
  'everlasting-vows': 'wedding',
  'forever-vows': 'engagement',
  'silk-vows': 'wedding',
  'burgundy-roadmap': 'wedding',
  'monochrome-envelope': 'wedding',
  'love-map-wedding': 'wedding',
  'angelic-baptism': 'baptism',
  'polaroid-engagement': 'engagement',
  'golden-heart-engagement': 'engagement',
  'cinematic-engagement': 'engagement',
  'last-bell': 'corporate'
});

export const PUBLIC_DESIGN_KEYS = Object.freeze(Object.keys(TEMPLATE_DESIGN_CATEGORIES));

export const templateCategoryForDesign = (designKey) => TEMPLATE_DESIGN_CATEGORIES[designKey] || null;

const EDITOR_TYPES = new Set(['wedding', 'baptism', 'birth', 'corporate', 'engagement', 'military']);

export const templateEditorTypeForCategory = (category) => (
  EDITOR_TYPES.has(category) ? category : 'corporate'
);
