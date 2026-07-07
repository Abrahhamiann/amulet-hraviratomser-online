import React from 'react';
import { CalendarPlus, MapPin, Share2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios.js';
import Button from '../components/Button.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Input from '../components/Input.jsx';
import Loading from '../components/Loading.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { required, toForm } from '../utils/forms.js';

export default function InvitationPage() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const [invitation, setInvitation] = useState(null);
  const [state, setState] = useState('loading');
  const [rsvpStatus, setRsvpStatus] = useState('');
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
    const data = toForm(event);
    const nextErrors = required(data, ['guestName', 'phone', 'status']);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setRsvpStatus('loading');
    try {
      await api.post(`/rsvp/${invitation._id}`, data);
      event.currentTarget.reset();
      setRsvpStatus('success');
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

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(invitation.names)}&dates=${new Date(invitation.date).toISOString().slice(0, 10).replaceAll('-', '')}/${new Date(invitation.date).toISOString().slice(0, 10).replaceAll('-', '')}&location=${encodeURIComponent(invitation.location)}`;

  return (
    <main className="invite-page">
      <section className="invite-card">
        <span className="eyebrow">{t(invitation.eventType) || invitation.eventType}</span>
        <h1>{invitation.names}</h1>
        <p>{invitation.message}</p>
        <div className="invite-date">{new Date(invitation.date).toLocaleDateString()} · {invitation.time}</div>
        <div className="countdown">{daysLeft} {t('daysToGo')}</div>
        <p>{invitation.location}</p>
        <div className="invite-actions">
          {invitation.mapLink && <Button to={invitation.mapLink} variant="secondary"><MapPin size={18} />{t('openMap')}</Button>}
          <Button type="button" onClick={share}><Share2 size={18} />{t('share')}</Button>
          <Button to={calendarUrl} variant="ghost"><CalendarPlus size={18} />{t('addCalendar')}</Button>
        </div>
      </section>
      <section className="invite-gallery">
        {invitation.gallery?.map((image, index) => <img key={index} src={image} alt={`${invitation.names} ${index + 1}`} />)}
      </section>
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
          <Button disabled={rsvpStatus === 'loading'}>{t('submit')}</Button>
          {rsvpStatus === 'success' && <p className="success">{t('rsvpSaved')}</p>}
        </form>
      </section>
    </main>
  );
}
