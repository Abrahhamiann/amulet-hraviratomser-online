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

const createInitialDraft = (template) => {
  const occasionTemplate = getOccasionTemplate(template);
  if (occasionTemplate?.getInitialDraft) return occasionTemplate.getInitialDraft(template);

  const gallery = uniqueImages([template.mainImage, ...(template.gallery || [])]);

  return {
    mainNames: template.title,
    eventDate: toDateInputValue(previewDate),
    eventTime: '18:00',
    eventLocation: 'Yerevan, Armenia',
    eventMessage: template.description,
    image: gallery[0] || '',
    gallery
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
