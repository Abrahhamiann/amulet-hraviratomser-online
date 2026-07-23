import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  HelpCircle,
  MapPin,
  MessageSquare,
  Phone,
  Users,
  XCircle
} from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import { resolveTemplateImage } from '../occasionTemplates/templateAssets.js';

const statusMeta = {
  attending: {
    label: 'Գալու է',
    icon: CheckCircle2
  },
  declined: {
    label: 'Չի գալու',
    icon: XCircle
  },
  unsure: {
    label: 'Դեռ վստահ չէ',
    icon: HelpCircle
  }
};

const formatDate = (value, withTime = false) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('hy-AM', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {})
  });
};

const normalizeKey = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/[_\s]+/g, '-')
  .replace(/[^a-z0-9-]/g, '');

const isBaptismInvitation = (invitation) => [
  invitation?.eventType,
  invitation?.templateId?.designKey,
  invitation?.templateId?.slug,
  invitation?.orderId?.templateId?.designKey,
  invitation?.orderId?.templateId?.slug
].map(normalizeKey).some((value) => value.includes('baptism'));

const getGuestSideLabel = (side, isBaptism) => {
  const labels = isBaptism
    ? { bride: 'Ընտանիքի հյուր', groom: 'Կնքահոր / կնքամոր հյուր', other: '' }
    : { bride: 'Հարսի կողմ', groom: 'Փեսայի կողմ', other: '' };

  return labels[side] || '';
};

export default function GuestResponsesPage() {
  const { invitationId } = useParams();
  const [state, setState] = useState('loading');
  const [details, setDetails] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    if (!token || !invitationId) return undefined;

    let mounted = true;
    api.get(`/rsvp/my/${invitationId}/details`)
      .then(({ data }) => {
        if (!mounted) return;
        setDetails(data);
        setState('ready');
      })
      .catch(() => {
        if (mounted) setState('error');
      });

    return () => {
      mounted = false;
    };
  }, [invitationId, token]);

  const rsvps = details?.rsvps || [];
  const invitation = details?.invitation;
  const template = invitation?.templateId || invitation?.orderId?.templateId;
  const isBaptism = isBaptismInvitation(invitation);
  const imageSrc = resolveTemplateImage(
    invitation?.gallery?.[0]
    || template?.mainImage
    || template?.gallery?.[0]
    || ''
  );

  const summary = useMemo(() => ({
    attending: rsvps
      .filter((rsvp) => rsvp.status === 'attending')
      .reduce((total, rsvp) => total + Number(rsvp.guestCount || 1), 0),
    declined: rsvps.filter((rsvp) => rsvp.status === 'declined').length,
    unsure: rsvps.filter((rsvp) => rsvp.status === 'unsure').length,
    responses: rsvps.length
  }), [rsvps]);

  const visibleRsvps = useMemo(() => (
    activeFilter === 'all'
      ? rsvps
      : rsvps.filter((rsvp) => rsvp.status === activeFilter)
  ), [activeFilter, rsvps]);

  if (!token) return <Navigate to="/login" replace />;

  return (
    <section className="guest-responses-page section page-top">
      <div className="guest-responses-shell">
        <Link className="guest-responses-back" to="/account">
          <ArrowLeft size={19} />
          Վերադառնալ իմ հրավիրատոմսերին
        </Link>

        {state === 'loading' && (
          <div className="guest-responses-state" role="status">
            <span className="guest-responses-loader" />
            <p>Բեռնվում են հյուրերի պատասխանները...</p>
          </div>
        )}

        {state === 'error' && (
          <div className="guest-responses-state is-error" role="alert">
            <XCircle size={34} />
            <h1>Չհաջողվեց բացել տվյալները</h1>
            <p>Խնդրում ենք թարմացնել էջը կամ վերադառնալ Profile։</p>
            <Link to="/account">Վերադառնալ Profile</Link>
          </div>
        )}

        {state === 'ready' && invitation && (
          <>
            <article className="guest-responses-hero">
              <div className="guest-responses-cover">
                {imageSrc ? (
                  <img src={imageSrc} alt={`${invitation.names} հրավիրատոմս`} />
                ) : (
                  <span>{String(invitation.names || 'A').charAt(0)}</span>
                )}
              </div>
              <div className="guest-responses-event">
                <span className="guest-responses-eyebrow">{template?.title || 'Հրավիրատոմս'}</span>
                <h1>{invitation.names}</h1>
                {invitation.message && <p>{invitation.message}</p>}
                <div className="guest-responses-event-meta">
                  <span><CalendarDays size={18} /> {formatDate(invitation.date)}</span>
                  <span><Clock size={18} /> {invitation.time}</span>
                  <span><MapPin size={18} /> {invitation.location}</span>
                </div>
                {invitation.slug && (
                  <Link className="guest-responses-invitation-link" to={`/invite/${invitation.slug}`}>
                    Դիտել հրավիրատոմսը
                    <ExternalLink size={17} />
                  </Link>
                )}
              </div>
            </article>

            <div className="guest-responses-heading">
              <div>
                <span>RSVP</span>
                <h2>Հյուրերի պատասխանները</h2>
                <p>Այստեղ հավաքված են հյուրերի մասնակցության բոլոր տվյալները։</p>
              </div>
              <strong>{summary.responses}</strong>
            </div>

            <div className="guest-responses-summary" aria-label="Հյուրերի պատասխանների ամփոփում">
              <article className="is-attending">
                <Users size={22} />
                <span>Գալիս են</span>
                <strong>{summary.attending}</strong>
                <small>ընդհանուր հյուր</small>
              </article>
              <article className="is-declined">
                <XCircle size={22} />
                <span>Չեն գալիս</span>
                <strong>{summary.declined}</strong>
                <small>պատասխան</small>
              </article>
              <article className="is-unsure">
                <HelpCircle size={22} />
                <span>Վստահ չեն</span>
                <strong>{summary.unsure}</strong>
                <small>պատասխան</small>
              </article>
              <article className="is-total">
                <MessageSquare size={22} />
                <span>Ընդհանուր</span>
                <strong>{summary.responses}</strong>
                <small>պատասխան</small>
              </article>
            </div>

            <div className="guest-responses-filters" role="group" aria-label="Ֆիլտրել պատասխանները">
              {[
                ['all', 'Բոլորը', summary.responses],
                ['attending', 'Գալու են', rsvps.filter((item) => item.status === 'attending').length],
                ['declined', 'Չեն գալու', summary.declined],
                ['unsure', 'Վստահ չեն', summary.unsure]
              ].map(([value, label, count]) => (
                <button
                  className={activeFilter === value ? 'is-active' : ''}
                  type="button"
                  key={value}
                  onClick={() => setActiveFilter(value)}
                  aria-pressed={activeFilter === value}
                >
                  {label}
                  <span>{count}</span>
                </button>
              ))}
            </div>

            {rsvps.length === 0 ? (
              <div className="guest-responses-empty">
                <Users size={34} />
                <h3>Դեռ պատասխաններ չկան</h3>
                <p>Հյուրերի պատասխանները կհայտնվեն այստեղ՝ լրացնելուց անմիջապես հետո։</p>
              </div>
            ) : visibleRsvps.length === 0 ? (
              <div className="guest-responses-empty">
                <h3>Այս խմբում պատասխաններ չկան</h3>
                <button type="button" onClick={() => setActiveFilter('all')}>Ցույց տալ բոլորը</button>
              </div>
            ) : (
              <div className="guest-response-grid">
                {visibleRsvps.map((rsvp) => {
                  const info = statusMeta[rsvp.status] || statusMeta.unsure;
                  const StatusIcon = info.icon;
                  const guestSide = getGuestSideLabel(rsvp.guestSide, isBaptism);

                  return (
                    <article className={`guest-response-card is-${rsvp.status || 'unsure'}`} key={rsvp._id}>
                      <div className="guest-response-card-head">
                        <span className="guest-response-avatar" aria-hidden="true">
                          {String(rsvp.guestName || 'Հ').trim().charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <h3>{rsvp.guestName}</h3>
                          <span>{formatDate(rsvp.createdAt, true)}</span>
                        </div>
                        <strong>
                          <StatusIcon size={16} />
                          {info.label}
                        </strong>
                      </div>

                      <div className="guest-response-details">
                        <span><Users size={17} /> {Number(rsvp.guestCount || 1)} հյուր</span>
                        {guestSide && <span><CheckCircle2 size={17} /> {guestSide}</span>}
                        <a href={`tel:${rsvp.phone}`}><Phone size={17} /> {rsvp.phone}</a>
                      </div>

                      {rsvp.message && (
                        <p>
                          <MessageSquare size={17} />
                          <span>{rsvp.message}</span>
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
