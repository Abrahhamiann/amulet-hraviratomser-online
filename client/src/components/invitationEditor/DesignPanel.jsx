import React from 'react';
import { Check, Palette, RotateCcw } from 'lucide-react';
import { useEditor } from './EditorContext.jsx';
import { PanelHeader } from './EditorControls.jsx';
import { getTemplateColorPalettes } from './editorData.js';

const sameColors = (left = {}, right = {}) => ['accent', 'text', 'overlay']
  .every((key) => String(left[key] || '').toLowerCase() === String(right[key] || '').toLowerCase());

export default function DesignPanel() {
  const { data, template, update } = useEditor();
  const palettes = getTemplateColorPalettes(template);
  const selectedPalette = palettes.find((palette) => sameColors(data.colors, palette.colors));
  const applyPalette = (palette) => update((draft) => { draft.colors = { ...palette.colors }; });

  return (
    <div className="invite-editor-panel">
      <PanelHeader title="Ձևավորում" subtitle="Ընտրեք այս հրավերի համար պատրաստված 5 ներդաշնակ գունային համակարգերից մեկը։"><Palette size={18} /></PanelHeader>
      <section className="invite-editor-card">
        <div className="invite-editor-card-title">
          <strong>Գունային համակարգ</strong>
          <button type="button" onClick={() => applyPalette(palettes[0])}><RotateCcw size={14} /> Վերականգնել</button>
        </div>
        <div className="invite-editor-palette-list" role="radiogroup" aria-label="Գունային համակարգ">
          {palettes.map((palette) => {
            const isSelected = selectedPalette?.id === palette.id;
            return (
              <button
                key={palette.id}
                type="button"
                className={isSelected ? 'is-active' : ''}
                role="radio"
                aria-checked={isSelected}
                onClick={() => applyPalette(palette)}
              >
                <span className="invite-editor-palette-swatches" aria-hidden="true">
                  <i style={{ background: palette.colors.overlay }} />
                  <i style={{ background: palette.colors.accent }} />
                  <i style={{ background: palette.colors.text }} />
                </span>
                <span><strong>{palette.name}</strong><small>{palette.description}</small></span>
                <i className="invite-editor-palette-check" aria-hidden="true">{isSelected && <Check size={15} />}</i>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
