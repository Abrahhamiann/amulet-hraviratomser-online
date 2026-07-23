import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Clock,
  LogOut,
  MapPin,
  Trash2,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function AccountPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [state, setState] = useState('loading');
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteState, setDeleteState] = useState('idle');
  const [deleteError, setDeleteError] = useState('');
  const token = localStorage.getItem('userToken');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!token) return undefined;
    api.get('/orders/my/list')
      .then(({ data }) => {
        setOrders(data);
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
  const openDeleteModal = (order) => {
    setDeleteTarget(order);
    setDeleteState('idle');
    setDeleteError('');
  };
  const closeDeleteModal = () => {
    if (deleteState === 'loading') return;
    setDeleteTarget(null);
    setDeleteError('');
  };
  const deleteInvitationOrder = async () => {
    if (!deleteTarget?._id) return;
    setDeleteState('loading');
    setDeleteError('');
    try {
      await api.delete(`/orders/my/${deleteTarget._id}`);
      setOrders((current) => current.filter((order) => order._id !== deleteTarget._id));
      setDeleteTarget(null);
      setDeleteState('idle');
    } catch {
      setDeleteState('error');
      setDeleteError(t('accountDeleteError'));
    }
  };

  return (
    <section className="account-page">
      <div className="account-heading">
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
              const imageSrc = getInvitationImage(order);
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
                  <button
                    className="account-delete-invitation"
                    type="button"
                    onClick={() => openDeleteModal(order)}
                    aria-label={`${t('accountDeleteInvitation')}: ${order.mainNames}`}
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="account-invitation-main">
                    {invitation?.slug ? (
                      <Link className="account-invitation-link" to={`/invite/${invitation.slug}`} aria-label={`${t('accountViewInvitation')}: ${order.mainNames}`}>
                        {invitationCard}
                      </Link>
                    ) : (
                      invitationCard
                    )}

                    {invitation?._id && (
                      <Link
                        className="account-guest-responses-link"
                        to={`/account/invitations/${invitation._id}/responses`}
                        aria-label={`Հյուրերի պատասխանները՝ ${order.mainNames}`}
                      >
                        <span>
                          <Users size={20} />
                          <span>
                            <strong>Հյուրերի պատասխանները</strong>
                            <small>Դիտել անունները, մասնակցությունը և բոլոր տվյալները</small>
                          </span>
                        </span>
                        <ArrowRight size={20} />
                      </Link>
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

      {deleteTarget && (
        <div className="account-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="delete-invitation-title">
          <div className="account-modal account-delete-modal">
            <AlertTriangle size={26} />
            <h2 id="delete-invitation-title">{t('accountDeleteTitle')}</h2>
            <p>{t('accountDeleteText')}</p>
            <strong>{deleteTarget.mainNames}</strong>
            {deleteError && <span className="account-delete-error">{deleteError}</span>}
            <div className="account-modal-actions">
              <button type="button" className="account-modal-secondary" onClick={closeDeleteModal} disabled={deleteState === 'loading'}>{t('accountDeleteCancel')}</button>
              <button type="button" className="account-modal-primary account-modal-danger" onClick={deleteInvitationOrder} disabled={deleteState === 'loading'}>
                {deleteState === 'loading' ? t('loading') : t('accountDeleteConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
