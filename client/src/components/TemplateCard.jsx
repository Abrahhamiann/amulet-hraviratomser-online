import React, { useEffect, useMemo, useState } from 'react';
import { Eye, Pencil, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getOccasionTemplate } from '../occasionTemplates/index.jsx';
import { resolveTemplateImage } from '../occasionTemplates/templateAssets.js';
import { getTemplatePagePreview } from '../occasionTemplates/templatePagePreviews.js';

export default function TemplateCard({ template }) {
  const { t } = useLanguage();
  const [qrOpen, setQrOpen] = useState(false);
  const [catalogWalkthroughComplete, setCatalogWalkthroughComplete] = useState(false);
  const [modalWalkthroughComplete, setModalWalkthroughComplete] = useState(false);
  const occasionTemplate = getOccasionTemplate(template);
  const CardPreview = occasionTemplate?.CardPreview;
  const imagePosition = template.imagePosition || {};
  const x = Number.isFinite(Number(imagePosition.x)) ? Number(imagePosition.x) : 50;
  const y = Number.isFinite(Number(imagePosition.y)) ? Number(imagePosition.y) : 50;
  const zoom = Number.isFinite(Number(imagePosition.zoom)) ? Math.min(2, Math.max(1, Number(imagePosition.zoom))) : 1;
  const objectPosition = `${x}% ${y}%`;
  const mainImage = resolveTemplateImage(template.mainImage);
  const pagePreview = getTemplatePagePreview(template);
  const previewPath = `/templates/${template._id}/live`;
  const previewUrl = useMemo(() => {
    if (typeof window === 'undefined') return previewPath;
    return new URL(previewPath, window.location.origin).toString();
  }, [previewPath]);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=12&data=${encodeURIComponent(previewUrl)}`;
  const openQr = () => {
    setModalWalkthroughComplete(false);
    setQrOpen(true);
  };
  const closeQr = () => {
    setModalWalkthroughComplete(false);
    setQrOpen(false);
  };

  useEffect(() => {
    if (!qrOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setQrOpen(false);
    };

    document.documentElement.classList.add('template-modal-lock');
    document.body.classList.add('template-modal-lock');
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.documentElement.classList.remove('template-modal-lock');
      document.body.classList.remove('template-modal-lock');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [qrOpen]);

  return (
    <article
      className="template-card reveal catalog-template-card"
      role="button"
      tabIndex={0}
      onClick={openQr}
      onMouseEnter={() => setCatalogWalkthroughComplete(false)}
      onMouseLeave={() => setCatalogWalkthroughComplete(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setCatalogWalkthroughComplete(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openQr();
        }
      }}
      aria-label={`${template.code || template.title}. ${t('scanQr')}`}
    >
      <div className="template-image catalog-template-preview">
        {pagePreview ? (
          <img
            className="catalog-template-scroll-shot"
            src={pagePreview}
            alt={`${template.title} — ամբողջական էջ`}
            width="630"
            height="16384"
            loading="lazy"
            onTransitionEnd={(event) => {
              if (event.propertyName === 'transform') setCatalogWalkthroughComplete(true);
            }}
          />
        ) : mainImage ? (
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
        {pagePreview && mainImage && (
          <img
            className={`catalog-template-final-cover${catalogWalkthroughComplete ? ' is-visible' : ''}`}
            src={mainImage}
            alt={template.title}
            loading="lazy"
            style={{ objectPosition, transformOrigin: objectPosition }}
          />
        )}
        <span className="catalog-new-badge">{t('new')}</span>
      </div>
      <div className="template-body catalog-template-caption">
        <h3>{template.code ? `${t('templateCodeLabel')} ${template.code}` : template.title}</h3>
        <p>{Number(template.price).toLocaleString()} AMD</p>
      </div>
      {qrOpen && createPortal(
        <div className="template-qr-backdrop" role="dialog" aria-modal="true" aria-labelledby={`template-qr-${template._id}`} onClick={closeQr}>
          <div className="template-qr-modal" onClick={(event) => event.stopPropagation()}>
            <button className="template-qr-close" type="button" onClick={closeQr} aria-label={t('close')}>
              <X size={22} />
            </button>
            <div className="template-qr-preview">
              {pagePreview ? (
                <img
                  className={`template-qr-auto-scroll${modalWalkthroughComplete ? ' is-complete' : ''}`}
                  src={pagePreview}
                  alt={`${template.title} — ամբողջական էջ`}
                  width="630"
                  height="16384"
                  onAnimationEnd={() => setModalWalkthroughComplete(true)}
                />
              ) : mainImage ? (
                <img src={mainImage} alt={template.title} />
              ) : CardPreview ? (
                <CardPreview template={template} />
              ) : (
                <span>{template.title}</span>
              )}
              {pagePreview && mainImage && (
                <img
                  className={`template-qr-final-cover${modalWalkthroughComplete ? ' is-visible' : ''}`}
                  src={mainImage}
                  alt={template.title}
                  style={{ objectPosition }}
                />
              )}
            </div>
            <div className="template-qr-content">
              <h2 id={`template-qr-${template._id}`}>{template.code ? `${t('templateCodeLabel')} ${template.code}` : template.title}</h2>
              <p className="template-qr-info">{Number(template.price).toLocaleString()} AMD</p>
              <div className="template-qr-tags">
                <span>{t(template.category)}</span>
                <span>{t('customDesign')}</span>
                <span>{Number(template.price).toLocaleString()} AMD</span>
              </div>
              {template.description && <p className="template-qr-description">{template.description}</p>}
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
                  <Pencil size={17} />
                  {t('edit')}
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
