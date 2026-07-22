import React, { useMemo, useState } from 'react';
import { Check, Eye, ShoppingBag, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getOccasionTemplate } from '../occasionTemplates/index.jsx';
import { resolveTemplateImage } from '../occasionTemplates/templateAssets.js';

export default function TemplateCard({ template }) {
  const { t } = useLanguage();
  const [qrOpen, setQrOpen] = useState(false);
  const occasionTemplate = getOccasionTemplate(template);
  const CardPreview = occasionTemplate?.CardPreview;
  const imagePosition = template.imagePosition || {};
  const x = Number.isFinite(Number(imagePosition.x)) ? Number(imagePosition.x) : 50;
  const y = Number.isFinite(Number(imagePosition.y)) ? Number(imagePosition.y) : 50;
  const zoom = Number.isFinite(Number(imagePosition.zoom)) ? Math.min(2, Math.max(1, Number(imagePosition.zoom))) : 1;
  const objectPosition = `${x}% ${y}%`;
  const mainImage = resolveTemplateImage(template.mainImage);
  const previewPath = `/templates/${template._id}/live`;
  const previewUrl = useMemo(() => {
    if (typeof window === 'undefined') return previewPath;
    return new URL(previewPath, window.location.origin).toString();
  }, [previewPath]);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=12&data=${encodeURIComponent(previewUrl)}`;
  const features = t('templateModalFeatures');

  const openQr = () => setQrOpen(true);
  const closeQr = () => setQrOpen(false);

  return (
    <article
      className="template-card reveal catalog-template-card"
      role="button"
      tabIndex={0}
      onClick={openQr}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openQr();
        }
      }}
      aria-label={`${template.title}. ${t('scanQr')}`}
    >
      <div className="template-image catalog-template-preview">
        {mainImage ? (
          <img
            src={mainImage}
            alt={template.title}
            loading="lazy"
            style={{
              '--template-image-zoom': zoom,
              objectPosition,
              transformOrigin: objectPosition
            }}
          />
        ) : CardPreview ? (
          <CardPreview template={template} />
        ) : (
          <span>{template.title}</span>
        )}
        <span className="catalog-new-badge">{t('new')}</span>
      </div>
      <div className="template-body catalog-template-caption">
        <h3>{template.title}</h3>
        <p>{template.description || t('templateDefaultDescription')}</p>
      </div>
      {qrOpen && createPortal(
        <div className="template-qr-backdrop" role="dialog" aria-modal="true" aria-labelledby={`template-qr-${template._id}`} onClick={closeQr}>
          <div className="template-qr-modal" onClick={(event) => event.stopPropagation()}>
            <button className="template-qr-close" type="button" onClick={closeQr} aria-label={t('close')}>
              <X size={22} />
            </button>
            <div className="template-qr-preview">
              {mainImage ? (
                <img src={mainImage} alt={template.title} />
              ) : CardPreview ? (
                <CardPreview template={template} />
              ) : (
                <span>{template.title}</span>
              )}
            </div>
            <div className="template-qr-content">
              <h2 id={`template-qr-${template._id}`}>{template.title}</h2>
              <p>{template.description || t('templateDefaultDescription')}</p>
              <div className="template-qr-tags" aria-label={t('features')}>
                <span>{t(template.category)}</span>
                <span>{t('customDesign')}</span>
                <span>{Number(template.price).toLocaleString()} AMD</span>
              </div>
              <h3>{t('features')}</h3>
              <ul className="template-qr-features">
                {features.map((feature) => (
                  <li key={feature}><Check size={16} /> {feature}</li>
                ))}
              </ul>
              <div className="template-qr-scan">
                <img src={qrUrl} alt={t('scanQr')} />
                <p>{t('scanQrText')}</p>
              </div>
              <div className="template-qr-note">
                <span>{t('templateTrialNote')}</span>
                <span>{t('templateSwitchNote')}</span>
              </div>
              <div className="template-qr-actions">
                <Link className="btn btn-primary" to={`/templates/${template._id}/live?edit=1`} onClick={closeQr}>
                  <ShoppingBag size={17} />
                  {t('chooseTemplate')}
                </Link>
                <a className="btn btn-ghost" href={previewPath} target="_blank" rel="noreferrer">
                  <Eye size={17} />
                  {t('preview')}
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </article>
  );
}
