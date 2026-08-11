import React, { useState } from 'react';
import { Check, Eye, LockKeyhole, ShoppingBag, Smartphone } from 'lucide-react';
import { useEditor } from './EditorContext.jsx';
import { PanelHeader } from './EditorControls.jsx';

export default function BuyPanel() {
  const { data, template, actions, saveStatus, setDevice, setMobileSheet } = useEditor();
  const [previewing, setPreviewing] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const checks = [
    ['Հիմնական տվյալներ', Boolean(data.mainNames && data.eventDate)],
    ['Միջոցառման վայր', Boolean(data.mapLinks?.some((item) => item.address || item.url))],
    ['Գլխավոր նկար', Boolean(data.image)],
    ['Երաժշտություն', data.musicEnabled === false || Boolean(data.musicUrl)],
    ['Հյուրերի պատասխաններ', data.questionsVisible !== false]
  ];
  const previewDisabled = actions.saving || saveStatus === 'saving' || !actions.previewPath;

  const openPrivatePreview = async () => {
    setPreviewError('');
    setPreviewing(true);
    try {
      const opened = await actions.onPreview?.(data);
      if (opened === false) setPreviewError('Չհաջողվեց բացել նախադիտումը։ Խնդրում ենք կրկին փորձել։');
    } catch {
      setPreviewError('Չհաջողվեց բացել նախադիտումը։ Խնդրում ենք կրկին փորձել։');
    } finally {
      setPreviewing(false);
    }
  };

  return (
    <div className="invite-editor-panel">
      <PanelHeader title="Գնել հրավերը" subtitle="Ստուգեք ավտոմատ պահպանված արդյունքը և անցեք պրոմոկոդի ու վճարման անվտանգ փուլին։" />
      <section className="invite-editor-buy-hero">
        <span><LockKeyhole size={21} /></span>
        <h3>Անձնական մինչև գնումը</h3>
        <p>Preview հղումը հասանելի կլինի միայն Ձեր account-ին։ Գնումից հետո նույն հրավերը կստանա public հղում։</p>
      </section>
      <section className="invite-editor-checklist">
        <header><strong>Պատրաստության ստուգում</strong><small>{checks.filter((item) => item[1]).length}/{checks.length}</small></header>
        {checks.map(([label, ready]) => <div key={label} className={ready ? 'is-ready' : ''}><span>{ready && <Check size={11} />}</span><p>{label}</p></div>)}
      </section>
      <div className="invite-editor-buy-actions">
        <button type="button" onClick={() => { setDevice('mobile'); setMobileSheet('collapsed'); }}><Smartphone size={16} /> Հեռախոսով ստուգել</button>
        <a
          href={previewDisabled ? undefined : actions.previewPath}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={previewDisabled}
          onClick={(event) => {
            if (previewDisabled) {
              event.preventDefault();
              return;
            }
            void openPrivatePreview();
          }}
        ><Eye size={16} /> {previewing ? 'Թարմացվում է...' : 'Նախադիտել'}</a>
        <button type="button" className="is-primary" onClick={() => actions.onBuy?.(data)} disabled={actions.saving}><ShoppingBag size={18} />{actions.saving ? 'Պատրաստվում է...' : `Գնել · ${Number(template.price || 0).toLocaleString()} AMD`}</button>
      </div>
      {previewError && <p className="invite-editor-error" role="alert">{previewError}</p>}
      <p className="invite-editor-payment-note">Հաջորդ քայլում կարող եք կիրառել պրոմոկոդ, տեսնել նվերը և միայն հետո անցնել Stripe վճարմանը։</p>
    </div>
  );
}
