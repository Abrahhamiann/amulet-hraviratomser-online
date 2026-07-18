import React from 'react';
import { AlertCircle, CalendarDays, Clock, ImagePlus, MapPin, Pencil, ShoppingBag, Sparkles, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

const createInitialDraft = (template) => {
  const occasionTemplate = getOccasionTemplate(template);
  if (occasionTemplate?.getInitialDraft) {
    const draft = occasionTemplate.getInitialDraft(template);
    return {
      ...draft,
      mapLink: draft.mapLink || '',
      mapLinks: draft.mapLinks || [],
      colors: { ...defaultColors, ...(draft.colors || {}) }
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
    colors: defaultColors
  };
};

const fileToGalleryImage = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => {
    const img = new Image();
    img.onerror = reject;
    img.onload = () => {
      const maxSize = 1400;
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.88));
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

export default function TemplateLivePreviewPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [template, setTemplate] = useState(null);
  const [draft, setDraft] = useState(null);
  const [isEdited, setIsEdited] = useState(false);
  const [editing, setEditing] = useState(false);
  const [warning, setWarning] = useState('');
  const [state, setState] = useState('loading');
  const [checkoutState, setCheckoutState] = useState('idle');

  useEffect(() => {
    api.get(`/templates/${id}`)
      .then(({ data }) => {
        setTemplate(data);
        setDraft(createInitialDraft(data));
        setState('ready');
      })
      .catch(() => setState('error'));
  }, [id]);

  const updateDraft = (event) => {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
  };

  const updateMapLink = (index, field, value) => {
    setDraft((current) => {
      const mapLinks = [...(current.mapLinks?.length ? current.mapLinks : [{ label: 'Քարտեզ 1', url: current.mapLink || '' }])];
      mapLinks[index] = { ...mapLinks[index], [field]: value };
      return { ...current, mapLinks, mapLink: mapLinks[0]?.url || '' };
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

  const updateColor = (key, value) => {
    setDraft((current) => ({
      ...current,
      colors: { ...defaultColors, ...(current.colors || {}), [key]: value }
    }));
  };

  const updateImages = async (event) => {
    const isSingleImageTemplate = getOccasionTemplate(template)?.key === 'midnight-vows';
    const files = Array.from(event.target.files || []).slice(0, isSingleImageTemplate ? 1 : 10);
    if (!files.length) return;

    const images = await Promise.all(files.map(fileToGalleryImage));
    setDraft((current) => {
      if (isSingleImageTemplate) return { ...current, image: images[0], gallery: [images[0]] };

      const gallery = uniqueImages([...images, ...(current.gallery || [])]).slice(0, 12);
      return { ...current, image: images[0], gallery };
    });
  };

  const selectImage = (image) => {
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
    setIsEdited(true);
    setWarning('');
    setEditing(false);
  };

  const orderTemplate = async () => {
    if (!isEdited) {
      setWarning('Պատվիրելուց առաջ պարտադիր խմբագրեք հրավերի տվյալները։');
      return;
    }

    setWarning('');
    setCheckoutState('loading');
    try {
      await startStripeCheckout(template._id, {
        ...draft,
        mapLink: cleanMapLinks(draft.mapLinks)[0]?.url || draft.mapLink || '',
        mapLinks: cleanMapLinks(draft.mapLinks),
        colors: { ...defaultColors, ...(draft.colors || {}) },
        gallery: uniqueImages([draft.image, ...(draft.gallery || [])])
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
  const editorMapLinks = draft?.mapLinks?.length ? draft.mapLinks : [{ label: 'Քարտեզ 1', url: draft?.mapLink || '' }];
  const editorColors = { ...defaultColors, ...(draft?.colors || {}) };

  return (
    <main className={LivePreview ? 'template-live-page test-wedding-page' : 'template-live-page'}>
      {LivePreview ? (
        <>
          <LivePreview
            draft={draft}
            price={template.price}
            loading={checkoutState === 'loading'}
            onEdit={() => setEditing(true)}
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

        <section className="template-live-details">
          <div><CalendarDays size={20} /><span>{formattedDate}</span></div>
          <div><Clock size={20} /><span>{draft?.eventTime || '18:00'}</span></div>
          <div><MapPin size={20} /><span>{draft?.eventLocation || 'Yerevan, Armenia'}</span></div>
        </section>

        <section className="template-live-footer">
          <div>
            <span>{t('invitationPrice')}</span>
            <strong>{Number(template.price).toLocaleString()} AMD</strong>
          </div>
          <div className="template-live-actions">
            <button className="btn btn-ghost template-live-edit" type="button" onClick={() => setEditing(true)}>
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
                <button type="button" onClick={addMapLink}>Ավելացնել քարտեզ</button>
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
                    value={item.url}
                    onChange={(event) => updateMapLink(index, 'url', event.target.value)}
                    placeholder="https://maps.google.com/..."
                    aria-label={`Map URL ${index + 1}`}
                  />
                  {editorMapLinks.length > 1 && (
                    <button type="button" onClick={() => removeMapLink(index)} aria-label={`Remove map ${index + 1}`}>
                      <Trash2 size={16} />
                    </button>
                  )}
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
                    <input type="color" value={editorColors[key]} onChange={(event) => updateColor(key, event.target.value)} />
                    <em>{editorColors[key]}</em>
                  </label>
                ))}
              </div>
            </div>
            <label className="invitation-editor-wide">
              Հրավերի տեքստ
              <textarea name="eventMessage" rows="4" value={draft.eventMessage} onChange={updateDraft} required />
            </label>
            {draft.gallery?.length > 0 && (
              <div className="invitation-gallery-picker">
                <span>Նկարները</span>
                <div>
                  {draft.gallery.map((galleryImage, index) => (
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
