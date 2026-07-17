import React from 'react';
import { CheckCircle2, ExternalLink, Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import Loading from '../components/Loading.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function PaymentSuccessPage() {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const [state, setState] = useState('loading');
  const [order, setOrder] = useState(null);
  const token = localStorage.getItem('userToken');
  const sessionId = params.get('session_id');

  useEffect(() => {
    if (!token || !sessionId) return undefined;

    api.post('/payments/confirm-checkout-session', { sessionId })
      .then(({ data }) => {
        setOrder(data);
        setState('ready');
      })
      .catch(() => setState('error'));
  }, [sessionId, token]);

  if (!token) return <Navigate to="/login" replace />;
  if (state === 'loading') return <Loading text={t('loading')} />;

  const invitePath = order?.invitationId?.slug ? `/invite/${order.invitationId.slug}` : '/account';

  return (
    <main className="payment-success-page">
      <section className="payment-success-card">
        {state === 'ready' ? <CheckCircle2 size={42} /> : <Ticket size={42} />}
        <h1>{state === 'ready' ? t('paymentSuccessTitle') : t('paymentSuccessErrorTitle')}</h1>
        <p>{state === 'ready' ? t('paymentSuccessText') : t('paymentSuccessErrorText')}</p>
        <div className="payment-success-actions">
          {state === 'ready' && (
            <Link className="btn btn-primary" to={invitePath}>
              <ExternalLink size={18} />
              {t('accountViewInvitation')}
            </Link>
          )}
          <Link className="btn btn-ghost" to="/account">{t('accountTitle')}</Link>
        </div>
      </section>
    </main>
  );
}
