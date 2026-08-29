const normalizeTemplateKey = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/[_\s]+/g, '-')
  .replace(/[^a-z0-9-]/g, '')
  .replace(/-+/g, '-');

const originalModule = () => import('./OriginalTypeScriptTemplates.tsx');
const importedBatchModule = () => import('./ImportedBatchTemplates.tsx');

const definitions = [
  ['sacred-beginnings', ['sacred-beginnings-invitation', 'sacred-baptism'], originalModule, 'SacredBeginnings'],
  ['birthday-sparkle', ['birthday-sparkle-suite', 'sparkle-birthday'], originalModule, 'BirthdaySparkle'],
  ['birthday-space', ['space-birthday', 'cnund1'], () => import('./BirthdaySpaceTemplate.jsx'), 'BirthdaySpace'],
  ['birthday-watercolor', ['watercolor-birthday', 'cnund2'], () => import('./BirthdayWatercolorTemplate.jsx'), 'BirthdayWatercolor'],
  ['birthday-crimson', ['emma-birthday', 'cnund3'], () => import('./BirthdayCrimsonTemplate.jsx'), 'BirthdayCrimson'],
  ['ivory-vows', ['amulet-ivory-vows', 'ivory-wedding'], originalModule, 'IvoryVows'],
  ['divine-blessing', ['divine-blessing-baptism'], originalModule, 'DivineBlessing'],
  ['elevate-invite', ['elevate-corporate'], originalModule, 'ElevateInvite'],
  ['everlasting-vows', ['everlasting-vows-wedding'], originalModule, 'EverlastingVows'],
  ['forever-vows', ['forever-vows-engagement', 'forever-vows-invitation'], originalModule, 'ForeverVows'],
  ['silk-vows', ['silk-vows-wedding', 'armenian-wedding-invitation'], originalModule, 'SilkVows'],
  ['burgundy-roadmap', ['burgundy-roadmap-wedding', 'wedding-burgundy-roadmap'], originalModule, 'BurgundyRoadmap'],
  ['monochrome-envelope', ['monochrome-envelope-wedding', 'harsaniq2'], originalModule, 'MonochromeEnvelope'],
  ['love-map-wedding', ['harsaniq4'], importedBatchModule, 'LoveMapWedding'],
  ['angelic-baptism', ['knunq1'], importedBatchModule, 'AngelicBaptism'],
  ['polaroid-engagement', ['nshanadrutyun1'], importedBatchModule, 'PolaroidEngagement'],
  ['golden-heart-engagement', ['nshanadrutyun2'], importedBatchModule, 'GoldenHeartEngagement'],
  ['cinematic-engagement', ['nshanadrutyun3'], importedBatchModule, 'CinematicEngagement'],
  ['last-bell', ['verjin-zang-1'], importedBatchModule, 'LastBell']
].map(([key, aliases, loadModule, exportPrefix]) => ({
  key,
  aliases: [key, ...aliases],
  loadModule,
  exportPrefix
}));

const findDefinition = (template) => {
  const candidates = [template?.designKey, template?.slug, template?.title]
    .map(normalizeTemplateKey)
    .filter(Boolean);
  return definitions.find((definition) => (
    candidates.some((candidate) => definition.aliases.includes(candidate))
  )) || null;
};

const loadedTemplates = new Map();

export const isSupportedOccasionTemplate = (template) => Boolean(findDefinition(template));

export const loadOccasionTemplate = async (template) => {
  const definition = findDefinition(template);
  if (!definition) return null;
  if (loadedTemplates.has(definition.key)) return loadedTemplates.get(definition.key);

  const promise = definition.loadModule().then((module) => ({
    key: definition.key,
    LivePreview: module[`${definition.exportPrefix}LivePreview`] || null,
    PublicView: module[`${definition.exportPrefix}InvitationView`] || null,
    getInitialDraft: module[`get${definition.exportPrefix}Draft`] || null
  })).catch((error) => {
    loadedTemplates.delete(definition.key);
    throw error;
  });
  loadedTemplates.set(definition.key, promise);
  return promise;
};

export const preloadOccasionTemplate = (template) => {
  if (!isSupportedOccasionTemplate(template)) return Promise.resolve(null);
  return loadOccasionTemplate(template).catch(() => null);
};
