import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ArrowLeft, CheckCircle2, ChevronDown, Eye, Images, LayoutGrid, Monitor, PanelLeftClose, PanelLeftOpen, Pencil, Redo2, RotateCcw, ShoppingBag, Smartphone, Sparkles, Tablet, Undo2, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import editorExitAlert from '../../assets/animations/editor-exit-alert.lottie?url';
import iphoneDeviceFrame from '../../assets/editor-devices/iphone-device-frame-clean.png';
import ipadDeviceFrame from '../../assets/editor-devices/ipad-device-frame-clean.png';
import logoImage from '../../assets/logo.webp';
import { EditorProvider, useEditor } from './EditorContext.jsx';
import TemplatesPanel from './TemplatesPanel.jsx';
import ContentPanel from './ContentPanel.jsx';
import DesignPanel from './DesignPanel.jsx';
import MediaPanel from './MediaPanel.jsx';
import BuyPanel from './BuyPanel.jsx';
import { splitNames } from './editorData.js';
import { resolveTemplateImage } from '../../occasionTemplates/templateAssets.js';
import { prepareImage } from './mediaUtils.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import './invitationEditor.css';

const previewSectionSelectors = {
  hero: [
    '.midnight-cover', '.midnight-message-section',
    '.engagement-cover', '.engagement-message-copy',
    '.baptism-hero', '.baptism-countdown-section', '.baptism-message-copy',
    '.sacred-hero', '.sacred-message',
    '.birthday-hero', '.birthday-message',
    '.ivory-hero', '.ivory-message',
    '.divine-hero', '.elevate-hero', '.ever-after-hero', '.everlasting-hero', '.forever-vows-hero', '.silk-vows-hero'
  ],
  family: ['.midnight-family-note', '.engagement-family-note', '.baptism-family-note', '.divine-family'],
  schedule: [
    '.midnight-schedule',
    '.engagement-week', '.engagement-location', '.engagement-place-list',
    '.baptism-event-section', '.baptism-party-section',
    '.sacred-schedule', '.birthday-schedule', '.ivory-schedule',
    '.divine-schedule', '.elevate-schedule', '.ever-after-schedule', '.everlasting-schedule', '.forever-vows-schedule', '.silk-vows-schedule'
  ],
  rsvp: ['.midnight-rsvp-section', '.engagement-rsvp-section', '.baptism-rsvp-section', '.sacred-rsvp', '.birthday-rsvp', '.ivory-rsvp', '.divine-rsvp', '.elevate-rsvp', '.ever-after-rsvp', '.everlasting-rsvp', '.forever-vows-rsvp', '.silk-vows-rsvp'],
  closing: ['.midnight-signature', '.engagement-final', '.baptism-signature', '.sacred-closing', '.birthday-closing', '.ivory-closing', '.divine-closing', '.elevate-closing', '.ever-after-closing', '.everlasting-closing', '.forever-vows-closing', '.silk-vows-closing'],
  dress: ['.curated-dress', '.ivory-dress', '.elevate-dress', '.ever-after-dress', '.everlasting-dress', '.forever-vows-dress']
};

const normalizePreviewText = (value) => String(value || '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('hy');

const TEMPLATE_TEXT_SELECTOR = 'h1, h2, h3, h4, h5, h6, p, span, strong, b, em, legend, blockquote, label, button, a, li, figcaption, small, time, address, dt, dd, th, td';
const EDITOR_TEXT_SECTIONS = new Set(['hero', 'family', 'schedule', 'rsvp', 'dress', 'closing', 'templateContent']);

const getEditableTextSection = (element, fallback = 'templateContent') => {
  const section = element.closest('[data-editor-section]')?.dataset.editorSection || fallback;
  return EDITOR_TEXT_SECTIONS.has(section) ? section : 'templateContent';
};

const getDatePreviewValues = (value) => {
  if (!value) return [];
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return [value];
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const armenianMonths = ['հունվարի', 'փետրվարի', 'մարտի', 'ապրիլի', 'մայիսի', 'հունիսի', 'հուլիսի', 'օգոստոսի', 'սեպտեմբերի', 'հոկտեմբերի', 'նոյեմբերի', 'դեկտեմբերի'];
  return [
    value,
    `${day}.${month}.${date.getFullYear()}`,
    `${day} · ${month} · ${date.getFullYear()}`,
    `${day} • ${month} • ${date.getFullYear()}`,
    `${date.getDate()} ${armenianMonths[date.getMonth()]}, ${date.getFullYear()}`,
    `${date.getDate()} ${armenianMonths[date.getMonth()]} ${date.getFullYear()}`
  ];
};

const getTemplateImageLabel = (image, index, labels = {}) => {
  const alt = String(image.alt || '').trim();
  if (alt) return alt;

  const context = [
    image.className,
    image.closest?.('section, article, figure, div')?.className
  ].filter((value) => typeof value === 'string').join(' ').toLowerCase();

  if (/hero|cover|intro/.test(context)) return labels.heroImage || 'Main section image';
  if (/gallery|carousel|slider/.test(context)) return `${labels.galleryImage || 'Gallery image'} ${index + 1}`;
  if (/bride|groom|couple|portrait|person|child|family/.test(context)) return labels.participantImage || 'Participant or family image';
  if (/venue|location|church|party|event|place/.test(context)) return labels.venueImage || 'Event venue image';
  if (/closing|final|footer/.test(context)) return labels.closingImage || 'Closing section image';
  return `${labels.invitationImage || 'Invitation image'} ${index + 1}`;
};

export const updateDraftTextField = (draft, field, value) => {
  if (!field) return;
  if (field === 'mainName.0' || field === 'mainName.1') {
    const names = splitNames(draft.mainNames);
    names[field.endsWith('.1') ? 1 : 0] = value;
    draft.mainNames = names.join(' & ');
    return;
  }
  const parts = field.split('.');
  let target = draft;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];
    const nextPart = parts[index + 1];
    if (target[part] == null) target[part] = /^\d+$/.test(nextPart) ? [] : {};
    target = target[part];
  }
  target[parts.at(-1)] = value;
};

const getPreviewFields = (data) => {
  const [firstName, secondName] = splitNames(data.mainNames);
  const fields = [];

  (data.mapLinks || []).forEach((item, index) => {
    ['label', 'subtitle', 'address'].forEach((key) => {
      fields.push([`mapLinks.${index}.${key}`, 'schedule', [item?.[key]], true]);
    });
    fields.push([`mapLinks.${index}.time`, 'schedule', [item?.time], false]);
  });

  fields.push(
    ['mainNames', 'hero', [data.mainNames]],
    ['mainName.0', 'hero', [firstName]],
    ['mainName.1', 'hero', [secondName]],
    ['eventMessage', 'hero', [data.eventMessage]],
    ['groomFamilyTitle', 'family', [data.groomFamilyTitle]],
    ['brideFamilyTitle', 'family', [data.brideFamilyTitle]],
    ['eventDate', 'schedule', getDatePreviewValues(data.eventDate), false],
    ['eventTime', 'schedule', [data.eventTime], false],
    ['eventLocation', 'schedule', [data.eventLocation]],
    ['rsvpSettings.title', 'rsvp', [data.rsvpSettings?.title]],
    ['rsvpSettings.description', 'rsvp', [data.rsvpSettings?.description]],
    ['rsvpSettings.deadline', 'rsvp', [data.rsvpSettings?.deadline]],
    ['rsvpSettings.guestPlaceholder', 'rsvp', [data.rsvpSettings?.guestPlaceholder]],
    ['rsvpSettings.attendingLabel', 'rsvp', [data.rsvpSettings?.attendingLabel]],
    ['rsvpSettings.notAttendingLabel', 'rsvp', [data.rsvpSettings?.notAttendingLabel]],
    ['rsvpSettings.submitLabel', 'rsvp', [data.rsvpSettings?.submitLabel]],
    ['rsvpQuestion', 'rsvp', [data.rsvpQuestion]],
    ['dressCode', 'dress', [data.dressCode]],
    ['closingMessage', 'closing', [data.closingMessage]]
  );

  return fields.map(([field, section, values, inline = true]) => ({
    field,
    section,
    inline,
    displayValue: values.length === 1 ? String(values[0] ?? '') : undefined,
    values: values.map(normalizePreviewText).filter((value) => value.length > 1)
  }));
};

const shadowHotspotStyles = `
  [data-editor-kind]{position:relative;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent;outline:2px solid transparent;outline-offset:5px;transition:background-color .24s ease,box-shadow .24s ease}
  [data-editor-kind="text"][contenteditable]{appearance:none!important;-webkit-appearance:none!important;border:0!important;border-radius:0!important;outline:0!important;box-shadow:none!important;cursor:text;caret-color:#d07d4f;user-select:text;-webkit-user-select:text}
  [data-editor-kind="text"][contenteditable]:focus:not(.is-editor-active),[data-editor-kind="text"][contenteditable]:focus-visible:not(.is-editor-active){border:0!important;outline:0!important;box-shadow:none!important}
  [data-editor-kind="text"][contenteditable]:empty{display:inline-block;min-width:2ch;min-height:1.25em}
  [data-editor-kind="text"]::after{pointer-events:none}
  [data-editor-kind="text"].is-editor-inline-editing{outline-color:#d07d4f;background-color:rgba(208,125,79,.055)}
  [data-editor-kind="text"].is-editor-inline-editing::after{opacity:0!important}
  [data-editor-kind]::after{content:attr(data-editor-label);position:absolute;z-index:999;top:-13px;right:-7px;min-height:30px;display:flex;align-items:center;padding:0 10px 0 31px;border:1px solid rgba(255,255,255,.86);border-radius:5px;background-color:#d07d4f;background-position:9px center;background-repeat:no-repeat;background-size:14px;color:#fff;font:700 11px/1.1 Arial,sans-serif;letter-spacing:.01em;white-space:nowrap;box-shadow:0 6px 18px rgba(50,28,14,.22);opacity:0;transform:translateY(4px);pointer-events:none;transition:opacity .2s ease,transform .2s ease}
  [data-editor-kind="text"]::after{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 20h9'/%3E%3Cpath d='M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z'/%3E%3C/svg%3E")}
  .road-label [data-editor-kind="text"]::after{top:-38px;right:0}
  [data-editor-kind="image"]::after{top:12px;right:12px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14.5 4h-5L7.8 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.8z'/%3E%3Ccircle cx='12' cy='13' r='3'/%3E%3C/svg%3E")}
  [data-editor-kind="color"]::after{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m19 3 2 2L8.5 17.5 5 19l1.5-3.5Z'/%3E%3Cpath d='m15 7 2 2'/%3E%3C/svg%3E")}
  [data-editor-kind="map"]::after{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z'/%3E%3Ccircle cx='12' cy='10' r='2.5'/%3E%3C/svg%3E")}
  [data-editor-kind]:is(:hover,:focus-visible){outline-color:#d07d4f;background-color:rgba(208,125,79,.035)}
  [data-editor-kind]:is(:hover,:focus-visible)::after{opacity:1;transform:translateY(0)}
  [data-editor-kind].is-editor-active{outline:3px solid #d07d4f!important;outline-offset:7px!important;background-color:rgba(208,125,79,.055)!important;box-shadow:0 0 0 5px rgba(208,125,79,.14)!important;animation:amuletEditorFocusPulse .72s cubic-bezier(.2,.8,.2,1) both}
  [data-editor-kind].is-editor-active::after{opacity:1;transform:translateY(0)}
  @keyframes amuletEditorFocusPulse{0%{box-shadow:0 0 0 0 rgba(208,125,79,.34)}55%{box-shadow:0 0 0 10px rgba(208,125,79,.1)}100%{box-shadow:0 0 0 5px rgba(208,125,79,.14)}}
  @media (hover:none){[data-editor-kind]::after{content:"";width:34px;min-height:34px;padding:0;background-position:center;opacity:0;transform:none}[data-editor-kind]:is(:focus,.is-editor-active)::after{opacity:.92}}
  @media (prefers-reduced-motion:reduce){[data-editor-kind],[data-editor-kind]::after{transition:none}}
`;

const studioMotionStyles = `
  .original-template-document *, .original-template-document *::before, .original-template-document *::after{animation-delay:0s!important;animation-duration:.001ms!important;animation-iteration-count:1!important;transition-delay:0s!important;transition-duration:.001ms!important;scroll-behavior:auto!important}
  .original-template-document .reveal{opacity:1!important;transform:none!important}
  .original-template-document .road-svg .draw{stroke-dasharray:none!important;stroke-dashoffset:0!important}
  .original-template-document .road-stop{opacity:1!important;transform:none!important}
  .original-template-document .silk-vows-reveal,
  .original-template-document .silk-vows-location-card:nth-child(n){opacity:1!important;transform:none!important}
`;

const makeEditorHotspot = (element, { kind, section, field = '', tab, inline = true, labels = {} }) => {
  element.dataset.editorKind = kind;
  element.dataset.editorSection = section;
  element.dataset.editorTab = tab;
  element.dataset.editorLabel = kind === 'image' ? labels.image : kind === 'map' ? labels.map : kind === 'color' ? labels.color : labels.edit;
  if (field) element.dataset.editorField = field;
  if (kind === 'text' && field && inline) {
    const numeric = element.dataset.editorInputMode === 'numeric';
    element.contentEditable = 'plaintext-only';
    if (!element.isContentEditable) element.contentEditable = 'true';
    element.spellcheck = !numeric;
    if (numeric) element.inputMode = 'numeric';
    element.dataset.editorOwnedContenteditable = '';
    if (!element.hasAttribute('role')) {
      element.setAttribute('role', 'textbox');
      element.dataset.editorOwnedRole = '';
    }
    element.setAttribute('aria-multiline', element.matches('p, blockquote, figcaption') ? 'true' : 'false');
    element.addEventListener('focus', forwardEditorInlineFocus);
    element.addEventListener('input', forwardEditorInlineInput);
    element.addEventListener('blur', forwardEditorInlineBlur);
    element.addEventListener('keydown', forwardEditorInlineKeyDown);
    element.dataset.editorOwnedInlineEvents = '';
  } else if (!element.hasAttribute('tabindex')) {
    element.tabIndex = 0;
    element.dataset.editorOwnedTabindex = '';
  }
  if (kind === 'text' && field && inline) element.dataset.editorInline = 'true';
  if (kind !== 'text' && !element.hasAttribute('role')) {
    element.setAttribute('role', 'button');
    element.dataset.editorOwnedRole = '';
  }
  if (!element.hasAttribute('aria-label')) {
    element.setAttribute('aria-label', kind === 'image' ? labels.changeImage : kind === 'map' ? labels.editMap : kind === 'color' ? labels.editColor : labels.editSection);
    element.dataset.editorOwnedLabel = '';
  }
  if (!element.hasAttribute('data-editor-owned-click')) {
    element.addEventListener('click', forwardEditorHotspotClick);
    element.dataset.editorOwnedClick = '';
  }
};

function forwardEditorInlineFocus(event) {
  const target = event.currentTarget;
  target.dataset.editorOriginalText = target.innerText;
  if (target.dataset.editorInputMode === 'numeric') {
    target.innerText = target.innerText.replace(/\D/g, '');
  }
  target.classList.add('is-editor-inline-editing');
  target.ownerDocument.__amuletEditorHotspotFocusHandler?.(target);
}

function forwardEditorInlineInput(event) {
  const target = event.currentTarget;
  // Keep the contenteditable DOM in charge while the user is typing. Updating
  // React state on every keystroke re-renders imported templates and moves the
  // caret (or drops focus entirely). The final value is committed on blur.
  const rawValue = target.innerText.replace(/\u00a0/g, ' ');
  const value = target.dataset.editorInputMode === 'numeric' ? rawValue.replace(/\D/g, '') : rawValue;
  if (value !== rawValue) {
    target.innerText = value;
    const selection = target.ownerDocument.getSelection();
    selection?.selectAllChildren(target);
    selection?.collapseToEnd();
  }
  target.dataset.editorLiveValue = value;
  target.ownerDocument.__amuletEditorInlineLiveHandler?.({
    field: target.dataset.editorField || '',
    value
  });
}

function forwardEditorInlineBlur(event) {
  const target = event.currentTarget;
  target.classList.remove('is-editor-inline-editing');
  const rawValue = target.innerText.replace(/\u00a0/g, ' ');
  const numeric = target.dataset.editorInputMode === 'numeric';
  const value = numeric ? rawValue.replace(/\D/g, '') : rawValue;
  if (numeric) target.innerText = `${value}${target.dataset.editorNumericSuffix || ''}`;
  delete target.dataset.editorOriginalText;
  target.ownerDocument.__amuletEditorInlineCommitHandler?.({
    field: target.dataset.editorField || '',
    value
  });
}

function forwardEditorInlineKeyDown(event) {
  const target = event.currentTarget;
  if (
    target.dataset.editorInputMode === 'numeric'
    && event.key.length === 1
    && !/\d/.test(event.key)
    && !event.ctrlKey
    && !event.metaKey
  ) {
    event.preventDefault();
    return;
  }
  if (event.key === 'Escape') {
    event.preventDefault();
    target.innerText = target.dataset.editorOriginalText ?? target.innerText;
    target.blur();
  }
  if (event.key === 'Enter' && target.getAttribute('aria-multiline') !== 'true') {
    event.preventDefault();
    target.blur();
  }
}

function forwardEditorHotspotClick(event) {
  event.currentTarget.ownerDocument.__amuletEditorHotspotHandler?.(event);
}

const getPreviewRoots = (root) => {
  const roots = [root];
  for (let index = 0; index < roots.length; index += 1) {
    roots[index].querySelectorAll?.('*').forEach((element) => {
      if (element.shadowRoot && !roots.includes(element.shadowRoot)) roots.push(element.shadowRoot);
    });
  }
  const templateShadowRoots = roots.filter((scope) => (
    scope.nodeType === 11 && scope.host?.classList?.contains('original-ts-template-host')
  ));
  return templateShadowRoots.length ? templateShadowRoots : [root];
};

const findPreviewElement = (root, selector) => {
  for (const scope of getPreviewRoots(root)) {
    const match = scope.querySelector?.(selector);
    if (match) return match;
  }
  return null;
};

export const clearPreviewDecorations = (root, { removeStyles = false, preserveActive = false } = {}) => {
  if (!root) return;
  getPreviewRoots(root).forEach((scope) => {
    scope.querySelectorAll('[data-editor-kind], [data-editor-section]').forEach((element) => {
      if (element.hasAttribute('data-editor-owned-tabindex')) element.removeAttribute('tabindex');
      if (element.hasAttribute('data-editor-owned-role')) element.removeAttribute('role');
      if (element.hasAttribute('data-editor-owned-label')) element.removeAttribute('aria-label');
      if (element.hasAttribute('data-editor-owned-click')) element.removeEventListener('click', forwardEditorHotspotClick);
      if (element.hasAttribute('data-editor-owned-inline-events')) {
        element.removeEventListener('focus', forwardEditorInlineFocus);
        element.removeEventListener('input', forwardEditorInlineInput);
        element.removeEventListener('blur', forwardEditorInlineBlur);
        element.removeEventListener('keydown', forwardEditorInlineKeyDown);
      }
      if (element.hasAttribute('data-editor-owned-contenteditable')) {
        element.removeAttribute('contenteditable');
        element.removeAttribute('spellcheck');
        element.removeAttribute('aria-multiline');
      }
      element.classList.remove('is-editor-inline-editing');
      if (!preserveActive) element.classList.remove('is-editor-active', 'is-editor-section-active');
      [
        'data-editor-kind', 'data-editor-field', 'data-editor-tab', 'data-editor-section',
        'data-editor-label', 'data-editor-owned-tabindex', 'data-editor-owned-role',
        'data-editor-owned-label', 'data-editor-owned-click', 'data-editor-owned-contenteditable',
        'data-editor-owned-inline-events', 'data-editor-original-text', 'data-editor-inline',
        'data-editor-rendered-value', 'data-editor-exact-value', 'data-editor-live-value'
      ].forEach((attribute) => element.removeAttribute(attribute));
    });
    if (removeStyles) scope.querySelector('style[data-amulet-edit-hotspots]')?.remove();
  });
};

export const decoratePreview = (root, data, { suppressMotion = false, labels: suppliedLabels = {} } = {}) => {
  if (!root) return { texts: [], images: [] };
  const labels = { image: 'Image', map: 'Map', edit: 'Edit', changeImage: 'Change image', editMap: 'Edit map', editSection: 'Edit this section', ...suppliedLabels };
  const fields = getPreviewFields(data);
  const editableTexts = new Map();
  const editableImages = new Map();

  getPreviewRoots(root).forEach((scope) => {
    // Keep the semantic field identity from the previous render. Imported
    // templates are decorated after React renders inside a shadow root; when
    // their DOM was localized or customized, matching by the newly typed text
    // alone could lose the field and leave the old value visible.
    const previousSemanticFields = new Map(
      [...scope.querySelectorAll('[data-editor-kind="text"][data-editor-field]')].map((element) => [
        element,
        {
          field: element.dataset.editorField,
          renderedValue: element.dataset.editorRenderedValue ?? element.textContent ?? '',
          exact: element.dataset.editorExactValue === 'true'
        }
      ])
    );
    if (scope.nodeType === 11 && scope.host && !scope.querySelector('style[data-amulet-edit-hotspots]')) {
      const style = scope.ownerDocument.createElement('style');
      style.dataset.amuletEditHotspots = '';
      style.textContent = `${suppressMotion ? studioMotionStyles : ''}${shadowHotspotStyles}`;
      scope.append(style);
    }

    clearPreviewDecorations(scope, { preserveActive: true });

    Object.entries(previewSectionSelectors).forEach(([section, selectors]) => {
      selectors.forEach((selector) => scope.querySelectorAll(selector).forEach((element) => {
        element.dataset.editorSection = section;
      }));
    });

    const genericSections = ['hero', 'hero', 'family', 'schedule', 'schedule', 'schedule', 'media', 'closing', 'schedule', 'rsvp', 'closing'];
    scope.querySelectorAll('section').forEach((element, index) => {
      if (element.closest('[data-editor-ignore]')) return;
      if (!element.dataset.editorSection && !element.parentElement?.closest('[data-editor-section]')) {
        element.dataset.editorSection = genericSections[index] || 'closing';
      }
    });

    const textCandidatesByBlock = new Map();
    const selectedTextContainers = new Set();
    scope.querySelectorAll(TEMPLATE_TEXT_SELECTOR).forEach((element, candidateIndex) => {
      if (element.closest('[aria-hidden="true"]')) return;
      if (element.closest('.original-template-preview-actions, [data-editor-ignore]')) return;
      if (element.closest('[data-dress-color-index]')) return;
      let parent = element.parentElement;
      while (parent) {
        if (selectedTextContainers.has(parent)) return;
        parent = parent.parentElement;
      }
      const hasNestedTextElement = Boolean(element.querySelector(TEMPLATE_TEXT_SELECTOR));
      const hasDirectText = [...element.childNodes].some((node) => node.nodeType === 3 && normalizePreviewText(node.textContent));
      // Prefer a mixed-content parent (for example: <p><em>Intro</em> rest of
      // sentence</p>) so the whole visible sentence is editable, while still
      // allowing independently styled child-only text nodes to be edited.
      if (!element.dataset.templateTextKey && hasNestedTextElement && !hasDirectText) return;
      const text = normalizePreviewText(element.textContent);
      if (!text && !element.dataset.templateTextKey) return;
      selectedTextContainers.add(element);

      // Every visible template string receives a stable positional key. Imported
      // templates already provide these keys; this fallback makes new JSX/TSX
      // templates editable without adding editor-specific markup by hand.
      const templateTextKey = element.dataset.templateTextKey || `text-${candidateIndex}`;
      if (!element.dataset.templateTextKey) element.dataset.templateTextKey = templateTextKey;
      if (element.dataset.templateTextDefault === undefined) element.dataset.templateTextDefault = element.textContent || '';

      const previousSemantic = previousSemanticFields.get(element);
      let match = previousSemantic?.field
        ? fields.find((item) => item.field === previousSemantic.field)
        : null;
      if (!match) match = fields.find((item) => item.values.some((value) => text === value || (value.length > 4 && text.includes(value))));
      let section = match?.section || getEditableTextSection(element);
      if (!match) {
        const defaultValue = element.dataset.editorInputMode === 'numeric'
          ? element.dataset.editorNumericValue || ''
          : element.dataset.templateTextDefault ?? element.textContent ?? '';
        const semanticSection = getEditableTextSection(element);
        editableTexts.set(templateTextKey, {
          key: templateTextKey,
          defaultValue,
          section: semanticSection,
          inputMode: element.dataset.editorInputMode || 'text'
        });
        match = { field: `templateTextOverrides.${templateTextKey}`, section: semanticSection };
        section = semanticSection;

        if (Object.prototype.hasOwnProperty.call(data.templateTextOverrides || {}, templateTextKey)) {
          const overriddenValue = String(data.templateTextOverrides[templateTextKey] ?? '');
          if (element.textContent !== overriddenValue) element.textContent = overriddenValue;
        }
      }
      if (
        match
        && previousSemantic?.exact
        && match.displayValue !== undefined
        && normalizePreviewText(element.textContent) === normalizePreviewText(previousSemantic.renderedValue)
        && element.textContent !== match.displayValue
      ) {
        element.textContent = match.displayValue;
      }
      const block = element.closest('section, article, blockquote') || section;
      const score = (match ? 100 : 0)
        + (element.matches('h1') ? 35 : element.matches('h2') ? 30 : element.matches('h3') ? 25 : 0)
        + Math.min(text.length, 40) / 10;
      const candidates = textCandidatesByBlock.get(block) || [];
      const exactValue = Boolean(match?.values?.includes(normalizePreviewText(element.textContent)));
      candidates.push({ element, exactValue, match, score, section });
      textCandidatesByBlock.set(block, candidates);
    });

    textCandidatesByBlock.forEach((candidates) => {
      candidates.forEach(({ element, exactValue, match, section }) => {
        const isInteractiveCopy = element.matches('button, a, label') || Boolean(element.closest('button, a, label'));
        makeEditorHotspot(element, { kind: 'text', section, field: match?.field, tab: 'content', inline: match?.inline !== false && !isInteractiveCopy, labels });
        if (match?.field && !match.field.startsWith('templateTextOverrides.')) {
          element.dataset.editorRenderedValue = element.textContent || '';
          element.dataset.editorExactValue = exactValue ? 'true' : 'false';
        }
      });
    });

    scope.querySelectorAll('[data-dress-color-index]').forEach((element) => {
      const index = Number(element.dataset.dressColorIndex);
      if (!Number.isInteger(index) || index < 0 || index >= (data.dressCodeColors || []).length) return;
      makeEditorHotspot(element, {
        kind: 'color',
        section: 'dress',
        field: `dressCodeColors.${index}.hex`,
        tab: 'content',
        labels
      });
    });

    const galleryImages = Array.isArray(data.gallery) ? data.gallery : [];
    const absoluteImageSource = (value) => {
      try { return new URL(resolveTemplateImage(value), document.baseURI).href; } catch { return resolveTemplateImage(value); }
    };

    scope.querySelectorAll('img:not([aria-hidden="true"])').forEach((image, imageOrder) => {
      if (image.closest('.original-template-preview-actions, [data-editor-ignore]')) return;
      const parent = image.parentElement;
      const hasVisualOverlay = parent && (
        parent.children.length > 1
        || parent.matches('picture, figure, button, a, label')
      );
      // Many imported designs place a gradient/border sibling above the <img>.
      // Decorating only the image makes a real pointer click land on that
      // overlay instead. Promote the hotspot to the immediate visual wrapper.
      const target = image.hasAttribute('data-editor-hotspot-self')
        ? image
        : image.closest('picture') || (hasVisualOverlay ? parent : image);
      if (!target) return;
      const source = image.currentSrc || image.src;
      const galleryIndex = galleryImages.findIndex((item) => absoluteImageSource(item) === source);
      const galleryContext = image.closest('[class*="gallery" i], [class*="carousel" i], [class*="slider" i], [class*="photos" i], [class*="fixed-photo" i], [class*="moments" i], [data-gallery], [data-carousel]');
      const isGalleryImage = galleryIndex >= 0 && Boolean(galleryContext);
      const templateImageKey = image.dataset.templateImageKey || `image-${imageOrder}`;
      if (!image.dataset.templateImageKey) image.dataset.templateImageKey = templateImageKey;
      if (!image.dataset.templateImageDefault) image.dataset.templateImageDefault = source;

      const overrideExists = Object.prototype.hasOwnProperty.call(data.templateImageOverrides || {}, templateImageKey);
      if (overrideExists) {
        const nextSource = String(data.templateImageOverrides[templateImageKey] ?? '');
        image.hidden = !nextSource;
        if (nextSource && image.src !== resolveTemplateImage(nextSource)) image.src = resolveTemplateImage(nextSource);
      }

      editableImages.set(templateImageKey, {
        key: templateImageKey,
        defaultValue: image.dataset.templateImageDefault || source,
        alt: image.alt || `${labels.image} ${editableImages.size + 1}`,
        label: getTemplateImageLabel(image, editableImages.size, labels),
        sourceField: isGalleryImage ? `gallery.${galleryIndex}` : '',
        group: isGalleryImage ? 'gallery' : 'other'
      });
      makeEditorHotspot(target, {
        kind: 'image',
        section: 'media',
        field: isGalleryImage ? `gallery.${galleryIndex}` : `templateImageOverrides.${templateImageKey}`,
        tab: 'media',
        labels
      });
    });

    let fallbackMapIndex = 0;
    scope.querySelectorAll('a[class*="map-button"], button[class*="map-button"], span[class*="map-button"], a[href*="google.com/maps"], a[href*="maps.google."], a[href*="maps.app"], a[href*="goo.gl/maps"]').forEach((target) => {
      const href = target.getAttribute('href') || '';
      const matchedIndex = (data.mapLinks || []).findIndex((item) => item?.url && href.includes(item.url));
      const mapIndex = matchedIndex >= 0 ? matchedIndex : Math.min(fallbackMapIndex, Math.max(0, (data.mapLinks || []).length - 1));
      fallbackMapIndex += 1;
      makeEditorHotspot(target, { kind: 'map', section: 'schedule', field: `mapLinks.${mapIndex}.url`, tab: 'content', labels });
    });

  });

  return { texts: [...editableTexts.values()], images: [...editableImages.values()] };
};

function PreviewViewport({ children, data, device, labels, onReady }) {
  const [mountNode, setMountNode] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!mountNode) return undefined;
    const run = () => {
      if (findPreviewElement(mountNode, '.is-editor-inline-editing')) return;
      const catalog = decoratePreview(mountNode, data, { suppressMotion: true, labels });
      onReady?.(mountNode, catalog);
    };
    const frame = window.requestAnimationFrame(run);
    const timers = [120, 420, 900].map((delay) => window.setTimeout(run, delay));
    const FrameMutationObserver = mountNode.ownerDocument.defaultView?.MutationObserver;
    const observer = FrameMutationObserver ? new FrameMutationObserver(run) : null;
    observer?.observe(mountNode, { childList: true, subtree: true, characterData: true });
    return () => {
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      observer?.disconnect();
    };
  }, [data, labels, mountNode, onReady]);

  useEffect(() => {
    const iframe = iframeRef.current;
    const screen = iframe?.parentElement;
    if (!iframe || !screen) return undefined;
    const updateViewportScale = () => {
      const screenWidth = screen.clientWidth;
      const screenHeight = screen.clientHeight;
      if (!screenWidth || !screenHeight) return;
      const virtualWidth = device === 'mobile' ? 390 : device === 'tablet' ? 768 : screenWidth;
      const scale = screenWidth / virtualWidth;
      iframe.style.width = `${virtualWidth}px`;
      iframe.style.height = `${screenHeight / scale}px`;
      iframe.style.transform = `scale(${scale})`;
    };
    updateViewportScale();
    const observer = new ResizeObserver(updateViewportScale);
    observer.observe(screen);
    return () => observer.disconnect();
  }, [device]);

  const prepareDocument = useCallback((iframe) => {
    const doc = iframe?.contentDocument;
    if (!doc) return;
    doc.head.replaceChildren();
    const base = doc.createElement('base');
    base.href = document.baseURI;
    const viewport = doc.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1';
    doc.head.append(base, viewport);
    document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => doc.head.append(node.cloneNode(true)));
    const previewStyle = doc.createElement('style');
    previewStyle.textContent = 'html,body,#invite-editor-preview-root{width:100%;height:100%;margin:0;overflow:hidden;} body{background:#fff;}';
    doc.head.append(previewStyle);
    doc.documentElement.lang = document.documentElement.lang || 'hy';
    doc.body.replaceChildren();
    const root = doc.createElement('div');
    root.id = 'invite-editor-preview-root';
    doc.body.append(root);
    setMountNode(root);
  }, []);

  return (
    <>
      <iframe
        ref={iframeRef}
        className="invite-editor-preview-viewport"
        title={labels.previewTitle}
        srcDoc="<!doctype html><html><head></head><body></body></html>"
        onLoad={(event) => prepareDocument(event.currentTarget)}
      />
      {mountNode && createPortal(children, mountNode)}
    </>
  );
}

function EditorPanel({ isSingleImageTemplate }) {
  const { tab } = useEditor();
  if (tab === 'templates') return <TemplatesPanel />;
  if (tab === 'design') return <DesignPanel />;
  if (tab === 'media') return <MediaPanel isSingleImageTemplate={isSingleImageTemplate} />;
  if (tab === 'buy') return <BuyPanel />;
  return <ContentPanel />;
}

function DeviceSwitcher() {
  const { device, setDevice } = useEditor();
  const { t } = useLanguage();
  return <div className="invite-editor-devices" role="tablist" aria-label={t('editorPreviewDevice')}>{[
    ['desktop', Monitor, t('editorDesktop')],
    ['tablet', Tablet, t('editorTablet')],
    ['mobile', Smartphone, t('editorMobile')]
  ].map(([value, Icon, label]) => <button key={value} role="tab" type="button" aria-selected={device === value} className={device === value ? 'is-active' : ''} onClick={() => setDevice(value)}><Icon size={15} /><span>{label}</span></button>)}</div>;
}

function PreviewWorkspace({ PreviewComponent }) {
  const { t } = useLanguage();
  const {
    activeField,
    activeSection,
    actions,
    data,
    device,
    focusEditorTarget,
    mobileSheet,
    previewFocusRequest,
    registerEditableContent,
    setMobileSheet,
    template,
    update
  } = useEditor();
  const previewRootRef = useRef(null);
  const imageInputRef = useRef(null);
  const pendingImageFieldRef = useRef('');
  const handledPreviewFocusRequestRef = useRef(previewFocusRequest.id);
  const [previewReady, setPreviewReady] = useState(0);
  const [imageUploadError, setImageUploadError] = useState('');
  const hotspotLabels = useMemo(() => ({ image: t('image'), map: t('map'), color: t('editorDressColor'), edit: t('editorEdit'), changeImage: t('editorChangeImage'), editMap: t('editorEditMap'), editColor: t('editorDressCodeColors'), editSection: t('editorEditSection'), heroImage: t('editorHeroImage'), galleryImage: t('editorGalleryImage'), participantImage: t('editorParticipantImage'), venueImage: t('editorVenueImage'), closingImage: t('editorClosingImage'), invitationImage: t('editorInvitationImage'), previewTitle: t('editorResponsivePreview') }), [t]);

  const handlePreviewReady = useCallback((root, catalog) => {
    registerEditableContent(catalog);
    if (previewRootRef.current === root) return;
    previewRootRef.current = root;
    setPreviewReady((value) => value + 1);
  }, [registerEditableContent]);

  useEffect(() => {
    registerEditableContent(decoratePreview(previewRootRef.current, data, { suppressMotion: true, labels: hotspotLabels }));
  }, [data, hotspotLabels, previewReady, registerEditableContent]);

  useEffect(() => {
    const root = previewRootRef.current;
    const previewScroll = root?.querySelector('.invite-editor-preview-scroll');
    const frameWindow = previewScroll?.ownerDocument?.defaultView;
    if (!previewScroll || !frameWindow) return undefined;
    const notifyImportedTemplate = () => {
      frameWindow.dispatchEvent(new frameWindow.Event('scroll'));
    };
    previewScroll.addEventListener('scroll', notifyImportedTemplate, { passive: true });
    notifyImportedTemplate();
    return () => previewScroll.removeEventListener('scroll', notifyImportedTemplate);
  }, [device, previewReady]);

  useEffect(() => {
    const root = previewRootRef.current;
    if (!root) return;
    const isNewFocusRequest = handledPreviewFocusRequestRef.current !== previewFocusRequest.id;
    const shouldScrollPreview = isNewFocusRequest && previewFocusRequest.scroll;
    handledPreviewFocusRequestRef.current = previewFocusRequest.id;
    getPreviewRoots(root).forEach((scope) => scope.querySelectorAll('.is-editor-active, .is-editor-section-active').forEach((element) => {
      element.classList.remove('is-editor-active', 'is-editor-section-active');
    }));
    const previewScroll = root.querySelector('.invite-editor-preview-scroll');
    const previewFrame = previewScroll?.ownerDocument?.defaultView?.frameElement;
    const editorSheet = document.querySelector('.invite-editor-sidebar:not(.is-collapsed)');
    const isCompactViewport = window.matchMedia('(max-width: 1024px)').matches;
    if (previewScroll) {
      if (isCompactViewport && mobileSheet !== 'collapsed' && previewFrame && editorSheet) {
        const frameRect = previewFrame.getBoundingClientRect();
        const sheetRect = editorSheet.getBoundingClientRect();
        const scale = frameRect.width / previewFrame.offsetWidth || 1;
        const occludedHeight = Math.max(0, frameRect.bottom - sheetRect.top) / scale;
        previewScroll.style.boxSizing = 'border-box';
        previewScroll.style.paddingBottom = `${occludedHeight + 24}px`;
      } else {
        previewScroll.style.boxSizing = '';
        previewScroll.style.paddingBottom = '';
      }
    }
    let target = activeField ? findPreviewElement(root, `[data-editor-field="${activeField}"]`) : null;
    if (!target && activeSection === 'media') target = findPreviewElement(root, '[data-editor-kind="image"]');
    if (!target && activeSection) target = findPreviewElement(root, `[data-editor-section="${activeSection}"]`);
    if (!target) return;
    const activeBlock = target.closest('[data-editor-section]') || target;
    void target.offsetWidth;
    target.classList.add('is-editor-active');
    if (activeBlock !== target) activeBlock.classList.add('is-editor-section-active');
    if (shouldScrollPreview) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (isCompactViewport && mobileSheet !== 'collapsed' && previewScroll && previewFrame && editorSheet) {
        const alignWithVisiblePreview = (behavior) => {
          const frameRect = previewFrame.getBoundingClientRect();
          const sheetRect = editorSheet.getBoundingClientRect();
          const scrollRect = previewScroll.getBoundingClientRect();
          const scale = frameRect.width / previewFrame.offsetWidth || 1;
          const visibleHeight = Math.max(88, Math.min(frameRect.height, sheetRect.top - frameRect.top)) / scale;
          const targetRect = target.getBoundingClientRect();
          const targetCenter = previewScroll.scrollTop + targetRect.top - scrollRect.top + (targetRect.height / 2);
          previewScroll.scrollTo({
            top: Math.max(0, targetCenter - (visibleHeight / 2)),
            behavior
          });
        };
        alignWithVisiblePreview(prefersReducedMotion ? 'auto' : 'smooth');
        // Opening the mobile sheet animates its top edge for 240ms. Recompute
        // once it has settled so the focused preview target is not left behind
        // the final sheet position.
        window.setTimeout(
          () => {
            if (!target.isConnected || !previewScroll.isConnected || !editorSheet.isConnected) return;
            alignWithVisiblePreview(prefersReducedMotion ? 'auto' : 'smooth');
          },
          prefersReducedMotion ? 0 : 280
        );
      } else {
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center', inline: 'nearest' });
      }
    }
  }, [activeField, activeSection, data, mobileSheet, previewFocusRequest, previewReady]);

  const openPreviewImagePicker = (field) => {
    if (!field) return;
    pendingImageFieldRef.current = field;
    setImageUploadError('');
    imageInputRef.current?.click();
  };

  const replacePreviewImage = async (file) => {
    const field = pendingImageFieldRef.current;
    pendingImageFieldRef.current = '';
    if (!file || !field) return;
    try {
      const image = await prepareImage(file);
      update((draft) => {
        if (field.startsWith('gallery.')) {
          const index = Number(field.split('.')[1]);
          if (Number.isInteger(index) && index >= 0 && index < (draft.gallery || []).length) {
            draft.gallery[index] = image;
            if (index === 0) draft.image = image;
          }
          return;
        }
        const key = field.replace(/^templateImageOverrides\./, '');
        if (key) draft.templateImageOverrides = { ...(draft.templateImageOverrides || {}), [key]: image };
      });
    } catch (uploadError) {
      setImageUploadError(uploadError.message?.startsWith('media') ? t(uploadError.message) : (uploadError.message || t('editorImageUploadError')));
    }
  };

  const openPreviewColorPicker = (target) => {
    const match = String(target.dataset.editorField || '').match(/^dressCodeColors\.(\d+)\.hex$/);
    const index = Number(match?.[1]);
    if (!Number.isInteger(index) || index < 0) return;
    const previewDocument = target.ownerDocument;
    const picker = previewDocument.createElement('input');
    picker.type = 'color';
    const computedColor = previewDocument.defaultView?.getComputedStyle(target).backgroundColor || '';
    const channels = computedColor.match(/[\d.]+/g)?.slice(0, 3).map(Number) || [];
    picker.value = channels.length === 3
      ? `#${channels.map((channel) => Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, '0')).join('')}`
      : '#d8b98e';
    picker.setAttribute('aria-label', hotspotLabels.editColor);
    Object.assign(picker.style, { position: 'fixed', width: '1px', height: '1px', opacity: '0', pointerEvents: 'none' });
    previewDocument.body.append(picker);
    const cleanup = () => picker.remove();
    picker.addEventListener('change', () => {
      const color = picker.value;
      update((draft) => {
        if (draft.dressCodeColors?.[index]) draft.dressCodeColors[index].hex = color;
      });
      cleanup();
    }, { once: true });
    window.setTimeout(cleanup, 120000);
    try {
      if (typeof picker.showPicker === 'function') picker.showPicker();
      else picker.click();
    } catch {
      picker.click();
    }
  };

  const handlePreviewClick = (event) => {
    if (event.amuletEditorHandled) return;
    const path = (event.nativeEvent || event).composedPath();
    if (path.some((node) => node?.dataset?.editorIgnore !== undefined)) return;
    // composedPath is ordered from the exact clicked node outwards. Respect
    // that order so text layered over an image selects the text, not the image
    // wrapper behind it.
    const target = path.find((node) => node?.dataset?.editorKind)
      || event.target.closest?.('[data-editor-kind]');
    if (!target) {
      const sectionTarget = path.find((node) => node?.dataset?.editorSection)
        || event.target.closest?.('[data-editor-section]');
      if (!sectionTarget) return;
      event.preventDefault();
      event.stopPropagation();
      focusEditorTarget({
        section: sectionTarget.dataset.editorSection || 'templateContent',
        targetTab: 'content',
        scrollPreview: false,
        focusSidebar: true
      });
      return;
    }
    event.amuletEditorHandled = true;
    if (target.dataset.editorKind === 'text' && target.dataset.editorField) {
      const inline = target.dataset.editorInline === 'true';
      if (!inline) {
        event.preventDefault();
        event.stopPropagation();
      }
      focusEditorTarget({
        section: target.dataset.editorSection || 'hero',
        field: target.dataset.editorField || '',
        targetTab: target.dataset.editorTab || 'content',
        scrollPreview: false,
        focusSidebar: !inline,
        scrollSidebar: true
      });
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (target.dataset.editorKind === 'image') {
      focusEditorTarget({
        section: 'media',
        field: target.dataset.editorField || '',
        targetTab: 'media',
        scrollPreview: false,
        focusSidebar: false
      });
      openPreviewImagePicker(target.dataset.editorField || '');
      return;
    }
    if (target.dataset.editorKind === 'color') {
      focusEditorTarget({
        section: 'dress',
        field: target.dataset.editorField || '',
        targetTab: 'content',
        scrollPreview: false,
        focusSidebar: false,
        scrollSidebar: true
      });
      openPreviewColorPicker(target);
      return;
    }
    focusEditorTarget({
      section: target.dataset.editorSection || (target.dataset.editorKind === 'image' ? 'media' : 'hero'),
      field: target.dataset.editorField || '',
      targetTab: target.dataset.editorTab || (target.dataset.editorKind === 'image' ? 'media' : 'content'),
      scrollPreview: false,
      focusSidebar: true
    });
  };

  const handlePreviewKeyDown = (event) => {
    if (event.target?.isContentEditable) return;
    if (!['Enter', ' '].includes(event.key)) return;
    handlePreviewClick(event);
  };

  useEffect(() => {
    const root = previewRootRef.current;
    if (!root) return undefined;
    const previewDocument = root.ownerDocument;
    previewDocument.__amuletEditorHotspotHandler = handlePreviewClick;
    previewDocument.__amuletEditorHotspotFocusHandler = (target) => {
      focusEditorTarget({
        section: target.dataset.editorSection || 'hero',
        field: target.dataset.editorField || '',
        targetTab: target.dataset.editorTab || 'content',
        scrollPreview: false,
        focusSidebar: false,
        scrollSidebar: true
      });
    };
    previewDocument.__amuletEditorInlineCommitHandler = ({ field, value }) => {
      if (!field) return;
      update((draft) => updateDraftTextField(draft, field, value));
    };
    previewDocument.__amuletEditorInlineLiveHandler = ({ field, value }) => {
      if (!field) return;
      const syncSidebarControl = () => {
        const sidebar = document.querySelector('.invite-editor-sidebar-scroll');
        const fieldContainer = [...(sidebar?.querySelectorAll('[data-editor-field]') || [])]
          .find((element) => element.dataset.editorField === field);
        const control = fieldContainer?.querySelector('input:not([type="file"]), textarea');
        if (!control || control.value === value) return Boolean(control);
        control.value = value;
        if (control instanceof HTMLTextAreaElement) {
          control.style.height = '0px';
          control.style.height = `${Math.max(control.scrollHeight, 46)}px`;
        }
        return true;
      };
      // The section can be mounting during the first keystroke after focus.
      // Sync immediately, then retry on the next frame if its control is not
      // in the sidebar DOM yet.
      if (!syncSidebarControl()) window.requestAnimationFrame(syncSidebarControl);
    };
    // Imported templates render inside shadow roots. Listen on the iframe
    // document as well as the React mount node so composed clicks from every
    // image/text hotspot reliably reach the editor, including nested buttons.
    previewDocument.addEventListener('click', handlePreviewClick, true);
    previewDocument.addEventListener('keydown', handlePreviewKeyDown, true);
    return () => {
      delete previewDocument.__amuletEditorHotspotHandler;
      delete previewDocument.__amuletEditorHotspotFocusHandler;
      delete previewDocument.__amuletEditorInlineCommitHandler;
      delete previewDocument.__amuletEditorInlineLiveHandler;
      previewDocument.removeEventListener('click', handlePreviewClick, true);
      previewDocument.removeEventListener('keydown', handlePreviewKeyDown, true);
    };
  }, [focusEditorTarget, previewReady, update]);

  const frameImage = device === 'mobile' ? iphoneDeviceFrame : device === 'tablet' ? ipadDeviceFrame : null;
  return (
    <main className="invite-editor-preview">
      <div className={`invite-editor-device is-${device}`}>
        <div className="invite-editor-device-screen">
          <PreviewViewport data={data} device={device} labels={hotspotLabels} onReady={handlePreviewReady}>
            <div className="invite-editor-preview-scroll" data-preview-device={device}>
              <PreviewComponent draft={data} price={template.price} mode="studio" loading={actions.saving} onHome={() => {}} onEdit={() => {}} onOrder={() => actions.onBuy?.(data)} />
            </div>
          </PreviewViewport>
        </div>
        {frameImage && <img className="invite-editor-device-frame" src={frameImage} alt="" aria-hidden="true" />}
      </div>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(event) => {
          void replacePreviewImage(event.target.files?.[0]);
          event.target.value = '';
        }}
      />
      {imageUploadError && <p className="invite-editor-preview-upload-error" role="alert">{imageUploadError}</p>}
      {mobileSheet === 'collapsed' && <button type="button" className="invite-editor-open-sheet" onClick={() => setMobileSheet('medium')}><Pencil size={17} /> {t('editorEdit')}</button>}
    </main>
  );
}

function EditorBody({ PreviewComponent, isSingleImageTemplate }) {
  const { activeField, activeSection, actions, canRedo, canUndo, data, device, dirty, mobileSheet, previewFocusRequest, redo, restoreOriginal, saveStatus, setDevice, setMobileSheet, setSidebarOpen, setTab, sidebarOpen, tab, undo } = useEditor();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [compactViewport, setCompactViewport] = useState(() => window.matchMedia('(max-width: 1024px)').matches);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [exitRequest, setExitRequest] = useState(null);
  const sheetStart = useRef(null);
  const restoreCancelRef = useRef(null);
  const exitSaveRef = useRef(null);
  const sessionBaselineRef = useRef(JSON.stringify(data));
  const hasSessionChanges = JSON.stringify(data) !== sessionBaselineRef.current;
  const dirtyRef = useRef(hasSessionChanges);
  const closeActionRef = useRef(actions.onClose);
  const historyGuardRef = useRef({ active: false, allowExit: false, marker: `amulet-editor-${Date.now()}-${Math.random().toString(16).slice(2)}` });
  const navItems = useMemo(() => [
    ['templates', LayoutGrid, t('editorTemplates')],
    ['content', Pencil, t('editorEdit')],
    ['design', Sparkles, t('editorDesign')],
    ['media', Images, t('editorMedia')],
    ['buy', CheckCircle2, t('editorBuy')]
  ], [t]);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1024px)');
    const updateViewport = () => {
      setCompactViewport(query.matches);
      if (query.matches) setDevice(window.innerWidth <= 600 ? 'mobile' : 'tablet');
    };
    updateViewport();
    query.addEventListener('change', updateViewport);
    window.addEventListener('resize', updateViewport);
    return () => {
      query.removeEventListener('change', updateViewport);
      window.removeEventListener('resize', updateViewport);
    };
  }, [setDevice]);

  useEffect(() => { dirtyRef.current = hasSessionChanges; }, [hasSessionChanges]);
  useEffect(() => { closeActionRef.current = actions.onClose; }, [actions.onClose]);

  useEffect(() => {
    const guard = historyGuardRef.current;
    const existingMarker = window.history.state?.amuletEditorGuard;
    if (existingMarker) guard.marker = existingMarker;
    else window.history.pushState({ ...(window.history.state || {}), amuletEditorGuard: guard.marker }, '', window.location.href);
    guard.active = true;
    guard.allowExit = false;

    const handleBrowserBack = () => {
      if (guard.allowExit || !guard.active) return;
      guard.active = false;
      if (dirtyRef.current) {
        setExitRequest({ destination: '', historyBack: true });
        return;
      }
      guard.allowExit = true;
      closeActionRef.current?.();
      window.setTimeout(() => window.history.back(), 0);
    };

    window.addEventListener('popstate', handleBrowserBack);
    return () => window.removeEventListener('popstate', handleBrowserBack);
  }, []);

  const finishExit = useCallback((destination = '', continueBrowserBack = false) => {
    const guard = historyGuardRef.current;
    const finalize = () => {
      actions.onClose?.();
      if (continueBrowserBack) window.setTimeout(() => window.history.back(), 0);
      else if (destination) navigate(destination);
    };

    guard.allowExit = true;
    if (guard.active) {
      guard.active = false;
      window.addEventListener('popstate', finalize, { once: true });
      window.history.back();
      return;
    }
    finalize();
  }, [actions, navigate]);

  const requestClose = useCallback((destination = '') => {
    if (!hasSessionChanges) {
      finishExit(destination);
      return;
    }
    setExitRequest({ destination, historyBack: false });
  }, [finishExit, hasSessionChanges]);

  const saveAndExit = useCallback(() => {
    if (!exitRequest) return;
    actions.onDraftChange?.(data, true);
    setExitRequest(null);
    finishExit('/templates');
  }, [actions, data, exitRequest, finishExit]);

  const discardAndExit = useCallback(() => {
    if (!exitRequest) return;
    const { destination, historyBack = false } = exitRequest;
    setExitRequest(null);
    restoreOriginal();
    finishExit(destination, historyBack);
  }, [exitRequest, finishExit, restoreOriginal]);

  const cancelExit = useCallback(() => {
    const guard = historyGuardRef.current;
    if (exitRequest?.historyBack && !guard.active) {
      window.history.pushState({ ...(window.history.state || {}), amuletEditorGuard: guard.marker }, '', window.location.href);
      guard.active = true;
      guard.allowExit = false;
    }
    setExitRequest(null);
  }, [exitRequest]);

  const showModifiedPreview = useCallback(async () => {
    const opened = await actions.onPreview?.(data);
    if (opened !== false) actions.onClose?.();
  }, [actions, data]);

  const confirmRestore = useCallback(() => {
    restoreOriginal();
    setRestoreOpen(false);
  }, [restoreOriginal]);

  useEffect(() => {
    if (restoreOpen) restoreCancelRef.current?.focus();
  }, [restoreOpen]);

  useEffect(() => {
    if (exitRequest) exitSaveRef.current?.focus();
  }, [exitRequest]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const onEscape = (event) => {
      if (event.key !== 'Escape') return;
      if (exitRequest) cancelExit();
      else if (restoreOpen) setRestoreOpen(false);
      else requestClose();
    };
    window.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      window.removeEventListener('keydown', onEscape);
    };
  }, [cancelExit, exitRequest, requestClose, restoreOpen]);

  useEffect(() => {
    if (!previewFocusRequest.scrollSidebar && !previewFocusRequest.focusSidebar) return undefined;
    let timer = 0;
    let cancelled = false;
    let attempts = 0;
    const focusTarget = () => {
      if (cancelled) return;
      const sidebar = document.querySelector('.invite-editor-sidebar-scroll');
      if (!sidebar) {
        if (attempts++ < 8) timer = window.setTimeout(focusTarget, 40);
        return;
      }
      let target = activeField ? sidebar.querySelector(`[data-editor-field="${activeField}"]`) : null;
      if (!target && activeSection) target = sidebar.querySelector(`[data-editor-section-id="${activeSection}"]`);
      if (!target) {
        if (attempts++ < 8) {
          timer = window.setTimeout(focusTarget, 50);
          return;
        }
        if (activeSection === 'media') sidebar.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const sidebarRect = sidebar.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const top = sidebar.scrollTop + targetRect.top - sidebarRect.top - ((sidebar.clientHeight - targetRect.height) / 2);
      sidebar.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      if (previewFocusRequest.focusSidebar) {
        const control = activeField ? target.querySelector('input, textarea, select, button, [tabindex="0"]') : null;
        control?.focus({ preventScroll: true });
      }
    };
    timer = window.setTimeout(focusTarget, 70);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [activeField, activeSection, previewFocusRequest, tab]);

  const selectTab = (next) => {
    setTab(next);
    setSidebarOpen(true);
    setMobileSheet('medium');
  };

  const panelOpen = compactViewport ? mobileSheet !== 'collapsed' : sidebarOpen;
  const toggleEditorPanel = () => {
    if (compactViewport) setMobileSheet((current) => current === 'collapsed' ? 'medium' : 'collapsed');
    else setSidebarOpen((current) => !current);
  };

  return (
    <section className={`amulet-invite-editor${sidebarOpen ? '' : ' is-sidebar-collapsed'} is-device-${device}`} data-active-section={activeSection} data-active-field={activeField || undefined} role="dialog" aria-modal="true" aria-label={t('editorDialogLabel')}>
      <header className="invite-editor-topbar">
        <div className="invite-editor-top-left">
          <button type="button" onClick={toggleEditorPanel} aria-expanded={panelOpen} aria-controls="invite-editor-sidebar" aria-label={panelOpen ? t('editorClosePanel') : t('editorOpenPanel')}>{panelOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}</button>
          <button type="button" onClick={undo} disabled={!canUndo} aria-label={t('editorUndo')}><Undo2 size={17} /></button>
          <button type="button" onClick={redo} disabled={!canRedo} aria-label={t('editorRedo')}><Redo2 size={17} /></button>
          <span>Amulet Studio</span>
        </div>
        <DeviceSwitcher />
        <div className="invite-editor-top-actions">
          <small className={actions.previewError ? 'is-error' : undefined} role={actions.previewError ? 'alert' : undefined} aria-live="polite">{actions.previewError ? t('editorPreviewError') : saveStatus === 'changed' ? t('editorSessionChanges') : t('editorOriginalState')}</small>
          <button className="invite-editor-restore-trigger" type="button" onClick={() => setRestoreOpen(true)} disabled={!dirty}><RotateCcw size={17} /><span>{t('editorRestore')}</span></button>
          <button type="button" onClick={() => void showModifiedPreview()} disabled={actions.saving || actions.previewing}><Eye size={17} /><span>{actions.previewing ? t('editorPreparing') : t('editorViewChanges')}</span></button>
          <button type="button" onClick={() => requestClose()} aria-label={t('editorClose')}><X size={24} /></button>
        </div>
      </header>

      <nav className="invite-editor-rail" aria-label={t('editorSections')}>
        <Link className="invite-editor-home-logo" to="/" onClick={(event) => { event.preventDefault(); requestClose('/'); }} aria-label={`${t('brand')} — ${t('home')}`} title={t('home')}>
          <img src={logoImage} alt="" width="34" height="34" />
        </Link>
        {navItems.map(([value, Icon, label]) => <button key={value} type="button" className={tab === value ? 'is-active' : ''} onClick={() => selectTab(value)} aria-current={tab === value ? 'page' : undefined} aria-label={label} title={label}><Icon size={20} /></button>)}
        <button type="button" className="invite-editor-back" onClick={() => requestClose()} aria-label={t('back')} title={t('back')}><ArrowLeft size={19} /></button>
      </nav>

      <aside id="invite-editor-sidebar" className={`invite-editor-sidebar is-${mobileSheet}`}>
        <div className="invite-editor-sidebar-scroll">
        <div className="invite-editor-sheet-handle" onPointerDown={(event) => { sheetStart.current = event.clientY; }} onPointerUp={(event) => {
          if (sheetStart.current === null) return;
          const delta = event.clientY - sheetStart.current;
          sheetStart.current = null;
          if (delta < -35) setMobileSheet('expanded');
          if (delta > 35) setMobileSheet('collapsed');
        }}><i /><button type="button" onClick={() => setMobileSheet('collapsed')} aria-label={t('editorClosePanel')}><ChevronDown size={17} /></button></div>
        <EditorPanel isSingleImageTemplate={isSingleImageTemplate} />
        </div>
        <footer>
          {compactViewport && (
            <button className="invite-editor-footer-preview" type="button" onClick={() => void showModifiedPreview()} disabled={actions.saving || actions.previewing}>
              <Eye size={16} />
              <span>{actions.previewing ? t('editorPreparing') : t('editorViewChanges')}</span>
            </button>
          )}
          <button className="invite-editor-footer-buy" type="button" onClick={() => actions.onBuy?.(data)} disabled={actions.saving}>
            <ShoppingBag size={16} />
            <span>{t('editorBuy')}</span>
          </button>
        </footer>
      </aside>

      <PreviewWorkspace PreviewComponent={PreviewComponent} />

      {restoreOpen && (
        <div className="invite-editor-confirm-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setRestoreOpen(false); }}>
          <section className="invite-editor-confirm" role="alertdialog" aria-modal="true" aria-labelledby="editor-restore-title" aria-describedby="editor-restore-description">
            <div className="invite-editor-confirm-icon" aria-hidden="true"><RotateCcw size={22} /></div>
            <h2 id="editor-restore-title">{t('editorRestoreTitle')}</h2>
            <p id="editor-restore-description">{t('editorRestoreDescription')}</p>
            <div>
              <button ref={restoreCancelRef} type="button" onClick={() => setRestoreOpen(false)}>{t('cancel')}</button>
              <button className="is-destructive" type="button" onClick={confirmRestore}>{t('editorRestoreConfirm')}</button>
            </div>
          </section>
        </div>
      )}

      {exitRequest && (
        <div className="invite-editor-confirm-backdrop" role="presentation">
          <section className="invite-editor-confirm invite-editor-exit-confirm" role="alertdialog" aria-modal="true" aria-labelledby="editor-exit-title" aria-describedby="editor-exit-description">
            <button className="invite-editor-confirm-close" type="button" onClick={cancelExit} aria-label={t('cancel')}><X size={20} /></button>
            <div className="invite-editor-exit-animation" aria-hidden="true">
              <DotLottieReact src={editorExitAlert} autoplay={!window.matchMedia('(prefers-reduced-motion: reduce)').matches} loop={!window.matchMedia('(prefers-reduced-motion: reduce)').matches} />
            </div>
            <h2 id="editor-exit-title">{t('editorExitTitle')}</h2>
            <p id="editor-exit-description">{t('editorExitDescription')}</p>
            <div className="invite-editor-exit-actions">
              <button className="is-destructive" type="button" onClick={discardAndExit}>{t('editorExitDiscard')}</button>
              <button ref={exitSaveRef} className="is-primary" type="button" onClick={saveAndExit}>{t('editorExitSave')}</button>
            </div>
          </section>
        </div>
      )}

    </section>
  );
}

export default function InvitationEditor({ draft, originalDraft, initialTarget, template, PreviewComponent, isSingleImageTemplate, saving, previewing, previewError, onClose, onDiscard, onRestore, onPreview, previewPath, onBuy, onDraftChange, onSelectTemplate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { initialized, user } = useAuth();
  const actions = useMemo(() => ({
    saving,
    previewing,
    previewError,
    onClose,
    onDiscard,
    onRestore,
    onDraftChange,
    onSelectTemplate,
    previewPath,
    onPreview: async (nextDraft) => onPreview?.(nextDraft),
    onBuy: (nextDraft) => onBuy?.(nextDraft)
  }), [onBuy, onClose, onDiscard, onDraftChange, onPreview, onRestore, onSelectTemplate, previewError, previewing, previewPath, saving]);

  useEffect(() => {
    if (!initialized || user) return;
    onClose?.();
    navigate('/login', {
      replace: true,
      state: { returnTo: `${location.pathname}${location.search}` }
    });
  }, [initialized, location.pathname, location.search, navigate, onClose, user]);

  if (!initialized || !user) return null;

  return <EditorProvider initialDraft={draft} originalDraft={originalDraft} initialTarget={initialTarget} template={template} actions={actions}><EditorBody PreviewComponent={PreviewComponent} isSingleImageTemplate={isSingleImageTemplate} /></EditorProvider>;
}
