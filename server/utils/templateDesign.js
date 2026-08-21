export const TEMPLATE_DESIGN_CATEGORIES = Object.freeze({
  'sacred-beginnings': 'baptism',
  'birthday-sparkle': 'birth',
  'ivory-vows': 'wedding',
  'divine-blessing': 'baptism',
  'elevate-invite': 'corporate',
  'everlasting-vows': 'wedding'
});

export const PUBLIC_DESIGN_KEYS = Object.freeze(Object.keys(TEMPLATE_DESIGN_CATEGORIES));

export const templateCategoryForDesign = (designKey) => TEMPLATE_DESIGN_CATEGORIES[designKey] || null;
