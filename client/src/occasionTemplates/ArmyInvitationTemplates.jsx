import { useCallback } from 'react';

import CeremonialApp from '../vendorTemplates/armyCeremonial/src/App.jsx';
import ceremonialFontUrl from '../vendorTemplates/armyCeremonial/src/assets/Arzumanian Aero Sans.ttf?url';
import ceremonialSong from '../vendorTemplates/armyCeremonial/src/assets/invitation-song.mp3';
import ceremonialPhoto from '../vendorTemplates/armyCeremonial/src/assets/soldier-photo.jpg';
import ceremonialStylesSource from '../vendorTemplates/armyCeremonial/src/styles.css?inline';
import CamouflageApp from '../vendorTemplates/armyCamouflage/src/App.jsx';
import camouflageBackgroundUrl from '../vendorTemplates/armyCamouflage/src/assets/camouflage-bg.png?url';
import camouflageFontUrl from '../vendorTemplates/armyCamouflage/src/assets/Arzumanian Aero Sans.ttf?url';
import camouflageSong from '../vendorTemplates/armyCamouflage/src/assets/invitation-song.mp3';
import camouflagePhoto from '../vendorTemplates/armyCamouflage/src/assets/soldier-photo.jpg';
import camouflageStylesSource from '../vendorTemplates/armyCamouflage/src/styles.css?inline';
import { OriginalTemplateSurface, TemplateShell } from './OriginalTypeScriptTemplates.tsx';
import { getConfiguredTemplateGallery, resolveTemplateImage } from './templateAssets.js';

const DEFAULTS = {
  name: 'Նարեկ',
  eventDate: '2026-05-25',
  time: '17:00',
  venue: 'NRENI ՌԵՍՏՈՐԱՆ',
  address: 'ք. Վերին Դվին, Նորակերտ թաղամաս 2-րդ փողոց, 2/24',
  mapUrl: 'https://maps.google.com',
  message: 'Սիրով հրավիրում ենք Ձեզ ներկա գտնվելու Նարեկի զինվորական ծառայության ճանապարհման առիթով կազմակերպվող մեր ընտանեկան երեկոյին։',
  deadline: '20.05.2026'
};

const ceremonialStyles = ceremonialStylesSource.replace(
  './assets/Arzumanian Aero Sans.ttf',
  ceremonialFontUrl
);
const camouflageStyles = camouflageStylesSource
  .replace('./assets/Arzumanian Aero Sans.ttf', camouflageFontUrl)
  .replace('./assets/camouflage-bg.png', camouflageBackgroundUrl);

const fontFace = (url) => `@font-face { font-family: 'Arzumanian Aero Sans'; src: url('${url}') format('truetype'); font-weight: 400; font-style: normal; font-display: swap; }`;
const getAdapterCss = (background, variant) => `
  :host {
    --background: ${background};
    --foreground: #fff;
    --font-body: 'Arzumanian Aero Sans', Arial, sans-serif;
    --font-display: 'Arzumanian Aero Sans', Arial, sans-serif;
    font-family: var(--font-body);
  }
  .original-template-document { min-width: 320px; }
  ${variant === 'ceremonial' ? `
    .page-shell {
      color: var(--text);
      background:
        radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--text) 14%, transparent), transparent 36%),
        linear-gradient(180deg, var(--blue-950) 0%, var(--blue-800) 48%, color-mix(in srgb, var(--text) 24%, var(--blue-700)) 100%);
    }
    .intro-section { background: linear-gradient(180deg, color-mix(in srgb, var(--blue-900) 74%, transparent), color-mix(in srgb, var(--blue-700) 38%, transparent)); }
    .details-section { background: color-mix(in srgb, var(--text) 4%, var(--blue-900)); }
    .rsvp-section { background: linear-gradient(180deg, color-mix(in srgb, var(--blue-950) 76%, transparent), var(--blue-950)); }
    .footer { background: var(--blue-950); }
  ` : `
    .global-overlay { background: linear-gradient(180deg, color-mix(in srgb, var(--dark) 74%, transparent), color-mix(in srgb, var(--olive-2) 58%, transparent) 34%, var(--dark)); }
    .intro-section, .details-section, .quote-section, .rsvp-section, .footer { background-color: var(--dark); }
  `}
  .army-template-studio .reveal { opacity: 1 !important; filter: none !important; transform: none !important; }
`;

const CEREMONIAL_THEME_ALIASES = {
  accent: ['--gold', '--gold-2'],
  text: ['--text', '--muted'],
  overlay: ['--blue-950', '--blue-900', '--blue-800', '--blue-700']
};

const CAMOUFLAGE_THEME_ALIASES = {
  accent: ['--gold', '--gold-soft'],
  text: ['--cream'],
  overlay: ['--olive', '--olive-2', '--dark', '--glass']
};

const formatDate = (value) => {
  const date = new Date(`${value || DEFAULTS.eventDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return String(value || '');
  return [date.getDate(), date.getMonth() + 1, date.getFullYear()]
    .map((part, index) => index < 2 ? String(part).padStart(2, '0') : String(part))
    .join('.');
};

const setText = (element, value) => {
  if (element && element.textContent !== String(value ?? '')) element.textContent = String(value ?? '');
};

const setOwnText = (element, value) => {
  if (!element) return;
  const textNode = [...element.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  if (textNode && textNode.textContent.trim() !== String(value ?? '').trim()) textNode.textContent = String(value ?? '');
};

const mark = (root, selector, attributes) => {
  const element = root.querySelector(selector);
  if (!element) return null;
  Object.entries(attributes).forEach(([name, value]) => {
    if (element.getAttribute(name) !== value) element.setAttribute(name, value);
  });
  return element;
};

const setStatusMessage = (form, message, state) => {
  let status = form.querySelector('.success-message');
  if (!status) {
    status = document.createElement('p');
    status.className = 'success-message success-enter';
    form.append(status);
  }
  status.setAttribute('role', state === 'error' ? 'alert' : 'status');
  setText(status, message);
};

const bindRsvp = (root, draft, onRsvpSubmit) => {
  const form = root.querySelector('.rsvp-form');
  if (!form) return;
  form.__amuletRsvpSubmit = onRsvpSubmit;
  form.__amuletRsvpDraft = draft;
  if (form.__amuletRsvpBound) return;
  form.__amuletRsvpBound = true;
  form.addEventListener('submit', async (event) => {
    if (!form.__amuletRsvpSubmit) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    const button = form.querySelector('.submit-button');
    const checked = form.querySelector('input[type="radio"]:checked');
    const inputs = form.querySelectorAll('input[type="text"]');
    const guestCount = Number(form.querySelector('.counter strong')?.textContent) || 1;
    if (button) button.disabled = true;
    setStatusMessage(form, 'Ուղարկվում է…', 'loading');
    try {
      await form.__amuletRsvpSubmit({
        guestName: String(inputs[0]?.value || '').trim(),
        status: checked && checked === form.querySelectorAll('input[type="radio"]')[1] ? 'declined' : 'attending',
        guestCount,
        guestSide: 'other',
        message: String(form.querySelector('textarea')?.value || '').trim()
      });
      setStatusMessage(form, 'Շնորհակալություն։ Ձեր պատասխանը հաստատված է։', 'success');
      form.reset();
    } catch {
      setStatusMessage(form, 'Չհաջողվեց ուղարկել։ Խնդրում ենք փորձել կրկին։', 'error');
    } finally {
      if (button) button.disabled = false;
    }
  }, true);
};

const customizeArmyTemplate = (root, draft, onRsvpSubmit, mode) => {
  const venue = (draft.mapLinks || []).find((item) => item?.visible !== false) || {};
  const name = draft.mainNames || DEFAULTS.name;
  const date = formatDate(draft.eventDate);
  const time = venue.time || draft.eventTime || DEFAULTS.time;
  const settings = draft.rsvpSettings || {};

  root.querySelector('.page-shell')?.classList.toggle('army-template-studio', mode === 'studio');
  mark(root, '.hero', { 'data-editor-section': 'hero' });
  mark(root, '.intro-section', { 'data-editor-section': 'hero' });
  mark(root, '.details-section', { 'data-editor-section': 'schedule' });
  mark(root, '.quote-section', { 'data-editor-section': 'templateContent' });
  mark(root, '.rsvp-section', { 'data-editor-section': 'rsvp' });
  mark(root, '.footer', { 'data-editor-section': 'closing' });

  const nameElement = mark(root, '.hero h1', { 'data-editor-field': 'mainNames' });
  setText(nameElement, name);
  mark(root, '.hero-title', { 'data-template-text-key': 'army-invitation-title' });

  const message = mark(root, '.intro-section .body-copy', { 'data-editor-field': 'eventMessage' });
  setText(message, draft.eventMessage || DEFAULTS.message.replace('Նարեկի', `${name}ի`));
  mark(root, '.intro-section .body-copy:nth-of-type(3)', { 'data-template-text-key': 'army-secondary-message' });

  const dateElements = root.querySelectorAll('.details-section .section-heading h2, .detail-card small + strong');
  dateElements.forEach((element) => {
    if (element.closest('.detail-card') && element.closest('.detail-card') !== root.querySelectorAll('.detail-card')[1]) return;
    element.setAttribute('data-editor-field', 'eventDate');
    setText(element, date);
  });

  const cards = root.querySelectorAll('.detail-card');
  const timeCard = cards[0];
  const venueCard = root.querySelector('.venue-card');
  const timeElement = timeCard?.querySelector('strong');
  if (timeElement) {
    timeElement.setAttribute('data-editor-field', 'mapLinks.0.time');
    setText(timeElement, time);
  }
  const venueName = venueCard?.querySelector('strong');
  const venueAddress = venueCard?.querySelector('p');
  const venueLink = venueCard?.querySelector('a');
  if (venueName) {
    venueName.setAttribute('data-editor-field', 'mapLinks.0.label');
    setText(venueName, venue.label || DEFAULTS.venue);
  }
  if (venueAddress) {
    venueAddress.setAttribute('data-editor-field', 'mapLinks.0.address');
    setText(venueAddress, venue.address || draft.eventLocation || DEFAULTS.address);
  }
  if (venueLink) venueLink.href = venue.url || draft.mapLink || DEFAULTS.mapUrl;

  mark(root, '.quote-section blockquote', { 'data-template-text-key': 'army-service-wish' });
  const rsvpTitle = mark(root, '.rsvp-section .section-heading h2', { 'data-editor-field': 'rsvpSettings.title' });
  setText(rsvpTitle, settings.title || 'Ձեր ներկայությունը');
  const rsvpDescription = root.querySelector('.rsvp-section .section-heading > p');
  setText(rsvpDescription, settings.description || 'Խնդրում ենք հաստատել');
  const deadline = root.querySelector('.rsvp-section .section-heading > span:not(.round-icon), .rsvp-section .light-heading > span');
  setText(deadline, `Պատասխանեք մինչև ${settings.deadline || DEFAULTS.deadline}`);
  const nameInput = root.querySelector('.rsvp-form input[type="text"]');
  if (nameInput) nameInput.placeholder = settings.guestPlaceholder || 'Գրեք Ձեր անունը';
  const optionLabels = root.querySelectorAll('.radio-row span');
  setText(optionLabels[0], settings.attendingLabel || 'Սիրով, կմասնակցեմ');
  setText(optionLabels[1], settings.notAttendingLabel || 'Ցավոք, չեմ կարող ներկա լինել');
  const submitButton = root.querySelector('.submit-button');
  setOwnText(submitButton, settings.submitLabel || 'Ուղարկել պատասխանը');
  const guestPicker = root.querySelector('.guest-picker');
  if (guestPicker) guestPicker.hidden = settings.askGuestCount === false;

  const closing = mark(root, '.footer p', { 'data-editor-field': 'closingMessage' });
  setText(closing, draft.closingMessage || 'Սիրով սպասում ենք Ձեզ');
  const imageOverrides = draft.templateImageOverrides || {};
  const stableImageKey = (stableKey, legacyKey) => (
    Object.prototype.hasOwnProperty.call(imageOverrides, stableKey)
      ? stableKey
      : (Object.prototype.hasOwnProperty.call(imageOverrides, legacyKey) ? legacyKey : stableKey)
  );
  mark(root, '.hero-emblem', { 'data-template-image-key': stableImageKey('army-hero-emblem', 'image-0') });
  const soldier = mark(root, '.soldier-photo', { 'data-template-image-key': 'army-soldier-photo' });
  mark(root, '.small-emblem img', { 'data-template-image-key': stableImageKey('army-small-emblem', 'image-2') });
  mark(root, '.footer img', { 'data-template-image-key': stableImageKey('army-footer-emblem', 'image-3') });
  const photo = resolveTemplateImage(draft.gallery?.[0] || draft.image);
  if (soldier && photo && soldier.getAttribute('src') !== photo) soldier.setAttribute('src', photo);
  if (soldier) soldier.alt = `${name}-ի լուսանկարը`;

  const audio = root.querySelector('audio');
  const musicZone = root.querySelector('.music-zone');
  if (musicZone) musicZone.setAttribute('data-editor-ignore', 'music');
  const musicSource = draft.musicEnabled === false ? '' : draft.musicUrl;
  if (musicZone) musicZone.hidden = !musicSource;
  if (audio && musicSource && audio.getAttribute('src') !== musicSource) audio.setAttribute('src', musicSource);
  if (audio && !musicSource) audio.removeAttribute('src');

  bindRsvp(root, draft, onRsvpSubmit);
};

const makeDraft = (template, photo, song, deadline) => {
  const gallery = getConfiguredTemplateGallery(template, [photo]);
  return {
    mainNames: DEFAULTS.name,
    eventDate: DEFAULTS.eventDate,
    eventTime: DEFAULTS.time,
    eventLocation: DEFAULTS.address,
    eventMessage: DEFAULTS.message,
    image: gallery[0] || photo,
    gallery,
    mapLink: DEFAULTS.mapUrl,
    mapLinks: [{ label: DEFAULTS.venue, time: DEFAULTS.time, address: DEFAULTS.address, url: DEFAULTS.mapUrl, visible: true }],
    colors: {},
    musicEnabled: true,
    musicUrl: song,
    musicTitle: 'Բանակ ճանապարհելու հրավերի երգ',
    closingMessage: 'Սիրով սպասում ենք Ձեզ',
    rsvpSettings: {
      title: 'Ձեր ներկայությունը',
      description: 'Խնդրում ենք հաստատել մասնակցությունը։',
      deadline,
      guestPlaceholder: 'Գրեք Ձեր անունը',
      attendingLabel: 'Սիրով, կմասնակցեմ',
      notAttendingLabel: 'Ցավոք, չեմ կարող ներկա լինել',
      submitLabel: 'Ուղարկել պատասխանը',
      askGuestCount: true,
      askMeal: false
    }
  };
};

const normalizeKey = (value) => String(value || '').trim().toLowerCase().replace(/[_\s]+/g, '-');
const matches = (template, keys) => [template.designKey, template.slug, template.title].map(normalizeKey).some((value) => keys.includes(value));

export const isArmyCeremonialTemplate = (template = {}) => matches(template, ['army-ceremonial', 'amulet-army-invitation']);
export const isArmyCamouflageTemplate = (template = {}) => matches(template, ['army-camouflage', 'army-invitation-camouflage']);

export const getArmyCeremonialDraft = (template = {}) => makeDraft(template, ceremonialPhoto, ceremonialSong, '1.06.2026');
export const getArmyCamouflageDraft = (template = {}) => makeDraft(template, camouflagePhoto, camouflageSong, '20.05.2026');

function ArmyTemplate({ variant, ...props }) {
  const ceremonial = variant === 'ceremonial';
  const draft = props.draft || (ceremonial ? getArmyCeremonialDraft() : getArmyCamouflageDraft());
  const customize = useCallback((root) => customizeArmyTemplate(root, draft, props.onRsvpSubmit, props.mode), [draft, props.mode, props.onRsvpSubmit]);
  const App = ceremonial ? CeremonialApp : CamouflageApp;
  const styles = ceremonial ? ceremonialStyles : camouflageStyles;
  const adapterCss = getAdapterCss(ceremonial ? '#081a30' : '#171b12', ceremonial ? 'ceremonial' : 'camouflage');
  const fontUrl = ceremonial ? ceremonialFontUrl : camouflageFontUrl;
  const themeVariableAliases = ceremonial ? CEREMONIAL_THEME_ALIASES : CAMOUFLAGE_THEME_ALIASES;
  const label = ceremonial ? 'Կապույտ հանդիսավոր բանակի քեֆի հրավեր' : 'Քողարկանախշ բանակի քեֆի հրավեր';
  return <TemplateShell props={props}><OriginalTemplateSurface css={styles} adapterCss={adapterCss} draft={draft} fontImport={fontFace(fontUrl)} globalFontImport={fontFace(fontUrl)} label={label} customize={customize} themeVariableAliases={themeVariableAliases}><App /></OriginalTemplateSurface></TemplateShell>;
}

export const ArmyCeremonialLivePreview = (props) => <ArmyTemplate {...props} variant="ceremonial" />;
export const ArmyCeremonialInvitationView = (props) => <ArmyTemplate {...props} variant="ceremonial" mode="public" />;
export const ArmyCamouflageLivePreview = (props) => <ArmyTemplate {...props} variant="camouflage" />;
export const ArmyCamouflageInvitationView = (props) => <ArmyTemplate {...props} variant="camouflage" mode="public" />;

export const ArmyCeremonialCardPreview = () => <div className="original-template-card-preview" style={{ background: '#0a2442' }}><img src={ceremonialPhoto} alt="" /><div /><span>React template</span><strong>Հանդիսավոր բանակի քեֆ</strong></div>;
export const ArmyCamouflageCardPreview = () => <div className="original-template-card-preview" style={{ background: '#1b2116' }}><img src={camouflagePhoto} alt="" /><div /><span>React template</span><strong>Քողարկանախշ բանակի քեֆ</strong></div>;
