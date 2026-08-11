import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { cloneEditorDraft, prepareEditorDraft } from './editorData.js';

const EditorContext = createContext(null);
const MAX_HISTORY = 60;
const getInitialPreviewDevice = () => {
  if (typeof window === 'undefined') return 'desktop';
  if (window.matchMedia('(max-width: 1024px)').matches) return 'mobile';
  if (window.matchMedia('(max-width: 1180px)').matches) return 'tablet';
  return 'desktop';
};

const getInitialMobileSheet = () => {
  if (typeof window === 'undefined') return 'medium';
  return window.matchMedia('(max-width: 1024px)').matches ? 'collapsed' : 'medium';
};

const createHistory = (draft) => ({ past: [], present: prepareEditorDraft(draft), future: [] });

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

export function EditorProvider({ initialDraft, initialTarget = {}, template, actions, children }) {
  const [history, dispatch] = useReducer(historyReducer, initialDraft, createHistory);
  const [tab, setTab] = useState(initialTarget.targetTab || 'content');
  const [device, setDevice] = useState(getInitialPreviewDevice);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSheet, setMobileSheet] = useState(getInitialMobileSheet);
  const [activeSection, setActiveSection] = useState(initialTarget.section || 'hero');
  const [activeField, setActiveField] = useState(initialTarget.field || (initialTarget.section ? '' : 'mainNames'));
  const [previewFocusRequest, setPreviewFocusRequest] = useState({ id: 0, scroll: false });
  const [editableContent, setEditableContent] = useState({ texts: [], images: [] });
  const [saveStatus, setSaveStatus] = useState('idle');
  const baselineRef = useRef(JSON.stringify(prepareEditorDraft(initialDraft)));
  const actionsRef = useRef(actions);
  const autosaveVersionRef = useRef(0);

  useEffect(() => {
    actionsRef.current = actions;
  }, [actions]);

  useEffect(() => {
    actionsRef.current.onDraftChange?.(history.present);
    setSaveStatus('saving');
    const version = ++autosaveVersionRef.current;
    const snapshot = cloneEditorDraft(history.present);
    const timer = window.setTimeout(async () => {
      try {
        const saved = await actionsRef.current.onSave?.(snapshot, { autosave: true });
        if (version !== autosaveVersionRef.current) return;
        if (saved === false) {
          setSaveStatus('error');
          return;
        }
        baselineRef.current = JSON.stringify(snapshot);
        setSaveStatus('saved');
      } catch {
        if (version === autosaveVersionRef.current) setSaveStatus('error');
      }
    }, 800);
    return () => window.clearTimeout(timer);
  }, [history.present]);

  const dirty = JSON.stringify(history.present) !== baselineRef.current;
  const update = useCallback((change) => dispatch({ type: 'update', change }), []);
  const undo = useCallback(() => dispatch({ type: 'undo' }), []);
  const redo = useCallback(() => dispatch({ type: 'redo' }), []);
  const focusEditorTarget = useCallback(({ section = 'hero', field = '', targetTab = 'content', scrollPreview = true } = {}) => {
    setActiveSection(section);
    setActiveField(field);
    setTab(targetTab);
    setSidebarOpen(true);
    setMobileSheet('medium');
    setPreviewFocusRequest((request) => ({ id: request.id + 1, scroll: scrollPreview }));
  }, []);
  const registerEditableContent = useCallback((catalog = {}) => {
    setEditableContent((current) => {
      const next = { texts: catalog.texts || [], images: catalog.images || [] };
      return JSON.stringify(current) === JSON.stringify(next) ? current : next;
    });
  }, []);

  const save = useCallback(async () => {
    setSaveStatus('saving');
    const saved = await actionsRef.current.onSave?.(history.present, { autosave: true });
    if (saved !== false) {
      baselineRef.current = JSON.stringify(history.present);
      setSaveStatus('saved');
    } else {
      setSaveStatus('error');
    }
    return saved;
  }, [history.present]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const command = event.metaKey || event.ctrlKey;
      if (command && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      }
      if (command && event.key.toLowerCase() === 's') {
        event.preventDefault();
        void save();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [redo, save, undo]);

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
    save,
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
  }), [actions, activeField, activeSection, device, dirty, editableContent, focusEditorTarget, history.future.length, history.past.length, history.present, mobileSheet, previewFocusRequest, redo, registerEditableContent, save, saveStatus, sidebarOpen, tab, template, undo, update]);

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) throw new Error('useEditor must be used inside EditorProvider');
  return context;
}
