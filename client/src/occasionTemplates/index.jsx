import {
  BirthdaySparkleCardPreview,
  BirthdaySparkleInvitationView,
  BirthdaySparkleLivePreview,
  BurgundyRoadmapCardPreview,
  BurgundyRoadmapInvitationView,
  BurgundyRoadmapLivePreview,
  MonochromeEnvelopeCardPreview,
  MonochromeEnvelopeInvitationView,
  MonochromeEnvelopeLivePreview,
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
  getMonochromeEnvelopeDraft,
  getDivineBlessingDraft,
  getElevateInviteDraft,
  getEverlastingVowsDraft,
  getForeverVowsDraft,
  getIvoryVowsDraft,
  getSacredBeginningsDraft,
  getSilkVowsDraft,
  isBirthdaySparkleTemplate,
  isBurgundyRoadmapTemplate,
  isMonochromeEnvelopeTemplate,
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
import {
  BirthdaySpaceCardPreview,
  BirthdaySpaceInvitationView,
  BirthdaySpaceLivePreview,
  getBirthdaySpaceDraft,
  isBirthdaySpaceTemplate
} from './BirthdaySpaceTemplate.jsx';
import {
  BirthdayWatercolorCardPreview,
  BirthdayWatercolorInvitationView,
  BirthdayWatercolorLivePreview,
  getBirthdayWatercolorDraft,
  isBirthdayWatercolorTemplate
} from './BirthdayWatercolorTemplate.jsx';
import {
  BirthdayCrimsonCardPreview,
  BirthdayCrimsonInvitationView,
  BirthdayCrimsonLivePreview,
  getBirthdayCrimsonDraft,
  isBirthdayCrimsonTemplate
} from './BirthdayCrimsonTemplate.jsx';
import {
  ArmyCamouflageCardPreview,
  ArmyCamouflageInvitationView,
  ArmyCamouflageLivePreview,
  ArmyCeremonialCardPreview,
  ArmyCeremonialInvitationView,
  ArmyCeremonialLivePreview,
  getArmyCamouflageDraft,
  getArmyCeremonialDraft,
  isArmyCamouflageTemplate,
  isArmyCeremonialTemplate
} from './ArmyInvitationTemplates.jsx';
import {
  AngelicBaptismCardPreview,
  AngelicBaptismInvitationView,
  AngelicBaptismLivePreview,
  CinematicEngagementCardPreview,
  CinematicEngagementInvitationView,
  CinematicEngagementLivePreview,
  GoldenHeartEngagementCardPreview,
  GoldenHeartEngagementInvitationView,
  GoldenHeartEngagementLivePreview,
  LastBellCardPreview,
  LastBellInvitationView,
  LastBellLivePreview,
  LoveMapWeddingCardPreview,
  LoveMapWeddingInvitationView,
  LoveMapWeddingLivePreview,
  PolaroidEngagementCardPreview,
  PolaroidEngagementInvitationView,
  PolaroidEngagementLivePreview,
  getAngelicBaptismDraft,
  getCinematicEngagementDraft,
  getGoldenHeartEngagementDraft,
  getLastBellDraft,
  getLoveMapWeddingDraft,
  getPolaroidEngagementDraft,
  isAngelicBaptismTemplate,
  isCinematicEngagementTemplate,
  isGoldenHeartEngagementTemplate,
  isLastBellTemplate,
  isLoveMapWeddingTemplate,
  isPolaroidEngagementTemplate
} from './ImportedBatchTemplates.tsx';

export const availableOccasionTemplates = [
  { key: 'sacred-beginnings', label: 'Սուրբ սկիզբ · մկրտություն' },
  { key: 'birthday-sparkle', label: 'Փայլուն տարեդարձ' },
  { key: 'birthday-space', label: 'Տիեզերական տարեդարձ' },
  { key: 'birthday-watercolor', label: 'Ջրաներկ տարեդարձ' },
  { key: 'birthday-crimson', label: 'Կարմիր տարեդարձ' },
  { key: 'army-ceremonial', label: 'Հանդիսավոր բանակի քեֆ' },
  { key: 'army-camouflage', label: 'Քողարկանախշ բանակի քեֆ' },
  { key: 'ivory-vows', label: 'Փղոսկրե երդումներ · հարսանիք' },
  { key: 'divine-blessing', label: 'Աստվածային օրհնություն · մկրտություն' },
  { key: 'elevate-invite', label: 'Վերելք · կորպորատիվ միջոցառում' },
  { key: 'everlasting-vows', label: 'Հավերժական երդումներ · հարսանիք' },
  { key: 'forever-vows', label: 'Forever Vows · նշանադրություն' },
  { key: 'silk-vows', label: 'Մետաքսե երդումներ · հարսանիք' },
  { key: 'burgundy-roadmap', label: 'Գինեգույն ճանապարհ · հարսանիք' },
  { key: 'monochrome-envelope', label: 'Մոնոխրոմ հրավեր · հարսանիք' },
  { key: 'love-map-wedding', label: 'Սիրո քարտեզ · հարսանիք' },
  { key: 'angelic-baptism', label: 'Հրեշտակային մկրտություն' },
  { key: 'polaroid-engagement', label: 'Պոլարոիդ նշանադրություն' },
  { key: 'golden-heart-engagement', label: 'Ոսկե սիրտ · նշանադրություն' },
  { key: 'cinematic-engagement', label: 'Կինոժապավեն · նշանադրություն' },
  { key: 'last-bell', label: 'Վերջին զանգ' }
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
    key: 'birthday-space',
    aliases: ['birthday-space', 'space-birthday', 'cnund1'],
    match: isBirthdaySpaceTemplate,
    CardPreview: BirthdaySpaceCardPreview,
    LivePreview: BirthdaySpaceLivePreview,
    PublicView: BirthdaySpaceInvitationView,
    getInitialDraft: getBirthdaySpaceDraft
  },
  {
    key: 'birthday-watercolor',
    aliases: ['birthday-watercolor', 'watercolor-birthday', 'cnund2'],
    match: isBirthdayWatercolorTemplate,
    CardPreview: BirthdayWatercolorCardPreview,
    LivePreview: BirthdayWatercolorLivePreview,
    PublicView: BirthdayWatercolorInvitationView,
    getInitialDraft: getBirthdayWatercolorDraft
  },
  {
    key: 'birthday-crimson',
    aliases: ['birthday-crimson', 'emma-birthday', 'cnund3'],
    match: isBirthdayCrimsonTemplate,
    CardPreview: BirthdayCrimsonCardPreview,
    LivePreview: BirthdayCrimsonLivePreview,
    PublicView: BirthdayCrimsonInvitationView,
    getInitialDraft: getBirthdayCrimsonDraft
  },
  {
    key: 'army-ceremonial',
    aliases: ['army-ceremonial', 'amulet-army-invitation'],
    match: isArmyCeremonialTemplate,
    CardPreview: ArmyCeremonialCardPreview,
    LivePreview: ArmyCeremonialLivePreview,
    PublicView: ArmyCeremonialInvitationView,
    getInitialDraft: getArmyCeremonialDraft
  },
  {
    key: 'army-camouflage',
    aliases: ['army-camouflage', 'army-invitation-camouflage'],
    match: isArmyCamouflageTemplate,
    CardPreview: ArmyCamouflageCardPreview,
    LivePreview: ArmyCamouflageLivePreview,
    PublicView: ArmyCamouflageInvitationView,
    getInitialDraft: getArmyCamouflageDraft
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
  },
  {
    key: 'monochrome-envelope',
    aliases: ['monochrome-envelope', 'monochrome-envelope-wedding', 'harsaniq2'],
    match: isMonochromeEnvelopeTemplate,
    CardPreview: MonochromeEnvelopeCardPreview,
    LivePreview: MonochromeEnvelopeLivePreview,
    PublicView: MonochromeEnvelopeInvitationView,
    getInitialDraft: getMonochromeEnvelopeDraft
  },
  {
    key: 'love-map-wedding',
    aliases: ['love-map-wedding', 'harsaniq4'],
    match: isLoveMapWeddingTemplate,
    CardPreview: LoveMapWeddingCardPreview,
    LivePreview: LoveMapWeddingLivePreview,
    PublicView: LoveMapWeddingInvitationView,
    getInitialDraft: getLoveMapWeddingDraft
  },
  {
    key: 'angelic-baptism',
    aliases: ['angelic-baptism', 'knunq1'],
    match: isAngelicBaptismTemplate,
    CardPreview: AngelicBaptismCardPreview,
    LivePreview: AngelicBaptismLivePreview,
    PublicView: AngelicBaptismInvitationView,
    getInitialDraft: getAngelicBaptismDraft
  },
  {
    key: 'polaroid-engagement',
    aliases: ['polaroid-engagement', 'nshanadrutyun1'],
    match: isPolaroidEngagementTemplate,
    CardPreview: PolaroidEngagementCardPreview,
    LivePreview: PolaroidEngagementLivePreview,
    PublicView: PolaroidEngagementInvitationView,
    getInitialDraft: getPolaroidEngagementDraft
  },
  {
    key: 'golden-heart-engagement',
    aliases: ['golden-heart-engagement', 'nshanadrutyun2'],
    match: isGoldenHeartEngagementTemplate,
    CardPreview: GoldenHeartEngagementCardPreview,
    LivePreview: GoldenHeartEngagementLivePreview,
    PublicView: GoldenHeartEngagementInvitationView,
    getInitialDraft: getGoldenHeartEngagementDraft
  },
  {
    key: 'cinematic-engagement',
    aliases: ['cinematic-engagement', 'nshanadrutyun3'],
    match: isCinematicEngagementTemplate,
    CardPreview: CinematicEngagementCardPreview,
    LivePreview: CinematicEngagementLivePreview,
    PublicView: CinematicEngagementInvitationView,
    getInitialDraft: getCinematicEngagementDraft
  },
  {
    key: 'last-bell',
    aliases: ['last-bell', 'verjin-zang-1'],
    match: isLastBellTemplate,
    CardPreview: LastBellCardPreview,
    LivePreview: LastBellLivePreview,
    PublicView: LastBellInvitationView,
    getInitialDraft: getLastBellDraft
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
