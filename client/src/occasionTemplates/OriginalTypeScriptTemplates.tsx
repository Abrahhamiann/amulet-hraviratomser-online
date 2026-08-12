import { useCallback, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Home, Pencil, ShoppingBag } from 'lucide-react';

import { BaptismInvitation } from '../vendorTemplates/sacred/src/components/invitation/BaptismInvitation';
import { invitation as sacredInvitation, type InvitationData } from '../vendorTemplates/sacred/src/data/invitation';
import sacredStyles from '../vendorTemplates/sacred/src/styles.css?inline';
import sacredPortrait from '../vendorTemplates/sacred/src/assets/child-portrait.jpg';

import { BirthdayIntro } from '../vendorTemplates/birthday/src/components/birthday/BirthdayIntro';
import { BirthdayMessage } from '../vendorTemplates/birthday/src/components/birthday/BirthdayMessage';
import { BirthdayPersonSection } from '../vendorTemplates/birthday/src/components/birthday/BirthdayPersonSection';
import { Countdown as BirthdayCountdown } from '../vendorTemplates/birthday/src/components/birthday/Countdown';
import { EventDetails as BirthdayEventDetails } from '../vendorTemplates/birthday/src/components/birthday/EventDetails';
import { FinalCelebration } from '../vendorTemplates/birthday/src/components/birthday/FinalCelebration';
import { Gallery as BirthdayGallery } from '../vendorTemplates/birthday/src/components/birthday/Gallery';
import { HeroSection as BirthdayHeroSection } from '../vendorTemplates/birthday/src/components/birthday/HeroSection';
import { LocationSection } from '../vendorTemplates/birthday/src/components/birthday/LocationSection';
import { MusicControl } from '../vendorTemplates/birthday/src/components/birthday/MusicControl';
import { PartyTimeline } from '../vendorTemplates/birthday/src/components/birthday/PartyTimeline';
import { RSVPSection, type RsvpData } from '../vendorTemplates/birthday/src/components/birthday/RSVPSection';
import { invitation as birthdayInvitation, type InvitationConfig } from '../vendorTemplates/birthday/src/config/invitation';
import birthdayStyles from '../vendorTemplates/birthday/src/styles.css?inline';
import birthdayPortrait from '../vendorTemplates/birthday/src/assets/portrait.jpg';

import { ClosingSection } from '../vendorTemplates/ivory/src/components/wedding/ClosingSection';
import { ContactSection } from '../vendorTemplates/ivory/src/components/wedding/ContactSection';
import { Countdown as WeddingCountdown } from '../vendorTemplates/ivory/src/components/wedding/Countdown';
import { CoupleSection } from '../vendorTemplates/ivory/src/components/wedding/CoupleSection';
import { DressCode } from '../vendorTemplates/ivory/src/components/wedding/DressCode';
import { FloatingActions } from '../vendorTemplates/ivory/src/components/wedding/FloatingActions';
import { Footer as WeddingFooter } from '../vendorTemplates/ivory/src/components/wedding/Footer';
import { Gallery as WeddingGallery } from '../vendorTemplates/ivory/src/components/wedding/Gallery';
import { HeroSection as WeddingHeroSection } from '../vendorTemplates/ivory/src/components/wedding/HeroSection';
import { ImportantInfo } from '../vendorTemplates/ivory/src/components/wedding/ImportantInfo';
import { InvitationMessage } from '../vendorTemplates/ivory/src/components/wedding/InvitationMessage';
import { RSVPForm } from '../vendorTemplates/ivory/src/components/wedding/RSVPForm';
import { StoryTimeline } from '../vendorTemplates/ivory/src/components/wedding/StoryTimeline';
import { VenueSection } from '../vendorTemplates/ivory/src/components/wedding/VenueSection';
import { WeddingSchedule } from '../vendorTemplates/ivory/src/components/wedding/WeddingSchedule';
import { wedding } from '../vendorTemplates/ivory/src/data/wedding';
import ivoryStyles from '../vendorTemplates/ivory/src/styles.css?inline';
import ivoryHero from '../vendorTemplates/ivory/src/assets/hero.jpg';

import { BabyGallery as DivineGallery } from '../vendorTemplates/divine/baptism/BabyGallery';
import { BaptismDetails as DivineDetails } from '../vendorTemplates/divine/baptism/BaptismDetails';
import { BaptismFooter as DivineFooter } from '../vendorTemplates/divine/baptism/BaptismFooter';
import { BaptismHero as DivineHero } from '../vendorTemplates/divine/baptism/BaptismHero';
import { BaptismTimeline as DivineTimeline } from '../vendorTemplates/divine/baptism/BaptismTimeline';
import { BlessingQuote as DivineQuote } from '../vendorTemplates/divine/baptism/BlessingQuote';
import { CalendarSection as DivineCalendar } from '../vendorTemplates/divine/baptism/CalendarSection';
import { CountdownSection as DivineCountdown } from '../vendorTemplates/divine/baptism/CountdownSection';
import { FamilyMessage as DivineFamilyMessage } from '../vendorTemplates/divine/baptism/FamilyMessage';
import { LocationSection as DivineLocation } from '../vendorTemplates/divine/baptism/LocationSection';
import { MusicButton as DivineMusic } from '../vendorTemplates/divine/baptism/MusicButton';
import { RSVPSection as DivineRsvp } from '../vendorTemplates/divine/baptism/RSVPSection';
import { CurveDivider as DivineCurve, Divider as DivineDivider } from '../vendorTemplates/divine/baptism/primitives';
import { invitation as divineInvitation } from '../vendorTemplates/divine/data/invitation';
import divineStyles from '../vendorTemplates/divine/styles.css?inline';
import divineHeroImage from '../vendorTemplates/divine/assets/baby-1.jpg';

import { ContactSection as ElevateContact } from '../vendorTemplates/elevate/invitation/ContactSection';
import { CorporateFooter as ElevateFooter } from '../vendorTemplates/elevate/invitation/CorporateFooter';
import { CorporateGallery as ElevateGallery } from '../vendorTemplates/elevate/invitation/CorporateGallery';
import { CorporateHero as ElevateHero } from '../vendorTemplates/elevate/invitation/CorporateHero';
import { CorporateStats as ElevateStats } from '../vendorTemplates/elevate/invitation/CorporateStats';
import { Countdown as ElevateCountdown } from '../vendorTemplates/elevate/invitation/Countdown';
import { DressCode as ElevateDressCode } from '../vendorTemplates/elevate/invitation/DressCode';
import { EventAgenda as ElevateAgenda } from '../vendorTemplates/elevate/invitation/EventAgenda';
import { EventDetails as ElevateDetails } from '../vendorTemplates/elevate/invitation/EventDetails';
import { EventIntroduction as ElevateIntroduction } from '../vendorTemplates/elevate/invitation/EventIntroduction';
import { EventPurpose as ElevatePurpose } from '../vendorTemplates/elevate/invitation/EventPurpose';
import { MusicToggle as ElevateMusic } from '../vendorTemplates/elevate/invitation/MusicToggle';
import { RSVPForm as ElevateRsvp } from '../vendorTemplates/elevate/invitation/RSVPForm';
import { SpeakersSection as ElevateSpeakers } from '../vendorTemplates/elevate/invitation/SpeakersSection';
import { VenueSection as ElevateVenue } from '../vendorTemplates/elevate/invitation/VenueSection';
import { invitation as elevateInvitation, type InvitationData as ElevateInvitationData } from '../vendorTemplates/elevate/data/invitation';
import elevateStyles from '../vendorTemplates/elevate/styles.css?inline';
import elevateHeroImage from '../vendorTemplates/elevate/assets/hero-bg.jpg';

import { Gallery as EverAfterGallery } from '../vendorTemplates/everafter/invite/Gallery';
import { Hero as EverAfterHero } from '../vendorTemplates/everafter/invite/Hero';
import { MusicToggle as EverAfterMusic } from '../vendorTemplates/everafter/invite/MusicToggle';
import { Rsvp as EverAfterRsvp } from '../vendorTemplates/everafter/invite/Rsvp';
import { CurveDivider as EverAfterCurve, OrnamentDivider as EverAfterDivider } from '../vendorTemplates/everafter/invite/decor';
import { Announcement as EverAfterAnnouncement, Countdown as EverAfterCountdown, Couple as EverAfterCouple, Details as EverAfterDetails, DressCode as EverAfterDressCode, Footer as EverAfterFooter, Location as EverAfterLocation, Quote as EverAfterQuote, Story as EverAfterStory, Timeline as EverAfterTimeline } from '../vendorTemplates/everafter/invite/sections';
import { dressPalette as everAfterDressPalette, invite as everAfterInvite } from '../vendorTemplates/everafter/invite/data';
import everAfterStyles from '../vendorTemplates/everafter/styles.css?inline';
import everAfterHeroImage from '../vendorTemplates/everafter/assets/hero-floral.jpg';

import { CoupleSection as EverlastingCouple } from '../vendorTemplates/everlasting/wedding/CoupleSection';
import { CeremonyDetails as EverlastingCeremony, ReceptionDetails as EverlastingReception } from '../vendorTemplates/everlasting/wedding/EventDetails';
import { MusicToggle as EverlastingMusic, WeddingFooter as EverlastingFooter } from '../vendorTemplates/everlasting/wedding/FooterAndMusic';
import { RSVPForm as EverlastingRsvp, WishesSection as EverlastingWishes } from '../vendorTemplates/everlasting/wedding/Forms';
import { OurStory as EverlastingStory } from '../vendorTemplates/everlasting/wedding/OurStory';
import { DressCode as EverlastingDressCode, RomanticQuote as EverlastingQuote } from '../vendorTemplates/everlasting/wedding/QuoteAndDressCode';
import { SaveTheDate as EverlastingSaveDate } from '../vendorTemplates/everlasting/wedding/SaveTheDate';
import { WeddingCountdown as EverlastingCountdown } from '../vendorTemplates/everlasting/wedding/WeddingCountdown';
import { WeddingGallery as EverlastingGallery } from '../vendorTemplates/everlasting/wedding/WeddingGallery';
import { WeddingHero as EverlastingHero } from '../vendorTemplates/everlasting/wedding/WeddingHero';
import { WeddingTimeline as EverlastingTimeline } from '../vendorTemplates/everlasting/wedding/WeddingTimeline';
import { weddingConfig as everlastingConfig, type WeddingConfig as EverlastingConfig } from '../vendorTemplates/everlasting/data/wedding';
import everlastingStyles from '../vendorTemplates/everlasting/styles.css?inline';
import everlastingHeroImage from '../vendorTemplates/everlasting/assets/hero.jpg';
import defaultInvitationSong from '../assets/audio/ed-sheeran-perfect.mp3';
import { resolveTemplateImage, templateDefaultGalleryIds } from './templateAssets.js';

import './originalTypeScriptTemplates.css';

type TemplateRecord = Record<string, unknown>;

type SurfaceProps = {
  children: ReactNode;
  css: string;
  fontImport: string;
  label: string;
  draft?: Draft;
  customize?: (root: HTMLDivElement) => void;
};

type Draft = {
  mainNames?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  eventMessage?: string;
  image?: string;
  gallery?: string[];
  mapLinks?: Array<{ label?: string; time?: string; address?: string; url?: string; subtitle?: string; visible?: boolean }>;
  musicEnabled?: boolean;
  musicUrl?: string;
  templateTextOverrides?: Record<string, string>;
  templateImageOverrides?: Record<string, string>;
  colors?: { accent?: string; text?: string; overlay?: string };
  colorPaletteId?: string;
  heroVisible?: boolean;
  familyVisible?: boolean;
  openingVisible?: boolean;
  receptionVisible?: boolean;
  questionsVisible?: boolean;
  finalMessageVisible?: boolean;
  dressCodeVisible?: boolean;
  groomFamilyTitle?: string;
  brideFamilyTitle?: string;
  rsvpQuestion?: string;
  dressCode?: string;
  dressCodeColors?: Array<{ name: string; hex: string }>;
  closingMessage?: string;
  rsvpSettings?: {
    title?: string;
    description?: string;
    guestPlaceholder?: string;
    attendingLabel?: string;
    notAttendingLabel?: string;
    submitLabel?: string;
    deadline?: string;
    askGuestCount?: boolean;
    askMeal?: boolean;
  };
};

type TemplateProps = {
  draft?: Draft;
  price?: number;
  loading?: boolean;
  mode?: 'preview' | 'public' | 'studio';
  onHome?: () => void;
  onEdit?: () => void;
  onOrder?: () => void;
  actions?: ReactNode;
  onRsvpSubmit?: (data: TemplateRsvpData) => Promise<unknown>;
};

export type TemplateRsvpData = {
  guestName: string;
  phone?: string;
  status: 'attending' | 'declined' | 'unsure';
  guestCount?: number;
  guestSide?: 'bride' | 'groom' | 'other';
  message?: string;
};

const UI_TRANSLATIONS: Record<string, string> = {
  Scroll: 'Ոլորել', Ceremony: 'Արարողություն', Date: 'Ամսաթիվ', Time: 'Ժամ',
  'View Location': 'Դիտել տեղադրությունը', 'The Day': 'Օրվա ծրագիրը', Moments: 'Պահեր',
  'Our family story': 'Մեր ընտանեկան պատմությունը', 'With gratitude': 'Երախտագիտությամբ',
  RSVP: 'Մասնակցության հաստատում', 'Created with Amulet': 'Ստեղծված է Amulet-ով',
  Days: 'Օր', Hours: 'Ժամ', Minutes: 'Րոպե', Seconds: 'Վայրկյան',
  'A Little Celebration': 'Մի փոքրիկ տոն', 'My Birthday Wish': 'Իմ տարեդարձի ցանկությունը',
  'Counting Down to the Party': 'Մինչև տոնակատարությունը',
  'Everything You Need to Know': 'Այն ամենը, ինչ պետք է իմանալ',
  'Beautiful Memories': 'Գեղեցիկ հիշողություններ', 'Party Schedule': 'Տոնական ծրագիր',
  'See you at the party': 'Կհանդիպենք տոնակատարությանը', 'Thank you!': 'Շնորհակալություն։',
  'How it began': 'Ինչպես սկսվեց', 'Our Story': 'Մեր պատմությունը',
  'Until Our Special Day': 'Մինչև մեր առանձնահատուկ օրը',
  'Good to know': 'Կարևոր է իմանալ', 'Important Information': 'Կարևոր տեղեկություններ',
  'A gentle note on style': 'Հագուստի մասին', 'Dress Code': 'Դրես կոդ',
  Gallery: 'Պատկերասրահ', 'We are here for you': 'Մենք Ձեր կողքին ենք',
  'Questions?': 'Հարցե՞ր ունեք', 'Open in Maps': 'Բացել քարտեզում',
  'Will you celebrate with us?': 'Կտոնե՞ք մեզ հետ', 'Full Name': 'Անուն ազգանուն',
  'Will you attend?': 'Կմասնակցե՞ք', 'Yes, with pleasure': 'Այո, մեծ սիրով',
  'Unfortunately, I cannot': 'Ցավոք, չեմ կարող', 'Number of Guests': 'Հյուրերի քանակ',
  'Food Preference': 'Սննդի նախընտրություն', 'A message for the couple': 'Հաղորդագրություն զույգին',
  'Confirm Attendance': 'Հաստատել մասնակցությունը',
  'Thank you — your answer has been received.': 'Շնորհակալություն․ Ձեր պատասխանը ստացվել է։',
  'We are so grateful you took the time to reply.': 'Շնորհակալ ենք պատասխանելու համար։',
  'Your name': 'Ձեր անունը', Attendance: 'Մասնակցություն', 'Joyfully yes': 'Այո, մեծ սիրով',
  'Sadly no': 'Ցավոք՝ ոչ', 'Message (optional)': 'Հաղորդագրություն (ըստ ցանկության)',
  'A few warm words for the family…': 'Մի քանի ջերմ խոսք ընտանիքին…',
  'Open Map': 'Բացել քարտեզը', 'Get Directions': 'Ինչպես հասնել',
  'Order of the celebration': 'Տոնակատարության ծրագիրը',
  'Will You Join the Celebration?': 'Կմիանա՞ք տոնակատարությանը',
  'Please let me know if you’ll be celebrating with us.': 'Խնդրում եմ տեղեկացնել՝ կմիանա՞ք մեր տոնին։',
  'Your response has been received. 🎂✨': 'Ձեր պատասխանը ստացվել է։ 🎂✨',
  'Send another response': 'Ուղարկել մեկ այլ պատասխան',
  '✓ Yes, I\'ll be there': '✓ Այո, ներկա կլինեմ',
  '✕ Unfortunately, I can\'t come': '✕ Ցավոք, չեմ կարող գալ',
  'Leave a birthday message': 'Թողնել տարեդարձի շնորհավորանք',
  'Optional — write something sweet': 'Ըստ ցանկության՝ գրեք ջերմ խոսքեր',
  'Send RSVP 🎉': 'Ուղարկել պատասխանը 🎉', 'The details': 'Մանրամասներ',
  Location: 'Վայր', 'Arrive a little early': 'Խնդրում ենք մի փոքր շուտ գալ',
  Where: 'Վայրը',
  'A candlelit hall wrapped in gardens — easy to find, and impossible to forget. Parking is available just around the corner.': 'Մոմերով լուսավորված, պարտեզներով շրջապատված սրահ, որը հեշտ է գտնել և անհնար է մոռանալ։ Մոտակայքում կա կայանատեղի։',
  Optional: 'Ըստ ցանկության',
  Bride: 'Հարս', Groom: 'Փեսա', 'The Bride': 'Հարսը', 'The Groom': 'Փեսան',
  'The Birthday Girl': 'Տարեդարձի հերոսուհին',
  'Thank you! We can\'t wait to celebrate with you.': 'Շնորհակալություն։ Անհամբեր սպասում ենք Ձեզ հետ տոնելուն։',
  'Your response has been noted with love.': 'Ձեր պատասխանը սիրով գրանցվեց։'
};

const localizeTemplateUi = (root: HTMLDivElement) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const value = node.nodeValue || '';
    const trimmed = value.trim();
    const translated = UI_TRANSLATIONS[trimmed];
    if (translated) node.nodeValue = value.replace(trimmed, translated);
    node = walker.nextNode();
  }
  root.querySelectorAll<HTMLElement>('[placeholder], [aria-label], [title]').forEach((element) => {
    ['placeholder', 'aria-label', 'title'].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (value && UI_TRANSLATIONS[value]) element.setAttribute(attribute, UI_TRANSLATIONS[value]);
    });
  });
};

const TEMPLATE_TEXT_SELECTOR = 'h1, h2, h3, p, span, strong, b, em, legend, blockquote, label, button, li, figcaption, small';

const applyTemplateOverrides = (root: HTMLDivElement, draft: Draft = {}) => {
  const textOverrides = draft.templateTextOverrides || {};
  const imageOverrides = draft.templateImageOverrides || {};
  const textElements = [...root.querySelectorAll<HTMLElement>(TEMPLATE_TEXT_SELECTOR)]
    .filter((element) => (
      [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
      && !element.closest('.original-template-preview-actions')
    ));

  textElements.forEach((element, index) => {
    const key = element.dataset.templateTextKey || `text-${index}`;
    if (!element.dataset.templateTextKey) element.dataset.templateTextKey = key;
    if (element.dataset.templateTextDefault === undefined) element.dataset.templateTextDefault = element.textContent || '';
    // While the user is typing directly on the preview, the MutationObserver
    // must not restore the last saved value before blur can commit the new one.
    if (element.classList.contains('is-editor-inline-editing')) return;
    if (Object.prototype.hasOwnProperty.call(textOverrides, key)) {
      const nextValue = String(textOverrides[key] ?? '');
      if (element.textContent !== nextValue) element.textContent = nextValue;
    }
  });

  [...root.querySelectorAll<HTMLImageElement>('img:not([aria-hidden="true"])')].forEach((image, index) => {
    const key = image.dataset.templateImageKey || `image-${index}`;
    if (!image.dataset.templateImageKey) image.dataset.templateImageKey = key;
    if (!image.dataset.templateImageDefault) image.dataset.templateImageDefault = image.currentSrc || image.src;
    if (!Object.prototype.hasOwnProperty.call(imageOverrides, key)) return;
    const nextSource = String(imageOverrides[key] ?? '');
    image.hidden = !nextSource;
    if (nextSource && image.src !== nextSource) image.src = nextSource;
  });

  const visibilityRules: Array<[string, boolean]> = [
    ['.sacred-hero, .sacred-message, .birthday-hero, .birthday-message, .ivory-hero, .ivory-message, .divine-hero, .elevate-hero, .ever-after-hero, .everlasting-hero', draft.heroVisible !== false],
    ['.sacred-schedule, .birthday-schedule, .ivory-schedule, .divine-schedule, .elevate-schedule, .ever-after-schedule, .everlasting-schedule', draft.receptionVisible !== false],
    ['.sacred-rsvp, .birthday-rsvp, .ivory-rsvp, .divine-rsvp, .elevate-rsvp, .ever-after-rsvp, .everlasting-rsvp', draft.questionsVisible !== false],
    ['.sacred-closing, .birthday-closing, .ivory-closing, .divine-closing, .elevate-closing, .ever-after-closing, .everlasting-closing', draft.finalMessageVisible !== false]
  ];
  visibilityRules.forEach(([selector, visible]) => {
    root.querySelectorAll<HTMLElement>(selector).forEach((element) => { element.hidden = !visible; });
  });
};

const formatArmenianDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  const months = ['հունվարի', 'փետրվարի', 'մարտի', 'ապրիլի', 'մայիսի', 'հունիսի', 'հուլիսի', 'օգոստոսի', 'սեպտեմբերի', 'հոկտեմբերի', 'նոյեմբերի', 'դեկտեմբերի'];
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
};

const splitNames = (value?: string) => String(value || '').split(/\s*(?:&|և|եւ|\+|,|·)\s*/).filter(Boolean);

const replaceTemplateText = (root: HTMLDivElement, replacements: Record<string, string>) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const value = node.nodeValue || '';
    const trimmed = value.trim();
    if (Object.prototype.hasOwnProperty.call(replacements, trimmed)) {
      const nextValue = value.replace(trimmed, replacements[trimmed]);
      if (nextValue !== value) node.nodeValue = nextValue;
    }
    node = walker.nextNode();
  }
};

const applyDraftGallery = (root: HTMLDivElement, draft: Draft, designKey: keyof typeof templateDefaultGalleryIds) => {
  const defaults = (templateDefaultGalleryIds[designKey] || []).map(resolveTemplateImage);
  const nextGallery = (draft.gallery || []).map(resolveTemplateImage);
  root.querySelectorAll<HTMLImageElement>('img:not([aria-hidden="true"])').forEach((image) => {
    let index = Number(image.dataset.templateGalleryIndex);
    if (!Number.isInteger(index)) {
      index = defaults.findIndex((source) => {
        try { return image.src === new URL(source, document.baseURI).href; } catch { return image.src === source; }
      });
      if (index >= 0) image.dataset.templateGalleryIndex = String(index);
    }
    if (index >= 0 && nextGallery[index] && image.src !== nextGallery[index]) image.src = nextGallery[index];
  });
};

const normalizeKey = (value: unknown) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/[_\s]+/g, '-')
  .replace(/[^a-z0-9-]/g, '')
  .replace(/-+/g, '-');

const matches = (template: TemplateRecord | undefined, aliases: string[]) => {
  const values = [template?.designKey, template?.slug, template?.title].map(normalizeKey);
  return values.some((value) => aliases.includes(value));
};

export const isSacredBeginningsTemplate = (template?: TemplateRecord) => matches(template, [
  'sacred-beginnings', 'sacred-beginnings-invitation', 'sacred-baptism'
]);

export const isBirthdaySparkleTemplate = (template?: TemplateRecord) => matches(template, [
  'birthday-sparkle', 'birthday-sparkle-suite', 'sparkle-birthday'
]);

export const isIvoryVowsTemplate = (template?: TemplateRecord) => matches(template, [
  'ivory-vows', 'amulet-ivory-vows', 'ivory-wedding'
]);

export const isDivineBlessingTemplate = (template?: TemplateRecord) => matches(template, [
  'divine-blessing', 'divine-blessing-baptism'
]);

export const isElevateInviteTemplate = (template?: TemplateRecord) => matches(template, [
  'elevate-invite', 'elevate-corporate'
]);

export const isEverAfterTemplate = (template?: TemplateRecord) => matches(template, [
  'ever-after', 'ever-after-engagement'
]);

export const isEverlastingVowsTemplate = (template?: TemplateRecord) => matches(template, [
  'everlasting-vows', 'everlasting-vows-wedding'
]);

function OriginalTemplateSurface({ children, css, fontImport, label, draft, customize }: SurfaceProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLDivElement | null>(null);
  const isolatedCss = useMemo(() => css.replaceAll(':root', ':host'), [css]);
  const customizeRef = useRef(customize);
  const draftRef = useRef(draft);
  const themeStyle = useMemo(() => {
    const accent = draft?.colors?.accent;
    const text = draft?.colors?.text;
    const overlay = draft?.colors?.overlay;
    if (!accent || !text || !overlay) return undefined;
    const isLegacyFallback = accent.toLowerCase() === '#d8b98e'
      && text.toLowerCase() === '#ffffff'
      && overlay.toLowerCase() === '#202020';
    if (!draft?.colorPaletteId && isLegacyFallback) return undefined;
    return {
      '--background': overlay,
      '--foreground': text,
      '--primary': accent,
      '--primary-foreground': overlay,
      '--accent': `color-mix(in srgb, ${accent} 22%, ${overlay})`,
      '--accent-foreground': text,
      '--secondary': `color-mix(in srgb, ${accent} 13%, ${overlay})`,
      '--secondary-foreground': text,
      '--muted': `color-mix(in srgb, ${text} 8%, ${overlay})`,
      '--muted-foreground': `color-mix(in srgb, ${text} 68%, ${overlay})`,
      '--card': `color-mix(in srgb, ${text} 5%, ${overlay})`,
      '--card-foreground': text,
      '--popover': overlay,
      '--popover-foreground': text,
      '--border': `color-mix(in srgb, ${accent} 30%, ${overlay})`,
      '--input': `color-mix(in srgb, ${accent} 24%, ${overlay})`,
      '--ring': accent,
      '--cream': `color-mix(in srgb, ${text} 7%, ${overlay})`,
      '--ivory': overlay,
      '--sand': `color-mix(in srgb, ${accent} 25%, ${overlay})`,
      '--champagne': `color-mix(in srgb, ${accent} 36%, ${overlay})`,
      '--gold': accent,
      '--gold-soft': `color-mix(in srgb, ${accent} 58%, ${overlay})`,
      '--ink': text,
      '--ink-soft': `color-mix(in srgb, ${text} 68%, ${overlay})`,
      '--blush': `color-mix(in srgb, #e7a3ad 52%, ${overlay})`,
      '--peach': `color-mix(in srgb, #efb18b 48%, ${overlay})`,
      '--lavender': `color-mix(in srgb, #bda6db 48%, ${overlay})`,
      '--sky': `color-mix(in srgb, #95c6df 46%, ${overlay})`,
      '--coral': accent,
      '--mint': `color-mix(in srgb, #89c9b2 45%, ${overlay})`,
      '--sage': `color-mix(in srgb, #8fa481 48%, ${overlay})`,
      '--dusty-blue': `color-mix(in srgb, #8ba9c8 48%, ${overlay})`,
      '--gradient-heaven': `radial-gradient(120% 80% at 50% 0%, color-mix(in srgb, ${text} 12%, ${overlay}) 0%, ${overlay} 72%)`,
      '--gradient-warm': `linear-gradient(180deg, ${overlay} 0%, color-mix(in srgb, ${accent} 12%, ${overlay}) 100%)`
    } as CSSProperties;
  }, [draft?.colorPaletteId, draft?.colors?.accent, draft?.colors?.overlay, draft?.colors?.text]);
  customizeRef.current = customize;
  draftRef.current = draft;

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    const root = document.createElement('div');
    root.className = 'original-template-document';
    style.textContent = `${fontImport}\n${isolatedCss}\n
      :host { display: block; width: 100%; color: var(--foreground); background: var(--background); }
      .original-template-document { width: 100%; min-height: 100vh; overflow-x: hidden; color: var(--foreground); background: var(--background); font-family: var(--font-body, var(--font-sans, ui-sans-serif, system-ui, sans-serif)); -webkit-font-smoothing: antialiased; }
      .original-template-document [hidden] { display: none !important; }
      .original-template-document h1, .original-template-document h2, .original-template-document h3 { font-family: var(--font-display, ui-serif, Georgia, serif); }
    `;
    shadow.replaceChildren(style, root);
    setPortalRoot(root);

    const applyLocalization = () => {
      localizeTemplateUi(root);
      customizeRef.current?.(root);
      applyTemplateOverrides(root, draftRef.current);
    };
    const observer = new MutationObserver(applyLocalization);
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    const frame = requestAnimationFrame(applyLocalization);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      setPortalRoot(null);
    };
  }, [fontImport, isolatedCss]);

  useLayoutEffect(() => {
    if (!portalRoot) return;
    localizeTemplateUi(portalRoot);
    customize?.(portalRoot);
    applyTemplateOverrides(portalRoot, draft);
  }, [customize, draft, portalRoot]);

  return (
    <div ref={hostRef} className="original-ts-template-host" role="document" aria-label={label} style={themeStyle}>
      {portalRoot ? createPortal(children, portalRoot) : null}
    </div>
  );
}

function PreviewActions({ price, loading, onHome, onEdit, onOrder }: TemplateProps) {
  return (
    <div className="midnight-floating-actions original-template-preview-actions">
      <span>{Number(price || 29000).toLocaleString('hy-AM')} AMD</span>
      <button className="btn btn-ghost template-home-action" type="button" onClick={onHome} aria-label="Գլխավոր էջ" title="Գլխավոր էջ"><Home size={19} /></button>
      <button className="btn btn-ghost" type="button" onClick={onEdit}><Pencil size={18} />Խմբագրել</button>
      <button className="btn btn-primary" type="button" onClick={onOrder} disabled={loading}><ShoppingBag size={18} />{loading ? 'Բեռնվում է...' : 'Գնել'}</button>
    </div>
  );
}

function TemplateShell({ children, props }: { children: ReactNode; props: TemplateProps }) {
  return (
    <div className="original-ts-template-shell">
      {children}
      {props.mode !== 'public' && props.mode !== 'studio' ? <PreviewActions {...props} /> : null}
      {props.mode === 'public' && props.actions ? (
        <section className="original-template-public-extras">
          {props.actions ? <div className="original-template-public-actions">{props.actions}</div> : null}
        </section>
      ) : null}
    </div>
  );
}

function SacredBeginningsTemplate(props: TemplateProps) {
  const { draft = {} } = props;
  const musicSource = draft.musicEnabled === false ? undefined : (draft.musicUrl || defaultInvitationSong);
  const data = useMemo<InvitationData>(() => {
    const image = resolveTemplateImage(draft.image) || sacredInvitation.child.portrait.src;
    const gallery = (draft.gallery || []).map(resolveTemplateImage).filter(Boolean);
    return {
      ...sacredInvitation,
      child: { ...sacredInvitation.child, name: draft.mainNames ?? sacredInvitation.child.name, portrait: { ...sacredInvitation.child.portrait, src: image } },
      hero: { ...sacredInvitation.hero, dateLabel: draft.eventDate !== undefined ? formatArmenianDate(draft.eventDate) : sacredInvitation.hero.dateLabel },
      intro: { ...sacredInvitation.intro, subMessage: draft.eventMessage ?? sacredInvitation.intro.subMessage },
      event: { ...sacredInvitation.event, isoDate: draft.eventDate ? `${draft.eventDate}T${draft.eventTime ?? '14:00'}:00+04:00` : '', dateLabel: draft.eventDate !== undefined ? formatArmenianDate(draft.eventDate) : sacredInvitation.event.dateLabel, timeLabel: draft.eventTime ?? sacredInvitation.event.timeLabel, venue: draft.eventLocation ?? sacredInvitation.event.venue },
      gallery: gallery.length ? gallery.map((src, index) => ({ src, alt: `${draft.mainNames || sacredInvitation.child.name} ${index + 1}` })) : sacredInvitation.gallery,
      rsvp: {
        ...sacredInvitation.rsvp,
        heading: draft.rsvpSettings?.title || sacredInvitation.rsvp.heading,
        description: draft.rsvpSettings?.description || draft.rsvpQuestion || sacredInvitation.rsvp.description,
        deadline: draft.rsvpSettings?.deadline || sacredInvitation.rsvp.deadline,
        guestPlaceholder: draft.rsvpSettings?.guestPlaceholder,
        attendingLabel: draft.rsvpSettings?.attendingLabel,
        notAttendingLabel: draft.rsvpSettings?.notAttendingLabel,
        submitLabel: draft.rsvpSettings?.submitLabel,
        askGuestCount: draft.rsvpSettings?.askGuestCount,
        askMeal: draft.rsvpSettings?.askMeal
      },
      closing: {
        ...sacredInvitation.closing,
        familyName: draft.groomFamilyTitle || sacredInvitation.closing.familyName,
        message: draft.closingMessage || sacredInvitation.closing.message
      }
    };
  }, [draft]);
  return (
    <TemplateShell props={props}><OriginalTemplateSurface
      css={sacredStyles}
      draft={draft}
      fontImport={'@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap");'}
      label="Սուրբ սկիզբ մկրտության հրավեր"
    >
      <BaptismInvitation data={data} visibility={draft} onRsvpSubmit={props.onRsvpSubmit} />
      <MusicControl src={musicSource} />
    </OriginalTemplateSurface></TemplateShell>
  );
}

function BirthdaySparkleTemplate(props: TemplateProps) {
  const { draft = {} } = props;
  const musicSource = draft.musicEnabled === false ? undefined : (draft.musicUrl || defaultInvitationSong);
  const [revealed, setRevealed] = useState(false);
  const onIntroDone = useCallback(() => setRevealed(true), []);
  const handleRsvp = useCallback((data: RsvpData) => props.onRsvpSubmit?.(data), [props.onRsvpSubmit]);
  const data = useMemo<InvitationConfig>(() => {
    const image = resolveTemplateImage(draft.image) || birthdayInvitation.portrait.src;
    const gallery = (draft.gallery || []).map(resolveTemplateImage).filter(Boolean);
    return {
      ...birthdayInvitation,
      birthdayPersonName: draft.mainNames ?? birthdayInvitation.birthdayPersonName,
      fullName: draft.mainNames ?? birthdayInvitation.fullName,
      eventDateISO: draft.eventDate ? `${draft.eventDate}T${draft.eventTime ?? '19:00'}:00` : '',
      dateLabel: draft.eventDate !== undefined ? formatArmenianDate(draft.eventDate) : birthdayInvitation.dateLabel,
      timeLabel: draft.eventTime ?? birthdayInvitation.timeLabel,
      venue: draft.eventLocation ?? birthdayInvitation.venue,
      personalMessage: draft.eventMessage ?? birthdayInvitation.personalMessage,
      dressCode: draft.dressCode || birthdayInvitation.dressCode,
      portrait: { ...birthdayInvitation.portrait, src: image },
      photos: gallery.length ? gallery.map((src, index) => ({ src, alt: `${draft.mainNames || birthdayInvitation.fullName} ${index + 1}`, width: 900, height: 1100 })) : birthdayInvitation.photos
    };
  }, [draft]);

  return (
    <TemplateShell props={props}><OriginalTemplateSurface
      css={birthdayStyles}
      draft={draft}
      fontImport={'@import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&family=Outfit:wght@200..700&family=Caveat:wght@400..700&display=swap");'}
      label="Փայլուն տարեդարձի հրավեր"
    >
      <main className="relative w-full overflow-x-hidden">
        <div className="birthday-hero" hidden={draft.heroVisible === false}>
          <BirthdayIntro onDone={onIntroDone} />
          <BirthdayHeroSection data={data} start={revealed} />
        </div>
        <BirthdayPersonSection data={data} />
        <BirthdayCountdown dateISO={data.eventDateISO} />
        <div className="birthday-schedule" hidden={draft.receptionVisible === false}>
          <BirthdayEventDetails data={data} />
          <PartyTimeline schedule={data.schedule} />
        </div>
        <BirthdayGallery photos={data.photos} />
        <div className="birthday-message" hidden={draft.heroVisible === false}><BirthdayMessage data={data} /></div>
        <div className="birthday-schedule" hidden={draft.receptionVisible === false}><LocationSection data={data} /></div>
        <div className="birthday-rsvp" hidden={draft.questionsVisible === false}><RSVPSection onSubmit={handleRsvp} settings={draft.rsvpSettings} question={draft.rsvpQuestion} /></div>
        <div className="birthday-closing" hidden={draft.finalMessageVisible === false}><FinalCelebration data={data} closingMessage={draft.closingMessage} /></div>
        <MusicControl src={musicSource} />
      </main>
    </OriginalTemplateSurface></TemplateShell>
  );
}

function IvoryVowsTemplate(props: TemplateProps) {
  const { draft = {} } = props;
  const musicSource = draft.musicEnabled === false ? undefined : (draft.musicUrl || defaultInvitationSong);
  const [ceremony, reception] = wedding.venues;
  const gallery = useMemo(() => {
    const images = (draft.gallery || []).map(resolveTemplateImage).filter(Boolean);
    return images.length
      ? images.map((src, index) => ({ src, alt: `${draft.mainNames || wedding.couple.groom.name} ${index + 1}` }))
      : wedding.gallery;
  }, [draft.gallery, draft.mainNames]);
  const dressCodeData = useMemo(() => ({
    text: draft.dressCode || wedding.dressCode.text,
    colors: draft.dressCodeColors?.length ? draft.dressCodeColors : wedding.dressCode.colors
  }), [draft.dressCode, draft.dressCodeColors]);
  const customize = useCallback((root: HTMLDivElement) => {
    const explicitNames = String(draft.mainNames ?? '').split(/\s*[&+,·]\s*/, 2);
    const [groom, bride] = explicitNames.length > 1 ? [explicitNames[0] || '', explicitNames[1] || ''] : splitNames(draft.mainNames);
    const replacements: Record<string, string> = {
      [wedding.couple.groom.name]: draft.mainNames !== undefined ? (groom || '') : wedding.couple.groom.name,
      [wedding.couple.bride.name]: draft.mainNames !== undefined ? (bride || '') : wedding.couple.bride.name,
      [wedding.date.long]: draft.eventDate !== undefined ? formatArmenianDate(draft.eventDate) : wedding.date.long,
      [wedding.invitation.note]: draft.eventMessage ?? wedding.invitation.note,
      [wedding.venues[0]?.name || '']: draft.eventLocation ?? wedding.venues[0]?.name ?? '',
      [wedding.dressCode.text]: draft.dressCode || wedding.dressCode.text,
      [wedding.closing.text]: draft.closingMessage || wedding.closing.text
    };
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      const value = node.nodeValue || '';
      const trimmed = value.trim();
      if (Object.prototype.hasOwnProperty.call(replacements, trimmed)) {
        const nextValue = value.replace(trimmed, replacements[trimmed]);
        if (nextValue !== value) node.nodeValue = nextValue;
      }
      node = walker.nextNode();
    }
    const hero = root.querySelector<HTMLImageElement>('section img');
    const image = resolveTemplateImage(draft.image);
    if (hero && image) hero.src = image;
  }, [draft]);

  return (
    <TemplateShell props={props}><OriginalTemplateSurface
      css={ivoryStyles}
      draft={draft}
      fontImport={'@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&family=Noto+Serif+Armenian:wght@300;400&family=Noto+Sans+Armenian:wght@300;400&display=swap");'}
      label="Փղոսկրե երդումներ հարսանեկան հրավեր"
      customize={customize}
    >
      <main className="overflow-x-hidden">
        <div className="ivory-hero" hidden={draft.heroVisible === false}><WeddingHeroSection /></div>
        <div className="ivory-message" hidden={draft.heroVisible === false}><InvitationMessage /></div>
        <CoupleSection />
        <StoryTimeline />
        <div className="ivory-schedule" hidden={draft.receptionVisible === false}>
          <WeddingCountdown />
          <WeddingSchedule />
          {ceremony ? <VenueSection venue={ceremony} /> : null}
          {reception ? <VenueSection venue={reception} reverse /> : null}
        </div>
        <WeddingGallery images={gallery} />
        <div className="ivory-dress" hidden={draft.dressCodeVisible === false}><DressCode dressCode={dressCodeData} /></div>
        <ImportantInfo />
        <div className="ivory-rsvp" hidden={draft.questionsVisible === false}><RSVPForm settings={draft.rsvpSettings} question={draft.rsvpQuestion} onSubmit={props.onRsvpSubmit} /></div>
        <ContactSection />
        <div className="ivory-closing" hidden={draft.finalMessageVisible === false}><ClosingSection /><WeddingFooter /></div>
        <FloatingActions />
        <MusicControl src={musicSource} />
      </main>
    </OriginalTemplateSurface></TemplateShell>
  );
}

function DivineBlessingTemplate(props: TemplateProps) {
  const { draft = {} } = props;
  const customize = useCallback((root: HTMLDivElement) => {
    const firstVenue = draft.mapLinks?.[0];
    replaceTemplateText(root, {
      [divineInvitation.babyName]: draft.mainNames ?? divineInvitation.babyName,
      [divineInvitation.heroDescription]: draft.eventMessage || divineInvitation.heroDescription,
      [divineInvitation.dateLabel]: draft.eventDate !== undefined ? formatArmenianDate(draft.eventDate) : divineInvitation.dateLabel,
      [divineInvitation.details[0]?.value || '']: draft.eventDate !== undefined ? formatArmenianDate(draft.eventDate) : divineInvitation.details[0]?.value || '',
      [divineInvitation.details[1]?.value || '']: draft.eventTime ?? divineInvitation.details[1]?.value ?? '',
      [divineInvitation.location.churchName]: firstVenue?.label || draft.eventLocation || divineInvitation.location.churchName,
      [divineInvitation.location.churchAddress]: firstVenue?.address || divineInvitation.location.churchAddress,
      [divineInvitation.familyMessage]: draft.closingMessage || divineInvitation.familyMessage,
      'Խնդրում ենք հաստատել Ձեր ներկայությունը': draft.rsvpSettings?.title || 'Խնդրում ենք հաստատել Ձեր ներկայությունը',
      'Անուն, Ազգանուն': draft.rsvpSettings?.guestPlaceholder || 'Անուն, Ազգանուն',
      'Այո, կմասնակցեմ': draft.rsvpSettings?.attendingLabel || 'Այո, կմասնակցեմ',
      'Չեմ կարող մասնակցել': draft.rsvpSettings?.notAttendingLabel || 'Չեմ կարող մասնակցել',
      'Ուղարկել': draft.rsvpSettings?.submitLabel || 'Ուղարկել'
    });
    const map = root.querySelector<HTMLAnchorElement>('a[href*="maps"]');
    if (map && firstVenue?.url) map.href = firstVenue.url;
    applyDraftGallery(root, draft, 'divine-blessing');
  }, [draft]);

  return (
    <TemplateShell props={props}><OriginalTemplateSurface
      css={divineStyles}
      draft={draft}
      fontImport={'@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Montserrat:wght@300;400;500&display=swap");'}
      label="Divine Blessing baptism invitation"
      customize={customize}
    >
      <main className="divine-template relative overflow-x-hidden">
        <div className="divine-hero" hidden={draft.heroVisible === false}><DivineHero /></div>
        <DivineCurve />
        <div className="divine-schedule" hidden={draft.receptionVisible === false}>
          <DivineDetails /><DivineDivider symbol="cross" /><DivineCountdown /><DivineCurve />
          <DivineCalendar /><DivineDivider symbol="floral" /><DivineTimeline />
        </div>
        <DivineDivider symbol="dove" />
        <div className="divine-family" hidden={draft.familyVisible === false}><DivineFamilyMessage /></div>
        <DivineGallery /><DivineQuote /><DivineCurve />
        <div className="divine-schedule" hidden={draft.receptionVisible === false}><DivineLocation /></div>
        <DivineDivider symbol="cross" />
        <div className="divine-rsvp" hidden={draft.questionsVisible === false}><DivineRsvp onSubmit={props.onRsvpSubmit} /></div>
        <div className="divine-closing" hidden={draft.finalMessageVisible === false}><DivineFooter /></div>
        <DivineMusic src={draft.musicEnabled === false ? undefined : (draft.musicUrl || defaultInvitationSong)} />
      </main>
    </OriginalTemplateSurface></TemplateShell>
  );
}

function ElevateInviteTemplate(props: TemplateProps) {
  const { draft = {} } = props;
  const customize = useCallback((root: HTMLDivElement) => {
    replaceTemplateText(root, {
      'Full name': draft.rsvpSettings?.guestPlaceholder || 'Full name',
      "Yes, I'll Attend": draft.rsvpSettings?.attendingLabel || "Yes, I'll Attend",
      "Unfortunately, I Can't Attend": draft.rsvpSettings?.notAttendingLabel || "Unfortunately, I Can't Attend",
      'Send Confirmation': draft.rsvpSettings?.submitLabel || 'Send Confirmation'
    });
  }, [draft.rsvpSettings]);
  const data = useMemo<ElevateInvitationData>(() => {
    const firstVenue = draft.mapLinks?.[0];
    const gallery = (draft.gallery || []).slice(1).map(resolveTemplateImage).filter(Boolean);
    const dateLabel = draft.eventDate !== undefined ? formatArmenianDate(draft.eventDate) : elevateInvitation.hero.dateLabel;
    const venueName = firstVenue?.label || draft.eventLocation || elevateInvitation.venue.name;
    const venueAddress = firstVenue?.address || elevateInvitation.venue.address;
    return {
      ...elevateInvitation,
      hero: {
        ...elevateInvitation.hero,
        title: draft.mainNames ?? elevateInvitation.hero.title,
        invitationNote: draft.eventMessage || elevateInvitation.hero.invitationNote,
        dateLabel,
        locationLabel: venueAddress,
        backgroundImage: resolveTemplateImage(draft.image) || elevateInvitation.hero.backgroundImage
      },
      details: {
        ...elevateInvitation.details,
        date: { ...elevateInvitation.details.date, value: dateLabel },
        time: { ...elevateInvitation.details.time, value: draft.eventTime ?? elevateInvitation.details.time.value },
        venue: { ...elevateInvitation.details.venue, value: venueName, note: venueAddress }
      },
      countdown: {
        ...elevateInvitation.countdown,
        targetDate: draft.eventDate ? `${draft.eventDate}T${draft.eventTime || '19:00'}:00+04:00` : elevateInvitation.countdown.targetDate
      },
      gallery: {
        ...elevateInvitation.gallery,
        images: gallery.length ? gallery.map((src, index) => ({ src, alt: `${draft.mainNames || elevateInvitation.hero.title} ${index + 1}` })) : elevateInvitation.gallery.images
      },
      venue: {
        ...elevateInvitation.venue,
        name: venueName,
        address: venueAddress,
        mapsUrl: firstVenue?.url || elevateInvitation.venue.mapsUrl
      },
      dressCode: {
        ...elevateInvitation.dressCode,
        note: draft.dressCode || elevateInvitation.dressCode.note,
        palette: draft.dressCodeColors?.length ? draft.dressCodeColors.map(({ name, hex }) => ({ name, color: hex })) : elevateInvitation.dressCode.palette
      },
      rsvp: {
        ...elevateInvitation.rsvp,
        title: draft.rsvpSettings?.title || elevateInvitation.rsvp.title,
        subtitle: draft.rsvpSettings?.description || draft.rsvpQuestion || elevateInvitation.rsvp.subtitle,
        deadline: draft.rsvpSettings?.deadline || elevateInvitation.rsvp.deadline
      },
      music: {
        ...elevateInvitation.music,
        enabled: draft.musicEnabled !== false,
        src: draft.musicUrl || elevateInvitation.music.src
      },
      finale: {
        ...elevateInvitation.finale,
        date: dateLabel,
        quote: draft.closingMessage || elevateInvitation.finale.quote
      }
    };
  }, [draft]);

  return (
    <TemplateShell props={props}><OriginalTemplateSurface
      css={elevateStyles}
      draft={draft}
      fontImport={'@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Montserrat:wght@300;400;500;600&display=swap");'}
      label="Elevate corporate invitation"
      customize={customize}
    >
      <main className="elevate-template relative">
        <div className="elevate-hero" hidden={draft.heroVisible === false}><ElevateHero data={data} /><ElevateIntroduction data={data} /></div>
        <div className="elevate-schedule" hidden={draft.receptionVisible === false}><ElevateDetails data={data} /><ElevateCountdown data={data} /><ElevateAgenda data={data} /></div>
        <ElevatePurpose data={data} /><ElevateSpeakers data={data} /><ElevateStats data={data} /><ElevateGallery data={data} />
        <div className="elevate-schedule" hidden={draft.receptionVisible === false}><ElevateVenue data={data} /></div>
        <div className="elevate-dress" hidden={draft.dressCodeVisible === false}><ElevateDressCode data={data} /></div>
        <div className="elevate-rsvp" hidden={draft.questionsVisible === false}><ElevateRsvp data={data} onSubmit={props.onRsvpSubmit} /></div>
        <ElevateContact data={data} />
        <div className="elevate-closing" hidden={draft.finalMessageVisible === false}><ElevateFooter data={data} /></div>
        <ElevateMusic data={data} />
      </main>
    </OriginalTemplateSurface></TemplateShell>
  );
}

function EverAfterTemplate(props: TemplateProps) {
  const { draft = {} } = props;
  const customize = useCallback((root: HTMLDivElement) => {
    const [bride, groom] = splitNames(draft.mainNames);
    const firstVenue = draft.mapLinks?.[0];
    replaceTemplateText(root, {
      [everAfterInvite.bride]: draft.mainNames !== undefined ? (bride || '') : everAfterInvite.bride,
      [everAfterInvite.groom]: draft.mainNames !== undefined ? (groom || '') : everAfterInvite.groom,
      [everAfterInvite.dateLabel]: draft.eventDate !== undefined ? formatArmenianDate(draft.eventDate) : everAfterInvite.dateLabel,
      [everAfterInvite.timeLabel]: draft.eventTime ?? everAfterInvite.timeLabel,
      [everAfterInvite.venue]: firstVenue?.label || draft.eventLocation || everAfterInvite.venue,
      [everAfterInvite.address]: firstVenue?.address || everAfterInvite.address
      , 'Will You Celebrate With Us?': draft.rsvpSettings?.title || 'Will You Celebrate With Us?'
      , 'kindly reply by September 1': draft.rsvpSettings?.deadline || 'kindly reply by September 1'
      , 'Full Name': draft.rsvpSettings?.guestPlaceholder || 'Անուն ազգանուն'
      , 'Անուն ազգանուն': draft.rsvpSettings?.guestPlaceholder || 'Անուն ազգանուն'
      , 'Joyfully Accept': draft.rsvpSettings?.attendingLabel || 'Joyfully Accept'
      , 'Regretfully Decline': draft.rsvpSettings?.notAttendingLabel || 'Regretfully Decline'
      , 'Send Our Reply': draft.rsvpSettings?.submitLabel || 'Send Our Reply'
      , 'Soft neutrals, silk and a touch of gold — dress as though the evening were a photograph you’d keep forever.': draft.dressCode || 'Soft neutrals, silk and a touch of gold — dress as though the evening were a photograph you’d keep forever.'
    });
    root.querySelectorAll<HTMLInputElement>('input[placeholder="Your name"], input[placeholder="Ձեր անունը"]').forEach((input) => {
      input.placeholder = draft.rsvpSettings?.guestPlaceholder || 'Անուն ազգանուն';
    });
    const dressRoot = root.querySelector('.ever-after-dress');
    draft.dressCodeColors?.forEach((color, index) => {
      const label = dressRoot?.querySelectorAll<HTMLElement>('.eyebrow.mt-3')[index];
      const swatch = label?.parentElement?.querySelector<HTMLElement>('.rounded-full');
      if (label) label.textContent = color.name;
      if (swatch) swatch.style.background = color.hex;
    });
    root.querySelectorAll<HTMLAnchorElement>('a[href*="maps"]').forEach((map) => {
      if (firstVenue?.url) map.href = firstVenue.url;
    });
    applyDraftGallery(root, draft, 'ever-after');
  }, [draft]);

  return (
    <TemplateShell props={props}><OriginalTemplateSurface
      css={everAfterStyles}
      draft={draft}
      fontImport={'@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Great+Vibes&family=Montserrat:wght@300;400;500&display=swap");'}
      label="Ever After engagement invitation"
      customize={customize}
    >
      <main className="ever-after-template relative overflow-x-hidden">
        <div className="ever-after-hero" hidden={draft.heroVisible === false}><EverAfterHero /><EverAfterStory /></div>
        <EverAfterCurve /><EverAfterCouple /><EverAfterCurve flip />
        <div className="ever-after-schedule" hidden={draft.receptionVisible === false}><EverAfterAnnouncement /><EverAfterCountdown /><EverAfterDivider label="The Details" /><EverAfterDetails /><EverAfterLocation /><EverAfterTimeline /></div>
        <EverAfterGallery /><EverAfterQuote />
        <div className="ever-after-dress" hidden={draft.dressCodeVisible === false}><EverAfterDressCode /></div>
        <div className="ever-after-rsvp" hidden={draft.questionsVisible === false}><EverAfterRsvp onSubmit={props.onRsvpSubmit} /></div>
        <div className="ever-after-closing" hidden={draft.finalMessageVisible === false}><EverAfterFooter /></div>
        {draft.musicEnabled !== false ? <EverAfterMusic /> : null}
      </main>
    </OriginalTemplateSurface></TemplateShell>
  );
}

function EverlastingVowsTemplate(props: TemplateProps) {
  const { draft = {} } = props;
  const customize = useCallback((root: HTMLDivElement) => {
    replaceTemplateText(root, {
      'Full Name': draft.rsvpSettings?.guestPlaceholder || 'Անուն ազգանուն',
      'Անուն ազգանուն': draft.rsvpSettings?.guestPlaceholder || 'Անուն ազգանուն',
      'Joyfully Accept': draft.rsvpSettings?.attendingLabel || 'Joyfully Accept',
      'Regretfully Decline': draft.rsvpSettings?.notAttendingLabel || 'Regretfully Decline',
      'Send RSVP': draft.rsvpSettings?.submitLabel || 'Send RSVP'
    });
    root.querySelectorAll<HTMLInputElement>('input[placeholder="Your name"], input[placeholder="Ձեր անունը"]').forEach((input) => {
      input.placeholder = draft.rsvpSettings?.guestPlaceholder || 'Անուն ազգանուն';
    });
  }, [draft.rsvpSettings]);
  const config = useMemo<EverlastingConfig>(() => {
    const [bride, groom] = splitNames(draft.mainNames);
    const gallery = (draft.gallery || []).map(resolveTemplateImage).filter(Boolean);
    const ceremony = draft.mapLinks?.[0];
    const reception = draft.mapLinks?.[1];
    const longDate = draft.eventDate !== undefined ? formatArmenianDate(draft.eventDate) : everlastingConfig.date.long;
    return {
      ...everlastingConfig,
      couple: {
        ...everlastingConfig.couple,
        bride: { ...everlastingConfig.couple.bride, name: bride || everlastingConfig.couple.bride.name, photo: gallery[1] || everlastingConfig.couple.bride.photo },
        groom: { ...everlastingConfig.couple.groom, name: groom || everlastingConfig.couple.groom.name, photo: gallery[2] || everlastingConfig.couple.groom.photo },
        initials: { left: (bride || everlastingConfig.couple.bride.name).charAt(0), right: (groom || everlastingConfig.couple.groom.name).charAt(0) }
      },
      hero: {
        ...everlastingConfig.hero,
        background: resolveTemplateImage(draft.image) || gallery[0] || everlastingConfig.hero.background,
        dateLabel: longDate,
        invitation: draft.eventMessage || everlastingConfig.hero.invitation
      },
      envelope: { ...everlastingConfig.envelope, enabled: false },
      date: {
        ...everlastingConfig.date,
        iso: draft.eventDate ? `${draft.eventDate}T${draft.eventTime || '16:00'}:00+04:00` : everlastingConfig.date.iso,
        long: longDate
      },
      ceremony: {
        ...everlastingConfig.ceremony,
        time: ceremony?.time || draft.eventTime || everlastingConfig.ceremony.time,
        venue: ceremony?.label || draft.eventLocation || everlastingConfig.ceremony.venue,
        city: ceremony?.address || everlastingConfig.ceremony.city,
        mapUrl: ceremony?.url || everlastingConfig.ceremony.mapUrl
      },
      reception: {
        ...everlastingConfig.reception,
        time: reception?.time || everlastingConfig.reception.time,
        venue: reception?.label || everlastingConfig.reception.venue,
        city: reception?.address || everlastingConfig.reception.city,
        mapUrl: reception?.url || everlastingConfig.reception.mapUrl
      },
      gallery: {
        ...everlastingConfig.gallery,
        images: gallery.length > 3 ? gallery.slice(3).map((src, index) => ({ src, alt: `${draft.mainNames || 'Wedding'} ${index + 1}` })) : everlastingConfig.gallery.images
      },
      dressCode: {
        ...everlastingConfig.dressCode,
        note: draft.dressCode || everlastingConfig.dressCode.note,
        swatches: draft.dressCodeColors?.length ? draft.dressCodeColors.map(({ name, hex }) => ({ name, color: hex })) : everlastingConfig.dressCode.swatches
      },
      rsvp: {
        ...everlastingConfig.rsvp,
        title: draft.rsvpSettings?.title || everlastingConfig.rsvp.title,
        subtitle: draft.rsvpSettings?.description || draft.rsvpQuestion || everlastingConfig.rsvp.subtitle,
        deadline: draft.rsvpSettings?.deadline || everlastingConfig.rsvp.deadline
      },
      music: {
        ...everlastingConfig.music,
        enabled: draft.musicEnabled !== false,
        src: draft.musicUrl || everlastingConfig.music.src
      },
      footer: {
        ...everlastingConfig.footer,
        message: draft.closingMessage || everlastingConfig.footer.message
      }
    };
  }, [draft]);

  return (
    <TemplateShell props={props}><OriginalTemplateSurface
      css={everlastingStyles}
      draft={draft}
      fontImport={'@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Great+Vibes&family=Montserrat:wght@300;400;500&display=swap");'}
      label="Everlasting Vows wedding invitation"
      customize={customize}
    >
      <main className="everlasting-template relative">
        <div className="everlasting-hero" hidden={draft.heroVisible === false}><EverlastingHero config={config} started /></div>
        <EverlastingStory story={config.story} /><EverlastingCouple couple={config.couple} />
        <div className="everlasting-schedule" hidden={draft.receptionVisible === false}><EverlastingSaveDate config={config} /><EverlastingCountdown iso={config.date.iso} /><EverlastingCeremony ceremony={config.ceremony} dateLong={config.date.long} /><EverlastingReception reception={config.reception} /><EverlastingTimeline timeline={config.timeline} /></div>
        <EverlastingGallery gallery={config.gallery} /><EverlastingQuote quote={config.quote} />
        <div className="everlasting-dress" hidden={draft.dressCodeVisible === false}><EverlastingDressCode dressCode={config.dressCode} /></div>
        <div className="everlasting-rsvp" hidden={draft.questionsVisible === false}><EverlastingRsvp rsvp={config.rsvp} onSubmit={props.onRsvpSubmit} /><EverlastingWishes wishes={config.wishes} /></div>
        <div className="everlasting-closing" hidden={draft.finalMessageVisible === false}><EverlastingFooter config={config} /></div>
        {config.music.enabled ? <EverlastingMusic music={config.music} /> : null}
      </main>
    </OriginalTemplateSurface></TemplateShell>
  );
}

const makeDraft = (mainNames: string, eventDate: string, eventTime: string, eventLocation: string, image: string, designKey: keyof typeof templateDefaultGalleryIds) => ({
  mainNames,
  eventDate,
  eventTime,
  eventLocation,
  eventMessage: '',
  image,
  gallery: templateDefaultGalleryIds[designKey] || [image],
  mapLinks: [],
  colors: {}
});

export const getSacredBeginningsDraft = () => makeDraft(
  sacredInvitation.child.name,
  sacredInvitation.event.isoDate.slice(0, 10),
  sacredInvitation.event.timeLabel,
  `${sacredInvitation.event.venue}, ${sacredInvitation.event.city}`,
  sacredPortrait,
  'sacred-beginnings'
);

export const getBirthdaySparkleDraft = () => makeDraft(
  birthdayInvitation.birthdayPersonName,
  birthdayInvitation.eventDateISO.slice(0, 10),
  birthdayInvitation.timeLabel,
  `${birthdayInvitation.venue}, ${birthdayInvitation.address}`,
  birthdayPortrait,
  'birthday-sparkle'
);

export const getIvoryVowsDraft = () => ({ ...makeDraft(
  `${wedding.couple.groom.name} & ${wedding.couple.bride.name}`,
  wedding.date.iso.slice(0, 10),
  wedding.venues[0]?.time || '',
  wedding.venues[0]?.name || '',
  ivoryHero,
  'ivory-vows'
), dressCode: wedding.dressCode.text, dressCodeColors: wedding.dressCode.colors.map((color) => ({ ...color })) });

export const getDivineBlessingDraft = () => ({ ...makeDraft(
  divineInvitation.babyName,
  divineInvitation.eventISO.slice(0, 10),
  divineInvitation.details[1]?.value || '14:00',
  divineInvitation.location.churchName,
  divineHeroImage,
  'divine-blessing'
),
  eventMessage: divineInvitation.heroDescription,
  closingMessage: divineInvitation.familyMessage,
  mapLinks: [{
    label: divineInvitation.location.churchName,
    time: divineInvitation.details[1]?.value || '14:00',
    address: divineInvitation.location.churchAddress,
    url: divineInvitation.location.mapUrl,
    visible: true
  }],
  rsvpSettings: {
    title: 'Խնդրում ենք հաստատել Ձեր ներկայությունը',
    description: '',
    deadline: '',
    guestPlaceholder: 'Անուն, Ազգանուն',
    attendingLabel: 'Այո, կմասնակցեմ',
    notAttendingLabel: 'Չեմ կարող մասնակցել',
    submitLabel: 'Ուղարկել',
    askGuestCount: true,
    askMeal: false
  }
});

export const getElevateInviteDraft = () => ({ ...makeDraft(
  elevateInvitation.hero.title,
  elevateInvitation.countdown.targetDate.slice(0, 10),
  elevateInvitation.details.time.value,
  elevateInvitation.venue.name,
  elevateHeroImage,
  'elevate-invite'
),
  eventMessage: elevateInvitation.hero.invitationNote,
  dressCode: elevateInvitation.dressCode.note,
  dressCodeColors: elevateInvitation.dressCode.palette.map(({ name, color }) => ({ name, hex: color })),
  dressCodeVisible: true,
  closingMessage: elevateInvitation.finale.quote,
  mapLinks: [{
    label: elevateInvitation.venue.name,
    time: elevateInvitation.details.time.value,
    address: elevateInvitation.venue.address,
    url: elevateInvitation.venue.mapsUrl,
    visible: true
  }],
  rsvpSettings: {
    title: elevateInvitation.rsvp.title,
    description: elevateInvitation.rsvp.subtitle,
    deadline: elevateInvitation.rsvp.deadline,
    guestPlaceholder: 'Full name',
    attendingLabel: "Yes, I'll Attend",
    notAttendingLabel: "Unfortunately, I Can't Attend",
    submitLabel: 'Send Confirmation',
    askGuestCount: true,
    askMeal: false
  }
});

export const getEverAfterDraft = () => ({ ...makeDraft(
  `${everAfterInvite.bride} & ${everAfterInvite.groom}`,
  everAfterInvite.dateISO.slice(0, 10),
  everAfterInvite.timeLabel,
  everAfterInvite.venue,
  everAfterHeroImage,
  'ever-after'
),
  dressCode: 'Soft neutrals, silk and a touch of gold — dress as though the evening were a photograph you’d keep forever.',
  dressCodeColors: everAfterDressPalette.map(({ name }, index) => ({ name, hex: ['#FAF7EF', '#EAD9B8', '#EBCBC8', '#B77E82', '#C9A85C'][index] || '#D8B98E' })),
  dressCodeVisible: true,
  mapLinks: [{
    label: everAfterInvite.venue,
    time: everAfterInvite.timeLabel,
    address: everAfterInvite.address,
    url: everAfterInvite.mapsUrl,
    visible: true
  }],
  rsvpSettings: {
    title: 'Will You Celebrate With Us?',
    description: '',
    deadline: 'kindly reply by September 1',
    guestPlaceholder: 'Անուն ազգանուն',
    attendingLabel: 'Joyfully Accept',
    notAttendingLabel: 'Regretfully Decline',
    submitLabel: 'Send Our Reply',
    askGuestCount: true,
    askMeal: false
  }
});

export const getEverlastingVowsDraft = () => ({ ...makeDraft(
  `${everlastingConfig.couple.bride.name} & ${everlastingConfig.couple.groom.name}`,
  everlastingConfig.date.iso.slice(0, 10),
  everlastingConfig.ceremony.time,
  everlastingConfig.ceremony.venue,
  everlastingHeroImage,
  'everlasting-vows'
),
  eventMessage: everlastingConfig.hero.invitation,
  dressCode: everlastingConfig.dressCode.note,
  dressCodeColors: everlastingConfig.dressCode.swatches.map(({ name, color }) => ({ name, hex: color })),
  dressCodeVisible: true,
  closingMessage: everlastingConfig.footer.message,
  mapLinks: [
    { label: everlastingConfig.ceremony.venue, time: everlastingConfig.ceremony.time, address: everlastingConfig.ceremony.city, url: everlastingConfig.ceremony.mapUrl, visible: true },
    { label: everlastingConfig.reception.venue, time: everlastingConfig.reception.time, address: everlastingConfig.reception.city, url: everlastingConfig.reception.mapUrl, visible: true }
  ],
  rsvpSettings: {
    title: everlastingConfig.rsvp.title,
    description: everlastingConfig.rsvp.subtitle,
    deadline: everlastingConfig.rsvp.deadline,
    guestPlaceholder: 'Անուն ազգանուն',
    attendingLabel: 'Joyfully Accept',
    notAttendingLabel: 'Regretfully Decline',
    submitLabel: 'Send RSVP',
    askGuestCount: true,
    askMeal: true
  }
});

function OriginalTemplateCard({ image, title }: { image: string; title: string }) {
  return (
    <div className="original-template-card-preview">
      <img src={image} alt="" />
      <div />
      <span>TypeScript template</span>
      <strong>{title}</strong>
    </div>
  );
}

export const SacredBeginningsCardPreview = () => <OriginalTemplateCard image={sacredPortrait} title="Սուրբ սկիզբ" />;
export const BirthdaySparkleCardPreview = () => <OriginalTemplateCard image={birthdayPortrait} title="Փայլուն տարեդարձ" />;
export const IvoryVowsCardPreview = () => <OriginalTemplateCard image={ivoryHero} title="Փղոսկրե երդումներ" />;
export const DivineBlessingCardPreview = () => <OriginalTemplateCard image={divineHeroImage} title="Աստվածային օրհնություն" />;
export const ElevateInviteCardPreview = () => <OriginalTemplateCard image={elevateHeroImage} title="Elevate" />;
export const EverAfterCardPreview = () => <OriginalTemplateCard image={everAfterHeroImage} title="Ever After" />;
export const EverlastingVowsCardPreview = () => <OriginalTemplateCard image={everlastingHeroImage} title="Everlasting Vows" />;

export const SacredBeginningsLivePreview = SacredBeginningsTemplate;
export const BirthdaySparkleLivePreview = BirthdaySparkleTemplate;
export const IvoryVowsLivePreview = IvoryVowsTemplate;
export const DivineBlessingLivePreview = DivineBlessingTemplate;
export const ElevateInviteLivePreview = ElevateInviteTemplate;
export const EverAfterLivePreview = EverAfterTemplate;
export const EverlastingVowsLivePreview = EverlastingVowsTemplate;
export const SacredBeginningsInvitationView = (props: TemplateProps) => <SacredBeginningsTemplate {...props} mode="public" />;
export const BirthdaySparkleInvitationView = (props: TemplateProps) => <BirthdaySparkleTemplate {...props} mode="public" />;
export const IvoryVowsInvitationView = (props: TemplateProps) => <IvoryVowsTemplate {...props} mode="public" />;
export const DivineBlessingInvitationView = (props: TemplateProps) => <DivineBlessingTemplate {...props} mode="public" />;
export const ElevateInviteInvitationView = (props: TemplateProps) => <ElevateInviteTemplate {...props} mode="public" />;
export const EverAfterInvitationView = (props: TemplateProps) => <EverAfterTemplate {...props} mode="public" />;
export const EverlastingVowsInvitationView = (props: TemplateProps) => <EverlastingVowsTemplate {...props} mode="public" />;
