import {
  BirthdaySparkleCardPreview,
  BirthdaySparkleInvitationView,
  BirthdaySparkleLivePreview,
  DivineBlessingCardPreview,
  DivineBlessingInvitationView,
  DivineBlessingLivePreview,
  ElevateInviteCardPreview,
  ElevateInviteInvitationView,
  ElevateInviteLivePreview,
  EverAfterCardPreview,
  EverAfterInvitationView,
  EverAfterLivePreview,
  EverlastingVowsCardPreview,
  EverlastingVowsInvitationView,
  EverlastingVowsLivePreview,
  getBirthdaySparkleDraft,
  getDivineBlessingDraft,
  getElevateInviteDraft,
  getEverAfterDraft,
  getEverlastingVowsDraft,
  getIvoryVowsDraft,
  getSacredBeginningsDraft,
  isBirthdaySparkleTemplate,
  isDivineBlessingTemplate,
  isElevateInviteTemplate,
  isEverAfterTemplate,
  isEverlastingVowsTemplate,
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
  { key: 'ivory-vows', label: 'Փղոսկրե երդումներ · հարսանիք' },
  { key: 'divine-blessing', label: 'Աստվածային օրհնություն · մկրտություն' },
  { key: 'elevate-invite', label: 'Վերելք · կորպորատիվ միջոցառում' },
  { key: 'ever-after', label: 'Եվ ապրեցին երջանիկ · նշանադրություն' },
  { key: 'everlasting-vows', label: 'Հավերժական երդումներ · հարսանիք' }
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
  },
  {
    key: 'divine-blessing',
    aliases: ['divine-blessing', 'divine-blessing-baptism'],
    match: isDivineBlessingTemplate,
    CardPreview: DivineBlessingCardPreview,
    LivePreview: DivineBlessingLivePreview,
    PublicView: DivineBlessingInvitationView,
    getInitialDraft: getDivineBlessingDraft
  },
  {
    key: 'elevate-invite',
    aliases: ['elevate-invite', 'elevate-corporate'],
    match: isElevateInviteTemplate,
    CardPreview: ElevateInviteCardPreview,
    LivePreview: ElevateInviteLivePreview,
    PublicView: ElevateInviteInvitationView,
    getInitialDraft: getElevateInviteDraft
  },
  {
    key: 'ever-after',
    aliases: ['ever-after', 'ever-after-engagement'],
    match: isEverAfterTemplate,
    CardPreview: EverAfterCardPreview,
    LivePreview: EverAfterLivePreview,
    PublicView: EverAfterInvitationView,
    getInitialDraft: getEverAfterDraft
  },
  {
    key: 'everlasting-vows',
    aliases: ['everlasting-vows', 'everlasting-vows-wedding'],
    match: isEverlastingVowsTemplate,
    CardPreview: EverlastingVowsCardPreview,
    LivePreview: EverlastingVowsLivePreview,
    PublicView: EverlastingVowsInvitationView,
    getInitialDraft: getEverlastingVowsDraft
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
