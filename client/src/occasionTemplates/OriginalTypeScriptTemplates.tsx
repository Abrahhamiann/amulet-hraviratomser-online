import { useCallback, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
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
import { resolveTemplateImage, templateDefaultGalleryIds } from './templateAssets.js';

import './originalTypeScriptTemplates.css';

type TemplateRecord = Record<string, unknown>;

type SurfaceProps = {
  children: ReactNode;
  css: string;
  fontImport: string;
  label: string;
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
  rsvpForm?: ReactNode;
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

const formatArmenianDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  const months = ['հունվարի', 'փետրվարի', 'մարտի', 'ապրիլի', 'մայիսի', 'հունիսի', 'հուլիսի', 'օգոստոսի', 'սեպտեմբերի', 'հոկտեմբերի', 'նոյեմբերի', 'դեկտեմբերի'];
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
};

const splitNames = (value?: string) => String(value || '').split(/\s*(?:&|և|եւ|\+|,|·)\s*/).filter(Boolean);

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

function OriginalTemplateSurface({ children, css, fontImport, label, customize }: SurfaceProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLDivElement | null>(null);
  const isolatedCss = useMemo(() => css.replaceAll(':root', ':host'), [css]);

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
      .original-template-document h1, .original-template-document h2, .original-template-document h3 { font-family: var(--font-display, ui-serif, Georgia, serif); }
    `;
    shadow.replaceChildren(style, root);
    setPortalRoot(root);

    const applyLocalization = () => {
      localizeTemplateUi(root);
      customize?.(root);
    };
    const observer = new MutationObserver(applyLocalization);
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    const frame = requestAnimationFrame(applyLocalization);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      setPortalRoot(null);
    };
  }, [customize, fontImport, isolatedCss]);

  return (
    <div ref={hostRef} className="original-ts-template-host" role="document" aria-label={label}>
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
      {props.mode === 'public' && (props.actions || props.rsvpForm) ? (
        <section className="original-template-public-extras">
          {props.rsvpForm ? <div className="original-template-rsvp">{props.rsvpForm}</div> : null}
          {props.actions ? <div className="original-template-public-actions">{props.actions}</div> : null}
        </section>
      ) : null}
    </div>
  );
}

function SacredBeginningsTemplate(props: TemplateProps) {
  const { draft = {} } = props;
  const data = useMemo<InvitationData>(() => {
    const image = resolveTemplateImage(draft.image) || sacredInvitation.child.portrait.src;
    const gallery = (draft.gallery || []).map(resolveTemplateImage).filter(Boolean);
    return {
      ...sacredInvitation,
      child: { ...sacredInvitation.child, name: draft.mainNames || sacredInvitation.child.name, portrait: { ...sacredInvitation.child.portrait, src: image } },
      hero: { ...sacredInvitation.hero, dateLabel: formatArmenianDate(draft.eventDate) || sacredInvitation.hero.dateLabel },
      intro: { ...sacredInvitation.intro, subMessage: draft.eventMessage || sacredInvitation.intro.subMessage },
      event: { ...sacredInvitation.event, isoDate: draft.eventDate ? `${draft.eventDate}T${draft.eventTime || '14:00'}:00+04:00` : sacredInvitation.event.isoDate, dateLabel: formatArmenianDate(draft.eventDate) || sacredInvitation.event.dateLabel, timeLabel: draft.eventTime || sacredInvitation.event.timeLabel, venue: draft.eventLocation || sacredInvitation.event.venue },
      gallery: gallery.length ? gallery.map((src, index) => ({ src, alt: `${draft.mainNames || sacredInvitation.child.name} ${index + 1}` })) : sacredInvitation.gallery
    };
  }, [draft]);
  return (
    <TemplateShell props={props}><OriginalTemplateSurface
      css={sacredStyles}
      fontImport={'@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap");'}
      label="Սուրբ սկիզբ մկրտության հրավեր"
    >
      <BaptismInvitation data={data} />
    </OriginalTemplateSurface></TemplateShell>
  );
}

function BirthdaySparkleTemplate(props: TemplateProps) {
  const { draft = {} } = props;
  const [revealed, setRevealed] = useState(false);
  const onIntroDone = useCallback(() => setRevealed(true), []);
  const handleRsvp = useCallback((_data: RsvpData) => undefined, []);
  const data = useMemo<InvitationConfig>(() => {
    const image = resolveTemplateImage(draft.image) || birthdayInvitation.portrait.src;
    const gallery = (draft.gallery || []).map(resolveTemplateImage).filter(Boolean);
    return {
      ...birthdayInvitation,
      birthdayPersonName: draft.mainNames || birthdayInvitation.birthdayPersonName,
      fullName: draft.mainNames || birthdayInvitation.fullName,
      eventDateISO: draft.eventDate ? `${draft.eventDate}T${draft.eventTime || '19:00'}:00` : birthdayInvitation.eventDateISO,
      dateLabel: formatArmenianDate(draft.eventDate) || birthdayInvitation.dateLabel,
      timeLabel: draft.eventTime || birthdayInvitation.timeLabel,
      venue: draft.eventLocation || birthdayInvitation.venue,
      personalMessage: draft.eventMessage || birthdayInvitation.personalMessage,
      portrait: { ...birthdayInvitation.portrait, src: image },
      photos: gallery.length ? gallery.map((src, index) => ({ src, alt: `${draft.mainNames || birthdayInvitation.fullName} ${index + 1}`, width: 900, height: 1100 })) : birthdayInvitation.photos
    };
  }, [draft]);

  return (
    <TemplateShell props={props}><OriginalTemplateSurface
      css={birthdayStyles}
      fontImport={'@import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&family=Outfit:wght@200..700&family=Caveat:wght@400..700&display=swap");'}
      label="Փայլուն տարեդարձի հրավեր"
    >
      <main className="relative w-full overflow-x-hidden">
        <BirthdayIntro onDone={onIntroDone} />
        <BirthdayHeroSection data={data} start={revealed} />
        <BirthdayPersonSection data={data} />
        <BirthdayCountdown dateISO={data.eventDateISO} />
        <BirthdayEventDetails data={data} />
        <PartyTimeline schedule={data.schedule} />
        <BirthdayGallery photos={data.photos} />
        <BirthdayMessage data={data} />
        <LocationSection data={data} />
        <RSVPSection onSubmit={handleRsvp} />
        <FinalCelebration data={data} />
        <MusicControl src={data.musicSrc} />
      </main>
    </OriginalTemplateSurface></TemplateShell>
  );
}

function IvoryVowsTemplate(props: TemplateProps) {
  const { draft = {} } = props;
  const [ceremony, reception] = wedding.venues;
  const customize = useCallback((root: HTMLDivElement) => {
    const [groom, bride] = splitNames(draft.mainNames);
    const replacements: Record<string, string> = {
      [wedding.couple.groom.name]: groom || wedding.couple.groom.name,
      [wedding.couple.bride.name]: bride || wedding.couple.bride.name,
      [wedding.date.long]: formatArmenianDate(draft.eventDate) || wedding.date.long,
      [wedding.invitation.note]: draft.eventMessage || wedding.invitation.note,
      [wedding.venues[0]?.name || '']: draft.eventLocation || wedding.venues[0]?.name || ''
    };
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      const value = node.nodeValue || '';
      const trimmed = value.trim();
      if (replacements[trimmed]) {
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
      fontImport={'@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&family=Noto+Serif+Armenian:wght@300;400&family=Noto+Sans+Armenian:wght@300;400&display=swap");'}
      label="Փղոսկրե երդումներ հարսանեկան հրավեր"
      customize={customize}
    >
      <main className="overflow-x-hidden">
        <WeddingHeroSection />
        <InvitationMessage />
        <CoupleSection />
        <StoryTimeline />
        <WeddingCountdown />
        <WeddingSchedule />
        {ceremony ? <VenueSection venue={ceremony} /> : null}
        {reception ? <VenueSection venue={reception} reverse /> : null}
        <WeddingGallery />
        <DressCode />
        <ImportantInfo />
        <RSVPForm />
        <ContactSection />
        <ClosingSection />
        <WeddingFooter />
        <FloatingActions />
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

export const getIvoryVowsDraft = () => makeDraft(
  `${wedding.couple.groom.name} & ${wedding.couple.bride.name}`,
  wedding.date.iso.slice(0, 10),
  wedding.venues[0]?.time || '',
  wedding.venues[0]?.name || '',
  ivoryHero,
  'ivory-vows'
);

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

export const SacredBeginningsLivePreview = SacredBeginningsTemplate;
export const BirthdaySparkleLivePreview = BirthdaySparkleTemplate;
export const IvoryVowsLivePreview = IvoryVowsTemplate;
export const SacredBeginningsInvitationView = (props: TemplateProps) => <SacredBeginningsTemplate {...props} mode="public" />;
export const BirthdaySparkleInvitationView = (props: TemplateProps) => <BirthdaySparkleTemplate {...props} mode="public" />;
export const IvoryVowsInvitationView = (props: TemplateProps) => <IvoryVowsTemplate {...props} mode="public" />;
