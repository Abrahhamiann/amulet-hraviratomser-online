import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { useEditor } from './EditorContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export function PanelHeader({ title, subtitle, children }) {
  return <header className="invite-editor-panel-header"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{children}</header>;
}

export function Field({ label, hint, action, editorField, children }) {
  const { activeField } = useEditor();
  return <label className={`invite-editor-field${editorField && activeField === editorField ? ' is-editor-active' : ''}`} data-editor-field={editorField || undefined}><span><b>{label}</b>{hint && <small>{hint}</small>}</span><div>{children}{action}</div></label>;
}

export function Toggle({ checked, onChange, label }) {
  const id = useId();
  return (
    <button id={id} className={`invite-editor-toggle${checked ? ' is-on' : ''}`} type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}>
      <i />
    </button>
  );
}

export function CollapsibleSection({ id, title, icon: Icon, open, onToggle, enabled, onEnabledChange, children }) {
  const { t } = useLanguage();
  return (
    <section className={`invite-editor-section${open ? ' is-open' : ''}${enabled === false ? ' is-disabled' : ''}`} data-editor-section-id={id}>
      <header>
        <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={`invite-editor-${id}`}>
          {Icon && <Icon size={17} />}<strong>{title}</strong><ChevronDown size={16} />
        </button>
        {typeof enabled === 'boolean' && <Toggle checked={enabled} onChange={onEnabledChange} label={`${title}: ${enabled ? t('enabled') : t('disabled')}`} />}
      </header>
      {open && <div id={`invite-editor-${id}`} className="invite-editor-section-body">{children}</div>}
    </section>
  );
}

export function EmptyState({ title, text }) {
  return <div className="invite-editor-empty"><strong>{title}</strong>{text && <p>{text}</p>}</div>;
}
