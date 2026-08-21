import React, { useState } from 'react';
import { Check, Eye, LockKeyhole, ShoppingBag, Smartphone } from 'lucide-react';
import { useEditor } from './EditorContext.jsx';
import { PanelHeader } from './EditorControls.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function BuyPanel() {
  const { data, template, actions, saveStatus, setDevice, setMobileSheet } = useEditor();
  const { t } = useLanguage();
  const [previewing, setPreviewing] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const checks = [
    [t('editorCheckBasics'), Boolean(data.mainNames && data.eventDate)],
    [t('editorCheckVenue'), Boolean(data.mapLinks?.some((item) => item.address || item.url))],
    [t('editorCheckImage'), Boolean(data.image)],
    [t('editorCheckMusic'), data.musicEnabled === false || Boolean(data.musicUrl)],
    [t('editorCheckRsvp'), data.questionsVisible !== false]
  ];
  const previewDisabled = actions.saving || saveStatus === 'saving' || previewing;

  const openPrivatePreview = async () => {
    setPreviewError('');
    setPreviewing(true);
    try {
      const opened = await actions.onPreview?.(data);
      if (opened === false) setPreviewError(t('editorPreviewError'));
    } catch {
      setPreviewError(t('editorPreviewError'));
    } finally {
      setPreviewing(false);
    }
  };

  return (
    <div className="invite-editor-panel">
      <PanelHeader title={t('editorBuyInvitation')} subtitle={t('editorBuySubtitle')} />
      <section className="invite-editor-buy-hero">
        <span><LockKeyhole size={21} /></span>
        <h3>{t('editorPrivateUntilPurchase')}</h3>
        <p>{t('editorPrivateUntilPurchaseText')}</p>
      </section>
      <section className="invite-editor-checklist">
        <header><strong>{t('editorReadinessCheck')}</strong><small>{checks.filter((item) => item[1]).length}/{checks.length}</small></header>
        {checks.map(([label, ready]) => <div key={label} className={ready ? 'is-ready' : ''}><span>{ready && <Check size={11} />}</span><p>{label}</p></div>)}
      </section>
      <div className="invite-editor-buy-actions">
        <button type="button" onClick={() => { setDevice('mobile'); setMobileSheet('collapsed'); }}><Smartphone size={16} /> {t('editorCheckOnMobile')}</button>
        <button
          type="button"
          disabled={previewDisabled}
          aria-busy={previewing}
          onClick={() => void openPrivatePreview()}
        ><Eye size={16} /> {previewing ? t('editorRefreshing') : t('preview')}</button>
        <button type="button" className="is-primary" onClick={() => actions.onBuy?.(data)} disabled={actions.saving}><ShoppingBag size={18} />{actions.saving ? t('editorPreparing') : `${t('editorBuy')} · ${Number(template.price || 0).toLocaleString()} AMD`}</button>
      </div>
      {previewError && <p className="invite-editor-error" role="alert">{previewError}</p>}
      <p className="invite-editor-payment-note">{t('editorPaymentNote')}</p>
    </div>
  );
}
