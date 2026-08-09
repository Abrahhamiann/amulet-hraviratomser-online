import {
  BirthdaySparkleCardPreview,
  BirthdaySparkleInvitationView,
  BirthdaySparkleLivePreview,
  getBirthdaySparkleDraft,
  getIvoryVowsDraft,
  getSacredBeginningsDraft,
  isBirthdaySparkleTemplate,
  isIvoryVowsTemplate,
  isSacredBeginningsTemplate,
  IvoryVowsCardPreview,
  IvoryVowsInvitationView,
  IvoryVowsLivePreview,
  SacredBeginningsCardPreview,
  SacredBeginningsInvitationView,
  SacredBeginningsLivePreview
} from './OriginalTypeScriptTemplates.tsx';

export const availableOccasionTemplates = [
  { key: 'sacred-beginnings', label: 'Սուրբ սկիզբ · մկրտություն' },
  { key: 'birthday-sparkle', label: 'Փայլուն տարեդարձ' },
  { key: 'ivory-vows', label: 'Փղոսկրե երդումներ · հարսանիք' }
];

const normalizeTemplateKey = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/[_\s]+/g, '-')
  .replace(/[^a-z0-9-]/g, '')
  .replace(/-+/g, '-');

export const occasionTemplates = [
  {
    key: 'sacred-beginnings',
    aliases: ['sacred-beginnings', 'sacred-beginnings-invitation', 'sacred-baptism'],
    match: isSacredBeginningsTemplate,
    CardPreview: SacredBeginningsCardPreview,
    LivePreview: SacredBeginningsLivePreview,
    PublicView: SacredBeginningsInvitationView,
    getInitialDraft: getSacredBeginningsDraft
  },
  {
    key: 'birthday-sparkle',
    aliases: ['birthday-sparkle', 'birthday-sparkle-suite', 'sparkle-birthday'],
    match: isBirthdaySparkleTemplate,
    CardPreview: BirthdaySparkleCardPreview,
    LivePreview: BirthdaySparkleLivePreview,
    PublicView: BirthdaySparkleInvitationView,
    getInitialDraft: getBirthdaySparkleDraft
  },
  {
    key: 'ivory-vows',
    aliases: ['ivory-vows', 'amulet-ivory-vows', 'ivory-wedding'],
    match: isIvoryVowsTemplate,
    CardPreview: IvoryVowsCardPreview,
    LivePreview: IvoryVowsLivePreview,
    PublicView: IvoryVowsInvitationView,
    getInitialDraft: getIvoryVowsDraft
  }
];

export const getOccasionTemplate = (template) => {
  const designKey = normalizeTemplateKey(template?.designKey);
  const slug = normalizeTemplateKey(template?.slug);
  const title = normalizeTemplateKey(template?.title);
  const candidates = [designKey, slug, title].filter(Boolean);

  return (
    occasionTemplates.find((item) => {
      const aliases = [item.key, ...(item.aliases || [])].map(normalizeTemplateKey);
      return candidates.some((candidate) => aliases.includes(candidate));
    }) ||
    occasionTemplates.find((item) => item.match(template)) ||
    null
  );
};
