import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  LogOut,
  MapPin,
  RefreshCw,
  Send,
  Trash2,
  Unlink,
  Users,
  Wrench
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import telegramLogo from '../assets/telegram-logo.png';
import { useLanguage } from '../context/LanguageContext.jsx';
import { resolveTemplateImage } from '../occasionTemplates/templateAssets.js';

const localeByLanguage = {
  hy: 'hy-AM',
  en: 'en-US',
  ru: 'ru-RU',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT'
};

const getInvitationImages = (order) => [...new Set([
  ...(order?.invitationId?.gallery || []),
  order?.templateId?.mainImage,
  ...(order?.templateId?.gallery || [])
]
  .map(resolveTemplateImage)
  .filter((image) => typeof image === 'string' && image.trim()))];

function AccountInvitationPreview({ order, fallbackText }) {
  const [imageIndex, setImageIndex] = useState(0);
  const images = getInvitationImages(order);
  const imageSrc = images[imageIndex] || '';

  return (
    <div className="account-invitation-preview" aria-hidden="true">
      {imageSrc ? (
        <img
          key={imageSrc}
          src={imageSrc}
          alt=""
          loading="lazy"
          onError={() => setImageIndex((current) => current + 1)}
        />
      ) : (
        <span>{String(fallbackText || 'A').charAt(0)}</span>
      )}
    </div>
  );
}

export default function AccountPage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [state, setState] = useState('loading');
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteState, setDeleteState] = useState('idle');
  const [deleteError, setDeleteError] = useState('');
  const [telegramStatus, setTelegramStatus] = useState(null);
  const [telegramState, setTelegramState] = useState('loading');
  const [telegramError, setTelegramError] = useState('');
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

  const loadTelegramStatus = async ({ quiet = false } = {}) => {
    if (!token) return;
    if (!quiet) setTelegramState('loading');
    try {
      const { data } = await api.get('/telegram/status');
      setTelegramStatus(data);
      setTelegramState((current) => (current === 'linking' && !data.connected ? 'linking' : 'ready'));
      setTelegramError('');
    } catch {
      setTelegramState('error');
      setTelegramError(t('telegramStatusError'));
    }
  };

  useEffect(() => {
    loadTelegramStatus();
    const handleFocus = () => loadTelegramStatus({ quiet: true });
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [token, language]);

  useEffect(() => {
    if (telegramState !== 'linking') return undefined;
    const interval = window.setInterval(async () => {
      try {
        const { data } = await api.get('/telegram/status');
        setTelegramStatus(data);
        if (data.connected) {
          setTelegramState('ready');
          setTelegramError('');
        }
      } catch {
        // Keep the current linking state; focus refresh offers another recovery path.
      }
    }, 3000);
    const timeout = window.setTimeout(() => {
      setTelegramState('ready');
      setTelegramError(t('telegramLinkExpired'));
    }, 10 * 60 * 1000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [telegramState, language]);

  if (!token) return <Navigate to="/login" replace />;

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('amulet-auth-change'));
    navigate('/login');
  };

  const formatEventDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(localeByLanguage[language] || localeByLanguage.en, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
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
  const connectTelegram = async () => {
    setTelegramState('linking');
    setTelegramError('');
    const telegramWindow = window.open('about:blank', 'amulet-telegram-connect');
    try {
      const { data } = await api.post('/telegram/link', { language });
      if (telegramWindow) {
        telegramWindow.opener = null;
        telegramWindow.location.replace(data.botUrl);
      } else {
        window.location.assign(data.botUrl);
      }
    } catch {
      if (telegramWindow) telegramWindow.close();
      setTelegramState('error');
      setTelegramError(t('telegramConnectError'));
    }
  };
  const openTelegramBot = () => {
    if (telegramStatus?.botUrl) {
      window.open(telegramStatus.botUrl, '_blank', 'noopener,noreferrer');
    }
  };
  const disconnectTelegram = async () => {
    if (!window.confirm(t('telegramDisconnectConfirm'))) return;
    setTelegramState('disconnecting');
    setTelegramError('');
    try {
      await api.delete('/telegram/disconnect');
      await loadTelegramStatus({ quiet: true });
    } catch {
      setTelegramState('error');
      setTelegramError(t('telegramDisconnectError'));
    }
  };
  const telegramUnavailable = (
    telegramStatus?.configured === false
    || telegramStatus?.available === false
    || telegramState === 'error'
  );

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

      <section className={`account-telegram-connect${telegramStatus?.connected ? ' is-connected' : ''}${telegramUnavailable ? ' is-unavailable' : ''}`} aria-labelledby="telegram-connect-title">
        <img className="account-telegram-logo" src={telegramLogo} alt="Telegram" />
        <div className="account-telegram-copy">
          <span className="account-telegram-kicker">Telegram</span>
          <h2 id="telegram-connect-title">{t('telegramCardTitle')}</h2>
          <p>
            {telegramUnavailable
              ? t('telegramMaintenanceDescription')
              : telegramStatus?.connected
                ? t('telegramConnectedDescription')
                : t('telegramCardDescription')}
          </p>
          <span className={`account-telegram-status${telegramStatus?.connected ? ' is-connected' : ''}${telegramUnavailable ? ' is-unavailable' : ''}`} role="status">
            {telegramUnavailable ? (
              <>
                <Wrench size={16} />
                {t('telegramMaintenance')}
              </>
            ) : telegramState === 'loading' ? (
              <>
                <RefreshCw size={16} className="is-spinning" />
                {t('telegramChecking')}
              </>
            ) : telegramStatus?.connected ? (
              <>
                <CheckCircle2 size={16} />
                {t('telegramConnected')}
                {telegramStatus.displayName ? ` · ${telegramStatus.displayName}` : ''}
              </>
            ) : (
              <>
                <span className="account-telegram-status-dot" aria-hidden="true" />
                {t('telegramNotConnected')}
              </>
            )}
          </span>
          {telegramError && !telegramUnavailable && (
            <span className="account-telegram-error" role="alert">{telegramError}</span>
          )}
        </div>
        <div className="account-telegram-actions">
          {telegramUnavailable ? (
            <button className="account-telegram-secondary account-telegram-maintenance-btn" type="button" disabled>
              <Wrench size={17} />
              {t('telegramComingSoon')}
            </button>
          ) : telegramStatus?.connected ? (
            <>
              <button
                className="account-telegram-primary"
                type="button"
                onClick={openTelegramBot}
                disabled={!telegramStatus.botUrl || telegramState === 'disconnecting'}
              >
                <Send size={18} />
                {t('telegramOpenBot')}
              </button>
              <button
                className="account-telegram-secondary"
                type="button"
                onClick={disconnectTelegram}
                disabled={telegramState === 'disconnecting'}
              >
                {telegramState === 'disconnecting' ? <RefreshCw size={17} className="is-spinning" /> : <Unlink size={17} />}
                {telegramState === 'disconnecting' ? t('telegramDisconnecting') : t('telegramDisconnect')}
              </button>
            </>
          ) : (
            <button
              className="account-telegram-primary"
              type="button"
              onClick={connectTelegram}
              disabled={telegramState === 'loading' || telegramState === 'linking' || telegramStatus?.configured === false}
            >
              {telegramState === 'linking' ? <RefreshCw size={18} className="is-spinning" /> : <Send size={18} />}
              {telegramState === 'linking' ? t('telegramWaitingForStart') : t('telegramConnect')}
            </button>
          )}
        </div>
      </section>

      <div className="account-panel">
        <div className="account-panel-head">
          <div>
            <h2>{t('accountInvitations')}</h2>
            <p>{t('accountSubtitle')}</p>
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
              const invitationIdentifier = invitation?.slug || invitation?._id;
              const invitationHref = invitationIdentifier ? `/invite/${invitationIdentifier}` : '';
              const invitationCard = (
                <div className={invitationHref ? 'account-invitation-card' : 'account-invitation-card is-disabled'}>
                  <AccountInvitationPreview
                    order={order}
                    fallbackText={order.mainNames || t('accountInvitations')}
                  />
                  <div className="account-invitation-copy">
                    <span>{t(order.eventType) || order.eventType}</span>
                    <strong>{order.mainNames}</strong>
                    <div>
                      <em><CalendarDays size={15} /> {formatEventDate(order.eventDate)}</em>
                      <em><Clock size={15} /> {order.eventTime}</em>
                    </div>
                    {order.eventLocation && <p><MapPin size={15} /> {order.eventLocation}</p>}
                    {invitationHref
                      ? <small>{t('accountViewInvitation')}</small>
                      : <small>{t('accountInvitationPending')}</small>}
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
                    {invitationHref ? (
                      <Link className="account-invitation-link" to={invitationHref} aria-label={`${t('accountViewInvitation')}: ${order.mainNames}`}>
                        {invitationCard}
                      </Link>
                    ) : (
                      invitationCard
                    )}

                    {invitation?._id && (
                      <Link
                        className="account-guest-responses-link"
                        to={`/account/invitations/${invitation._id}/responses`}
                        aria-label={`${t('accountGuestResponses')}: ${order.mainNames}`}
                      >
                        <span>
                          <Users size={20} />
                          <span>
                            <strong>{t('accountGuestResponses')}</strong>
                            <small>{t('accountGuestResponsesDescription')}</small>
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
