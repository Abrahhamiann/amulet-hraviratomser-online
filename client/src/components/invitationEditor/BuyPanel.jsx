import React from 'react';
import { Check, Eye, LockKeyhole, Save, ShoppingBag, Smartphone } from 'lucide-react';
import { useEditor } from './EditorContext.jsx';
import { PanelHeader } from './EditorControls.jsx';

export default function BuyPanel() {
  const { data, template, actions, save, saveStatus, setDevice, setMobileSheet } = useEditor();
  const checks = [
    ['Հիմնական տվյալներ', Boolean(data.mainNames && data.eventDate)],
    ['Միջոցառման վայր', Boolean(data.mapLinks?.some((item) => item.address || item.url))],
    ['Գլխավոր նկար', Boolean(data.image)],
    ['Երաժշտություն', data.musicEnabled === false || Boolean(data.musicUrl)],
    ['Հյուրերի պատասխաններ', data.questionsVisible !== false]
  ];

  return (
    <div className="invite-editor-panel">
      <PanelHeader title="Գնել հրավերը" subtitle="Ստուգեք արդյունքը, պահպանեք անձնական preview-ը և անցեք պրոմոկոդի ու վճարման անվտանգ փուլին։" />
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
        <button type="button" onClick={() => setMobileSheet('collapsed')}><Eye size={16} /> Նախադիտել</button>
        <button type="button" onClick={() => void save()} disabled={actions.saving}><Save size={17} />{saveStatus === 'saving' ? 'Պահպանվում է...' : 'Պահպանել private preview-ը'}</button>
        <button type="button" className="is-primary" onClick={() => actions.onBuy?.(data)} disabled={actions.saving}><ShoppingBag size={18} />{actions.saving ? 'Պատրաստվում է...' : `Գնել · ${Number(template.price || 0).toLocaleString()} AMD`}</button>
      </div>
      <p className="invite-editor-payment-note">Հաջորդ քայլում կարող եք կիրառել պրոմոկոդ, տեսնել նվերը և միայն հետո անցնել Stripe վճարմանը։</p>
    </div>
  );
}

