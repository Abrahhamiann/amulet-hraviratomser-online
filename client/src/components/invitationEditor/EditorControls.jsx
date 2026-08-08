import React, { useId, useState } from 'react';
import { ChevronDown, Settings2, X } from 'lucide-react';

export function PanelHeader({ title, subtitle, children }) {
  return <header className="invite-editor-panel-header"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{children}</header>;
}

export function Field({ label, hint, action, children }) {
  return <label className="invite-editor-field"><span><b>{label}</b>{hint && <small>{hint}</small>}</span><div>{children}{action}</div></label>;
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
  return (
    <section className={`invite-editor-section${open ? ' is-open' : ''}${enabled === false ? ' is-disabled' : ''}`}>
      <header>
        <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={`invite-editor-${id}`}>
          {Icon && <Icon size={17} />}<strong>{title}</strong><ChevronDown size={16} />
        </button>
        {typeof enabled === 'boolean' && <Toggle checked={enabled} onChange={onEnabledChange} label={`${title}: ${enabled ? 'միացված' : 'անջատված'}`} />}
      </header>
      {open && <div id={`invite-editor-${id}`} className="invite-editor-section-body">{children}</div>}
    </section>
  );
}

export function TypographyEditor({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="invite-editor-typography">
      <button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label="Տեքստի ոճ"><Settings2 size={15} /></button>
      {open && (
        <div className="invite-editor-popover" role="dialog" aria-label="Տեքստի ոճ">
          <header><strong>Տեքստի ոճ</strong><button type="button" onClick={() => setOpen(false)} aria-label="Փակել"><X size={15} /></button></header>
          <Field label="Տառատեսակ"><select value={value.fontFamily || 'inherit'} onChange={(event) => onChange({ fontFamily: event.target.value })}><option value="inherit">Կայքի հիմնական</option><option value="Arial Armenian, Arial, sans-serif">Հայերեն դասական</option><option value="Georgia, Times New Roman, serif">Նրբագեղ Serif</option><option value="SHK Dzeragir, cursive">Ձեռագիր</option></select></Field>
          <div className="invite-editor-grid-two">
            <Field label="Չափ"><input type="number" min="0" max="120" value={value.fontSize || 0} onChange={(event) => onChange({ fontSize: Number(event.target.value) })} /></Field>
            <Field label="Հաստություն"><select value={value.fontWeight || 400} onChange={(event) => onChange({ fontWeight: Number(event.target.value) })}>{[300, 400, 500, 600, 700].map((weight) => <option key={weight}>{weight}</option>)}</select></Field>
            <Field label="Տողերի բարձրություն"><input type="number" min=".7" max="2" step=".05" value={value.lineHeight || 1.05} onChange={(event) => onChange({ lineHeight: Number(event.target.value) })} /></Field>
            <Field label="Տառամիջոց"><input type="number" min="-4" max="16" step=".5" value={value.letterSpacing || 0} onChange={(event) => onChange({ letterSpacing: Number(event.target.value) })} /></Field>
          </div>
          <Field label="Գույն"><div className="invite-editor-color-line"><input type="color" value={value.color || '#ffffff'} onChange={(event) => onChange({ color: event.target.value })} /><input value={value.color || ''} placeholder="Template default" onChange={(event) => onChange({ color: event.target.value })} /></div></Field>
          <div className="invite-editor-text-options">
            {['left', 'center', 'right'].map((align) => <button key={align} type="button" className={value.align === align ? 'is-active' : ''} onClick={() => onChange({ align })}>{align === 'left' ? 'Ձախ' : align === 'right' ? 'Աջ' : 'Կենտրոն'}</button>)}
            <button type="button" className={value.italic ? 'is-active' : ''} onClick={() => onChange({ italic: !value.italic })}>Շեղ</button>
            <button type="button" className={value.uppercase ? 'is-active' : ''} onClick={() => onChange({ uppercase: !value.uppercase })}>ՄԵԾԱՏԱՌ</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function EmptyState({ title, text }) {
  return <div className="invite-editor-empty"><strong>{title}</strong>{text && <p>{text}</p>}</div>;
}

