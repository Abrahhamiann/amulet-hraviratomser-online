import React from 'react';
import { LogOut, Ticket } from 'lucide-react';
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
