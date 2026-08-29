import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Eye, LogIn, Pencil, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import alertGuruAnimation from '../assets/animations/editor-exit-alert.lottie?url';
import { API_URL, qrImageUrl, siteUrl } from '../config/env.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { resolveTemplateCardImage } from '../occasionTemplates/templateCardAssets.js';

const backgroundPreviewQueue = [];
let activeBackgroundPreviews = 0;

const drainBackgroundPreviewQueue = () => {
  while (activeBackgroundPreviews < 2 && backgroundPreviewQueue.length) {
    const entry = backgroundPreviewQueue.shift();
    if (entry.cancelled) continue;
    activeBackgroundPreviews += 1;
    entry.started = true;
    entry.start(entry.release);
  }
};

const enqueueBackgroundPreview = (start) => {
  const entry = {
    cancelled: false,
    released: false,
    started: false,
    start,
    release() {
      if (entry.released) return;
      entry.released = true;
      if (entry.started) activeBackgroundPreviews = Math.max(0, activeBackgroundPreviews - 1);
      drainBackgroundPreviewQueue();
    }
  };
  backgroundPreviewQueue.push(entry);
  drainBackgroundPreviewQueue();
  return () => {
    entry.cancelled = true;
    entry.release();
  };
};

export default function TemplateCard({ template, priority = false }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [qrOpen, setQrOpen] = useState(false);
  const [authWarningOpen, setAuthWarningOpen] = useState(false);
  const [authReturnPath, setAuthReturnPath] = useState('/templates');
  const [remotePreviewReady, setRemotePreviewReady] = useState(false);
  const [remotePreviewFailed, setRemotePreviewFailed] = useState(false);
  const [previewRequested, setPreviewRequested] = useState(false);
  const [coverReady, setCoverReady] = useState(false);
  const loginButtonRef = useRef(null);
  const qrModalRef = useRef(null);
  const qrContentRef = useRef(null);
  const backgroundPreviewCancelRef = useRef(null);
  const backgroundPreviewReleaseRef = useRef(null);
  const imagePosition = template.imagePosition || {};
  const x = Number.isFinite(Number(imagePosition.x)) ? Number(imagePosition.x) : 50;
  const y = Number.isFinite(Number(imagePosition.y)) ? Number(imagePosition.y) : 50;
  const zoom = Number.isFinite(Number(imagePosition.zoom)) ? Math.min(2, Math.max(1, Number(imagePosition.zoom))) : 1;
  const objectPosition = `${x}% ${y}%`;
  const storedMainImage = template.mainImageStored
    ? `${API_URL}/templates/${template._id}/card-image?v=${encodeURIComponent(template.updatedAt || '')}`
    : '';
  const cardImage = storedMainImage || resolveTemplateCardImage(template.mainImage);
  const mainImage = cardImage;
  // Catalog cards are controlled only by admin-provided media: the main image
  // at rest and the saved full-page screenshot while hovered/focused.
  const hasAdminPagePreview = Boolean(template.pagePreviewAvailable);
  const remotePagePreview = hasAdminPagePreview
    ? `${API_URL}/templates/${template._id}/page-preview?v=${encodeURIComponent(template.updatedAt || '')}`
    : '';
  // Request the real screenshot after the cover is ready (or immediately on
  // intent), then keep it behind the cover until decoding has completed.
  const catalogPagePreview = previewRequested && !remotePreviewFailed ? remotePagePreview : '';
  const pagePreview = qrOpen && remotePreviewReady ? remotePagePreview : '';
  const previewPath = `/templates/${template._id}/live`;
  const previewUrl = useMemo(() => siteUrl(previewPath), [previewPath]);
  const qrUrl = qrImageUrl(previewUrl, 220, 12);
  const showPreview = useCallback(() => {
    if (remotePagePreview && !remotePreviewFailed) setPreviewRequested(true);
  }, [remotePagePreview, remotePreviewFailed]);
  const requestPreview = useCallback(() => {
    backgroundPreviewCancelRef.current?.();
    backgroundPreviewCancelRef.current = null;
    backgroundPreviewReleaseRef.current = null;
    showPreview();
  }, [showPreview]);
  const releaseBackgroundPreview = () => {
    backgroundPreviewReleaseRef.current?.();
    backgroundPreviewReleaseRef.current = null;
    backgroundPreviewCancelRef.current = null;
  };
  const openQr = () => {
    requestPreview();
    setQrOpen(true);
  };
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
    if (!qrOpen) return undefined;
    const focusId = window.requestAnimationFrame(() => {
      const scrollTarget = window.matchMedia('(max-width: 880px)').matches
        ? qrModalRef.current
        : qrContentRef.current;
      scrollTarget?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(focusId);
  }, [qrOpen]);

  const forwardQrWheelToContent = (event) => {
    if (window.matchMedia('(max-width: 880px)').matches) return;
    const content = qrContentRef.current;
    if (!content || content.contains(event.target) || content.scrollHeight <= content.clientHeight) return;
    event.preventDefault();
    content.scrollTop += event.deltaY;
  };

  useEffect(() => {
    setRemotePreviewReady(false);
    setRemotePreviewFailed(false);
    setPreviewRequested(false);
    setCoverReady(false);
  }, [remotePagePreview]);

  useEffect(() => {
    if (!coverReady || !remotePagePreview || remotePreviewFailed) return undefined;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '')) return undefined;

    const queuePreview = () => {
      backgroundPreviewCancelRef.current = enqueueBackgroundPreview((release) => {
        backgroundPreviewReleaseRef.current = release;
        showPreview();
      });
    };
    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(queuePreview, { timeout: priority ? 800 : 2200 });
      return () => {
        window.cancelIdleCallback(idleId);
        backgroundPreviewCancelRef.current?.();
      };
    }
    const timeoutId = window.setTimeout(queuePreview, priority ? 250 : 900);
    return () => {
      window.clearTimeout(timeoutId);
      backgroundPreviewCancelRef.current?.();
    };
  }, [coverReady, priority, remotePagePreview, remotePreviewFailed, showPreview]);

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
      onPointerEnter={requestPreview}
      onFocus={requestPreview}
    >
      <div className="template-image catalog-template-preview">
        {catalogPagePreview ? (
          <img
            className={`catalog-template-scroll-shot${remotePreviewReady ? ' is-ready' : ''}`}
            src={catalogPagePreview}
            alt={`${template.title} — ամբողջական էջ`}
            loading="eager"
            decoding="async"
            fetchPriority="low"
            onLoad={() => {
              releaseBackgroundPreview();
              setRemotePreviewReady(false);
              window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => setRemotePreviewReady(true));
              });
            }}
            onError={() => {
              releaseBackgroundPreview();
              setRemotePreviewReady(false);
              setRemotePreviewFailed(true);
            }}
          />
        ) : cardImage ? (
          <img
            src={cardImage}
            alt={template.title}
            className="catalog-template-main-image"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            onLoad={() => setCoverReady(true)}
            style={{
              '--template-image-zoom': zoom,
              objectPosition,
              transformOrigin: objectPosition
            }}
          />
        ) : (
          <span>{template.title}</span>
        )}
        {catalogPagePreview && cardImage && (
          <img
            className="catalog-template-final-cover"
            src={cardImage}
            alt={template.title}
            loading="eager"
            decoding="async"
            onLoad={() => setCoverReady(true)}
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
          <div
            ref={qrModalRef}
            className="template-qr-modal"
            tabIndex="-1"
            onWheel={forwardQrWheelToContent}
            onClick={(event) => event.stopPropagation()}
          >
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
            <div ref={qrContentRef} className="template-qr-content" tabIndex="0">
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
