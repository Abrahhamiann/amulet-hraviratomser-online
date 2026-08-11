import React from 'react';
import { Check, CheckCircle2, Copy, Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import Loading from '../components/Loading.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { clearPurchasedPromo } from '../utils/promoStorage.js';

export default function PaymentSuccessPage() {
  const { t } = useLanguage();
  const { initialized, user } = useAuth();
  const [params] = useSearchParams();
  const [state, setState] = useState('loading');
  const [order, setOrder] = useState(null);
  const [copied, setCopied] = useState(false);
  const sessionId = params.get('session_id');

  useEffect(() => {
    if (!user || !sessionId) return undefined;

    api.post('/payments/confirm-checkout-session', { sessionId })
      .then(({ data }) => {
        const purchasedTemplateId = data?.templateId?._id || data?.templateId;
        clearPurchasedPromo(user, purchasedTemplateId);
        setOrder(data);
        setState('ready');
      })
      .catch(() => setState('error'));
  }, [sessionId, user]);

  if (!initialized) return <Loading text={t('loading')} />;
  if (!user) return <Navigate to="/login" replace />;
  if (state === 'loading') return <Loading text={t('loading')} />;

  const invitePath = order?.invitationId?.slug ? `/invite/${order.invitationId.slug}` : '/account';
  const invitationUrl = order?.invitationId?.slug ? `${window.location.origin}${invitePath}` : '';
  const qrUrl = invitationUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=14&data=${encodeURIComponent(invitationUrl)}` : '';
  const copyInvitationUrl = async () => {
    if (!invitationUrl) return;
    try {
      await navigator.clipboard.writeText(invitationUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt(t('copyInvitationLink'), invitationUrl);
    }
  };

  return (
    <main className="payment-success-page">
      <section className="payment-success-card">
        {state === 'ready' ? <CheckCircle2 size={42} /> : <Ticket size={42} />}
        <h1>{state === 'ready' ? t('paymentSuccessTitle') : t('paymentSuccessErrorTitle')}</h1>
        <p>{state === 'ready' ? t('paymentSuccessText') : t('paymentSuccessErrorText')}</p>
        {state === 'ready' && invitationUrl && (
          <div className="payment-success-invitation">
            <img src={qrUrl} alt={t('invitationQrCode')} width="168" height="168" />
            <div>
              <strong>{t('paymentInvitationLink')}</strong>
              <a href={invitationUrl}>{invitationUrl}</a>
              <button type="button" onClick={copyInvitationUrl} aria-label={t('copyInvitationLink')}>
                {copied ? <Check size={17} /> : <Copy size={17} />}
                <span>{t('copyInvitationLink')}</span>
              </button>
            </div>
          </div>
        )}
        <div className={state === 'ready' ? 'payment-success-actions is-ready' : 'payment-success-actions'}>
          {state === 'ready' && (
            <Link className="btn btn-primary" to={invitePath}>
              {t('accountViewInvitation')}
            </Link>
          )}
          <Link className="btn btn-ghost" to="/account">{t('accountTitle')}</Link>
        </div>
      </section>
    </main>
  );
}
