import {
  getTestWeddingDraft,
  isTestTemplate,
  TestWeddingCardPreview,
  TestWeddingInvitationView,
  TestWeddingLivePreview
} from './TestWeddingTemplate.jsx';
import {
  getRomanticGoldDraft,
  isRomanticGoldTemplate,
  RomanticGoldCardPreview,
  RomanticGoldInvitationView,
  RomanticGoldLivePreview
} from './RomanticGoldTemplate.jsx';
import {
  getMidnightVowsDraft,
  isMidnightVowsTemplate,
  MidnightVowsCardPreview,
  MidnightVowsInvitationView,
  MidnightVowsLivePreview
} from './MidnightVowsTemplate.jsx';

export const availableOccasionTemplates = [
  { key: 'classic', label: 'Classic / default' },
  { key: 'test-wedding', label: 'Test wedding editorial' },
  { key: 'romantic-gold', label: 'Romantic gold HTML/CSS' },
  { key: 'midnight-vows', label: 'Midnight vows fullscreen' }
];

const normalizeTemplateKey = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/[_\s]+/g, '-')
  .replace(/[^a-z0-9-]/g, '')
  .replace(/-+/g, '-');

export const occasionTemplates = [
  {
    key: 'test-wedding',
    aliases: ['test', 'test-wedding', 'testwedding'],
    match: isTestTemplate,
    CardPreview: TestWeddingCardPreview,
    LivePreview: TestWeddingLivePreview,
    PublicView: TestWeddingInvitationView,
    getInitialDraft: getTestWeddingDraft
  },
  {
    key: 'romantic-gold',
    aliases: ['romantic-gold', 'romanticgold'],
    match: isRomanticGoldTemplate,
    CardPreview: RomanticGoldCardPreview,
    LivePreview: RomanticGoldLivePreview,
    PublicView: RomanticGoldInvitationView,
    getInitialDraft: getRomanticGoldDraft
  },
  {
    key: 'midnight-vows',
    aliases: ['midnight-vows', 'midnightvows', 'dark-wedding'],
    match: isMidnightVowsTemplate,
    CardPreview: MidnightVowsCardPreview,
    LivePreview: MidnightVowsLivePreview,
    PublicView: MidnightVowsInvitationView,
    getInitialDraft: getMidnightVowsDraft
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
