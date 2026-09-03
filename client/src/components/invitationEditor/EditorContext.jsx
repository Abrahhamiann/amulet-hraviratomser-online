import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { cloneEditorDraft, prepareEditorDraft } from './editorData.js';

const EditorContext = createContext(null);
const MAX_HISTORY = 60;
const getInitialPreviewDevice = () => {
  if (typeof window === 'undefined') return 'desktop';
  if (window.matchMedia('(max-width: 600px)').matches) return 'mobile';
  if (window.matchMedia('(max-width: 1180px)').matches) return 'tablet';
  return 'desktop';
};

const getInitialMobileSheet = () => {
  if (typeof window === 'undefined') return 'medium';
  return window.matchMedia('(max-width: 1024px)').matches ? 'collapsed' : 'medium';
};

const createHistory = (draft) => ({ past: [], present: prepareEditorDraft(draft), future: [] });

const getTemplateRsvpDefaults = (template = {}) => {
  const key = [template.designKey, template.slug, template.title].filter(Boolean).join(' ').toLowerCase();
  if (key.includes('birthday-sparkle')) return {
    title: 'Կմիանա՞ք տոնակատարությանը',
    description: 'Խնդրում եմ տեղեկացնել՝ կմիանա՞ք մեր տոնին։',
    guestPlaceholder: 'Ձեր անունը',
    attendingLabel: '✓ Այո, ներկա կլինեմ',
    notAttendingLabel: '✕ Ցավոք, չեմ կարող գալ',
    submitLabel: 'Ուղարկել պատասխանը 🎉'
  };
  if (key.includes('ivory-vows')) return {
    title: 'Կտոնե՞ք մեզ հետ',
    description: 'Խնդրում ենք նախապես հաստատել Ձեր մասնակցությունը։',
    guestPlaceholder: 'Ձեր անունը',
    attendingLabel: 'Այո, մեծ սիրով',
    notAttendingLabel: 'Ցավոք, չեմ կարող',
    submitLabel: 'Հաստատել մասնակցությունը',
    deadline: '1 օգոստոսի, 2026'
  };
  if (key.includes('sacred-beginnings')) return {
    title: 'Կտոնե՞ք մեզ հետ',
    description: 'Խնդրում ենք տեղեկացնել՝ կկարողանա՞ք մեզ միանալ այս առանձնահատուկ օրը։',
    guestPlaceholder: 'Ձեր անունը',
    attendingLabel: 'Այո, մեծ սիրով',
    notAttendingLabel: 'Ցավոք՝ ոչ',
    submitLabel: 'Հաստատել մասնակցությունը',
    deadline: 'Խնդրում ենք պատասխանել մինչև 1 սեպտեմբերի, 2026'
  };
  return {};
};

const prepareTemplateImageOverrides = (draft = {}, template = {}) => {
  const overrides = { ...(draft.templateImageOverrides || {}) };
  const templateKey = [template.designKey, template.slug, template.title].filter(Boolean).join(' ').toLowerCase();
  if (templateKey.includes('army-ceremonial')
    || templateKey.includes('amulet-army-invitation')
    || templateKey.includes('army-camouflage')) {
    [
      ['image-0', 'army-hero-emblem'],
      ['image-2', 'army-small-emblem'],
      ['image-3', 'army-footer-emblem']
    ].forEach(([legacyKey, stableKey]) => {
      if (!Object.prototype.hasOwnProperty.call(overrides, stableKey)
        && Object.prototype.hasOwnProperty.call(overrides, legacyKey)) {
        overrides[stableKey] = overrides[legacyKey];
      }
      delete overrides[legacyKey];
    });
  }

  // Blank fixed-image overrides made the asset permanently invisible. In the
  // editor, a missing key consistently means "use the template default".
  return Object.fromEntries(Object.entries(overrides)
    .filter(([, value]) => typeof value === 'string' && value.trim()));
};

const prepareTemplateDraft = (draft, template) => ({
  ...draft,
  templateImageOverrides: prepareTemplateImageOverrides(draft, template),
  rsvpSettings: { ...getTemplateRsvpDefaults(template), ...(draft?.rsvpSettings || {}) }
});

function historyReducer(state, action) {
  if (action.type === 'reset') return createHistory(action.draft);
  if (action.type === 'undo' && state.past.length) {
    return {
      past: state.past.slice(0, -1),
      present: state.past[state.past.length - 1],
      future: [state.present, ...state.future].slice(0, MAX_HISTORY)
    };
  }
  if (action.type === 'redo' && state.future.length) {
    return {
      past: [...state.past, state.present].slice(-MAX_HISTORY),
      present: state.future[0],
      future: state.future.slice(1)
    };
  }
  if (action.type !== 'update') return state;

  const next = cloneEditorDraft(state.present);
  action.change(next);
  return {
    past: [...state.past, state.present].slice(-MAX_HISTORY),
    present: next,
    future: []
  };
}

export function EditorProvider({ initialDraft, originalDraft = initialDraft, initialTarget = {}, template, actions, children }) {
  const [history, dispatch] = useReducer(historyReducer, { draft: initialDraft, template }, ({ draft, template: sourceTemplate }) => createHistory(prepareTemplateDraft(draft, sourceTemplate)));
  const [tab, setTab] = useState(initialTarget.targetTab || 'content');
  const [device, setDevice] = useState(getInitialPreviewDevice);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSheet, setMobileSheet] = useState(getInitialMobileSheet);
  const [activeSection, setActiveSection] = useState(initialTarget.section || 'hero');
  const [activeField, setActiveField] = useState(initialTarget.field || (initialTarget.section ? '' : 'mainNames'));
  const [previewFocusRequest, setPreviewFocusRequest] = useState({ id: 0, scroll: false, scrollSidebar: false, focusSidebar: false });
  const [editableContent, setEditableContent] = useState({ texts: [], images: [] });
  const [saveStatus, setSaveStatus] = useState('idle');
  const originalDraftRef = useRef(prepareEditorDraft(prepareTemplateDraft(cloneEditorDraft(originalDraft), template)));
  const baselineRef = useRef(JSON.stringify(originalDraftRef.current));
  const actionsRef = useRef(actions);

  useEffect(() => {
    actionsRef.current = actions;
  }, [actions]);

  useEffect(() => {
    const hasChanges = JSON.stringify(history.present) !== baselineRef.current;
    actionsRef.current.onDraftChange?.(history.present, hasChanges);
    setSaveStatus(hasChanges ? 'changed' : 'original');
  }, [history.present]);

  const dirty = JSON.stringify(history.present) !== baselineRef.current;
  const update = useCallback((change) => dispatch({ type: 'update', change }), []);
  const undo = useCallback(() => dispatch({ type: 'undo' }), []);
  const redo = useCallback(() => dispatch({ type: 'redo' }), []);
  const focusEditorTarget = useCallback(({ section = 'hero', field = '', targetTab = 'content', scrollPreview = true, focusSidebar = true, scrollSidebar = focusSidebar } = {}) => {
    setActiveSection(section);
    setActiveField(field);
    setTab(targetTab);
    setSidebarOpen(true);
    setMobileSheet('medium');
    setPreviewFocusRequest((request) => ({ id: request.id + 1, scroll: scrollPreview, scrollSidebar, focusSidebar }));
  }, []);
  const registerEditableContent = useCallback((catalog = {}) => {
    setEditableContent((current) => {
      const next = { texts: catalog.texts || [], images: catalog.images || [] };
      return JSON.stringify(current) === JSON.stringify(next) ? current : next;
    });
  }, []);

  const restoreOriginal = useCallback(() => {
    const restored = cloneEditorDraft(originalDraftRef.current);
    dispatch({ type: 'reset', draft: restored });
    setSaveStatus('original');
    actionsRef.current.onRestore?.(restored);
    return restored;
  }, []);

  const discardChanges = useCallback(() => {
    const restored = cloneEditorDraft(originalDraftRef.current);
    actionsRef.current.onDiscard?.(restored);
    return restored;
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      const command = event.metaKey || event.ctrlKey;
      if (command && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [redo, undo]);

  const value = useMemo(() => ({
    data: history.present,
    template,
    actions,
    update,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    dirty,
    restoreOriginal,
    discardChanges,
    saveStatus,
    tab,
    setTab,
    device,
    setDevice,
    sidebarOpen,
    setSidebarOpen,
    mobileSheet,
    setMobileSheet,
    activeSection,
    activeField,
    previewFocusRequest,
    focusEditorTarget,
    editableContent,
    registerEditableContent
  }), [actions, activeField, activeSection, device, dirty, discardChanges, editableContent, focusEditorTarget, history.future.length, history.past.length, history.present, mobileSheet, previewFocusRequest, redo, registerEditableContent, restoreOriginal, saveStatus, sidebarOpen, tab, template, undo, update]);

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) throw new Error('useEditor must be used inside EditorProvider');
  return context;
}
