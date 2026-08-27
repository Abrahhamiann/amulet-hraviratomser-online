import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Eye, LogIn, Pencil, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import alertGuruAnimation from '../assets/animations/editor-exit-alert.lottie?url';
import { API_URL, qrImageUrl, siteUrl } from '../config/env.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { resolveTemplateImage } from '../occasionTemplates/templateAssets.js';

export default function TemplateCard({ template }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [qrOpen, setQrOpen] = useState(false);
  const [authWarningOpen, setAuthWarningOpen] = useState(false);
  const [authReturnPath, setAuthReturnPath] = useState('/templates');
  const [remotePreviewReady, setRemotePreviewReady] = useState(false);
  const [remotePreviewFailed, setRemotePreviewFailed] = useState(false);
  const loginButtonRef = useRef(null);
  const imagePosition = template.imagePosition || {};
  const x = Number.isFinite(Number(imagePosition.x)) ? Number(imagePosition.x) : 50;
  const y = Number.isFinite(Number(imagePosition.y)) ? Number(imagePosition.y) : 50;
  const zoom = Number.isFinite(Number(imagePosition.zoom)) ? Math.min(2, Math.max(1, Number(imagePosition.zoom))) : 1;
  const objectPosition = `${x}% ${y}%`;
  const mainImage = resolveTemplateImage(template.mainImage);
  // Catalog cards are controlled only by admin-provided media: the main image
  // at rest and the saved full-page screenshot while hovered/focused.
  const hasAdminPagePreview = Boolean(template.pagePreviewAvailable);
  const remotePagePreview = hasAdminPagePreview
    ? `${API_URL}/templates/${template._id}/page-preview?v=${encodeURIComponent(template.updatedAt || '')}`
    : '';
  // Keep the real screenshot mounted behind the main image so it is already
  // decoded when the user hovers. Until it is ready, hover leaves the main
  // image completely unchanged.
  const catalogPagePreview = !remotePreviewFailed ? remotePagePreview : '';
  const pagePreview = qrOpen && catalogPagePreview ? catalogPagePreview : '';
  const previewPath = `/templates/${template._id}/live`;
  const previewUrl = useMemo(() => siteUrl(previewPath), [previewPath]);
  const qrUrl = qrImageUrl(previewUrl, 220, 12);
  const openQr = () => setQrOpen(true);
  const closeQr = () => setQrOpen(false);
  const requireAuthenticatedAction = (event, returnPath) => {
    if (user) return false;
    event.preventDefault();
    event.stopPropagation();
    closeQr();
    setAuthReturnPath(returnPath);
    setAuthWarningOpen(true);
    return true;
  };

  useEffect(() => {
    if (!qrOpen && !authWarningOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return;
      if (authWarningOpen) setAuthWarningOpen(false);
      else closeQr();
    };

    document.documentElement.classList.add('template-modal-lock');
    document.body.classList.add('template-modal-lock');
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.documentElement.classList.remove('template-modal-lock');
      document.body.classList.remove('template-modal-lock');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [authWarningOpen, qrOpen]);

  useEffect(() => {
    if (authWarningOpen) loginButtonRef.current?.focus();
  }, [authWarningOpen]);

  useEffect(() => {
    setRemotePreviewReady(false);
    setRemotePreviewFailed(false);
  }, [remotePagePreview]);

  return (
    <article
      className={`template-card reveal catalog-template-card${remotePreviewReady ? ' is-preview-ready' : ''}`}
      role="button"
      tabIndex={0}
      onClick={openQr}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openQr();
        }
      }}
      aria-label={`${template.code || template.title}. ${t('scanQr')}`}
    >
      <div className="template-image catalog-template-preview">
        {catalogPagePreview ? (
          <img
            className={`catalog-template-scroll-shot${remotePreviewReady ? ' is-ready' : ''}`}
            src={catalogPagePreview}
            alt={`${template.title} — ամբողջական էջ`}
            loading="lazy"
            decoding="async"
            onLoad={() => {
              setRemotePreviewReady(false);
              window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => setRemotePreviewReady(true));
              });
            }}
            onError={() => {
              setRemotePreviewReady(false);
              setRemotePreviewFailed(true);
            }}
          />
        ) : mainImage ? (
          <img
            src={mainImage}
            alt={template.title}
            className="catalog-template-main-image"
            loading="lazy"
            decoding="async"
            style={{
              '--template-image-zoom': zoom,
              objectPosition,
              transformOrigin: objectPosition
            }}
          />
        ) : (
          <span>{template.title}</span>
        )}
        {catalogPagePreview && mainImage && (
          <img
            className="catalog-template-final-cover"
            src={mainImage}
            alt={template.title}
            loading="lazy"
            decoding="async"
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
        <div
          className="template-qr-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`template-qr-${template._id}`}
          onClick={(event) => {
            event.stopPropagation();
            closeQr();
          }}
        >
          <div className="template-qr-modal" onClick={(event) => event.stopPropagation()}>
            <button className="template-qr-close" type="button" onClick={closeQr} aria-label={t('close')}>
              <X size={22} />
            </button>
            <div className="template-qr-preview">
              {pagePreview ? (
                <img
                  className="template-qr-auto-scroll"
                  src={pagePreview}
                  alt={`${template.title} — ամբողջական էջ`}
                  decoding="async"
                />
              ) : mainImage ? (
                <img src={mainImage} alt={template.title} />
              ) : (
                <span>{template.title}</span>
              )}
            </div>
            <div className="template-qr-content">
              <h2 id={`template-qr-${template._id}`}>{template.code ? `${t('templateCodeLabel')} ${template.code}` : template.title}</h2>
              <p className="template-qr-info">{Number(template.price).toLocaleString()} AMD</p>
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
                <Link
                  className="btn btn-primary"
                  to={`/templates/${template._id}/live?edit=1`}
                  onClick={(event) => {
                    if (!requireAuthenticatedAction(event, `/templates/${template._id}/live?edit=1`)) closeQr();
                  }}
                >
                  <Pencil size={17} />
                  {t('edit')}
                </Link>
                <a
                  className="btn btn-ghost"
                  href={previewPath}
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeQr}
                >
                  <Eye size={17} />
                  {t('preview')}
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      {authWarningOpen && createPortal(
        <div
          className="auth-required-backdrop"
          onClick={(event) => {
            event.stopPropagation();
            setAuthWarningOpen(false);
          }}
        >
          <section
            className="auth-required-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="auth-required-title"
            aria-describedby="auth-required-description"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="auth-required-close" type="button" onClick={() => setAuthWarningOpen(false)} aria-label={t('close')}>
              <X size={20} />
            </button>
            <span className="auth-required-animation" aria-hidden="true">
              <DotLottieReact
                src={alertGuruAnimation}
                autoplay={!prefersReducedMotion}
                loop={!prefersReducedMotion}
              />
            </span>
            <h2 id="auth-required-title">{t('templateAuthRequiredTitle')}</h2>
            <p id="auth-required-description">{t('templateAuthRequiredText')}</p>
            <Link
              ref={loginButtonRef}
              className="btn btn-primary auth-required-login"
              to="/login"
              state={{ returnTo: authReturnPath }}
              onClick={() => setAuthWarningOpen(false)}
            >
              <LogIn size={18} />
              {t('login')}
            </Link>
          </section>
        </div>,
        document.body
      )}
    </article>
  );
}
