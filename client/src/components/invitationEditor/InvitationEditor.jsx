import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, LayoutGrid, Monitor, PanelLeftClose, PanelLeftOpen, Pencil, Redo2, Save, ShoppingBag, Smartphone, Sparkles, Tablet, Undo2, X } from 'lucide-react';
import { EditorProvider, useEditor } from './EditorContext.jsx';
import TemplatesPanel from './TemplatesPanel.jsx';
import ContentPanel from './ContentPanel.jsx';
import DesignPanel from './DesignPanel.jsx';
import MediaPanel from './MediaPanel.jsx';
import BuyPanel from './BuyPanel.jsx';
import './invitationEditor.css';

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
  const { data, template, device, actions, mobileSheet, setMobileSheet } = useEditor();
  return (
    <main className="invite-editor-preview">
      <div className={`invite-editor-device is-${device}`}>
        {device === 'mobile' && <div className="invite-editor-phone-island" aria-hidden="true" />}
        <div className="invite-editor-preview-scroll">
          <PreviewComponent draft={data} price={template.price} mode="studio" loading={actions.saving} onHome={() => {}} onEdit={() => {}} onOrder={() => actions.onBuy?.(data)} />
        </div>
      </div>
      {mobileSheet === 'collapsed' && <button type="button" className="invite-editor-open-sheet" onClick={() => setMobileSheet('medium')}><Pencil size={17} /> Խմբագրել</button>}
    </main>
  );
}

function EditorBody({ PreviewComponent, isSingleImageTemplate }) {
  const { actions, canRedo, canUndo, data, device, dirty, mobileSheet, redo, save, saveStatus, setMobileSheet, setSidebarOpen, setTab, sidebarOpen, tab, undo } = useEditor();
  const [confirmClose, setConfirmClose] = useState(false);
  const sheetStart = useRef(null);

  const requestClose = useCallback(() => {
    if (dirty) setConfirmClose(true);
    else actions.onClose?.();
  }, [actions, dirty]);

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

  const selectTab = (next) => {
    setTab(next);
    setSidebarOpen(true);
    setMobileSheet('medium');
  };

  return (
    <section className={`amulet-invite-editor${sidebarOpen ? '' : ' is-sidebar-collapsed'} is-device-${device}`} role="dialog" aria-modal="true" aria-label="Amulet հրավերի խմբագրիչ">
      <header className="invite-editor-topbar">
        <div className="invite-editor-top-left">
          <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={sidebarOpen ? 'Փակել վահանակը' : 'Բացել վահանակը'}>{sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}</button>
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

      <aside className={`invite-editor-sidebar is-${mobileSheet}`}>
        <div className="invite-editor-sheet-handle" onPointerDown={(event) => { sheetStart.current = event.clientY; }} onPointerUp={(event) => {
          if (sheetStart.current === null) return;
          const delta = event.clientY - sheetStart.current;
          sheetStart.current = null;
          if (delta < -35) setMobileSheet('expanded');
          if (delta > 35) setMobileSheet('collapsed');
        }}><i /><button type="button" onClick={() => setMobileSheet(mobileSheet === 'expanded' ? 'medium' : 'expanded')} aria-label="Փոխել վահանակի բարձրությունը">{mobileSheet === 'expanded' ? <ChevronDown size={16} /> : <ChevronUp size={16} />}</button></div>
        <div className="invite-editor-sidebar-scroll"><EditorPanel isSingleImageTemplate={isSingleImageTemplate} /></div>
        <footer><button type="button" onClick={() => void save()} disabled={actions.saving}><Save size={16} /> Պահպանել preview-ը</button><button type="button" onClick={() => actions.onBuy?.(data)} disabled={actions.saving}><ShoppingBag size={16} /> Գնել</button></footer>
      </aside>

      <PreviewWorkspace PreviewComponent={PreviewComponent} />

      {confirmClose && <div className="invite-editor-confirm" role="dialog" aria-modal="true" aria-labelledby="invite-editor-close-title"><section><span><Save size={20} /></span><h2 id="invite-editor-close-title">Փակե՞լ խմբագրիչը</h2><p>Վերջին փոփոխությունները դեռ չեն պահպանվել private preview-ում։</p><div><button type="button" onClick={() => setConfirmClose(false)}>Շարունակել խմբագրումը</button><button type="button" onClick={async () => { const saved = await save(); if (saved !== false) actions.onClose?.(); }}>Պահպանել և փակել</button><button type="button" className="is-danger" onClick={() => actions.onClose?.()}>Փակել առանց պահպանելու</button></div></section></div>}
    </section>
  );
}

export default function InvitationEditor({ draft, template, PreviewComponent, isSingleImageTemplate, saving, onClose, onSave, onBuy, onDraftChange, onSelectTemplate }) {
  const actions = useMemo(() => ({
    saving,
    onClose,
    onDraftChange,
    onSelectTemplate,
    onSave: async (nextDraft) => onSave?.(nextDraft),
    onBuy: (nextDraft) => onBuy?.(nextDraft)
  }), [onBuy, onClose, onDraftChange, onSave, onSelectTemplate, saving]);

  return <EditorProvider initialDraft={draft} template={template} actions={actions}><EditorBody PreviewComponent={PreviewComponent} isSingleImageTemplate={isSingleImageTemplate} /></EditorProvider>;
}
