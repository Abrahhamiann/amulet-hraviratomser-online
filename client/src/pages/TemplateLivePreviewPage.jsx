import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  CalendarDays,
  ClipboardList,
  Clock,
  Home,
  LogIn,
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
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import ErrorState from '../components/ErrorState.jsx';
import InvitationEditor, { clearPreviewDecorations, decoratePreview, updateDraftTextField } from '../components/invitationEditor/InvitationEditor.jsx';
import { cloneEditorDraft } from '../components/invitationEditor/editorData.js';
import Loading from '../components/Loading.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import giftPremiumAnimation from '../assets/animations/gift-premium.lottie?url';
import alertGuruAnimation from '../assets/animations/editor-exit-alert.lottie?url';
import { getOccasionTemplate } from '../occasionTemplates/index.jsx';
import { resolveTemplateImage } from '../occasionTemplates/templateAssets.js';
import { startStripeCheckout } from '../utils/checkout.js';
import { promoStorageKey, readRememberedPromo } from '../utils/promoStorage.js';
import { normalizeMapUrl } from '../utils/mapLinks.js';

const previewDate = new Date();
previewDate.setMonth(previewDate.getMonth() + 1);

const editorAutosaveKey = (templateId) => `amulet_autosave_${templateId}`;
const editorOpenKey = (templateId) => `amulet_editor_open_${templateId}`;
const BURGUNDY_ROADMAP_AUTOSAVE_VERSION = 'harsaniq1-zip-exact-v1';

const readEditorAutosave = (template) => {
  const templateId = template?._id;
  if (!templateId) return null;
  try {
    const saved = JSON.parse(localStorage.getItem(editorAutosaveKey(templateId)) || 'null');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return null;
    if (template.designKey === 'burgundy-roadmap'
      && saved.__designVersion !== BURGUNDY_ROADMAP_AUTOSAVE_VERSION) {
      localStorage.removeItem(editorAutosaveKey(templateId));
      return null;
    }
    const { __designVersion: _designVersion, ...draft } = saved;
    return draft;
  } catch {
    localStorage.removeItem(editorAutosaveKey(templateId));
    return null;
  }
};

const writeEditorAutosave = (template, nextDraft) => {
  const templateId = template?._id;
  if (!templateId || !nextDraft) return;
  try {
    const payload = template.designKey === 'burgundy-roadmap'
      ? { ...nextDraft, __designVersion: BURGUNDY_ROADMAP_AUTOSAVE_VERSION }
      : nextDraft;
    localStorage.setItem(editorAutosaveKey(templateId), JSON.stringify(payload));
  } catch {
    // Editing must remain available when browser storage is unavailable or full.
  }
};

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
    url: normalizeMapUrl(item?.url),
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

function AuthRequiredModal({ onClose, returnTo, t }) {
  const loginButtonRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    loginButtonRef.current?.focus();
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

  return (
    <div className="auth-required-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="auth-required-modal" role="alertdialog" aria-modal="true" aria-labelledby="live-auth-required-title" aria-describedby="live-auth-required-description">
        <button className="auth-required-close" type="button" onClick={onClose} aria-label={t('close')}><X size={20} /></button>
        <span className="auth-required-animation" aria-hidden="true">
          <DotLottieReact src={alertGuruAnimation} autoplay={!window.matchMedia('(prefers-reduced-motion: reduce)').matches} loop={!window.matchMedia('(prefers-reduced-motion: reduce)').matches} />
        </span>
        <h2 id="live-auth-required-title">{t('templateAuthRequiredTitle')}</h2>
        <p id="live-auth-required-description">{t('templateAuthRequiredText')}</p>
        <Link ref={loginButtonRef} className="btn btn-primary auth-required-login" to="/login" state={{ returnTo }} onClick={onClose}>
          <LogIn size={18} />{t('login')}
        </Link>
      </section>
    </div>
  );
}

export default function TemplateLivePreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, previewToken } = useParams();
  const [searchParams] = useSearchParams();
  const isStandalonePreview = Boolean(previewToken && searchParams.get('standalone') === '1');
  const { t } = useLanguage();
  const { initialized, user } = useAuth();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [template, setTemplate] = useState(null);
  const [draft, setDraft] = useState(null);
  const [isEdited, setIsEdited] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editorInitialTarget, setEditorInitialTarget] = useState({});
  const [editRequiredOpen, setEditRequiredOpen] = useState(false);
  const [authWarningOpen, setAuthWarningOpen] = useState(false);
  const [state, setState] = useState('loading');
  const [checkoutState, setCheckoutState] = useState('idle');
  const [previewState, setPreviewState] = useState('idle');
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
    if (!initialized) return undefined;
    if (previewToken && !user) {
      navigate('/login', {
        replace: true,
        state: { returnTo: `${location.pathname}${location.search}` }
      });
      return undefined;
    }
    const request = previewToken ? api.get(`/previews/${previewToken}`) : api.get(`/templates/${id}`);
    request
      .then(({ data }) => {
        if (data.mode === 'public' && data.invitationSlug) {
          navigate(`/invite/${data.invitationSlug}`, { replace: true });
          return;
        }
        const nextTemplate = previewToken ? data.template : data;
        const savedDraft = previewToken || !user ? null : readEditorAutosave(nextTemplate);
        const initialDraft = savedDraft || (previewToken ? data.draft : createInitialDraft(nextTemplate));
        setTemplate(nextTemplate);
        setDraft(initialDraft);
        setIsEdited(Boolean(previewToken || savedDraft));
        setState('ready');
      })
      .catch(() => {
        if (previewToken) navigate('/', { replace: true });
        else setState('error');
      });
    return undefined;
  }, [id, initialized, navigate, previewToken, user]);

  useEffect(() => {
    if (!initialized || user || searchParams.get('edit') !== '1') return;
    navigate('/login', {
      replace: true,
      state: { returnTo: `${location.pathname}${location.search}` }
    });
  }, [initialized, location.pathname, location.search, navigate, searchParams, user]);

  useEffect(() => {
    const shouldReopenEditor = template?._id && localStorage.getItem(editorOpenKey(template._id)) === '1';
    if (!autoEditorOpenedRef.current && state === 'ready' && draft && (searchParams.get('edit') === '1' || shouldReopenEditor)) {
      autoEditorOpenedRef.current = true;
      openEditor();
    }
  }, [state, draft, searchParams, template?._id]);

  useEffect(() => {
    if (!autoBuyOpenedRef.current && state === 'ready' && draft && searchParams.get('buy') === '1') {
      autoBuyOpenedRef.current = true;
      setIsEdited(true);
      void openPromoOrResumeCheckout();
    }
  }, [state, draft, searchParams]);

  useEffect(() => {
    const root = livePreviewRootRef.current;
    if (!root || !user || state !== 'ready' || !draft || editing || isStandalonePreview) return undefined;

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
        writeEditorAutosave(template, next);
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
  }, [draft, editing, editorHotspotLabels, isStandalonePreview, state, template?._id, user]);

  const cleanDraft = (sourceDraft = draft) => {
    const cleanGallery = uniqueImages(sourceDraft.gallery || [])
      .filter((image) => !isEnvelopeImage(resolveTemplateImage(image)));
    return {
      ...sourceDraft,
      image: isEnvelopeImage(resolveTemplateImage(sourceDraft.image)) ? (cleanGallery[0] || '') : sourceDraft.image,
      mapLink: cleanVenueLinks(sourceDraft.mapLinks)[0]?.url || normalizeMapUrl(sourceDraft.mapLink),
      mapLinks: cleanVenueLinks(sourceDraft.mapLinks),
      colors: { ...defaultColors, ...(sourceDraft.colors || {}) },
      gallery: cleanGallery.slice(0, 10)
    };
  };

  const openPrivatePreview = async (sourceDraft = draft) => {
    const nextDraft = cleanDraft(sourceDraft);
    setPreviewState('loading');
    try {
      const { data } = await api.post('/previews', {
        templateId: template._id,
        draft: nextDraft,
        previewToken: autosaveTokenRef.current || undefined
      });
      const nextPreviewPath = `${data.path}?standalone=1`;
      autosaveTokenRef.current = data.token;
      setPrivatePreviewPath(nextPreviewPath);
      writeEditorAutosave(template, nextDraft);
      setDraft(nextDraft);
      setIsEdited(true);
      setPreviewState('idle');
      navigate(nextPreviewPath);
      return true;
    } catch {
      setPreviewState('error');
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
      localStorage.removeItem(editorOpenKey(template._id));
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
    if (!user) {
      setAuthWarningOpen(true);
      return;
    }
    const isEditorTarget = target && typeof target === 'object' && (
      Object.hasOwn(target, 'section') || Object.hasOwn(target, 'field') || Object.hasOwn(target, 'targetTab')
    );
    setEditorInitialTarget(isEditorTarget ? target : {});
    if (template?._id) localStorage.setItem(editorOpenKey(template._id), '1');
    setEditing(true);
  };

  const closeEditor = () => {
    if (template?._id) localStorage.removeItem(editorOpenKey(template._id));
    setEditing(false);
  };

  useEffect(() => {
    if (!initialized || user || !editing) return;
    if (template?._id) localStorage.removeItem(editorOpenKey(template._id));
    setEditorInitialTarget({});
    setEditing(false);
    setAuthWarningOpen(true);
  }, [editing, initialized, template?._id, user]);

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
    localStorage.removeItem(editorAutosaveKey(template._id));
    localStorage.removeItem(editorOpenKey(template._id));
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

  const persistEditorDraft = (nextDraft, hasChanges) => {
    setDraft(nextDraft);
    setIsEdited(hasChanges);
    if (hasChanges) writeEditorAutosave(template, nextDraft);
    else if (template?._id) localStorage.removeItem(editorAutosaveKey(template._id));
  };

  const selectEditorTemplate = (templateId) => {
    clearEditorSession();
    setEditing(false);
    setState('loading');
    autoEditorOpenedRef.current = false;
    navigate(`/templates/${templateId}/live?edit=1`);
  };

  if (!initialized || state === 'loading') return <Loading text={t('loading')} />;
  if (state === 'error') return <ErrorState text={t('error')} />;

  const occasionTemplate = getOccasionTemplate(template);
  const LivePreview = occasionTemplate?.LivePreview;
  const originalEditorDraft = createInitialDraft(template);
  const isSingleImageTemplate = false;
  const editorActive = editing && Boolean(user);
  const image = resolveTemplateImage(draft?.image || template.mainImage || template.gallery?.[0]);
  const formattedDate = draft?.eventDate ? new Date(draft.eventDate).toLocaleDateString() : previewDate.toLocaleDateString();

  return (
    <main
      ref={livePreviewRootRef}
      className={`${LivePreview ? 'template-live-page test-wedding-page' : 'template-live-page'}${editorActive ? ' is-editing' : ''}${isStandalonePreview ? ' is-standalone-preview' : ''}`}
    >
      {LivePreview && !editorActive ? (
        <>
          <LivePreview
            draft={draft}
            price={template.price}
            loading={checkoutState === 'loading'}
            mode={isStandalonePreview ? 'preview' : undefined}
            onHome={() => navigate('/templates')}
            onEdit={openEditor}
            onOrder={orderTemplate}
          />
          {checkoutState === 'error' && <p className="template-live-error">{t('checkoutError')}</p>}
        </>
      ) : !LivePreview ? (
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

        <section className="template-live-footer">
          <div>
            <span>{t('invitationPrice')}</span>
            <strong>{Number(template.price).toLocaleString()} AMD</strong>
          </div>
          <div className="template-live-actions">
            <button className="btn btn-ghost template-home-action" type="button" onClick={() => navigate('/templates')} aria-label={t('templates')} title={t('templates')}>
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
        </section>
        {checkoutState === 'error' && <p className="template-live-error">{t('checkoutError')}</p>}
      </article>
      ) : null}

      {editRequiredOpen && (
        <EditRequiredModal
          t={t}
          onClose={() => setEditRequiredOpen(false)}
          onEdit={openEditor}
        />
      )}

      {authWarningOpen && (
        <AuthRequiredModal
          t={t}
          returnTo={`${location.pathname}?edit=1`}
          onClose={() => setAuthWarningOpen(false)}
        />
      )}

      {promoOpen && (
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

      {editorActive && draft && LivePreview && (
        <InvitationEditor
          key={template._id}
          draft={draft}
          originalDraft={originalEditorDraft}
          initialTarget={editorInitialTarget}
          template={template}
          PreviewComponent={LivePreview}
          isSingleImageTemplate={isSingleImageTemplate}
          saving={checkoutState === 'loading' || previewState === 'loading'}
          previewing={previewState === 'loading'}
          previewError={previewState === 'error'}
          onClose={closeEditor}
          onDiscard={discardEditorDraft}
          onRestore={restoreEditorDraft}
          onPreview={openPrivatePreview}
          previewPath={privatePreviewPath}
          onBuy={buyFromEditor}
          onDraftChange={persistEditorDraft}
          onSelectTemplate={selectEditorTemplate}
        />
      )}

    </main>
  );
}
