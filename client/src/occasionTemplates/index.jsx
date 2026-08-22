import {
  BirthdaySparkleCardPreview,
  BirthdaySparkleInvitationView,
  BirthdaySparkleLivePreview,
  BurgundyRoadmapCardPreview,
  BurgundyRoadmapInvitationView,
  BurgundyRoadmapLivePreview,
  DivineBlessingCardPreview,
  DivineBlessingInvitationView,
  DivineBlessingLivePreview,
  ElevateInviteCardPreview,
  ElevateInviteInvitationView,
  ElevateInviteLivePreview,
  EverlastingVowsCardPreview,
  EverlastingVowsInvitationView,
  EverlastingVowsLivePreview,
  ForeverVowsCardPreview,
  ForeverVowsInvitationView,
  ForeverVowsLivePreview,
  getBirthdaySparkleDraft,
  getBurgundyRoadmapDraft,
  getDivineBlessingDraft,
  getElevateInviteDraft,
  getEverlastingVowsDraft,
  getForeverVowsDraft,
  getIvoryVowsDraft,
  getSacredBeginningsDraft,
  getSilkVowsDraft,
  isBirthdaySparkleTemplate,
  isBurgundyRoadmapTemplate,
  isDivineBlessingTemplate,
  isElevateInviteTemplate,
  isEverlastingVowsTemplate,
  isForeverVowsTemplate,
  isIvoryVowsTemplate,
  isSacredBeginningsTemplate,
  isSilkVowsTemplate,
  IvoryVowsCardPreview,
  IvoryVowsInvitationView,
  IvoryVowsLivePreview,
  SacredBeginningsCardPreview,
  SacredBeginningsInvitationView,
  SacredBeginningsLivePreview,
  SilkVowsCardPreview,
  SilkVowsInvitationView,
  SilkVowsLivePreview
} from './OriginalTypeScriptTemplates.tsx';

export const availableOccasionTemplates = [
  { key: 'sacred-beginnings', label: 'Սուրբ սկիզբ · մկրտություն' },
  { key: 'birthday-sparkle', label: 'Փայլուն տարեդարձ' },
  { key: 'ivory-vows', label: 'Փղոսկրե երդումներ · հարսանիք' },
  { key: 'divine-blessing', label: 'Աստվածային օրհնություն · մկրտություն' },
  { key: 'elevate-invite', label: 'Վերելք · կորպորատիվ միջոցառում' },
  { key: 'everlasting-vows', label: 'Հավերժական երդումներ · հարսանիք' },
  { key: 'forever-vows', label: 'Forever Vows · նշանադրություն' },
  { key: 'silk-vows', label: 'Մետաքսե երդումներ · հարսանիք' },
  { key: 'burgundy-roadmap', label: 'Գինեգույն ճանապարհ · հարսանիք' }
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
    key: 'everlasting-vows',
    aliases: ['everlasting-vows', 'everlasting-vows-wedding'],
    match: isEverlastingVowsTemplate,
    CardPreview: EverlastingVowsCardPreview,
    LivePreview: EverlastingVowsLivePreview,
    PublicView: EverlastingVowsInvitationView,
    getInitialDraft: getEverlastingVowsDraft
  },
  {
    key: 'forever-vows',
    aliases: ['forever-vows', 'forever-vows-engagement', 'forever-vows-invitation'],
    match: isForeverVowsTemplate,
    CardPreview: ForeverVowsCardPreview,
    LivePreview: ForeverVowsLivePreview,
    PublicView: ForeverVowsInvitationView,
    getInitialDraft: getForeverVowsDraft
  },
  {
    key: 'silk-vows',
    aliases: ['silk-vows', 'silk-vows-wedding', 'armenian-wedding-invitation'],
    match: isSilkVowsTemplate,
    CardPreview: SilkVowsCardPreview,
    LivePreview: SilkVowsLivePreview,
    PublicView: SilkVowsInvitationView,
    getInitialDraft: getSilkVowsDraft
  },
  {
    key: 'burgundy-roadmap',
    aliases: ['burgundy-roadmap', 'burgundy-roadmap-wedding', 'wedding-burgundy-roadmap'],
    match: isBurgundyRoadmapTemplate,
    CardPreview: BurgundyRoadmapCardPreview,
    LivePreview: BurgundyRoadmapLivePreview,
    PublicView: BurgundyRoadmapInvitationView,
    getInitialDraft: getBurgundyRoadmapDraft
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
