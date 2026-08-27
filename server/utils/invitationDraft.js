import { PUBLIC_DESIGN_KEYS as TEMPLATE_PUBLIC_DESIGN_KEYS } from './templateDesign.js';

export const metadataText = (value, fallback = '', limit = 420) =>
  String(value ?? fallback ?? '').trim().slice(0, limit);

export const uniqueImages = (images = []) => [...new Set(
  images.filter((image) => typeof image === 'string' && image.trim())
)];

export const isAllowedImage = (image) => (
  /^(https?:\/\/|\/|asset:)/.test(image)
  || /^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(image)
) && image.length < 2500000;

const allowedImageFilters = new Set(['none', 'warm', 'soft', 'sepia', 'cool', 'cinema', 'vintage', 'mono', 'contrast']);
const allowedButtonPresets = new Set(Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0')));
const allowedButtonRadii = new Set(['square', 'xs', 'sm', 'md', 'lg', 'pill']);
const allowedAlignments = new Set(['left', 'center', 'right']);
const allowedVenueIcons = new Set(['location', 'church', 'home', 'party', 'photo']);
const allowedFontFamilies = new Set([
  'inherit',
  'Arial Armenian, Arial, sans-serif',
  'Georgia, Times New Roman, serif',
  'SHK Dzeragir, cursive'
]);

export const isAllowedMusic = (music) => (
  /^(?:https?:\/\/|\/(?!\/))/.test(String(music || ''))
  || /^data:audio\/(?:mpeg|mp3|wav|ogg|mp4|x-m4a);base64,/i.test(String(music || ''))
) && String(music || '').length < 7200000;

const normalizedSecond = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(3600, Math.max(0, number)) : 0;
};

export const isHexColor = (value) => /^#[0-9a-f]{6}$/i.test(String(value || '').trim());

export const normalizeMapUrl = (value) => {
  const input = String(value || '').trim();
  if (!input) return '';
  const markdownMatch = input.match(/^\s*\[[^\]]*\]\(\s*(https?:\/\/[^\s)]+)(?:\s+["'][^"']*["'])?\s*\)\s*$/i);
  const candidate = (markdownMatch?.[1] || input).replace(/^<|>$/g, '').trim();
  try {
    const url = new URL(candidate);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
};

export const normalizeMapLinks = (source) => {
  const links = Array.isArray(source?.mapLinks) ? source.mapLinks : [];
  const normalized = links
    .map((item, index) => {
      const requestedUrl = normalizeMapUrl(metadataText(item?.url, '', 600));
      return {
        label: metadataText(item?.label, `Map ${index + 1}`, 80),
        time: metadataText(item?.time, '', 24),
        address: metadataText(item?.address, '', 180),
        url: requestedUrl,
        subtitle: metadataText(item?.subtitle, '', 120),
        icon: allowedVenueIcons.has(item?.icon) ? item.icon : 'location',
        visible: item?.visible !== false
      };
    })
    .filter((item) => item.label || item.time || item.address || /^https?:\/\//.test(item.url));

  const mapLink = normalizeMapUrl(metadataText(source?.mapLink, '', 600));
  if (mapLink && !normalized.some((item) => item.url === mapLink)) {
    normalized.unshift({ label: 'Map', time: '', address: '', url: mapLink, subtitle: '', icon: 'location', visible: true });
  }
  return normalized.slice(0, 20);
};

export const normalizeColors = (source = {}) => ({
  accent: isHexColor(source.accent) ? source.accent : '#d8b98e',
  text: isHexColor(source.text) ? source.text : '#ffffff',
  overlay: isHexColor(source.overlay) ? source.overlay : '#202020'
});

export const normalizeDressCodeColors = (source = []) => (Array.isArray(source) ? source : [])
  .slice(0, 16)
  .map((color, index) => ({
    name: metadataText(color?.name, `Color ${index + 1}`, 60),
    hex: isHexColor(color?.hex) ? String(color.hex).toLowerCase() : '#d8b98e'
  }));

const normalizeTextStyle = (source = {}) => ({
  fontFamily: allowedFontFamilies.has(source.fontFamily) ? source.fontFamily : 'inherit',
  fontSize: Math.min(120, Math.max(0, Number(source.fontSize) || 0)),
  fontWeight: [300, 400, 500, 600, 700].includes(Number(source.fontWeight)) ? Number(source.fontWeight) : 400,
  color: isHexColor(source.color) ? source.color : '',
  lineHeight: Math.min(2, Math.max(.7, Number(source.lineHeight) || 1.05)),
  letterSpacing: Math.min(16, Math.max(-4, Number(source.letterSpacing) || 0)),
  align: allowedAlignments.has(source.align) ? source.align : 'center',
  italic: source.italic === true,
  uppercase: source.uppercase === true
});

export const normalizeTextStyles = (source = {}) => ({ names: normalizeTextStyle(source.names) });

export const normalizeButtonDesign = (source = {}) => ({
  preset: allowedButtonPresets.has(source.preset) ? source.preset : '01',
  radius: allowedButtonRadii.has(source.radius) ? source.radius : 'pill'
});

const normalizeTemplateTextOverrides = (source = {}) => Object.fromEntries(
  Object.entries(source && typeof source === 'object' ? source : {})
    .filter(([key, value]) => /^text-\d+$/.test(key) && typeof value === 'string')
    .slice(0, 500)
    .map(([key, value]) => [key, value.slice(0, 1200)])
);

const normalizeTemplateImageOverrides = (source = {}) => Object.fromEntries(
  Object.entries(source && typeof source === 'object' ? source : {})
    .filter(([key, value]) => /^image-\d+$/.test(key) && (value === '' || (typeof value === 'string' && isAllowedImage(value))))
    .slice(0, 100)
);

export const normalizeRsvpSettings = (source = {}) => ({
  title: metadataText(source.title, 'Confirm your attendance', 140),
  description: metadataText(source.description, '', 320),
  guestPlaceholder: metadataText(source.guestPlaceholder, 'Name', 100),
  attendingLabel: metadataText(source.attendingLabel, 'Attending', 100),
  notAttendingLabel: metadataText(source.notAttendingLabel, 'Not attending', 100),
  submitLabel: metadataText(source.submitLabel, 'Submit', 80),
  deadline: metadataText(source.deadline, '', 32),
  askGuestCount: source.askGuestCount !== false,
  askMeal: source.askMeal === true
});

// Keep preview/purchase validation on the same canonical list used by the
// catalog. New public designs must not require a second allow-list update.
export const PUBLIC_DESIGN_KEYS = TEMPLATE_PUBLIC_DESIGN_KEYS;

export const normalizeDraft = (draft, template) => {
  const source = draft && typeof draft === 'object' ? draft : {};
  const sourceGallery = Array.isArray(source.gallery) ? source.gallery : [];
  const templateImage = template.mainImage || template.gallery?.[0] || '';
  const requestedImage = String(source.image || '').trim();
  const image = isAllowedImage(requestedImage)
    ? requestedImage
    : (isAllowedImage(templateImage) ? templateImage : '');
  const gallery = uniqueImages([image, ...sourceGallery, templateImage]).filter(isAllowedImage).slice(0, 10);
  const mapLinks = normalizeMapLinks(source);
  const requestedMusic = String(source.musicUrl || '').trim();

  return {
    mainNames: metadataText(source.mainNames, template.title, 120),
    eventDate: metadataText(source.eventDate, '', 32),
    eventTime: metadataText(source.eventTime, '18:00', 24),
    eventLocation: metadataText(source.eventLocation, 'Yerevan, Armenia', 180),
    mapLink: mapLinks[0]?.url || '',
    mapLinks,
    eventMessage: metadataText(source.eventMessage, template.description, 420),
    image,
    gallery,
    colors: normalizeColors(source.colors),
    colorPaletteId: metadataText(source.colorPaletteId, '', 80),
    imageFilter: allowedImageFilters.has(source.imageFilter) ? source.imageFilter : 'none',
    musicEnabled: source.musicEnabled !== false,
    musicUrl: isAllowedMusic(requestedMusic) ? requestedMusic : '',
    musicTitle: metadataText(source.musicTitle, '', 160),
    musicStart: normalizedSecond(source.musicStart),
    musicEnd: normalizedSecond(source.musicEnd),
    textStyles: normalizeTextStyles(source.textStyles),
    buttonDesign: normalizeButtonDesign(source.buttonDesign),
    templateTextOverrides: normalizeTemplateTextOverrides(source.templateTextOverrides),
    templateImageOverrides: normalizeTemplateImageOverrides(source.templateImageOverrides),
    rsvpSettings: normalizeRsvpSettings(source.rsvpSettings),
    dressCodeColors: normalizeDressCodeColors(source.dressCodeColors),
    groomFamilyTitle: metadataText(source.groomFamilyTitle, '', 120),
    brideFamilyTitle: metadataText(source.brideFamilyTitle, '', 120),
    rsvpQuestion: metadataText(source.rsvpQuestion, '', 240),
    dressCode: metadataText(source.dressCode, '', 300),
    closingMessage: metadataText(source.closingMessage, '', 420),
    heroVisible: source.heroVisible !== false,
    familyVisible: source.familyVisible !== false,
    openingVisible: source.openingVisible !== false,
    receptionVisible: source.receptionVisible !== false,
    questionsVisible: source.questionsVisible !== false,
    dressCodeVisible: source.dressCodeVisible === true,
    finalMessageVisible: source.finalMessageVisible !== false
  };
};

export const invitationCustomization = (draft = {}) => ({
  groomFamilyTitle: draft.groomFamilyTitle || '',
  brideFamilyTitle: draft.brideFamilyTitle || '',
  rsvpQuestion: draft.rsvpQuestion || '',
  dressCode: draft.dressCode || '',
  closingMessage: draft.closingMessage || '',
  imageFilter: allowedImageFilters.has(draft.imageFilter) ? draft.imageFilter : 'none',
  musicEnabled: draft.musicEnabled !== false,
  musicUrl: isAllowedMusic(draft.musicUrl) ? draft.musicUrl : '',
  musicTitle: metadataText(draft.musicTitle, '', 160),
  musicStart: normalizedSecond(draft.musicStart),
  musicEnd: normalizedSecond(draft.musicEnd),
  textStyles: normalizeTextStyles(draft.textStyles),
  buttonDesign: normalizeButtonDesign(draft.buttonDesign),
  templateTextOverrides: normalizeTemplateTextOverrides(draft.templateTextOverrides),
  templateImageOverrides: normalizeTemplateImageOverrides(draft.templateImageOverrides),
  rsvpSettings: normalizeRsvpSettings(draft.rsvpSettings),
  dressCodeColors: normalizeDressCodeColors(draft.dressCodeColors),
  heroVisible: draft.heroVisible !== false,
  familyVisible: draft.familyVisible !== false,
  openingVisible: draft.openingVisible !== false,
  receptionVisible: draft.receptionVisible !== false,
  questionsVisible: draft.questionsVisible !== false,
  dressCodeVisible: draft.dressCodeVisible === true,
  finalMessageVisible: draft.finalMessageVisible !== false
});
