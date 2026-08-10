import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Camera, CheckCircle2, ChevronDown, LayoutGrid, Monitor, PanelLeftClose, PanelLeftOpen, Pencil, Redo2, Save, ShoppingBag, Smartphone, Sparkles, Tablet, Undo2, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import iphoneDeviceFrame from '../../assets/editor-devices/iphone-device-frame-clean.png';
import ipadDeviceFrame from '../../assets/editor-devices/ipad-device-frame-clean.png';
import { EditorProvider, useEditor } from './EditorContext.jsx';
import TemplatesPanel from './TemplatesPanel.jsx';
import ContentPanel from './ContentPanel.jsx';
import DesignPanel from './DesignPanel.jsx';
import MediaPanel from './MediaPanel.jsx';
import BuyPanel from './BuyPanel.jsx';
import { normalizeInvitationGallery, splitNames } from './editorData.js';
import { resolveTemplateImage } from '../../occasionTemplates/templateAssets.js';
import { prepareImage } from './mediaUtils.js';
import './invitationEditor.css';

const previewSectionSelectors = {
  hero: [
    '.midnight-cover', '.midnight-message-section',
    '.engagement-cover', '.engagement-message-copy',
    '.baptism-hero', '.baptism-countdown-section', '.baptism-message-copy',
    '.sacred-hero', '.sacred-message',
    '.birthday-hero', '.birthday-message',
    '.ivory-hero', '.ivory-message'
  ],
  family: ['.midnight-family-note', '.engagement-family-note', '.baptism-family-note'],
  schedule: [
    '.midnight-schedule',
    '.engagement-week', '.engagement-location', '.engagement-place-list',
    '.baptism-event-section', '.baptism-party-section',
    '.sacred-schedule', '.birthday-schedule', '.ivory-schedule'
  ],
  rsvp: ['.midnight-rsvp-section', '.engagement-rsvp-section', '.baptism-rsvp-section', '.sacred-rsvp', '.birthday-rsvp', '.ivory-rsvp'],
  closing: ['.midnight-signature', '.engagement-final', '.baptism-signature', '.sacred-closing', '.birthday-closing', '.ivory-closing'],
  dress: ['.curated-dress']
};

const normalizePreviewText = (value) => String(value || '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('hy');

const getTemplateImageLabel = (image, index) => {
  const alt = String(image.alt || '').trim();
  if (alt) return alt;

  const context = [
    image.className,
    image.closest?.('section, article, figure, div')?.className
  ].filter((value) => typeof value === 'string').join(' ').toLowerCase();

  if (/hero|cover|intro/.test(context)) return 'Գլխավոր բաժնի նկար';
  if (/gallery|carousel|slider/.test(context)) return `Պատկերասրահի նկար ${index + 1}`;
  if (/bride|groom|couple|portrait|person|child|family/.test(context)) return 'Մասնակցի կամ ընտանիքի նկար';
  if (/venue|location|church|party|event|place/.test(context)) return 'Միջոցառման վայրի նկար';
  if (/closing|final|footer/.test(context)) return 'Եզրափակիչ բաժնի նկար';
  return `Հրավերի նկար ${index + 1}`;
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
  const fields = [
    ['mainName.0', 'hero', [firstName]],
    ['mainName.1', 'hero', [secondName]],
    ['mainNames', 'hero', [data.mainNames]],
    ['eventMessage', 'hero', [data.eventMessage]],
    ['eventTime', 'schedule', [data.eventTime]],
    ['eventLocation', 'schedule', [data.eventLocation]]
  ];

  (data.mapLinks || []).forEach((item, index) => {
    ['label', 'time', 'subtitle', 'address'].forEach((key) => {
      fields.push([`mapLinks.${index}.${key}`, 'schedule', [item?.[key]]]);
    });
  });

  return fields.map(([field, section, values]) => ({
    field,
    section,
    values: values.map(normalizePreviewText).filter((value) => value.length > 1)
  }));
};

const shadowHotspotStyles = `
  [data-editor-kind]{position:relative;cursor:pointer;touch-action:manipulation;outline:2px solid transparent;outline-offset:5px;transition:outline-color .24s ease,background-color .24s ease,box-shadow .24s ease}
  [data-editor-kind="text"][contenteditable]{border:0!important;outline:0!important;box-shadow:none!important;cursor:text;caret-color:#d07d4f;user-select:text;-webkit-user-select:text}
  [data-editor-kind="text"]::after{pointer-events:auto}
  [data-editor-kind="text"].is-editor-inline-editing{outline-color:#d07d4f;background-color:rgba(208,125,79,.055)}
  [data-editor-kind="text"].is-editor-inline-editing::after{opacity:0!important}
  [data-editor-kind]::after{content:attr(data-editor-label);position:absolute;z-index:999;top:-13px;right:-7px;min-height:30px;display:flex;align-items:center;padding:0 10px 0 31px;border:1px solid rgba(255,255,255,.86);border-radius:5px;background-color:#d07d4f;background-position:9px center;background-repeat:no-repeat;background-size:14px;color:#fff;font:700 11px/1.1 Arial,sans-serif;letter-spacing:.01em;white-space:nowrap;box-shadow:0 6px 18px rgba(50,28,14,.22);opacity:0;transform:translateY(4px);pointer-events:none;transition:opacity .2s ease,transform .2s ease}
  [data-editor-kind="text"]::after{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 20h9'/%3E%3Cpath d='M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z'/%3E%3C/svg%3E")}
  [data-editor-kind="image"]::after{top:12px;right:12px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14.5 4h-5L7.8 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.8z'/%3E%3Ccircle cx='12' cy='13' r='3'/%3E%3C/svg%3E")}
  [data-editor-kind="map"]::after{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z'/%3E%3Ccircle cx='12' cy='10' r='2.5'/%3E%3C/svg%3E")}
  [data-editor-kind]:is(:hover,:focus-visible){outline-color:#d07d4f;background-color:rgba(208,125,79,.035)}
  [data-editor-kind]:is(:hover,:focus-visible)::after{opacity:1;transform:translateY(0)}
  [data-editor-kind].is-editor-active{outline:3px solid #d07d4f!important;outline-offset:7px!important;background-color:rgba(208,125,79,.08)!important;box-shadow:0 0 0 7px rgba(208,125,79,.16),0 12px 34px rgba(73,39,20,.18)!important;animation:amuletEditorFocusPulse .72s cubic-bezier(.2,.8,.2,1) both}
  [data-editor-kind].is-editor-active::after{opacity:1;transform:translateY(0)}
  @keyframes amuletEditorFocusPulse{0%{box-shadow:0 0 0 0 rgba(208,125,79,.42),0 4px 12px rgba(73,39,20,.08)}55%{box-shadow:0 0 0 12px rgba(208,125,79,.12),0 14px 38px rgba(73,39,20,.2)}100%{box-shadow:0 0 0 7px rgba(208,125,79,.16),0 12px 34px rgba(73,39,20,.18)}}
  @media (hover:none){[data-editor-kind]::after{content:"";width:34px;min-height:34px;padding:0;background-position:center;opacity:0;transform:none}[data-editor-kind]:is(:focus,.is-editor-active)::after{opacity:.92}}
  @media (prefers-reduced-motion:reduce){[data-editor-kind],[data-editor-kind]::after{transition:none}}
`;

const studioMotionStyles = `
  .original-template-document *, .original-template-document *::before, .original-template-document *::after{animation-delay:0s!important;animation-duration:.001ms!important;transition-delay:0s!important}
`;

const makeEditorHotspot = (element, { kind, section, field = '', tab }) => {
  element.dataset.editorKind = kind;
  element.dataset.editorSection = section;
  element.dataset.editorTab = tab;
  element.dataset.editorLabel = kind === 'image' ? 'Նկար' : kind === 'map' ? 'Քարտեզ' : 'Խմբագրել';
  if (field) element.dataset.editorField = field;
  if (kind === 'text' && field) {
    element.contentEditable = 'plaintext-only';
    element.spellcheck = true;
    element.dataset.editorOwnedContenteditable = '';
    if (!element.hasAttribute('role')) {
      element.setAttribute('role', 'textbox');
      element.dataset.editorOwnedRole = '';
    }
    element.setAttribute('aria-multiline', element.matches('p, blockquote, figcaption') ? 'true' : 'false');
    element.addEventListener('focus', forwardEditorInlineFocus);
    element.addEventListener('blur', forwardEditorInlineBlur);
    element.addEventListener('keydown', forwardEditorInlineKeyDown);
    element.dataset.editorOwnedInlineEvents = '';
  } else if (!element.hasAttribute('tabindex')) {
    element.tabIndex = 0;
    element.dataset.editorOwnedTabindex = '';
  }
  if (kind !== 'text' && !element.hasAttribute('role')) {
    element.setAttribute('role', 'button');
    element.dataset.editorOwnedRole = '';
  }
  if (!element.hasAttribute('aria-label')) {
    element.setAttribute('aria-label', kind === 'image' ? 'Փոխել նկարը' : kind === 'map' ? 'Խմբագրել քարտեզը' : 'Խմբագրել այս հատվածը');
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
  target.classList.add('is-editor-inline-editing');
}

function forwardEditorInlineBlur(event) {
  const target = event.currentTarget;
  target.classList.remove('is-editor-inline-editing');
  const value = target.innerText.replace(/\u00a0/g, ' ');
  delete target.dataset.editorOriginalText;
  target.ownerDocument.__amuletEditorInlineCommitHandler?.({
    field: target.dataset.editorField || '',
    value
  });
}

function forwardEditorInlineKeyDown(event) {
  const target = event.currentTarget;
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
  if (event.currentTarget.dataset.editorKind === 'image') {
    const picker = event.currentTarget.ownerDocument.querySelector('[data-direct-image-picker]');
    if (picker) {
      picker.dataset.targetField = event.currentTarget.dataset.editorField || '';
      picker.click();
    }
  }
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

export const clearPreviewDecorations = (root, { removeStyles = false } = {}) => {
  if (!root) return;
  getPreviewRoots(root).forEach((scope) => {
    scope.querySelectorAll('[data-editor-kind], [data-editor-section]').forEach((element) => {
      if (element.hasAttribute('data-editor-owned-tabindex')) element.removeAttribute('tabindex');
      if (element.hasAttribute('data-editor-owned-role')) element.removeAttribute('role');
      if (element.hasAttribute('data-editor-owned-label')) element.removeAttribute('aria-label');
      if (element.hasAttribute('data-editor-owned-click')) element.removeEventListener('click', forwardEditorHotspotClick);
      if (element.hasAttribute('data-editor-owned-inline-events')) {
        element.removeEventListener('focus', forwardEditorInlineFocus);
        element.removeEventListener('blur', forwardEditorInlineBlur);
        element.removeEventListener('keydown', forwardEditorInlineKeyDown);
      }
      if (element.hasAttribute('data-editor-owned-contenteditable')) {
        element.removeAttribute('contenteditable');
        element.removeAttribute('spellcheck');
        element.removeAttribute('aria-multiline');
      }
      element.classList.remove('is-editor-active', 'is-editor-section-active', 'is-editor-inline-editing');
      [
        'data-editor-kind', 'data-editor-field', 'data-editor-tab', 'data-editor-section',
        'data-editor-label', 'data-editor-owned-tabindex', 'data-editor-owned-role',
        'data-editor-owned-label', 'data-editor-owned-click', 'data-editor-owned-contenteditable',
        'data-editor-owned-inline-events', 'data-editor-original-text'
      ].forEach((attribute) => element.removeAttribute(attribute));
    });
    if (removeStyles) scope.querySelector('style[data-amulet-edit-hotspots]')?.remove();
  });
};

export const decoratePreview = (root, data, { suppressMotion = false } = {}) => {
  if (!root) return { texts: [], images: [] };
  const fields = getPreviewFields(data);
  const editableTexts = new Map();
  const editableImages = new Map();

  getPreviewRoots(root).forEach((scope) => {
    if (scope.nodeType === 11 && scope.host && !scope.querySelector('style[data-amulet-edit-hotspots]')) {
      const style = scope.ownerDocument.createElement('style');
      style.dataset.amuletEditHotspots = '';
      style.textContent = `${suppressMotion ? studioMotionStyles : ''}${shadowHotspotStyles}`;
      scope.append(style);
    }

    clearPreviewDecorations(scope);

    Object.entries(previewSectionSelectors).forEach(([section, selectors]) => {
      selectors.forEach((selector) => scope.querySelectorAll(selector).forEach((element) => {
        element.dataset.editorSection = section;
      }));
    });

    const genericSections = ['hero', 'hero', 'family', 'schedule', 'schedule', 'schedule', 'media', 'closing', 'schedule', 'rsvp', 'closing'];
    scope.querySelectorAll('section').forEach((element, index) => {
      if (!element.dataset.editorSection) element.dataset.editorSection = genericSections[index] || 'closing';
    });

    const textCandidatesByBlock = new Map();
    scope.querySelectorAll('h1, h2, h3, p, span, strong, b, em, legend, blockquote, label, button, li, figcaption, small').forEach((element) => {
      if (element.closest('[aria-hidden="true"]')) return;
      if (!element.dataset.templateTextKey && element.querySelector('h1, h2, h3, p, span, strong, b, em, legend, blockquote, label, button, li, figcaption, small')) return;
      const text = normalizePreviewText(element.textContent);
      const templateTextKey = element.dataset.templateTextKey;
      if (!text && !templateTextKey) return;
      let match = fields.find((item) => item.values.some((value) => text === value || (value.length > 4 && text.includes(value))));
      let section = match?.section || element.closest('[data-editor-section]')?.dataset.editorSection || 'hero';
      if (!templateTextKey && element.closest('button, a, input, textarea, select, label, .original-template-preview-actions')) return;
      if (!match && templateTextKey) {
        const defaultValue = element.dataset.templateTextDefault || element.textContent || '';
        editableTexts.set(templateTextKey, { key: templateTextKey, defaultValue });
        match = { field: `templateTextOverrides.${templateTextKey}`, section: 'templateContent' };
        section = 'templateContent';
      }
      if (!match) return;
      const block = element.closest('section, article, blockquote') || section;
      const score = (match ? 100 : 0)
        + (element.matches('h1') ? 35 : element.matches('h2') ? 30 : element.matches('h3') ? 25 : 0)
        + Math.min(text.length, 40) / 10;
      const candidates = textCandidatesByBlock.get(block) || [];
      candidates.push({ element, match, score, section });
      textCandidatesByBlock.set(block, candidates);
    });

    textCandidatesByBlock.forEach((candidates) => {
      candidates.forEach(({ element, match, section }) => {
        makeEditorHotspot(element, { kind: 'text', section, field: match?.field, tab: 'content' });
      });
    });

    const orderedImages = [data.image, ...(data.gallery || [])]
      .filter((image, index, images) => image && images.indexOf(image) === index);
    const absoluteImageSource = (value) => {
      try { return new URL(resolveTemplateImage(value), document.baseURI).href; } catch { return resolveTemplateImage(value); }
    };

    scope.querySelectorAll('img:not([aria-hidden="true"])').forEach((image) => {
      if (image.closest('.engagement-week, .baptism-envelope-button')) return;
      const target = image.closest('picture') || image;
      if (!target) return;
      const source = image.currentSrc || image.src;
      const imageIndex = orderedImages.findIndex((item) => absoluteImageSource(item) === source);
      const templateImageKey = image.dataset.templateImageKey;
      if (templateImageKey) {
        editableImages.set(templateImageKey, {
          key: templateImageKey,
          defaultValue: image.dataset.templateImageDefault || source,
          alt: image.alt || `Նկար ${editableImages.size + 1}`,
          label: getTemplateImageLabel(image, editableImages.size)
        });
      }
      makeEditorHotspot(target, {
        kind: 'image',
        section: 'media',
        field: templateImageKey ? `templateImageOverrides.${templateImageKey}` : (imageIndex >= 0 ? `gallery.${imageIndex}` : ''),
        tab: 'media'
      });
    });

    let fallbackMapIndex = 0;
    scope.querySelectorAll('a[class*="map-button"], button[class*="map-button"], span[class*="map-button"], a[href*="google.com/maps"], a[href*="maps.app"], a[href*="goo.gl/maps"]').forEach((target) => {
      const href = target.getAttribute('href') || '';
      const matchedIndex = (data.mapLinks || []).findIndex((item) => item?.url && href.includes(item.url));
      const mapIndex = matchedIndex >= 0 ? matchedIndex : Math.min(fallbackMapIndex, Math.max(0, (data.mapLinks || []).length - 1));
      fallbackMapIndex += 1;
      makeEditorHotspot(target, { kind: 'map', section: 'schedule', field: `mapLinks.${mapIndex}.url`, tab: 'content' });
    });

    scope.querySelectorAll('.midnight-cover, .engagement-cover, .baptism-hero, .sacred-hero, .birthday-hero, .ivory-hero').forEach((target) => {
      if (target.querySelector('[data-template-image-key]')) return;
      target.querySelectorAll('[data-editor-kind="image"]').forEach((child) => {
        child.removeAttribute('data-editor-kind');
        child.removeAttribute('data-editor-section');
        child.removeAttribute('data-editor-tab');
      });
      makeEditorHotspot(target, { kind: 'image', section: 'media', tab: 'media' });
    });
  });

  return { texts: [...editableTexts.values()], images: [...editableImages.values()] };
};

function PreviewViewport({ children, data, device, onReady }) {
  const [mountNode, setMountNode] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!mountNode) return undefined;
    const run = () => {
      if (findPreviewElement(mountNode, '.is-editor-inline-editing')) return;
      const catalog = decoratePreview(mountNode, data, { suppressMotion: true });
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
  }, [data, mountNode, onReady]);

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
        title="Հրավերի responsive նախադիտում"
        srcDoc="<!doctype html><html><head></head><body></body></html>"
        onLoad={(event) => prepareDocument(event.currentTarget)}
      />
      {mountNode && createPortal(children, mountNode)}
    </>
  );
}

const navItems = [
  ['templates', LayoutGrid, 'Ձևանմուշներ'],
  ['content', Pencil, 'Խմբագրել'],
  ['design', Sparkles, 'Ձևավորում'],
  ['media', Save, 'Մեդիա'],
  ['buy', CheckCircle2, 'Գնել']
];

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
  return <div className="invite-editor-devices" role="tablist" aria-label="Նախադիտման սարք">{[
    ['desktop', Monitor, 'Համակարգիչ'],
    ['tablet', Tablet, 'Պլանշետ'],
    ['mobile', Smartphone, 'Հեռախոս']
  ].map(([value, Icon, label]) => <button key={value} role="tab" type="button" aria-selected={device === value} className={device === value ? 'is-active' : ''} onClick={() => setDevice(value)}><Icon size={15} /><span>{label}</span></button>)}</div>;
}

function PreviewWorkspace({ PreviewComponent }) {
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
  const directImageInputRef = useRef(null);
  const directImageFieldRef = useRef('');
  const handledPreviewFocusRequestRef = useRef(previewFocusRequest);
  const [previewReady, setPreviewReady] = useState(0);

  const handlePreviewReady = useCallback((root, catalog) => {
    registerEditableContent(catalog);
    if (previewRootRef.current === root) return;
    previewRootRef.current = root;
    setPreviewReady((value) => value + 1);
  }, [registerEditableContent]);

  useEffect(() => {
    registerEditableContent(decoratePreview(previewRootRef.current, data, { suppressMotion: true }));
  }, [data, previewReady, registerEditableContent]);

  useEffect(() => {
    const root = previewRootRef.current;
    if (!root) return;
    const shouldScrollPreview = handledPreviewFocusRequestRef.current !== previewFocusRequest;
    handledPreviewFocusRequestRef.current = previewFocusRequest;
    getPreviewRoots(root).forEach((scope) => scope.querySelectorAll('.is-editor-active, .is-editor-section-active').forEach((element) => {
      element.classList.remove('is-editor-active', 'is-editor-section-active');
    }));
    let target = activeField ? findPreviewElement(root, `[data-editor-field="${activeField}"]`) : null;
    if (!target && activeSection === 'media') target = findPreviewElement(root, '[data-editor-kind="image"]');
    if (!target && activeSection) target = findPreviewElement(root, `[data-editor-section="${activeSection}"]`);
    if (!target) return;
    const activeBlock = target.closest('[data-editor-section]') || target;
    void target.offsetWidth;
    target.classList.add('is-editor-active');
    if (activeBlock !== target) activeBlock.classList.add('is-editor-section-active');
    if (shouldScrollPreview) target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  }, [activeField, activeSection, previewFocusRequest, previewReady]);

  const handlePreviewClick = (event) => {
    if (event.amuletEditorHandled) return;
    const path = (event.nativeEvent || event).composedPath();
    const target = path.find((node) => ['map', 'image'].includes(node?.dataset?.editorKind))
      || path.find((node) => node?.dataset?.editorKind)
      || event.target.closest?.('[data-editor-kind]');
    if (!target) return;
    event.amuletEditorHandled = true;
    if (target.dataset.editorKind === 'text' && target.dataset.editorField) {
      event.preventDefault();
      event.stopPropagation();
      focusEditorTarget({
        section: target.dataset.editorSection || 'hero',
        field: target.dataset.editorField || '',
        targetTab: target.dataset.editorTab || 'content',
        scrollPreview: false
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
        scrollPreview: false
      });
      return;
    }
    focusEditorTarget({
      section: target.dataset.editorSection || (target.dataset.editorKind === 'image' ? 'media' : 'hero'),
      field: target.dataset.editorField || '',
      targetTab: target.dataset.editorTab || (target.dataset.editorKind === 'image' ? 'media' : 'content'),
      scrollPreview: false
    });
  };

  const replaceDirectImage = async (file) => {
    if (!file) return;
    const image = await prepareImage(file);
    const prefix = 'templateImageOverrides.';
    const field = directImageFieldRef.current;
    update((draft) => {
      if (field.startsWith(prefix)) {
        draft.templateImageOverrides = { ...(draft.templateImageOverrides || {}), [field.slice(prefix.length)]: image };
      } else {
        draft.image = image;
        draft.gallery = normalizeInvitationGallery(image, draft.gallery);
      }
    });
  };

  const handlePreviewKeyDown = (event) => {
    if (!['Enter', ' '].includes(event.key)) return;
    handlePreviewClick(event);
  };

  useEffect(() => {
    const root = previewRootRef.current;
    if (!root) return undefined;
    root.ownerDocument.__amuletEditorHotspotHandler = handlePreviewClick;
    root.ownerDocument.__amuletEditorInlineCommitHandler = ({ field, value }) => {
      if (!field) return;
      update((draft) => updateDraftTextField(draft, field, value));
    };
    root.addEventListener('click', handlePreviewClick, true);
    root.addEventListener('keydown', handlePreviewKeyDown, true);
    return () => {
      delete root.ownerDocument.__amuletEditorHotspotHandler;
      delete root.ownerDocument.__amuletEditorInlineCommitHandler;
      root.removeEventListener('click', handlePreviewClick, true);
      root.removeEventListener('keydown', handlePreviewKeyDown, true);
    };
  }, [previewReady]);

  const frameImage = device === 'mobile' ? iphoneDeviceFrame : device === 'tablet' ? ipadDeviceFrame : null;
  return (
    <main className="invite-editor-preview">
      <div className={`invite-editor-device is-${device}`}>
        <div className="invite-editor-device-screen">
          <PreviewViewport data={data} device={device} onReady={handlePreviewReady}>
            <div className="invite-editor-preview-scroll" data-preview-device={device}>
              <input ref={directImageInputRef} data-direct-image-picker type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => { directImageFieldRef.current = event.currentTarget.dataset.targetField || ''; void replaceDirectImage(event.target.files?.[0]); event.target.value = ''; }} />
              <PreviewComponent draft={data} price={template.price} mode="studio" loading={actions.saving} onHome={() => {}} onEdit={() => {}} onOrder={() => actions.onBuy?.(data)} />
              <button
                type="button"
                className="invite-editor-preview-camera"
                aria-label="Փոխել հրավերի նկարը"
                onClick={() => { directImageFieldRef.current = ''; directImageInputRef.current?.click(); focusEditorTarget({ section: 'media', targetTab: 'media', scrollPreview: false }); }}
              >
                <Camera size={16} />
              </button>
            </div>
          </PreviewViewport>
        </div>
        {frameImage && <img className="invite-editor-device-frame" src={frameImage} alt="" aria-hidden="true" />}
      </div>
      {mobileSheet === 'collapsed' && <button type="button" className="invite-editor-open-sheet" onClick={() => setMobileSheet('medium')}><Pencil size={17} /> Խմբագրել</button>}
    </main>
  );
}

function EditorBody({ PreviewComponent, isSingleImageTemplate }) {
  const { activeField, activeSection, actions, canRedo, canUndo, data, device, dirty, mobileSheet, redo, save, saveStatus, setDevice, setMobileSheet, setSidebarOpen, setTab, sidebarOpen, tab, undo } = useEditor();
  const [confirmClose, setConfirmClose] = useState(false);
  const [closePending, setClosePending] = useState(false);
  const [compactViewport, setCompactViewport] = useState(() => window.matchMedia('(max-width: 1024px)').matches);
  const sheetStart = useRef(null);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1024px)');
    const updateViewport = (event) => {
      setCompactViewport(event.matches);
      if (event.matches) setDevice('mobile');
    };
    if (query.matches) setDevice('mobile');
    query.addEventListener('change', updateViewport);
    return () => query.removeEventListener('change', updateViewport);
  }, [setDevice]);

  const requestClose = useCallback(() => {
    if (dirty) setConfirmClose(true);
    else actions.onClose?.();
  }, [actions, dirty]);

  const continueEditing = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setConfirmClose(false);
  };

  const saveAndClose = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (closePending) return;
    setClosePending(true);
    const saved = await save();
    if (saved !== false) actions.onClose?.();
    else setClosePending(false);
  };

  const closeWithoutSaving = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setConfirmClose(false);
    actions.onClose?.();
  };

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const onEscape = (event) => { if (event.key === 'Escape') requestClose(); };
    window.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      window.removeEventListener('keydown', onEscape);
    };
  }, [requestClose]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const sidebar = document.querySelector('.invite-editor-sidebar-scroll');
      if (!sidebar) return;
      let target = activeField ? sidebar.querySelector(`[data-editor-field="${activeField}"]`) : null;
      if (!target && activeSection) target = sidebar.querySelector(`[data-editor-section-id="${activeSection}"]`);
      if (!target) {
        if (activeSection === 'media') sidebar.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const control = activeField ? target.querySelector('input, textarea, select, button') : null;
      control?.focus({ preventScroll: true });
    }, 90);
    return () => window.clearTimeout(timer);
  }, [activeField, activeSection, tab]);

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
    <section className={`amulet-invite-editor${sidebarOpen ? '' : ' is-sidebar-collapsed'} is-device-${device}`} data-active-section={activeSection} data-active-field={activeField || undefined} role="dialog" aria-modal="true" aria-label="Amulet հրավերի խմբագրիչ">
      <header className="invite-editor-topbar">
        <div className="invite-editor-top-left">
          <button type="button" onClick={toggleEditorPanel} aria-expanded={panelOpen} aria-controls="invite-editor-sidebar" aria-label={panelOpen ? 'Փակել խմբագրման վահանակը' : 'Բացել խմբագրման վահանակը'}>{panelOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}</button>
          <button type="button" onClick={undo} disabled={!canUndo} aria-label="Հետարկել"><Undo2 size={17} /></button>
          <button type="button" onClick={redo} disabled={!canRedo} aria-label="Կրկնել"><Redo2 size={17} /></button>
          <span>Amulet Studio</span>
        </div>
        <DeviceSwitcher />
        <div className="invite-editor-top-actions">
          <small>{saveStatus === 'saving' ? 'Պահպանվում է...' : saveStatus === 'saved' ? 'Պահպանված է' : dirty ? 'Չպահպանված փոփոխություններ' : 'Պատրաստ է'}</small>
          <button type="button" onClick={() => void save()} disabled={actions.saving}><Save size={17} /><span>Պահպանել</span></button>
          <button type="button" onClick={requestClose} aria-label="Փակել խմբագրիչը"><X size={24} /></button>
        </div>
      </header>

      <nav className="invite-editor-rail" aria-label="Խմբագրիչի բաժիններ">
        <strong aria-hidden="true">A</strong>
        {navItems.map(([value, Icon, label]) => <button key={value} type="button" className={tab === value ? 'is-active' : ''} onClick={() => selectTab(value)} aria-current={tab === value ? 'page' : undefined} aria-label={label} title={label}><Icon size={20} /></button>)}
        <button type="button" className="invite-editor-back" onClick={requestClose} aria-label="Ետ" title="Ետ"><ArrowLeft size={19} /></button>
      </nav>

      <aside id="invite-editor-sidebar" className={`invite-editor-sidebar is-${mobileSheet}`}>
        <div className="invite-editor-sidebar-scroll">
        <div className="invite-editor-sheet-handle" onPointerDown={(event) => { sheetStart.current = event.clientY; }} onPointerUp={(event) => {
          if (sheetStart.current === null) return;
          const delta = event.clientY - sheetStart.current;
          sheetStart.current = null;
          if (delta < -35) setMobileSheet('expanded');
          if (delta > 35) setMobileSheet('collapsed');
        }}><i /><button type="button" onClick={() => setMobileSheet('collapsed')} aria-label="Փակել խմբագրման վահանակը"><ChevronDown size={17} /></button></div>
        <EditorPanel isSingleImageTemplate={isSingleImageTemplate} />
        </div>
        <footer><button type="button" onClick={() => void save()} disabled={actions.saving}><Save size={16} /> Պահպանել preview-ը</button><button type="button" onClick={() => actions.onBuy?.(data)} disabled={actions.saving}><ShoppingBag size={16} /> Գնել</button></footer>
      </aside>

      <PreviewWorkspace PreviewComponent={PreviewComponent} />

      {confirmClose && <div className="invite-editor-confirm" role="dialog" aria-modal="true" aria-labelledby="invite-editor-close-title"><section><span><Save size={20} /></span><h2 id="invite-editor-close-title">Փակե՞լ խմբագրիչը</h2><p>Վերջին փոփոխությունները դեռ չեն պահպանվել private preview-ում։</p><div><button type="button" onClick={continueEditing} disabled={closePending}>Շարունակել խմբագրումը</button><button type="button" onClick={saveAndClose} disabled={closePending}>{closePending ? 'Պահպանվում է...' : 'Պահպանել և փակել'}</button><button type="button" className="is-danger" onClick={closeWithoutSaving} disabled={closePending}>Փակել առանց պահպանելու</button></div></section></div>}
    </section>
  );
}

export default function InvitationEditor({ draft, initialTarget, template, PreviewComponent, isSingleImageTemplate, saving, onClose, onSave, onBuy, onDraftChange, onSelectTemplate }) {
  const actions = useMemo(() => ({
    saving,
    onClose,
    onDraftChange,
    onSelectTemplate,
    onSave: async (nextDraft) => onSave?.(nextDraft),
    onBuy: (nextDraft) => onBuy?.(nextDraft)
  }), [onBuy, onClose, onDraftChange, onSave, onSelectTemplate, saving]);

  return <EditorProvider initialDraft={draft} initialTarget={initialTarget} template={template} actions={actions}><EditorBody PreviewComponent={PreviewComponent} isSingleImageTemplate={isSingleImageTemplate} /></EditorProvider>;
}
