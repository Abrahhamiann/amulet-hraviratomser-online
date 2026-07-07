import slugify from 'slugify';

export const makeSlug = (value) =>
  slugify(value || Date.now().toString(), {
    lower: true,
    strict: true,
    trim: true,
    locale: 'en'
  });
