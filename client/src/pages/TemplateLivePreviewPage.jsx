import React from 'react';
import {
  AlertCircle,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Clock,
  Heart,
  Image as ImageIcon,
  ImagePlus,
  MapPin,
  Megaphone,
  MessageSquare,
  Palette,
  Pencil,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  Users,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import ErrorState from '../components/ErrorState.jsx';
import Loading from '../components/Loading.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getOccasionTemplate } from '../occasionTemplates/index.jsx';
import { resolveTemplateImage } from '../occasionTemplates/templateAssets.js';
import { startStripeCheckout } from '../utils/checkout.js';

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

const cleanMapLinks = (links = []) => links
  .map((item, index) => ({
    label: String(item?.label || `Քարտեզ ${index + 1}`).trim(),
    url: String(item?.url || '').trim()
  }))
  .filter((item) => item.url);

const cleanVenueLinks = (links = []) => links
  .map((item, index) => ({
    label: String(item?.label || `Վայր ${index + 1}`).trim(),
    time: String(item?.time || '').trim(),
    address: String(item?.address || '').trim(),
    url: String(item?.url || '').trim()
  }))
  .filter((item) => item.label || item.time || item.address || item.url);

const createDefaultVenue = (draft = {}, index = 0) => ({
  label: `Վայր ${index + 1}`,
  time: index === 0 ? draft.eventTime || '' : '',
  address: index === 0 ? draft.eventLocation || '' : '',
  url: index === 0 ? draft.mapLink || '' : ''
});

const getDraftVenueLinks = (draft = {}) => {
  const links = Array.isArray(draft?.mapLinks) && draft.mapLinks.length
    ? draft.mapLinks
    : [createDefaultVenue(draft, 0)];

  return links.map((item, index) => ({
    ...createDefaultVenue(draft, index),
    ...(item || {}),
    label: String(item?.label || `Վայր ${index + 1}`).trim() || `Վայր ${index + 1}`
  }));
};

const createInitialDraft = (template) => {
  const occasionTemplate = getOccasionTemplate(template);
  if (occasionTemplate?.getInitialDraft) {
    const draft = occasionTemplate.getInitialDraft(template);
    const isBaptismTemplate = occasionTemplate.key === 'baptism-blessing';
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
      closingMessage: draft.closingMessage || 'Սիրով սպասում ենք Ձեզ։',
      heroVisible: draft.heroVisible !== false,
      familyVisible: draft.familyVisible !== false,
      openingVisible: draft.openingVisible !== false,
      receptionVisible: draft.receptionVisible !== false,
      questionsVisible: draft.questionsVisible !== false,
      finalMessageVisible: draft.finalMessageVisible !== false
    };
  }

  const gallery = uniqueImages([template.mainImage, ...(template.gallery || [])]);

  return {
    mainNames: template.title,
    eventDate: toDateInputValue(previewDate),
    eventTime: '18:00',
    eventLocation: 'Yerevan, Armenia',
    mapLink: '',
    mapLinks: [],
    eventMessage: template.description,
    image: gallery[0] || '',
    gallery,
    colors: defaultColors,
    groomFamilyTitle: '',
    brideFamilyTitle: '',
    rsvpQuestion: '',
    dressCode: '',
    closingMessage: 'Սիրով սպասում ենք Ձեզ։',
    heroVisible: true,
    familyVisible: true,
    openingVisible: true,
    receptionVisible: true,
    questionsVisible: true,
    finalMessageVisible: true
  };
};

const fileToGalleryImage = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => {
    if (file.size <= 2300000) {
      resolve(String(reader.result || ''));
      return;
    }

    const img = new Image();
    img.onerror = reject;
    img.onload = () => {
      const maxSize = 2400;
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.96));
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

const splitDisplayNames = (value = '') => {
  const parts = String(value || '')
    .split(/\s*(?:&|\+|և|եւ|,|\/)\s*/i)
    .map((item) => item.trim())
    .filter(Boolean);
  return [parts[0] || '', parts[1] || ''];
};

function EditorSection({ icon: Icon, title, children, defaultOpen = true, enabled, onEnabledChange }) {
  const [open, setOpen] = useState(defaultOpen);
  const isOptional = typeof enabled === 'boolean';

  return (
    <section className={`smart-editor-section${open ? ' is-open' : ''}${isOptional && !enabled ? ' is-disabled' : ''}`}>
      <header className="smart-editor-section-header">
        <button type="button" className="smart-editor-section-toggle" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
          <ChevronDown size={18} />
          {Icon && <Icon size={18} />}
          <span>{title}</span>
        </button>
        {isOptional && (
          <label className="smart-editor-switch">
            <span>{enabled ? 'Ցույց տալ' : 'Թաքցնել'}</span>
            <input type="checkbox" checked={enabled} onChange={(event) => onEnabledChange(event.target.checked)} />
            <i aria-hidden="true" />
          </label>
        )}
      </header>
      {open && <div className="smart-editor-section-body">{children}</div>}
    </section>
  );
}

function SmartInvitationEditor({
  draft,
  editorColors,
  editorMapLinks,
  isSingleImageTemplate,
  onClose,
  onSave,
  onUpdateDraft,
  onUpdateMapLink,
  onAddVenue,
  onRemoveVenue,
  onUpdateColor,
  onCommitColors,
  onUpdateImages,
  onSelectImage,
  onRemoveImage,
  category
}) {
  const [firstName, secondName] = splitDisplayNames(draft.mainNames);
  const nameLabels = {
    baptism: ['Երեխայի անունը', 'Երկրորդ անունը'],
    birth: ['Հոբելյարի անունը', 'Երկրորդ անունը'],
    corporate: ['Կազմակերպության անունը', 'Միջոցառման անունը'],
    engagement: ['Փեսայի լրիվ անունը', 'Հարսնացուի լրիվ անունը'],
    wedding: ['Փեսայի լրիվ անունը', 'Հարսնացուի լրիվ անունը']
  }[category] || ['Առաջին անունը', 'Երկրորդ անունը'];
  const [visibleSections, setVisibleSections] = useState({
    hero: draft.heroVisible !== false,
    family: draft.familyVisible !== false,
    opening: draft.openingVisible !== false,
    reception: draft.receptionVisible !== false,
    questions: draft.questionsVisible !== false,
    dressCode: draft.dressCodeVisible === true,
    finalMessage: draft.finalMessageVisible !== false
  });

  const setSectionVisible = (key, value) => {
    setVisibleSections((current) => ({ ...current, [key]: value }));
    onUpdateDraft({ target: { name: `${key}Visible`, value } });
  };

  const updateNamePart = (index, value) => {
    const names = splitDisplayNames(draft.mainNames);
    names[index] = value;
    onUpdateDraft({ target: { name: 'mainNames', value: names.filter(Boolean).join(' & ') } });
  };

  const updateField = (name, value) => {
    onUpdateDraft({ target: { name, value } });
  };

  const gallery = withoutEnvelopeImages(draft.gallery || []);

  return (
    <section className="smart-editor-backdrop" role="dialog" aria-modal="true" aria-labelledby="smart-editor-title">
      <form className="smart-editor-panel" onSubmit={onSave}>
        <div className="smart-editor-topbar">
          <div>
            <span>Հրավերի տվյալներ</span>
            <h2 id="smart-editor-title">Նախապես լրացրեք հրավերը</h2>
            <p>Փոփոխությունները երևում են միայն այս դիտման մեջ։ Refresh-ից հետո հրավերը վերադառնում է նախնական տեսքին։</p>
          </div>
          <button type="button" className="smart-editor-close" onClick={onClose} aria-label="Փակել խմբագրիչը">
            <X size={22} />
          </button>
        </div>

        <EditorSection icon={Heart} title="Հիմնական տեղեկություններ" enabled={visibleSections.hero} onEnabledChange={(value) => setSectionVisible('hero', value)}>
          <div className="smart-editor-tip">
            <Sparkles size={18} />
            <span>Օգտագործեք անունները՝ ինչպես ցանկանում եք տեսնել հրավերի գլխավոր հատվածում։</span>
          </div>
          <div className="smart-editor-grid two">
            <label>
              {nameLabels[0]}
              <input value={firstName} onChange={(event) => updateNamePart(0, event.target.value)} placeholder="օրինակ՝ Զոր Մելիք" />
            </label>
            <label>
              {nameLabels[1]}
              <input value={secondName} onChange={(event) => updateNamePart(1, event.target.value)} placeholder="օրինակ՝ Ջուլի Դոու" />
            </label>
          </div>
        </EditorSection>

        <EditorSection icon={ImageIcon} title="Հերոսի լուսանկար" enabled={visibleSections.hero} onEnabledChange={(value) => setSectionVisible('hero', value)}>
          <div className="smart-editor-photo-zone">
            <span>Հերոսի լուսանկար</span>
            <div className="smart-editor-phone-frame">
              {draft.image ? <img src={resolveTemplateImage(draft.image)} alt="Հերոսի լուսանկար" /> : <ImageIcon size={38} />}
            </div>
            <label className="smart-editor-upload-btn">
              Վերբեռնել
              <input type="file" accept="image/*" multiple={false} onChange={onUpdateImages} />
            </label>
            <small>JPG, PNG, GIF, WebP, HEIC</small>
            <p>Օգտագործեք զույգի լուսանկար կամ ամբողջական մարմնի լուսանկար։</p>
          </div>
        </EditorSection>

        <EditorSection icon={Users} title="Ընտանեկան տեղեկատվություն" enabled={visibleSections.family} onEnabledChange={(value) => setSectionVisible('family', value)}>
          <div className="smart-editor-grid">
            <label className="wide">
              Փեսայի ընտանիքը
              <input name="groomFamilyTitle" value={draft.groomFamilyTitle ?? 'Mr. & Mrs.'} onChange={onUpdateDraft} />
            </label>
            <label className="wide">
              Հարսնացուի ընտանիքը
              <input name="brideFamilyTitle" value={draft.brideFamilyTitle ?? 'Mr. & Mrs.'} onChange={onUpdateDraft} />
            </label>
          </div>
        </EditorSection>

        <EditorSection icon={Megaphone} title="Բացման հաղորդագրություն" enabled={visibleSections.opening} onEnabledChange={(value) => setSectionVisible('opening', value)}>
          <label>
            Հատուկ հաղորդագրություն
            <textarea name="eventMessage" rows="4" value={draft.eventMessage || ''} onChange={onUpdateDraft} />
          </label>
        </EditorSection>

        <EditorSection icon={CalendarDays} title="Wedding Reception" enabled={visibleSections.reception} onEnabledChange={(value) => setSectionVisible('reception', value)}>
          <div className="smart-editor-tabs" aria-label="Reception type">
            <button type="button" className="is-active">Օրվա գրաֆիկ</button>
          </div>
          <div className="smart-editor-grid">
            <label className="wide">
              Միջոցառման ամսաթիվ
              <input name="eventDate" type="date" value={draft.eventDate || ''} onChange={onUpdateDraft} />
            </label>
            <label className="wide">
              Միջոցառման ժամը
              <input name="eventTime" type="time" value={draft.eventTime || ''} onChange={onUpdateDraft} />
            </label>
            <label className="wide">
              Հասցե
              <textarea name="eventLocation" rows="3" value={draft.eventLocation || ''} onChange={onUpdateDraft} placeholder="Հարսանյաց վայրի հասցեն" />
            </label>
          </div>
          <div className="smart-editor-map-list">
            <div className="smart-editor-mini-head">
              <span>Քարտեզ</span>
              <button type="button" onClick={onAddVenue}><Plus size={16} /> Ավելացնել վայր</button>
            </div>
            {editorMapLinks.map((item, index) => (
              <div className="smart-editor-venue-row" key={`venue-${index}`}>
                <input value={item.label} onChange={(event) => onUpdateMapLink(index, 'label', event.target.value)} placeholder={`Վայր ${index + 1}`} />
                <input type="time" value={item.time || (index === 0 ? draft.eventTime || '' : '')} onChange={(event) => onUpdateMapLink(index, 'time', event.target.value)} />
                <input value={item.address || (index === 0 ? draft.eventLocation || '' : '')} onChange={(event) => onUpdateMapLink(index, 'address', event.target.value)} placeholder="Հասցե" />
                <input value={item.url || ''} onChange={(event) => onUpdateMapLink(index, 'url', event.target.value)} placeholder="https://maps.google.com/..." />
                <button type="button" onClick={() => onRemoveVenue(index)} aria-label="Ջնջել վայրը"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </EditorSection>

        <EditorSection icon={ClipboardList} title="Հաստատեք ձեր պատասխանը" enabled={visibleSections.questions} onEnabledChange={(value) => setSectionVisible('questions', value)}>
          <div className="smart-editor-tip info">
            <AlertCircle size={18} />
            <span>Հյուրերը կարող են հաստատել իրենց ներկայությունը ամենավերջին հրավերի մեջ։</span>
          </div>
          <label>
            Լրացուցիչ հարց
            <input name="rsvpQuestion" value={draft.rsvpQuestion || ''} onChange={onUpdateDraft} placeholder="օրինակ՝ Ձեզ հետ քանի՞ հյուր է գալու" />
          </label>
          <button type="button" className="smart-editor-outline-btn" onClick={() => updateField('rsvpQuestion', draft.rsvpQuestion || 'Ձեզ հետ քանի՞ հյուր է գալու')}>
            <Plus size={17} />
            Ավելացնել հարց
          </button>
        </EditorSection>

        <EditorSection icon={Palette} title="Հագուստի կանոնակարգ" defaultOpen={false} enabled={visibleSections.dressCode} onEnabledChange={(value) => setSectionVisible('dressCode', value)}>
          <div className="smart-editor-tip">
            <Palette size={18} />
            <span>Հնարավորություն տվեք հյուրերին պատրաստվել հագուստի գույների կամ ոճի համաձայն։</span>
          </div>
          <textarea name="dressCode" rows="3" value={draft.dressCode || ''} onChange={onUpdateDraft} placeholder="Օրինակ՝ խնդրում ենք ընտրել բաց գույների հագուստ" />
        </EditorSection>

        <EditorSection icon={MessageSquare} title="Շնորհակալական նամակ" enabled={visibleSections.finalMessage} onEnabledChange={(value) => setSectionVisible('finalMessage', value)}>
          <label>
            Շնորհակալական հաղորդագրություն
            <textarea name="closingMessage" rows="4" value={draft.closingMessage ?? 'Your presence would be the greatest gift we could receive!'} onChange={onUpdateDraft} />
          </label>
        </EditorSection>

        <EditorSection icon={Palette} title="Հրավերի գույները" defaultOpen={false}>
          <div className="smart-editor-color-grid">
            {[
              ['accent', 'Գլխավոր գույն'],
              ['text', 'Տեքստի գույն'],
              ['overlay', 'Ֆոնի շերտ']
            ].map(([key, label]) => (
              <label key={key}>
                <span>{label}</span>
                <input
                  type="color"
                  defaultValue={editorColors[key]}
                  onChange={(event) => onUpdateColor(key, event.target.value)}
                  onBlur={onCommitColors}
                  onMouseUp={onCommitColors}
                  onTouchEnd={onCommitColors}
                />
                <em>{editorColors[key]}</em>
              </label>
            ))}
          </div>
        </EditorSection>

        {gallery.length > 0 && (
          <div className="smart-editor-gallery">
            <span>Նկարները</span>
            <div>
              {gallery.map((galleryImage, index) => (
                <div className="smart-editor-gallery-item" key={`${galleryImage.slice(0, 48)}-${index}`}>
                  <button type="button" className={galleryImage === draft.image ? 'is-selected' : ''} onClick={() => onSelectImage(galleryImage)} aria-label={`Ընտրել նկար ${index + 1}`}>
                    <img src={resolveTemplateImage(galleryImage)} alt={`Նկար ${index + 1}`} />
                  </button>
                  <button type="button" onClick={() => onRemoveImage(galleryImage)} aria-label={`Ջնջել նկար ${index + 1}`}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <label className="smart-editor-upload-wide">
          <ImagePlus size={20} />
          <span>Ավելացնել նկար</span>
          <input type="file" accept="image/*" multiple={!isSingleImageTemplate} onChange={onUpdateImages} />
        </label>

        <div className="smart-editor-actions">
          <button type="button" className="smart-editor-secondary" onClick={onClose}>Չեղարկել</button>
          <button type="submit" className="smart-editor-primary">Ցույց տալ թարմացված հրավերը</button>
        </div>
      </form>
    </section>
  );
}

export default function TemplateLivePreviewPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const [template, setTemplate] = useState(null);
  const [draft, setDraft] = useState(null);
  const [isEdited, setIsEdited] = useState(false);
  const [editing, setEditing] = useState(false);
  const [warning, setWarning] = useState('');
  const [state, setState] = useState('loading');
  const [checkoutState, setCheckoutState] = useState('idle');
  const [pendingColors, setPendingColors] = useState(defaultColors);
  const pendingColorsRef = useRef(defaultColors);
  const autoEditorOpenedRef = useRef(false);

  useEffect(() => {
    api.get(`/templates/${id}`)
      .then(({ data }) => {
        const initialDraft = createInitialDraft(data);
        setTemplate(data);
        setDraft(initialDraft);
        const initialColors = { ...defaultColors, ...(initialDraft.colors || {}) };
        pendingColorsRef.current = initialColors;
        setPendingColors(initialColors);
        setState('ready');
      })
      .catch(() => setState('error'));
  }, [id]);

  useEffect(() => {
    if (!autoEditorOpenedRef.current && state === 'ready' && draft && searchParams.get('edit') === '1') {
      autoEditorOpenedRef.current = true;
      openEditor();
    }
  }, [state, draft, searchParams]);

  const updateDraft = (event) => {
    const { name, value } = event.target;
    setDraft((current) => {
      if (name !== 'eventTime' && name !== 'eventLocation') return { ...current, [name]: value };

      const mapLinks = [...getDraftVenueLinks(current)];
      mapLinks[0] = {
        ...createDefaultVenue(current, 0),
        ...(mapLinks[0] || {}),
        ...(name === 'eventTime' ? { time: value } : { address: value })
      };

      return {
        ...current,
        [name]: value,
        mapLinks
      };
    });
  };

  const updateMapLink = (index, field, value) => {
    setDraft((current) => {
      const mapLinks = [...getDraftVenueLinks(current)];
      mapLinks[index] = { ...createDefaultVenue(current, index), ...(mapLinks[index] || {}), [field]: value };
      return {
        ...current,
        eventTime: index === 0 && field === 'time' ? value : current.eventTime,
        eventLocation: index === 0 && field === 'address' ? value : current.eventLocation,
        mapLinks,
        mapLink: mapLinks[0]?.url || ''
      };
    });
  };

  const addMapLink = () => {
    setDraft((current) => {
      const currentLinks = current.mapLinks?.length ? current.mapLinks : [{ label: 'Քարտեզ 1', url: current.mapLink || '' }];
      return {
        ...current,
        mapLinks: [...currentLinks, { label: `Քարտեզ ${currentLinks.length + 1}`, url: '' }]
      };
    });
  };

  const removeMapLink = (index) => {
    setDraft((current) => {
      const mapLinks = (current.mapLinks || []).filter((_, itemIndex) => itemIndex !== index);
      return { ...current, mapLinks, mapLink: mapLinks[0]?.url || '' };
    });
  };

  const addVenue = () => {
    setDraft((current) => {
      const currentLinks = getDraftVenueLinks(current);
      return {
        ...current,
        mapLinks: [...currentLinks, createDefaultVenue(current, currentLinks.length)]
      };
    });
  };

  const removeVenue = (index) => {
    setDraft((current) => {
      const mapLinks = getDraftVenueLinks(current)
        .filter((_, itemIndex) => itemIndex !== index);
      const nextLinks = mapLinks.length ? mapLinks : [createDefaultVenue(current, 0)];
      return {
        ...current,
        eventTime: nextLinks[0]?.time || current.eventTime,
        eventLocation: nextLinks[0]?.address || current.eventLocation,
        mapLinks: nextLinks,
        mapLink: nextLinks[0]?.url || ''
      };
    });
  };

  const updateColor = (key, value) => {
    pendingColorsRef.current = { ...pendingColorsRef.current, [key]: value };
  };

  const commitColors = () => {
    const nextColors = { ...defaultColors, ...pendingColorsRef.current };
    setPendingColors(nextColors);
    setDraft((current) => ({
      ...current,
      colors: nextColors
    }));
  };

  const updateImages = async (event) => {
    const occasionTemplateKey = getOccasionTemplate(template)?.key;
    const isSingleImageTemplate = occasionTemplateKey === 'midnight-vows';
    const files = Array.from(event.target.files || []).slice(0, isSingleImageTemplate ? 1 : 10);
    if (!files.length) return;

    const images = await Promise.all(files.map(fileToGalleryImage));
    setDraft((current) => {
      if (isSingleImageTemplate) return { ...current, image: images[0], gallery: [images[0]] };

      const gallery = withoutEnvelopeImages(uniqueImages([...images, ...(current.gallery || [])])).slice(0, 12);
      return { ...current, image: images[0], gallery };
    });
  };

  const selectImage = (image) => {
    if (isEnvelopeImage(resolveTemplateImage(image))) return;
    setDraft((current) => ({ ...current, image }));
  };

  const removeImage = (imageToRemove) => {
    setDraft((current) => {
      const gallery = (current.gallery || []).filter((galleryImage) => galleryImage !== imageToRemove);
      const image = current.image === imageToRemove ? (gallery[0] || '') : current.image;
      return { ...current, image, gallery };
    });
  };

  const saveDraft = (event) => {
    event.preventDefault();
    commitColors();
    setIsEdited(true);
    setWarning('');
    setEditing(false);
  };

  const openEditor = () => {
    const nextColors = { ...defaultColors, ...(draft?.colors || {}) };
    pendingColorsRef.current = nextColors;
    setPendingColors(nextColors);
    setEditing(true);
  };

  const orderTemplate = async () => {
    if (!isEdited) {
      setWarning('Պատվիրելուց առաջ պարտադիր խմբագրեք հրավերի տվյալները։');
      return;
    }

    setWarning('');
    setCheckoutState('loading');
    try {
      const cleanGallery = uniqueImages([draft.image, ...(draft.gallery || [])])
        .filter((image) => !isEnvelopeImage(resolveTemplateImage(image)));
      await startStripeCheckout(template._id, {
        ...draft,
        image: isEnvelopeImage(resolveTemplateImage(draft.image)) ? (cleanGallery[0] || '') : draft.image,
        mapLink: cleanVenueLinks(draft.mapLinks)[0]?.url || draft.mapLink || '',
        mapLinks: cleanVenueLinks(draft.mapLinks),
        colors: { ...defaultColors, ...(draft.colors || {}) },
        gallery: cleanGallery
      });
    } catch {
      setCheckoutState('error');
    }
  };

  if (state === 'loading') return <Loading text={t('loading')} />;
  if (state === 'error') return <ErrorState text={t('error')} />;

  const occasionTemplate = getOccasionTemplate(template);
  const LivePreview = occasionTemplate?.LivePreview;
  const isSingleImageTemplate = occasionTemplate?.key === 'midnight-vows';
  const image = resolveTemplateImage(draft?.image || template.mainImage || template.gallery?.[0]);
  const formattedDate = draft?.eventDate ? new Date(draft.eventDate).toLocaleDateString() : previewDate.toLocaleDateString();
  const editorMapLinks = getDraftVenueLinks(draft);
  const editorColors = { ...defaultColors, ...pendingColors };

  return (
    <main className={LivePreview ? 'template-live-page test-wedding-page' : 'template-live-page'}>
      {LivePreview ? (
        <>
          <LivePreview
            draft={draft}
            price={template.price}
            loading={checkoutState === 'loading'}
            onEdit={openEditor}
            onOrder={orderTemplate}
          />
          {warning && (
            <p className="template-live-warning" role="alert">
              <AlertCircle size={18} />
              {warning}
            </p>
          )}
          {checkoutState === 'error' && <p className="template-live-error">{t('checkoutError')}</p>}
        </>
      ) : (
      <article className="template-live-card">
        <section className="template-live-hero">
          {image && <img src={image} alt={draft?.mainNames || template.title} />}
          <div className="template-live-scrim" />
          <div className="template-live-copy">
            <span><Sparkles size={16} /> {t(template.category)}</span>
            <h1>{draft?.mainNames || template.title}</h1>
            <p>{draft?.eventMessage || template.description}</p>
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
              <span><Users size={18} /> Ընտանեկան տեղեկատվություն</span>
              {draft.groomFamilyTitle && <p>{draft.groomFamilyTitle}</p>}
              {draft.brideFamilyTitle && <p>{draft.brideFamilyTitle}</p>}
            </div>
          )}
          {draft?.openingVisible !== false && draft?.eventMessage && (
            <div>
              <span><Megaphone size={18} /> Բացման հաղորդագրություն</span>
              <p>{draft.eventMessage}</p>
            </div>
          )}
          {draft?.dressCodeVisible === true && draft?.dressCode && (
            <div>
              <span><Palette size={18} /> Հագուստի կանոնակարգ</span>
              <p>{draft.dressCode}</p>
            </div>
          )}
          {draft?.questionsVisible !== false && draft?.rsvpQuestion && (
            <div>
              <span><ClipboardList size={18} /> Հյուրերի հարց</span>
              <p>{draft.rsvpQuestion}</p>
            </div>
          )}
          {draft?.finalMessageVisible !== false && draft?.closingMessage && (
            <div>
              <span><MessageSquare size={18} /> Շնորհակալական նամակ</span>
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
            <button className="btn btn-ghost template-live-edit" type="button" onClick={openEditor}>
              <Pencil size={18} />
              Խմբագրել
            </button>
            <button className="btn btn-primary template-live-order" type="button" onClick={orderTemplate} disabled={checkoutState === 'loading'}>
              <ShoppingBag size={18} />
              {checkoutState === 'loading' ? t('loading') : t('orderThis')}
            </button>
          </div>
        </section>
        {warning && (
          <p className="template-live-warning" role="alert">
            <AlertCircle size={18} />
            {warning}
          </p>
        )}
        {checkoutState === 'error' && <p className="template-live-error">{t('checkoutError')}</p>}
      </article>
      )}

      {editing && draft && (
        <SmartInvitationEditor
          draft={draft}
          editorColors={editorColors}
          editorMapLinks={editorMapLinks}
          isSingleImageTemplate={isSingleImageTemplate}
          onClose={() => setEditing(false)}
          onSave={saveDraft}
          onUpdateDraft={updateDraft}
          onUpdateMapLink={updateMapLink}
          onAddVenue={addVenue}
          onRemoveVenue={removeVenue}
          onUpdateColor={updateColor}
          onCommitColors={commitColors}
          onUpdateImages={updateImages}
          onSelectImage={selectImage}
          onRemoveImage={removeImage}
          category={template.category}
        />
      )}

      {/* Previous invitation editor form is temporarily commented out for rollback. */}
      {false && editing && draft && (
        <section className="invitation-editor-panel" aria-label="Edit invitation">
          <form className="invitation-editor-form" onSubmit={saveDraft}>
            <div className="invitation-editor-title">
              <span>Խմբագրել հրավերը</span>
              <button type="button" onClick={() => setEditing(false)} aria-label="Close editor"><X size={20} /></button>
            </div>

            <label>
              Անուն ազգանուն
              <input name="mainNames" value={draft.mainNames} onChange={updateDraft} required />
            </label>
            <label>
              Առիթի օրը
              <input name="eventDate" type="date" value={draft.eventDate} onChange={updateDraft} required />
            </label>
            <label>
              Ժամը
              <input name="eventTime" type="time" value={draft.eventTime} onChange={updateDraft} required />
            </label>
            <label>
              Վայրը
              <input name="eventLocation" value={draft.eventLocation} onChange={updateDraft} required />
            </label>
            <div className="invitation-map-links invitation-editor-wide">
              <div className="invitation-editor-section-head">
                <span>Քարտեզի հղումներ</span>
                <button type="button" onClick={addVenue}>Ավելացնել վայր</button>
              </div>
              {editorMapLinks.map((item, index) => (
                <div className="invitation-map-link-row" key={`map-link-${index}`}>
                  <input
                    value={item.label}
                    onChange={(event) => updateMapLink(index, 'label', event.target.value)}
                    placeholder={`Վայր ${index + 1}`}
                    aria-label={`Map label ${index + 1}`}
                  />
                  <input
                    type="time"
                    value={item.time || (index === 0 ? draft.eventTime || '' : '')}
                    onChange={(event) => updateMapLink(index, 'time', event.target.value)}
                    aria-label={`Venue time ${index + 1}`}
                  />
                  <input
                    value={item.address || (index === 0 ? draft.eventLocation || '' : '')}
                    onChange={(event) => updateMapLink(index, 'address', event.target.value)}
                    placeholder="Հասցե"
                    aria-label={`Venue address ${index + 1}`}
                  />
                  <input
                    value={item.url || ''}
                    onChange={(event) => updateMapLink(index, 'url', event.target.value)}
                    placeholder="https://maps.google.com/..."
                    aria-label={`Map URL ${index + 1}`}
                  />
                  <button type="button" onClick={() => removeVenue(index)} aria-label={`Remove venue ${index + 1}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="invitation-color-controls invitation-editor-wide">
              <span>Հրավերի գույները</span>
              <div className="invitation-color-grid">
                {[
                  ['accent', 'Գլխավոր գույն'],
                  ['text', 'Տեքստի գույն'],
                  ['overlay', 'Ֆոնի շերտ']
                ].map(([key, label]) => (
                  <label className="invitation-color-field" key={key}>
                    <span>{label}</span>
                    <input
                      type="color"
                      defaultValue={editorColors[key]}
                      onChange={(event) => updateColor(key, event.target.value)}
                      onBlur={commitColors}
                      onMouseUp={commitColors}
                      onTouchEnd={commitColors}
                    />
                    <em>{editorColors[key]}</em>
                  </label>
                ))}
              </div>
            </div>
            <label className="invitation-editor-wide">
              Հրավերի տեքստ
              <textarea name="eventMessage" rows="4" value={draft.eventMessage} onChange={updateDraft} required />
            </label>
            {withoutEnvelopeImages(draft.gallery || []).length > 0 && (
              <div className="invitation-gallery-picker">
                <span>Նկարները</span>
                <div>
                  {withoutEnvelopeImages(draft.gallery || []).map((galleryImage, index) => (
                    <div className="invitation-gallery-item" key={`${galleryImage.slice(0, 48)}-${index}`}>
                      <button
                        type="button"
                        className={`invitation-gallery-select${galleryImage === draft.image ? ' is-selected' : ''}`}
                        onClick={() => selectImage(galleryImage)}
                        aria-label={`Select image ${index + 1}`}
                      >
                        <img src={galleryImage} alt={`Template ${index + 1}`} />
                      </button>
                      <button
                        type="button"
                        className="invitation-gallery-remove"
                        onClick={() => removeImage(galleryImage)}
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <label className="invitation-upload-field">
              <ImagePlus size={20} />
              <span>Ավելացնել նկար</span>
              <input type="file" accept="image/*" multiple={!isSingleImageTemplate} onChange={updateImages} />
            </label>

            <button className="invitation-save-btn" type="submit">Ցուցադրել թարմացված հրավերը</button>
          </form>
        </section>
      )}
    </main>
  );
}
