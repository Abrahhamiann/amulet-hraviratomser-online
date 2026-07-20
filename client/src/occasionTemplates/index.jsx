import {
  getMidnightVowsDraft,
  isMidnightVowsTemplate,
  MidnightVowsCardPreview,
  MidnightVowsInvitationView,
  MidnightVowsLivePreview
} from './MidnightVowsTemplate.jsx';
import {
  BaptismBlessingCardPreview,
  BaptismBlessingInvitationView,
  BaptismBlessingLivePreview,
  getBaptismBlessingDraft,
  isBaptismBlessingTemplate
} from './BaptismBlessingTemplate.jsx';
import {
  EngagementSerenadeCardPreview,
  EngagementSerenadeInvitationView,
  EngagementSerenadeLivePreview,
  getEngagementSerenadeDraft,
  isEngagementSerenadeTemplate
} from './EngagementSerenadeTemplate.jsx';

export const availableOccasionTemplates = [
  { key: 'midnight-vows', label: 'Midnight vows fullscreen' },
  { key: 'baptism-blessing', label: 'Baptism blessing envelope' },
  { key: 'engagement-serenade', label: 'Engagement serenade fullscreen' }
];

const normalizeTemplateKey = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/[_\s]+/g, '-')
  .replace(/[^a-z0-9-]/g, '')
  .replace(/-+/g, '-');

export const occasionTemplates = [
  {
    key: 'midnight-vows',
    aliases: ['midnight-vows', 'midnight-vows-fullscreen', 'midnightvows', 'dark-wedding'],
    match: isMidnightVowsTemplate,
    CardPreview: MidnightVowsCardPreview,
    LivePreview: MidnightVowsLivePreview,
    PublicView: MidnightVowsInvitationView,
    getInitialDraft: getMidnightVowsDraft
  },
  {
    key: 'baptism-blessing',
    aliases: ['baptism-blessing', 'baptismblessing', 'baptism-envelope'],
    match: isBaptismBlessingTemplate,
    CardPreview: BaptismBlessingCardPreview,
    LivePreview: BaptismBlessingLivePreview,
    PublicView: BaptismBlessingInvitationView,
    getInitialDraft: getBaptismBlessingDraft
  },
  {
    key: 'engagement-serenade',
    aliases: ['engagement-serenade', 'engagementserenade', 'engagement-photo', 'proposal-lake'],
    match: isEngagementSerenadeTemplate,
    CardPreview: EngagementSerenadeCardPreview,
    LivePreview: EngagementSerenadeLivePreview,
    PublicView: EngagementSerenadeInvitationView,
    getInitialDraft: getEngagementSerenadeDraft
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
