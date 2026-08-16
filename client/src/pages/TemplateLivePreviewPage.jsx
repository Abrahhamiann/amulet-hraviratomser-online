import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  CalendarDays,
  ClipboardList,
  Clock,
  Home,
  MapPin,
  Megaphone,
  MessageSquare,
  Palette,
  Pencil,
  ShoppingBag,
  Sparkles,
  Users,
  X
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import ErrorState from '../components/ErrorState.jsx';
import InvitationEditor, { clearPreviewDecorations, decoratePreview, updateDraftTextField } from '../components/invitationEditor/InvitationEditor.jsx';
import { cloneEditorDraft } from '../components/invitationEditor/editorData.js';
import Loading from '../components/Loading.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import giftPremiumAnimation from '../assets/animations/gift-premium.lottie?url';
import { getOccasionTemplate } from '../occasionTemplates/index.jsx';
import { resolveTemplateImage } from '../occasionTemplates/templateAssets.js';
import { startStripeCheckout } from '../utils/checkout.js';
import { promoStorageKey, readRememberedPromo } from '../utils/promoStorage.js';

const previewDate = new Date();
previewDate.setMonth(previewDate.getMonth() + 1);

const toDateInputValue = (date) => date.toISOString().slice(0, 10);

const uniqueImages = (images) => [...new Set(images.filter(Boolean))];
const isEnvelopeImage = (image) => /baptism-envelope(?:[.-])/.test(String(image || ''));
const withoutEnvelopeImages = (images = []) => images.filter((image) => !isEnvelopeImage(resolveTemplateImage(image)));
const defaultColors = {
  accent: '#d8b98e',
  text: '#ffffff',
  overlay: '#202020'
};

const cleanVenueLinks = (links = []) => links
  .map((item, index) => ({
    label: String(item?.label ?? `Վայր ${index + 1}`).trim(),
    time: String(item?.time ?? '').trim(),
    address: String(item?.address ?? '').trim(),
    url: String(item?.url ?? '').trim(),
    subtitle: String(item?.subtitle ?? '').trim(),
    icon: String(item?.icon || 'location').trim(),
    visible: item?.visible !== false
  }))
  .filter((item) => item.label || item.time || item.address || item.url)
  .slice(0, 20);

const createInitialDraft = (template) => {
  const occasionTemplate = getOccasionTemplate(template);
  if (occasionTemplate?.getInitialDraft) {
    const draft = occasionTemplate.getInitialDraft(template);
    const isBaptismTemplate = occasionTemplate.key === 'sacred-beginnings';
    const gallery = isBaptismTemplate ? withoutEnvelopeImages(draft.gallery || []) : (draft.gallery || []);
    const image = isBaptismTemplate && isEnvelopeImage(resolveTemplateImage(draft.image)) ? (gallery[0] || '') : draft.image;
    return {
      ...draft,
      image,
      gallery,
      mapLink: draft.mapLink || '',
      mapLinks: draft.mapLinks || [],
      colors: { ...defaultColors, ...(draft.colors || {}) },
      groomFamilyTitle: draft.groomFamilyTitle || '',
      brideFamilyTitle: draft.brideFamilyTitle || '',
      rsvpQuestion: draft.rsvpQuestion || '',
      dressCode: draft.dressCode || '',
      closingMessage: draft.closingMessage ?? 'Սիրով սպասում ենք Ձեզ։',
      musicEnabled: draft.musicEnabled !== false,
      musicUrl: draft.musicUrl || '',
      musicTitle: draft.musicTitle || '',
      musicStart: Number(draft.musicStart) || 0,
      musicEnd: Number(draft.musicEnd) || 0,
      heroVisible: draft.heroVisible !== false,
      familyVisible: draft.familyVisible !== false,
      openingVisible: draft.openingVisible !== false,
      receptionVisible: draft.receptionVisible !== false,
      questionsVisible: draft.questionsVisible !== false,
      finalMessageVisible: draft.finalMessageVisible !== false
    };
  }

  const gallery = uniqueImages(template.gallery || []);

  return {
    mainNames: template.title,
    eventDate: toDateInputValue(previewDate),
    eventTime: '18:00',
    eventLocation: 'Yerevan, Armenia',
    mapLink: '',
    mapLinks: [],
    eventMessage: '',
    image: template.mainImage || gallery[0] || '',
    gallery,
    colors: defaultColors,
    groomFamilyTitle: '',
    brideFamilyTitle: '',
    rsvpQuestion: '',
    dressCode: '',
    closingMessage: 'Սիրով սպասում ենք Ձեզ։',
    musicEnabled: true,
    musicUrl: '',
    musicTitle: '',
    musicStart: 0,
    musicEnd: 0,
    heroVisible: true,
    familyVisible: true,
    openingVisible: true,
    receptionVisible: true,
    questionsVisible: true,
    finalMessageVisible: true
  };
};

function EditRequiredModal({ onClose, onEdit, t }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const startEditing = () => {
    onClose();
    onEdit();
  };

  return (
    <div
      className="edit-required-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="edit-required-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-required-title"
        aria-describedby="edit-required-description"
      >
        <button
          ref={closeButtonRef}
          className="edit-required-close"
          type="button"
          onClick={onClose}
          aria-label={t('close')}
        >
          <X size={20} />
        </button>

        <div className="edit-required-icon" aria-hidden="true">
          <Pencil size={25} />
        </div>
        <h2 id="edit-required-title">{t('editRequiredTitle')}</h2>
        <p id="edit-required-description">{t('editRequiredText')}</p>

        <div className="edit-required-actions">
          <button className="edit-required-primary" type="button" onClick={startEditing}>
            <Pencil size={18} />
            {t('editRequiredAction')}
          </button>
          <button className="edit-required-secondary" type="button" onClick={onClose}>
            {t('editRequiredLater')}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function TemplateLivePreviewPage() {
  const navigate = useNavigate();
  const { id, previewToken } = useParams();
  const [searchParams] = useSearchParams();
  const isStandalonePreview = Boolean(previewToken && searchParams.get('standalone') === '1');
  const { t } = useLanguage();
  const { user } = useAuth();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [template, setTemplate] = useState(null);
  const [draft, setDraft] = useState(null);
  const [isEdited, setIsEdited] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editorInitialTarget, setEditorInitialTarget] = useState({});
  const [editRequiredOpen, setEditRequiredOpen] = useState(false);
  const [state, setState] = useState('loading');
  const [checkoutState, setCheckoutState] = useState('idle');
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoResult, setPromoResult] = useState(null);
  const [promoChecking, setPromoChecking] = useState(false);
  const [privatePreviewPath, setPrivatePreviewPath] = useState(previewToken ? `/preview/${previewToken}?standalone=1` : '');
  const autoEditorOpenedRef = useRef(false);
  const autoBuyOpenedRef = useRef(false);
  const livePreviewRootRef = useRef(null);
  const autosaveTokenRef = useRef(previewToken || '');
  const editorHotspotLabels = useMemo(() => ({ image: t('image'), map: t('map'), edit: t('editorEdit'), changeImage: t('editorChangeImage'), editMap: t('editorEditMap'), editSection: t('editorEditSection'), heroImage: t('editorHeroImage'), galleryImage: t('editorGalleryImage'), participantImage: t('editorParticipantImage'), venueImage: t('editorVenueImage'), closingImage: t('editorClosingImage'), invitationImage: t('editorInvitationImage') }), [t]);

  useEffect(() => {
    const request = previewToken ? api.get(`/previews/${previewToken}`) : api.get(`/templates/${id}`);
    request
      .then(({ data }) => {
        if (data.mode === 'public' && data.invitationSlug) {
          navigate(`/invite/${data.invitationSlug}`, { replace: true });
          return;
        }
        const nextTemplate = previewToken ? data.template : data;
        const initialDraft = previewToken ? data.draft : createInitialDraft(nextTemplate);
        if (!previewToken) localStorage.removeItem(`amulet_autosave_${nextTemplate._id}`);
        setTemplate(nextTemplate);
        setDraft(initialDraft);
        setIsEdited(Boolean(previewToken));
        setState('ready');
      })
      .catch(() => {
        if (previewToken) navigate('/', { replace: true });
        else setState('error');
      });
  }, [id, navigate, previewToken]);

  useEffect(() => {
    if (!autoEditorOpenedRef.current && state === 'ready' && draft && searchParams.get('edit') === '1') {
      autoEditorOpenedRef.current = true;
      openEditor();
    }
  }, [state, draft, searchParams]);

  useEffect(() => {
    if (!autoBuyOpenedRef.current && state === 'ready' && draft && searchParams.get('buy') === '1') {
      autoBuyOpenedRef.current = true;
      setIsEdited(true);
      void openPromoOrResumeCheckout();
    }
  }, [state, draft, searchParams]);

  useEffect(() => {
    const root = livePreviewRootRef.current;
    if (!root || state !== 'ready' || !draft || editing || isStandalonePreview) return undefined;

    const eventRoots = new Set();
    const activateEditorTarget = (event) => {
      if (event.amuletEditorHandled) return;
      const path = event.composedPath();
      const target = path.find((node) => ['image', 'map'].includes(node?.dataset?.editorKind))
        || path.find((node) => node?.dataset?.editorKind);
      if (!target) {
        const sectionTarget = path.find((node) => node?.dataset?.editorSection);
        if (!sectionTarget) return;
        event.preventDefault();
        event.stopPropagation();
        setEditorInitialTarget({
          section: sectionTarget.dataset.editorSection || 'templateContent',
          field: '',
          targetTab: 'content'
        });
        setEditing(true);
        return;
      }
      event.amuletEditorHandled = true;
      const isInlineEditableText = target.dataset.editorKind === 'text'
        && target.dataset.editorField
        && target.dataset.editorInline === 'true';
      if (isInlineEditableText) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      setEditorInitialTarget({
        section: target.dataset.editorSection || (target.dataset.editorKind === 'image' ? 'media' : 'hero'),
        field: target.dataset.editorField || '',
        targetTab: target.dataset.editorTab || (target.dataset.editorKind === 'image' ? 'media' : 'content')
      });
      setEditing(true);
    };
    const activateEditorTargetFromKeyboard = (event) => {
      if (!['Enter', ' '].includes(event.key)) return;
      activateEditorTarget(event);
    };
    const registerEventRoots = () => {
      const queue = [root];
      for (let index = 0; index < queue.length; index += 1) {
        const scope = queue[index];
        if (!eventRoots.has(scope)) {
          scope.addEventListener('click', activateEditorTarget, true);
          scope.addEventListener('keydown', activateEditorTargetFromKeyboard, true);
          eventRoots.add(scope);
        }
        scope.querySelectorAll?.('*').forEach((element) => {
          if (element.shadowRoot && !queue.includes(element.shadowRoot)) queue.push(element.shadowRoot);
        });
      }
    };
    const decorate = () => {
      decoratePreview(root, draft, { labels: editorHotspotLabels });
      registerEventRoots();
    };
    root.ownerDocument.__amuletEditorInlineCommitHandler = ({ field, value }) => {
      if (!field) return;
      setDraft((current) => {
        const next = cloneEditorDraft(current);
        updateDraftTextField(next, field, value);
        return next;
      });
      setIsEdited(true);
    };
    const frame = window.requestAnimationFrame(decorate);
    const timers = [120, 420, 900].map((delay) => window.setTimeout(decorate, delay));
    const observer = new MutationObserver(decorate);
    observer.observe(root, { childList: true, subtree: true, characterData: true });

    return () => {
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
      delete root.ownerDocument.__amuletEditorInlineCommitHandler;
      eventRoots.forEach((scope) => {
        scope.removeEventListener('click', activateEditorTarget, true);
        scope.removeEventListener('keydown', activateEditorTargetFromKeyboard, true);
      });
      clearPreviewDecorations(root, { removeStyles: true });
    };
  }, [draft, editing, editorHotspotLabels, isStandalonePreview, state]);

  const cleanDraft = (sourceDraft = draft) => {
    const cleanGallery = uniqueImages(sourceDraft.gallery || [])
      .filter((image) => !isEnvelopeImage(resolveTemplateImage(image)));
    return {
      ...sourceDraft,
      image: isEnvelopeImage(resolveTemplateImage(sourceDraft.image)) ? (cleanGallery[0] || '') : sourceDraft.image,
      mapLink: cleanVenueLinks(sourceDraft.mapLinks)[0]?.url || sourceDraft.mapLink || '',
      mapLinks: cleanVenueLinks(sourceDraft.mapLinks),
      colors: { ...defaultColors, ...(sourceDraft.colors || {}) },
      gallery: cleanGallery.slice(0, 10)
    };
  };

  const openPrivatePreview = async (sourceDraft = draft) => {
    const nextDraft = cleanDraft(sourceDraft);
    try {
      const { data } = await api.post('/previews', {
        templateId: template._id,
        draft: nextDraft,
        previewToken: autosaveTokenRef.current || undefined
      });
      autosaveTokenRef.current = data.token;
      setPrivatePreviewPath(`${data.path}?standalone=1`);
      localStorage.setItem(`amulet_autosave_${template._id}`, JSON.stringify(nextDraft));
      setDraft(nextDraft);
      setIsEdited(true);
      return true;
    } catch {
      return false;
    }
  };

  const buyFromEditor = async (sourceDraft = draft) => {
    setCheckoutState('loading');
    const nextDraft = cleanDraft(sourceDraft);
    try {
      const { data } = await api.post('/previews', { templateId: template._id, draft: nextDraft, previewToken: autosaveTokenRef.current || undefined });
      autosaveTokenRef.current = data.token;
      setDraft(nextDraft);
      setIsEdited(true);
      setEditing(false);
      setCheckoutState('idle');
      setPromoError('');
      setPromoResult(null);
      void openPromoOrResumeCheckout();
      navigate(data.path, { replace: true });
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.setItem('amulet_pending_template', template._id);
        localStorage.setItem('amulet_pending_draft', JSON.stringify(nextDraft));
        localStorage.setItem('amulet_pending_action', 'buy');
        window.location.replace('/login');
        return false;
      }
      setCheckoutState('error');
      return false;
    }
  };

  const openEditor = (target = {}) => {
    const isEditorTarget = target && typeof target === 'object' && (
      Object.hasOwn(target, 'section') || Object.hasOwn(target, 'field') || Object.hasOwn(target, 'targetTab')
    );
    setEditorInitialTarget(isEditorTarget ? target : {});
    setEditing(true);
  };

  const orderTemplate = async () => {
    if (!isEdited) {
      setEditRequiredOpen(true);
      return;
    }
    await openPromoOrResumeCheckout();
  };

  const performCheckout = async (appliedPromoCode = '') => {
    setPromoOpen(false);
    setCheckoutState('loading');
    const nextDraft = cleanDraft();
    try {
      let checkoutPreviewToken = autosaveTokenRef.current || previewToken;
      if (!checkoutPreviewToken) {
        const { data } = await api.post('/previews', { templateId: template._id, draft: nextDraft });
        checkoutPreviewToken = data.token;
        autosaveTokenRef.current = data.token;
      }
      await startStripeCheckout(template._id, nextDraft, {
        previewToken: checkoutPreviewToken,
        promoCode: appliedPromoCode
      });
    } catch (error) {
      if (error.response?.status === 401) {
        await startStripeCheckout(template._id, nextDraft, { promoCode: appliedPromoCode });
        return;
      }
      setCheckoutState('error');
    }
  };

  const openPromoOrResumeCheckout = async () => {
    const storageKey = promoStorageKey(user, template?._id);
    const remembered = readRememberedPromo(storageKey);
    if (remembered?.code) {
      setPromoChecking(true);
      setPromoError('');
      try {
        const { data } = await api.post('/promocodes/validate', { code: remembered.code, templateId: template._id });
        const confirmed = { ...data, code: data.code || remembered.code };
        localStorage.setItem(storageKey, JSON.stringify(confirmed));
        setPromoCode(confirmed.code);
        setPromoResult(confirmed);
        await performCheckout(confirmed.code);
        return;
      } catch {
        localStorage.removeItem(storageKey);
      } finally {
        setPromoChecking(false);
      }
    }
    setPromoCode('');
    setPromoResult(null);
    setPromoError('');
    setPromoOpen(true);
  };

  const validatePromo = async (event) => {
    event.preventDefault();
    if (!promoCode.trim()) return;
    setPromoChecking(true);
    setPromoError('');
    setPromoResult(null);
    try {
      const { data } = await api.post('/promocodes/validate', { code: promoCode, templateId: template._id });
      const confirmed = { ...data, code: data.code || promoCode.trim() };
      setPromoResult(confirmed);
      const storageKey = promoStorageKey(user, template._id);
      if (storageKey) localStorage.setItem(storageKey, JSON.stringify(confirmed));
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.setItem('amulet_pending_template', template._id);
        localStorage.setItem('amulet_pending_draft', JSON.stringify(cleanDraft()));
        localStorage.setItem('amulet_pending_promo', promoCode.trim());
        localStorage.removeItem('amulet_pending_action');
        window.location.replace('/login');
        return;
      }
      setPromoError(t('promoInvalid'));
    } finally {
      setPromoChecking(false);
    }
  };

  const clearEditorSession = () => {
    if (!template?._id) return;
    localStorage.removeItem(`amulet_autosave_${template._id}`);
    localStorage.removeItem('amulet_pending_draft');
    localStorage.removeItem('amulet_pending_action');
    autosaveTokenRef.current = '';
    setPrivatePreviewPath('');
  };

  const restoreEditorDraft = (originalDraft) => {
    clearEditorSession();
    setDraft(cloneEditorDraft(originalDraft));
    setIsEdited(false);
  };

  const discardEditorDraft = (originalDraft) => {
    restoreEditorDraft(originalDraft);
    setEditing(false);
    if (previewToken) navigate(`/templates/${template._id}/live`, { replace: true });
  };

  if (state === 'loading') return <Loading text={t('loading')} />;
  if (state === 'error') return <ErrorState text={t('error')} />;

  const occasionTemplate = getOccasionTemplate(template);
  const LivePreview = occasionTemplate?.LivePreview;
  const originalEditorDraft = createInitialDraft(template);
  const isSingleImageTemplate = false;
  const image = resolveTemplateImage(draft?.image || template.mainImage || template.gallery?.[0]);
  const formattedDate = draft?.eventDate ? new Date(draft.eventDate).toLocaleDateString() : previewDate.toLocaleDateString();

  return (
    <main
      ref={livePreviewRootRef}
      className={`${LivePreview ? 'template-live-page test-wedding-page' : 'template-live-page'}${editing ? ' is-editing' : ''}${isStandalonePreview ? ' is-standalone-preview' : ''}`}
    >
      {LivePreview ? (
        <>
          <LivePreview
            draft={draft}
            price={template.price}
            loading={checkoutState === 'loading'}
            mode={isStandalonePreview ? 'studio' : undefined}
            onHome={() => navigate('/')}
            onEdit={openEditor}
            onOrder={orderTemplate}
          />
          {checkoutState === 'error' && <p className="template-live-error">{t('checkoutError')}</p>}
        </>
      ) : (
      <article className="template-live-card">
        <section className="template-live-hero">
          {image && <img src={image} alt={draft?.mainNames ?? template.title} />}
          <div className="template-live-scrim" />
          <div className="template-live-copy">
            <span><Sparkles size={16} /> {t(template.category)}</span>
            <h1>{draft?.mainNames ?? template.title}</h1>
            {draft?.eventMessage && <p>{draft.eventMessage}</p>}
          </div>
        </section>

        {draft?.receptionVisible !== false && (
          <section className="template-live-details">
            <div><CalendarDays size={20} /><span>{formattedDate}</span></div>
            <div><Clock size={20} /><span>{draft?.eventTime || '18:00'}</span></div>
            <div><MapPin size={20} /><span>{draft?.eventLocation || 'Yerevan, Armenia'}</span></div>
          </section>
        )}

        <section className="template-live-prefill-sections">
          {draft?.familyVisible !== false && (draft?.groomFamilyTitle || draft?.brideFamilyTitle) && (
            <div>
              <span><Users size={18} /> {t('familyInformation')}</span>
              {draft.groomFamilyTitle && <p>{draft.groomFamilyTitle}</p>}
              {draft.brideFamilyTitle && <p>{draft.brideFamilyTitle}</p>}
            </div>
          )}
          {draft?.openingVisible !== false && draft?.eventMessage && (
            <div>
              <span><Megaphone size={18} /> {t('editorOpeningMessage')}</span>
              <p>{draft.eventMessage}</p>
            </div>
          )}
          {draft?.dressCodeVisible === true && draft?.dressCode && (
            <div>
              <span><Palette size={18} /> {t('editorDressCode')}</span>
              <p>{draft.dressCode}</p>
            </div>
          )}
          {draft?.questionsVisible !== false && draft?.rsvpQuestion && (
            <div>
              <span><ClipboardList size={18} /> {t('guestQuestion')}</span>
              <p>{draft.rsvpQuestion}</p>
            </div>
          )}
          {draft?.finalMessageVisible !== false && draft?.closingMessage && (
            <div>
              <span><MessageSquare size={18} /> {t('thankYouMessage')}</span>
              <p>{draft.closingMessage}</p>
            </div>
          )}
        </section>

        {!isStandalonePreview && <section className="template-live-footer">
          <div>
            <span>{t('invitationPrice')}</span>
            <strong>{Number(template.price).toLocaleString()} AMD</strong>
          </div>
          <div className="template-live-actions">
            <button className="btn btn-ghost template-home-action" type="button" onClick={() => navigate('/')} aria-label={t('home')} title={t('home')}>
              <Home size={19} />
            </button>
            <button className="btn btn-ghost template-live-edit" type="button" onClick={openEditor}>
              <Pencil size={18} />
              {t('editorEdit')}
            </button>
            <button className="btn btn-primary template-live-order" type="button" onClick={orderTemplate} disabled={checkoutState === 'loading'}>
              <ShoppingBag size={18} />
              {checkoutState === 'loading' ? t('loading') : t('orderThis')}
            </button>
          </div>
        </section>}
        {checkoutState === 'error' && <p className="template-live-error">{t('checkoutError')}</p>}
      </article>
      )}

      {!isStandalonePreview && editRequiredOpen && (
        <EditRequiredModal
          t={t}
          onClose={() => setEditRequiredOpen(false)}
          onEdit={openEditor}
        />
      )}

      {!isStandalonePreview && promoOpen && (
        <div className="promo-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="promo-modal-title">
          <section className="promo-modal">
            <button className="promo-modal-close" type="button" onClick={() => setPromoOpen(false)} aria-label={t('close')}><X size={20} /></button>
            <div className="promo-modal-animation" aria-hidden="true">
              <DotLottieReact src={giftPremiumAnimation} autoplay={!prefersReducedMotion} loop={!prefersReducedMotion} />
            </div>
            <span className="promo-modal-kicker">{t('promoQuestionKicker')}</span>
            <h2 id="promo-modal-title">{promoResult ? t('promoCongratulations') : t('promoQuestion')}</h2>
            {!promoResult && <p>{t('promoQuestionText')}</p>}
            {!promoResult ? (
              <form onSubmit={validatePromo} className="promo-modal-form" noValidate>
                <label htmlFor="checkout-promo">{t('promoCodeLabel')}</label>
                <div><input id="checkout-promo" value={promoCode} onChange={(event) => setPromoCode(event.target.value.toUpperCase())} autoComplete="off" maxLength={32} /><button type="submit" disabled={promoChecking || !promoCode.trim()}>{promoChecking ? t('loading') : t('promoApply')}</button></div>
                {promoError && <span className="promo-modal-error" role="alert">{promoError}</span>}
                <button className="promo-skip-button" type="button" onClick={() => performCheckout('')}>{t('promoNoCode')}</button>
              </form>
            ) : (
              <div className="promo-gift-reveal" aria-live="polite">
                <p>{Number(promoResult.discountAmount).toLocaleString()} AMD {t('promoDiscountApplied')}</p>
                <div><del>{Number(promoResult.originalAmount).toLocaleString()} AMD</del><b>{Number(promoResult.finalAmount).toLocaleString()} AMD</b></div>
                <button type="button" onClick={() => performCheckout(promoResult.code)}>{t('promoContinue')}</button>
              </div>
            )}
          </section>
        </div>
      )}

      {!isStandalonePreview && editing && draft && LivePreview && (
        <InvitationEditor
          key={template._id}
          draft={draft}
          originalDraft={originalEditorDraft}
          initialTarget={editorInitialTarget}
          template={template}
          PreviewComponent={LivePreview}
          isSingleImageTemplate={isSingleImageTemplate}
          saving={checkoutState === 'loading'}
          onClose={() => setEditing(false)}
          onDiscard={discardEditorDraft}
          onRestore={restoreEditorDraft}
          onPreview={openPrivatePreview}
          previewPath={privatePreviewPath}
          onBuy={buyFromEditor}
          onDraftChange={setDraft}
          onSelectTemplate={(templateId) => navigate(`/templates/${templateId}/live?edit=1`)}
        />
      )}

    </main>
  );
}
