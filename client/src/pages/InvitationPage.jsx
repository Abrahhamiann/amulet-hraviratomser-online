import { CalendarDays, CheckCircle2, Clock, MapPin, Share2, Sparkles, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios.js';
import Button from '../components/Button.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Input from '../components/Input.jsx';
import Loading from '../components/Loading.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getOccasionTemplate } from '../occasionTemplates/index.jsx';
import { resolveTemplateImage } from '../occasionTemplates/templateAssets.js';
import { required, toForm } from '../utils/forms.js';

const isDisplayableImage = (image) => /^(https?:\/\/|data:image\/|\/|asset:)/.test(image);

const normalizeMapLinks = (invitation, mapLabel) => {
  const links = Array.isArray(invitation?.mapLinks) ? invitation.mapLinks : [];
  const normalized = links
    .map((item, index) => ({
      label: String(item?.label || `${mapLabel} ${index + 1}`).trim(),
      time: String(item?.time || '').trim(),
      address: String(item?.address || '').trim(),
      url: String(item?.url || '').trim()
    }))
    .filter((item) => item.label || item.time || item.address || item.url);

  if (invitation?.mapLink && !normalized.some((item) => item.url === invitation.mapLink)) {
    normalized.unshift({ label: mapLabel, url: invitation.mapLink });
  }

  return normalized;
};

export default function InvitationPage() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const [invitation, setInvitation] = useState(null);
  const [state, setState] = useState('loading');
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get(`/invitations/${slug}`).then(({ data }) => {
      setInvitation(data);
      setState('ready');
    }).catch(() => setState('error'));
  }, [slug]);

  const daysLeft = useMemo(() => {
    if (!invitation?.date) return null;
    return Math.max(0, Math.ceil((new Date(invitation.date) - new Date()) / 86400000));
  }, [invitation]);

  const submitRsvp = async (data) => {
    // All invitation templates converge here. Keep the API payload stable even
    // when an optional control is not rendered and a template passes null.
    const normalizedData = {
      guestName: String(data?.guestName ?? '').trim(),
      phone: String(data?.phone ?? '').trim(),
      status: String(data?.status ?? '').trim(),
      guestSide: ['bride', 'groom', 'other'].includes(data?.guestSide) ? data.guestSide : 'other',
      guestCount: Number.isFinite(Number(data?.guestCount)) ? Number(data.guestCount) : 1,
      message: String(data?.message ?? '').trim()
    };
    const nextErrors = required(normalizedData, ['guestName', 'status'], t('validationRequired'));
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) throw new Error('Missing RSVP fields');
    setRsvpStatus('loading');
    try {
      const response = await api.post(`/rsvp/${invitation._id}`, normalizedData);
      setRsvpStatus('success');
      return response.data;
    } catch (error) {
      setRsvpStatus('error');
      throw error;
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      await submitRsvp(toForm(event));
      form.reset();
      setSuccessOpen(true);
    } catch {
      // The form keeps its values and renders the validation/request error.
    }
  };

  const share = () => {
    const url = window.location.href;
    if (navigator.share) navigator.share({ title: invitation.names, url });
    else navigator.clipboard.writeText(url);
  };

  if (state === 'loading') return <Loading text={t('loading')} />;
  if (state === 'error') return <ErrorState text={t('error')} />;

  const eventDate = new Date(invitation.date);
  const heroImage = invitation.gallery?.[0];
  const secondaryGallery = invitation.gallery?.slice(1) || [];
  const occasionTemplate = getOccasionTemplate(invitation.templateId);
  const PublicView = occasionTemplate?.PublicView;
  const mapLinks = normalizeMapLinks(invitation, t('map'));
  const gallery = (invitation.gallery || []).filter((image) => {
    if (typeof image !== 'string' || !image.trim()) return false;
    if (!PublicView) return true;
    return isDisplayableImage(image);
  }).map(resolveTemplateImage);
  const inviteActions = (
    <Button type="button" onClick={share}><Share2 size={18} />{t('share')}</Button>
  );
  if (PublicView) {
    const publicDraft = {
      mainNames: invitation.names,
      eventDate: eventDate.toISOString().slice(0, 10),
      eventTime: invitation.time,
      eventLocation: invitation.location,
      mapLink: mapLinks[0]?.url || '',
      mapLinks,
      eventMessage: invitation.message,
      image: gallery[0] || '',
      gallery,
      colors: invitation.colors || undefined,
      colorPaletteId: invitation.colorPaletteId || '',
      ...(invitation.customization || {})
    };

    return (
      <main className="invite-page test-wedding-page test-wedding-public-page">
        <PublicView
          draft={publicDraft}
          daysLeftText={`${daysLeft ?? 0} ${t('daysToGo')}`}
          actions={inviteActions}
          onRsvpSubmit={submitRsvp}
        />
      </main>
    );
  }

  return (
    <main className="invite-page">
      <article className="invite-template-card">
        <section className="invite-template-hero">
          {heroImage && <img src={heroImage} alt={invitation.names} />}
          <div className="invite-template-scrim" />
          <div className="invite-template-copy">
            <span><Sparkles size={16} /> {t(invitation.eventType) || invitation.eventType}</span>
            <h1>{invitation.names}</h1>
            <p>{invitation.message}</p>
          </div>
        </section>

        <section className="invite-template-details">
          <div><CalendarDays size={20} /><span>{eventDate.toLocaleDateString()}</span></div>
          <div><Clock size={20} /><span>{invitation.time}</span></div>
          <div><MapPin size={20} /><span>{invitation.location}</span></div>
        </section>

        <section className="invite-template-footer">
          <div>
            <span>{daysLeft} {t('daysToGo')}</span>
            <strong>{invitation.location}</strong>
          </div>
          <div className="invite-actions">
            {inviteActions}
          </div>
        </section>
      </article>

      {secondaryGallery.length > 0 && (
        <section className="invite-gallery">
          {secondaryGallery.map((image, index) => <img key={index} src={image} alt={`${invitation.names} ${index + 2}`} />)}
        </section>
      )}

      <section className="rsvp-panel">
        <h2>{t('rsvp')}</h2>
        <form className="panel-form compact" onSubmit={submit} noValidate>
          <Input label={t('guestName')} name="guestName" error={errors.guestName} />
          <Input label={t('phone')} name="phone" type="tel" error={errors.phone} />
          <Input label={t('attendance')} name="status" as="select" error={errors.status}>
            <option value="">-</option>
            <option value="attending">{t('attending')}</option>
            <option value="declined">{t('declined')}</option>
            <option value="unsure">{t('unsure')}</option>
          </Input>
          <Input label={t('guestCount')} name="guestCount" type="number" min="1" defaultValue="1" />
          <Input label={t('message')} name="message" as="textarea" rows="3" />
          <Button disabled={rsvpStatus === 'loading'}>{rsvpStatus === 'loading' ? t('loading') : t('submit')}</Button>
          {rsvpStatus === 'error' && <p className="form-error">{t('error')}</p>}
        </form>
      </section>

      {successOpen && (
        <div className="rsvp-success-backdrop" role="dialog" aria-modal="true" aria-labelledby="rsvp-success-title">
          <div className="rsvp-success-modal">
            <button type="button" onClick={() => setSuccessOpen(false)} aria-label={t('close')}><X size={20} /></button>
            <CheckCircle2 size={44} />
            <h2 id="rsvp-success-title">{t('rsvpSentTitle')}</h2>
            <p>{t('rsvpSentText')}</p>
          </div>
        </div>
      )}
    </main>
  );
}
