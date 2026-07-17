import React from 'react';
import { AlertCircle, CalendarDays, Clock, ImagePlus, MapPin, Pencil, ShoppingBag, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios.js';
import ErrorState from '../components/ErrorState.jsx';
import Loading from '../components/Loading.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getTestWeddingDraft, isTestTemplate, TestWeddingLivePreview } from '../invitationTemplates/TestWeddingTemplate.jsx';
import { startStripeCheckout } from '../utils/checkout.js';

const previewDate = new Date();
previewDate.setMonth(previewDate.getMonth() + 1);

const toDateInputValue = (date) => date.toISOString().slice(0, 10);

const uniqueImages = (images) => [...new Set(images.filter(Boolean))];

const createInitialDraft = (template) => {
  if (isTestTemplate(template)) return getTestWeddingDraft();

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
      const maxSize = 900;
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.74));
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
    const files = Array.from(event.target.files || []).slice(0, 10);
    if (!files.length) return;

    const images = await Promise.all(files.map(fileToGalleryImage));
    setDraft((current) => {
      const gallery = uniqueImages([...images, ...(current.gallery || [])]).slice(0, 12);
      return { ...current, image: images[0], gallery };
    });
  };

  const selectImage = (image) => {
    setDraft((current) => ({ ...current, image }));
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

  const isTest = isTestTemplate(template);
  const image = draft?.image || template.mainImage || template.gallery?.[0];
  const formattedDate = draft?.eventDate ? new Date(draft.eventDate).toLocaleDateString() : previewDate.toLocaleDateString();

  return (
    <main className={isTest ? 'template-live-page test-wedding-page' : 'template-live-page'}>
      {isTest ? (
        <>
          <TestWeddingLivePreview
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
        <section className="demo-editor-panel" aria-label="Edit invitation">
          <form className="demo-editor-form" onSubmit={saveDraft}>
            <div className="demo-editor-title">
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
            <label className="demo-editor-wide">
              Հրավերի տեքստ
              <textarea name="eventMessage" rows="4" value={draft.eventMessage} onChange={updateDraft} required />
            </label>
            {draft.gallery?.length > 0 && (
              <div className="demo-gallery-picker">
                <span>Նկարները</span>
                <div>
                  {draft.gallery.map((galleryImage, index) => (
                    <button
                      key={`${galleryImage.slice(0, 48)}-${index}`}
                      type="button"
                      className={galleryImage === draft.image ? 'is-selected' : ''}
                      onClick={() => selectImage(galleryImage)}
                    >
                      <img src={galleryImage} alt={`Template ${index + 1}`} />
                    </button>
                  ))}
                </div>
              </div>
            )}
            <label className="demo-upload-field">
              <ImagePlus size={20} />
              <span>Ավելացնել նկար</span>
              <input type="file" accept="image/*" multiple onChange={updateImages} />
            </label>

            <button className="demo-save-btn" type="submit">Ցուցադրել թարմացված հրավերը</button>
          </form>
        </section>
      )}
    </main>
  );
}
