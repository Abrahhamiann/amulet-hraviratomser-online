import React from 'react';
import { CalendarDays, CalendarPlus, CheckCircle2, Clock, MapPin, Share2, Sparkles, X } from 'lucide-react';
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

const normalizeMapLinks = (invitation) => {
  const links = Array.isArray(invitation?.mapLinks) ? invitation.mapLinks : [];
  const normalized = links
    .map((item, index) => ({
      label: String(item?.label || `Քարտեզ ${index + 1}`).trim(),
      time: String(item?.time || '').trim(),
      address: String(item?.address || '').trim(),
      url: String(item?.url || '').trim()
    }))
    .filter((item) => item.label || item.time || item.address || item.url);

  if (invitation?.mapLink && !normalized.some((item) => item.url === invitation.mapLink)) {
    normalized.unshift({ label: 'Քարտեզ', url: invitation.mapLink });
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

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = toForm(event);
    const nextErrors = required(data, ['guestName', 'phone', 'status']);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setRsvpStatus('loading');
    try {
      await api.post(`/rsvp/${invitation._id}`, data);
      form.reset();
      setRsvpStatus('success');
      setSuccessOpen(true);
    } catch {
      setRsvpStatus('error');
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
  const calendarDate = eventDate.toISOString().slice(0, 10).replaceAll('-', '');
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(invitation.names)}&dates=${calendarDate}/${calendarDate}&location=${encodeURIComponent(invitation.location)}`;
  const heroImage = invitation.gallery?.[0];
  const secondaryGallery = invitation.gallery?.slice(1) || [];
  const occasionTemplate = getOccasionTemplate(invitation.templateId);
  const PublicView = occasionTemplate?.PublicView;
  const isBaptismTemplate = occasionTemplate?.key === 'baptism-blessing';
  const isEngagementTemplate = occasionTemplate?.key === 'engagement-serenade';
  const mapLinks = normalizeMapLinks(invitation);
  const mapActionLinks = mapLinks.filter((item) => item.url);
  const gallery = (invitation.gallery || []).filter((image) => {
    if (typeof image !== 'string' || !image.trim()) return false;
    if (!PublicView) return true;
    return isDisplayableImage(image);
  }).map(resolveTemplateImage);
  const rsvpForm = (
    <form className={`panel-form compact test-wedding-rsvp-form${isBaptismTemplate ? ' baptism-live-rsvp-form' : ''}${isEngagementTemplate ? ' engagement-live-rsvp-form' : ''}`} onSubmit={submit}>
      <fieldset className="rsvp-choice-group">
        <legend>{isBaptismTemplate ? 'Հյուրի կապը' : 'Հյուրի կողմը'}</legend>
        <label className="rsvp-radio"><input type="radio" name="guestSide" value="bride" defaultChecked /><span>{isBaptismTemplate ? 'Ընտանիքի հյուր' : 'Հարսի կողմ'}</span></label>
        <label className="rsvp-radio"><input type="radio" name="guestSide" value="groom" /><span>{isBaptismTemplate ? 'Կնքահոր / կնքամոր հյուր' : 'Փեսայի կողմ'}</span></label>
      </fieldset>
      <Input label={t('guestName')} name="guestName" error={errors.guestName} />
      <Input label={t('phone')} name="phone" type="tel" error={errors.phone} />
      <fieldset className="rsvp-choice-group">
        <legend>{t('attendance')}</legend>
        <label className="rsvp-radio"><input type="radio" name="status" value="attending" defaultChecked /><span>Սիրով կմասնակցենք</span></label>
        <label className="rsvp-radio"><input type="radio" name="status" value="declined" /><span>Ցավոք, չենք կարող ներկա լինել</span></label>
      </fieldset>
      <Input label={isBaptismTemplate ? 'Հյուրերի քանակ' : t('guestCount')} name="guestCount" type="number" min="1" defaultValue="1" />
      <Input label={isBaptismTemplate ? 'Հաղորդագրություն' : t('message')} name="message" as="textarea" rows="3" />
      <Button disabled={rsvpStatus === 'loading'}>{rsvpStatus === 'loading' ? t('loading') : t('submit')}</Button>
      {rsvpStatus === 'error' && <p className="form-error">{t('error')}</p>}
    </form>
  );
  const inviteActions = (
    <>
      {mapActionLinks.map((item, index) => (
        <Button key={`${item.url}-${index}`} to={item.url} variant="secondary">
          <MapPin size={18} />
          {item.label || t('openMap')}
        </Button>
      ))}
      <Button type="button" onClick={share}><Share2 size={18} />{t('share')}</Button>
      <Button to={calendarUrl} variant="ghost"><CalendarPlus size={18} />{t('addCalendar')}</Button>
    </>
  );
  const successModal = successOpen && (
    <div className="rsvp-success-backdrop" role="dialog" aria-modal="true" aria-labelledby="rsvp-success-title">
      <div className="rsvp-success-modal">
        <button type="button" onClick={() => setSuccessOpen(false)} aria-label="Close RSVP message"><X size={20} /></button>
        <CheckCircle2 size={44} />
        <h2 id="rsvp-success-title">Ձեր պատասխանը ուղարկվել է</h2>
        <p>Շնորհակալություն, հրավիրողը կտեսնի Ձեր անունը, հյուրերի քանակը և մեկնաբանությունը իր էջում։</p>
      </div>
    </div>
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
      colors: invitation.colors || undefined
    };

    return (
      <main className="invite-page test-wedding-page test-wedding-public-page">
        <PublicView
          draft={publicDraft}
          daysLeftText={`${daysLeft ?? 0} ${t('daysToGo')}`}
          actions={inviteActions}
          rsvpForm={rsvpForm}
        />
        {successModal}
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
            {mapActionLinks.map((item, index) => (
              <Button key={`${item.url}-${index}`} to={item.url} variant="secondary">
                <MapPin size={18} />
                {item.label || t('openMap')}
              </Button>
            ))}
            <Button type="button" onClick={share}><Share2 size={18} />{t('share')}</Button>
            <Button to={calendarUrl} variant="ghost"><CalendarPlus size={18} />{t('addCalendar')}</Button>
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
        <form className="panel-form compact" onSubmit={submit}>
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
            <button type="button" onClick={() => setSuccessOpen(false)} aria-label="Close RSVP message"><X size={20} /></button>
            <CheckCircle2 size={44} />
            <h2 id="rsvp-success-title">Ձեր պատասխանը ուղարկվել է</h2>
            <p>Շնորհակալություն, հրավիրողը կտեսնի ձեր անունը, հյուրերի քանակը և մեկնաբանությունը իր էջում։</p>
          </div>
        </div>
      )}
    </main>
  );
}
