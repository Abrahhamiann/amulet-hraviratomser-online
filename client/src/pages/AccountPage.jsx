import React from 'react';
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  HelpCircle,
  LogOut,
  MapPin,
  MessageSquare,
  Ticket,
  Users,
  XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useLanguage } from '../context/LanguageContext.jsx';

const normalizeKey = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/[_\s]+/g, '-')
  .replace(/[^a-z0-9-]/g, '');

const isBaptismOrder = (order) => {
  const values = [
    order?.eventType,
    order?.templateId?.designKey,
    order?.templateId?.slug,
    order?.templateId?.title
  ].map(normalizeKey);

  return values.some((value) => value.includes('baptism'));
};

export default function AccountPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [rsvpsByInvitation, setRsvpsByInvitation] = useState({});
  const [expandedRsvps, setExpandedRsvps] = useState({});
  const [state, setState] = useState('loading');
  const [logoutOpen, setLogoutOpen] = useState(false);
  const token = localStorage.getItem('userToken');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!token) return undefined;
    api.get('/orders/my/list')
      .then(async ({ data }) => {
        setOrders(data);
        const invitations = data
          .map((order) => order.invitationId)
          .filter((invitation) => invitation?._id);
        const rsvpEntries = await Promise.all(invitations.map(async (invitation) => {
          try {
            const response = await api.get(`/rsvp/my/${invitation._id}`);
            return [invitation._id, response.data];
          } catch {
            return [invitation._id, []];
          }
        }));
        setRsvpsByInvitation(Object.fromEntries(rsvpEntries));
        setState('ready');
      })
      .catch(() => setState('error'));
  }, [token]);

  if (!token) return <Navigate to="/login" replace />;

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('amulet-auth-change'));
    navigate('/login');
  };

  const statusInfo = {
    attending: { icon: CheckCircle2, label: t('attending') },
    declined: { icon: XCircle, label: t('declined') },
    unsure: { icon: HelpCircle, label: t('unsure') }
  };
  const getGuestSideLabel = (rsvp) => {
    const labels = rsvp.isBaptism
      ? { bride: 'Ընտանիքի հյուր', groom: 'Կնքահոր / կնքամոր հյուր', other: '' }
      : { bride: 'Հարսի կողմ', groom: 'Փեսայի կողմ', other: '' };
    return labels[rsvp.guestSide] || '';
  };
  const getOrderRsvps = (order) => {
    const invitation = order.invitationId;
    return (rsvpsByInvitation[invitation?._id] || []).map((rsvp) => ({
      ...rsvp,
      isBaptism: isBaptismOrder(order)
    }));
  };
  const getRsvpSummary = (items) => ({
    attending: items
      .filter((rsvp) => rsvp.status === 'attending')
      .reduce((total, rsvp) => total + Number(rsvp.guestCount || 1), 0),
    declined: items.filter((rsvp) => rsvp.status === 'declined').length,
    unsure: items.filter((rsvp) => rsvp.status === 'unsure').length
  });
  const formatEventDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('hy-AM', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  const getInvitationImage = (order) => (
    order?.templateId?.mainImage
    || order?.templateId?.gallery?.[0]
    || order?.invitationId?.gallery?.[0]
    || ''
  );
  const toggleRsvps = (orderId) => {
    setExpandedRsvps((current) => ({ ...current, [orderId]: !current[orderId] }));
  };

  return (
    <section className="account-page">
      <div className="account-heading">
        <Ticket size={28} />
        <h1>{t('accountTitle')}</h1>
        <p>{user?.name || user?.email}</p>
        <button className="account-logout-btn" type="button" onClick={() => setLogoutOpen(true)}>
          <LogOut size={18} />
          {t('accountLogout')}
        </button>
      </div>

      <div className="account-panel">
        <div className="account-panel-head">
          <div>
            <h2>{t('accountInvitations')}</h2>
            <p>Ձեր գնված հրավիրատոմսերը և հյուրերի պատասխանները</p>
          </div>
          {state === 'ready' && orders.length > 0 && <span>{orders.length}</span>}
        </div>

        {state === 'loading' && <p className="account-state-text">{t('loading')}</p>}
        {state === 'error' && <p className="account-state-text">{t('accountOrdersError')}</p>}
        {state === 'ready' && orders.length === 0 && <p className="account-state-text">{t('accountNoInvitations')}</p>}
        {state === 'ready' && orders.length > 0 && (
          <div className="account-invitation-list">
            {orders.map((order) => {
              const invitation = order.invitationId;
              const orderRsvps = getOrderRsvps(order);
              const summary = getRsvpSummary(orderRsvps);
              const imageSrc = getInvitationImage(order);
              const rsvpsOpen = Boolean(expandedRsvps[order._id]);
              const invitationCard = (
                <div className={invitation?.slug ? 'account-invitation-card' : 'account-invitation-card is-disabled'}>
                  <div className="account-invitation-preview" aria-hidden="true">
                    {imageSrc ? (
                      <img src={imageSrc} alt="" loading="lazy" />
                    ) : (
                      <span>{String(order.mainNames || t('accountInvitations')).charAt(0)}</span>
                    )}
                  </div>
                  <div className="account-invitation-copy">
                    <span>{t(order.eventType) || order.eventType}</span>
                    <strong>{order.mainNames}</strong>
                    <div>
                      <em><CalendarDays size={15} /> {formatEventDate(order.eventDate)}</em>
                      <em><Clock size={15} /> {order.eventTime}</em>
                    </div>
                    {order.eventLocation && <p><MapPin size={15} /> {order.eventLocation}</p>}
                    {invitation?.slug ? <small>{t('accountViewInvitation')}</small> : <small>Հրավերը դեռ պատրաստ չէ</small>}
                  </div>
                </div>
              );

              return (
                <article className="account-invitation-row" key={order._id}>
                  {invitation?.slug ? (
                    <Link className="account-invitation-link" to={`/invite/${invitation.slug}`} aria-label={`${t('accountViewInvitation')}: ${order.mainNames}`}>
                      {invitationCard}
                    </Link>
                  ) : (
                    invitationCard
                  )}

                  <div className="account-invitation-rsvps">
                    <div className="account-rsvp-head">
                      <h3>Հյուրերի պատասխանները</h3>
                      <button
                        className={rsvpsOpen ? 'account-rsvp-toggle is-open' : 'account-rsvp-toggle'}
                        type="button"
                        onClick={() => toggleRsvps(order._id)}
                        aria-expanded={rsvpsOpen}
                        aria-label="Բացել հյուրերի պատասխանները"
                      >
                        <span>{orderRsvps.length}</span>
                        <ChevronDown size={18} />
                      </button>
                    </div>
                    <div className="account-rsvp-summary">
                      <div>
                        <Users size={17} />
                        <span>Գալիս են</span>
                        <strong>{summary.attending}</strong>
                      </div>
                      <div>
                        <XCircle size={17} />
                        <span>Չեն գալիս</span>
                        <strong>{summary.declined}</strong>
                      </div>
                      <div>
                        <HelpCircle size={17} />
                        <span>Վստահ չեն</span>
                        <strong>{summary.unsure}</strong>
                      </div>
                    </div>

                    {orderRsvps.length === 0 && (
                      <p className="account-rsvp-empty">Դեռ հյուրերի պատասխաններ չկան։</p>
                    )}

                    {rsvpsOpen && orderRsvps.length > 0 && (
                      <div className="account-rsvp-list">
                        {orderRsvps.map((rsvp) => {
                          const info = statusInfo[rsvp.status] || statusInfo.unsure;
                          const StatusIcon = info.icon;

                          return (
                            <article className="account-rsvp-card" key={rsvp._id}>
                              <div>
                                <strong>{rsvp.guestName}</strong>
                                <span>{Number(rsvp.guestCount || 1)} հյուր</span>
                              </div>
                              <div className="account-rsvp-status">
                                <StatusIcon size={16} />
                                <span>{info.label}</span>
                              </div>
                              {getGuestSideLabel(rsvp) && <span>{getGuestSideLabel(rsvp)}</span>}
                              <span>{rsvp.phone}</span>
                              {rsvp.message && (
                                <p>
                                  <MessageSquare size={15} />
                                  {rsvp.message}
                                </p>
                              )}
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {logoutOpen && (
        <div className="account-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="logout-title">
          <div className="account-modal">
            <LogOut size={24} />
            <h2 id="logout-title">{t('accountLogoutTitle')}</h2>
            <p>{t('accountLogoutText')}</p>
            <div className="account-modal-actions">
              <button type="button" className="account-modal-secondary" onClick={() => setLogoutOpen(false)}>{t('accountStay')}</button>
              <button type="button" className="account-modal-primary" onClick={logout}>{t('accountLogoutConfirm')}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
