import React from 'react';
import { CheckCircle2, HelpCircle, LogOut, MessageSquare, Ticket, Users, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function AccountPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [rsvpsByInvitation, setRsvpsByInvitation] = useState({});
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

  const allRsvps = orders.flatMap((order) => {
    const invitation = order.invitationId;
    return (rsvpsByInvitation[invitation?._id] || []).map((rsvp) => ({
      ...rsvp,
      invitationTitle: order.mainNames,
      invitationSlug: invitation?.slug
    }));
  });
  const attendingGuests = allRsvps
    .filter((rsvp) => rsvp.status === 'attending')
    .reduce((total, rsvp) => total + Number(rsvp.guestCount || 1), 0);
  const declinedGuests = allRsvps.filter((rsvp) => rsvp.status === 'declined').length;
  const unsureGuests = allRsvps.filter((rsvp) => rsvp.status === 'unsure').length;

  const statusInfo = {
    attending: { icon: CheckCircle2, label: t('attending') },
    declined: { icon: XCircle, label: t('declined') },
    unsure: { icon: HelpCircle, label: t('unsure') }
  };
  const guestSideLabels = {
    bride: 'Հարսի կողմ',
    groom: 'Փեսայի կողմ',
    other: ''
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
        <h2>{t('accountInvitations')}</h2>
        {state === 'loading' && <p>{t('loading')}</p>}
        {state === 'error' && <p>{t('accountOrdersError')}</p>}
        {state === 'ready' && orders.length === 0 && <p>{t('accountNoInvitations')}</p>}
        {state === 'ready' && orders.length > 0 && (
          <div className="account-order-list">
            {orders.map((order) => (
              <article className="account-order-card" key={order._id}>
                <strong>{order.mainNames}</strong>
                <span>{order.eventType}</span>
                <span>{new Date(order.eventDate).toLocaleDateString()}</span>
                {order.invitationId?.slug && <Link to={`/invite/${order.invitationId.slug}`}>{t('accountViewInvitation')}</Link>}
                {order.templateId && <Link to={`/templates/${order.templateId._id}/live`} target="_blank" rel="noreferrer">{t('accountViewDesign')}</Link>}
              </article>
            ))}
          </div>
        )}
      </div>

      {state === 'ready' && orders.length > 0 && (
        <div className="account-panel account-rsvp-panel">
          <h2>Հյուրերի պատասխաններ</h2>
          <div className="account-rsvp-summary">
            <div>
              <Users size={18} />
              <span>Գալիս են</span>
              <strong>{attendingGuests}</strong>
            </div>
            <div>
              <XCircle size={18} />
              <span>Չեն գալիս</span>
              <strong>{declinedGuests}</strong>
            </div>
            <div>
              <HelpCircle size={18} />
              <span>Վստահ չեն</span>
              <strong>{unsureGuests}</strong>
            </div>
          </div>

          {allRsvps.length === 0 ? (
            <p className="account-rsvp-empty">Դեռ հյուրերի պատասխաններ չկան։</p>
          ) : (
            <div className="account-rsvp-list">
              {allRsvps.map((rsvp) => {
                const info = statusInfo[rsvp.status] || statusInfo.unsure;
                const StatusIcon = info.icon;

                return (
                  <article className="account-rsvp-card" key={rsvp._id}>
                    <div>
                      <strong>{rsvp.guestName}</strong>
                      <span>{rsvp.invitationTitle}</span>
                    </div>
                    <div className="account-rsvp-status">
                      <StatusIcon size={17} />
                      <span>{info.label}</span>
                    </div>
                    <span>{Number(rsvp.guestCount || 1)} հյուր</span>
                    {guestSideLabels[rsvp.guestSide] && <span>{guestSideLabels[rsvp.guestSide]}</span>}
                    <span>{rsvp.phone}</span>
                    {rsvp.message && (
                      <p>
                        <MessageSquare size={16} />
                        {rsvp.message}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

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
