import React from 'react';
import { Palette, RotateCcw } from 'lucide-react';
import { useEditor } from './EditorContext.jsx';
import { Field, PanelHeader } from './EditorControls.jsx';
import { buttonPresets, radiusPresets } from './editorData.js';

export default function DesignPanel() {
  const { data, update } = useEditor();
  const setColor = (key, value) => update((draft) => { draft.colors[key] = value; });
  const selectedPreset = buttonPresets.find((item) => item.id === data.buttonDesign.preset) || buttonPresets[0];

  return (
    <div className="invite-editor-panel">
      <PanelHeader title="Ձևավորում" subtitle="Կարգավորեք հրավերի գույները և բոլոր գործողությունների կոճակները։"><Palette size={18} /></PanelHeader>
      <section className="invite-editor-card">
        <div className="invite-editor-card-title"><strong>Գունային համակարգ</strong><button type="button" onClick={() => update((draft) => { draft.colors = { accent: '#d8b98e', text: '#ffffff', overlay: '#202020' }; })}><RotateCcw size={14} /> Վերականգնել</button></div>
        <div className="invite-editor-color-grid">
          {[['accent', 'Գլխավոր'], ['text', 'Տեքստ'], ['overlay', 'Ֆոն']].map(([key, label]) => (
            <label key={key}><span>{label}</span><input type="color" value={data.colors[key]} onChange={(event) => setColor(key, event.target.value)} /><em>{data.colors[key]}</em></label>
          ))}
        </div>
      </section>

      <section className="invite-editor-card">
        <div className="invite-editor-card-title"><strong>Կոճակների ոճ</strong><small>12 պատրաստի տարբերակ</small></div>
        <div className="invite-editor-preset-grid">
          {buttonPresets.map((preset) => (
            <button key={preset.id} type="button" className={data.buttonDesign.preset === preset.id ? 'is-active' : ''} onClick={() => update((draft) => { draft.buttonDesign.preset = preset.id; })} aria-pressed={data.buttonDesign.preset === preset.id} title={preset.label}>
              <span style={{ ...preset.style, borderRadius: radiusPresets.find((item) => item.id === data.buttonDesign.radius)?.value || 0 }}>{preset.id}</span>
              <small>{preset.label}</small>
            </button>
          ))}
        </div>
        <Field label="Անկյունների կլորություն"><div className="invite-editor-radius-list">{radiusPresets.map((radius) => <button key={radius.id} type="button" className={data.buttonDesign.radius === radius.id ? 'is-active' : ''} onClick={() => update((draft) => { draft.buttonDesign.radius = radius.id; })}>{radius.label}</button>)}</div></Field>
        <div className="invite-editor-button-example"><span>Արդյունք</span><button type="button" style={{ ...selectedPreset.style, borderRadius: radiusPresets.find((item) => item.id === data.buttonDesign.radius)?.value || 0 }}>Օրինակ կոճակ</button></div>
      </section>
    </div>
  );
}

