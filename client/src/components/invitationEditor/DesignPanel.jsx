import React from 'react';
import { Check, Palette, RotateCcw } from 'lucide-react';
import { useEditor } from './EditorContext.jsx';
import { PanelHeader } from './EditorControls.jsx';
import { getTemplateColorPalettes } from './editorData.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

const sameColors = (left = {}, right = {}) => ['accent', 'text', 'overlay']
  .every((key) => String(left[key] || '').toLowerCase() === String(right[key] || '').toLowerCase());

export default function DesignPanel() {
  const { data, template, update } = useEditor();
  const { language, t } = useLanguage();
  const palettes = getTemplateColorPalettes(template);
  const selectedPalette = data.colorPaletteId
    ? palettes.find((palette) => palette.id === data.colorPaletteId)
    : palettes.find((palette) => sameColors(data.colors, palette.colors));
  const applyPalette = (palette) => update((draft) => {
    draft.colors = { ...palette.colors };
    draft.colorPaletteId = palette.id;
  });
  const restoreTemplateColors = () => update((draft) => {
    draft.colors = {};
    draft.colorPaletteId = '';
  });

  return (
    <div className="invite-editor-panel">
      <PanelHeader title={t('editorDesign')} subtitle={t('editorPaletteSubtitle').replace('{count}', palettes.length)}><Palette size={18} /></PanelHeader>
      <section className="invite-editor-card">
        <div className="invite-editor-card-title">
          <strong>{t('editorColorSystem')}</strong>
          <button type="button" onClick={restoreTemplateColors}><RotateCcw size={14} /> {t('editorRestore')}</button>
        </div>
        <div className="invite-editor-palette-list" role="radiogroup" aria-label={t('editorColorSystem')}>
          {palettes.map((palette, index) => {
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
                <span><strong>{language === 'hy' ? palette.name : `${t('editorPalette')} ${index + 1}`}</strong><small>{language === 'hy' ? palette.description : t('editorPaletteHint')}</small></span>
                <i className="invite-editor-palette-check" aria-hidden="true">{isSelected && <Check size={15} />}</i>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
