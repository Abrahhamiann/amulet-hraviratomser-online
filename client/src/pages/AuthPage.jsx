import React, { useEffect, useRef, useState } from 'react';
import { Check, LogIn, Mail, Phone, ShieldCheck, UserPlus, X } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import Loading from '../components/Loading.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { startStripeCheckout } from '../utils/checkout.js';

import { GOOGLE_CLIENT_ID as googleClientId } from '../config/env.js';

export default function AuthPage() {
  const navigate = useNavigate();
  const { initialized, setAuthenticatedUser, user } = useAuth();
  const { t } = useLanguage();
  const googleRef = useRef(null);
  const codeRefs = useRef([]);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', identifier: '', password: '', confirmPassword: '' });
  const [verificationEmail, setVerificationEmail] = useState('');
  const [code, setCode] = useState(Array(6).fill(''));
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const passwordChecks = {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    lowercase: /[a-z]/.test(form.password),
    number: /\d/.test(form.password),
    special: /[^A-Za-z0-9]/.test(form.password)
  };

  const saveSession = ({ user: nextUser }) => {
    setAuthenticatedUser(nextUser);
    const pendingTemplate = localStorage.getItem('amulet_pending_template');
    if (pendingTemplate) {
      const pendingDraft = localStorage.getItem('amulet_pending_draft');
      const pendingAction = localStorage.getItem('amulet_pending_action');
      const pendingPromo = localStorage.getItem('amulet_pending_promo');
      ['amulet_pending_template', 'amulet_pending_draft', 'amulet_pending_action', 'amulet_pending_promo'].forEach((key) => localStorage.removeItem(key));
      let parsedDraft = null;
      try { parsedDraft = pendingDraft ? JSON.parse(pendingDraft) : null; } catch { parsedDraft = null; }
      if (pendingAction === 'preview') {
        api.post('/previews', { templateId: pendingTemplate, draft: parsedDraft })
          .then(({ data }) => navigate(data.path, { replace: true }))
          .catch(() => navigate(`/templates/${pendingTemplate}/live`, { replace: true }));
        return;
      }
      if (pendingAction === 'buy') {
        api.post('/previews', { templateId: pendingTemplate, draft: parsedDraft })
          .then(({ data }) => navigate(`${data.path}?buy=1`, { replace: true }))
          .catch(() => navigate(`/templates/${pendingTemplate}/live?edit=1`, { replace: true }));
        return;
      }
      startStripeCheckout(pendingTemplate, parsedDraft, { promoCode: pendingPromo || '' }).catch(() => navigate(`/templates/${pendingTemplate}/live`, { replace: true }));
      return;
    }
    navigate('/', { replace: true });
  };

  useEffect(() => {
    if (!googleClientId || !googleRef.current) return undefined;
    const loadGoogle = () => new Promise((resolve) => {
      if (window.google?.accounts?.id) return resolve();
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      document.head.appendChild(script);
    });
    let cancelled = false;
    let resizeObserver;
    let renderFrame = 0;
    loadGoogle().then(() => {
      if (cancelled || !window.google?.accounts?.id || !googleRef.current) return;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async ({ credential }) => {
          try {
            setError(''); setBusy(true);
            const { data } = await api.post('/auth/google', { idToken: credential });
            saveSession(data);
          } catch (err) { setError(err.response?.data?.message || 'Google sign-in failed'); }
          finally { setBusy(false); }
        }
      });
      let renderedWidth = 0;
      const renderGoogleButton = () => {
        const slot = googleRef.current;
        if (cancelled || !slot) return;
        const availableWidth = Math.floor(slot.getBoundingClientRect().width);
        const width = Math.min(400, Math.max(200, availableWidth || 280));
        if (width === renderedWidth && slot.querySelector('iframe')) return;
        renderedWidth = width;
        slot.innerHTML = '';
        window.google.accounts.id.renderButton(slot, {
          theme: 'outline', size: 'large', shape: 'pill', text: mode === 'register' ? 'signup_with' : 'signin_with',
          width
        });
      };
      const scheduleRender = () => {
        window.cancelAnimationFrame(renderFrame);
        renderFrame = window.requestAnimationFrame(renderGoogleButton);
      };
      renderGoogleButton();
      resizeObserver = new ResizeObserver(scheduleRender);
      resizeObserver.observe(googleRef.current);
    });
    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      window.cancelAnimationFrame(renderFrame);
    };
  }, [mode]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const changeMode = (nextMode) => { setMode(nextMode); setError(''); setStatus(''); };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true); setError(''); setStatus('');
    try {
      if (mode === 'register') {
        if (!Object.values(passwordChecks).every(Boolean)) throw new Error(t('authPasswordRulesError'));
        if (form.password !== form.confirmPassword) throw new Error(t('authPasswordsMismatch'));
        const { data } = await api.post('/auth/register', form);
        setVerificationEmail(data.email);
        setCode(Array(6).fill(''));
        setStatus(t('authCodeSent'));
        window.setTimeout(() => codeRefs.current[0]?.focus(), 120);
        return;
      }
      const { data } = await api.post('/auth/login', { identifier: form.identifier, password: form.password });
      saveSession(data);
    } catch (err) { setError(err.response?.data?.message || err.message || t('error')); }
    finally { setBusy(false); }
  };

  const updateCode = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setCode((current) => current.map((item, itemIndex) => itemIndex === index ? digit : item));
    if (digit && index < 5) codeRefs.current[index + 1]?.focus();
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    if (code.join('').length !== 6) return setError(t('authCodeLength'));
    try {
      setBusy(true); setError('');
      const { data } = await api.post('/auth/verify-email', { email: verificationEmail, code: code.join('') });
      setVerificationComplete(true);
      window.setTimeout(() => saveSession(data), 900);
    } catch (err) { setError(err.response?.data?.message || t('authCodeWrong')); }
    finally { setBusy(false); }
  };

  if (!initialized) return <Loading text={t('loading')} />;
  if (user) return <Navigate to="/" replace />;

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <div className="auth-brand">
          {verificationEmail && <Mail size={24} aria-hidden="true" />}
          <h1>{verificationEmail ? t('authVerifyTitle') : mode === 'register' ? t('authRegister') : t('login')}</h1>
          <p>{verificationEmail ? t('authVerifyIntro').replace('{email}', verificationEmail) : t('authIntro')}</p>
        </div>
        {!verificationEmail ? (
          <>
            <div className="auth-tabs">
              <button type="button" aria-pressed={mode === 'login'} className={mode === 'login' ? 'is-active' : ''} onClick={() => changeMode('login')}><LogIn size={16} />{t('login')}</button>
              <button type="button" aria-pressed={mode === 'register'} className={mode === 'register' ? 'is-active' : ''} onClick={() => changeMode('register')}><UserPlus size={16} />{t('authRegister')}</button>
            </div>
            <form className="auth-form" onSubmit={submit}>
              {mode === 'register' && <label><span>{t('contactName')}</span><input autoComplete="name" value={form.name} onChange={(event) => update('name', event.target.value)} placeholder={t('authNamePlaceholder')} required /></label>}
              {mode === 'register' ? (
                <>
                  <label><span>Email</span><input type="email" autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} required /></label>
                  <label><span>{t('phone')}</span><div className="auth-input-icon"><Phone size={17} /><input type="tel" autoComplete="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} required /></div></label>
                </>
              ) : <label><span>{t('authIdentifier')}</span><input autoComplete="username" value={form.identifier} onChange={(event) => update('identifier', event.target.value)} required /></label>}
              <label><span>{t('password')}</span><input type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={form.password} onChange={(event) => update('password', event.target.value)} placeholder="••••••••" required minLength={8} maxLength={128} /></label>
              {mode === 'register' && (
                <>
                  <label><span>{t('authRepeatPassword')}</span><input type="password" autoComplete="new-password" value={form.confirmPassword} onChange={(event) => update('confirmPassword', event.target.value)} placeholder="••••••••" required minLength={8} maxLength={128} /></label>
                  <PasswordRequirements checks={passwordChecks} t={t} />
                </>
              )}
              {mode === 'login' && <Link className="auth-forgot-link" to="/forgot-password">{t('authForgotPassword')}</Link>}
              <button className="auth-submit" type="submit" disabled={busy}>{mode === 'register' ? <UserPlus size={18} /> : <LogIn size={18} />}<span>{busy ? t('authWait') : mode === 'register' ? t('authRegister') : t('login')}</span></button>
            </form>
            <div className="auth-divider"><span>{t('authOr')}</span></div>
            <div className="google-auth-slot" ref={googleRef}>{!googleClientId && <span>{t('authGoogleMissing')}</span>}</div>
          </>
        ) : (
          <form className={verificationComplete ? 'verification-form is-complete' : 'verification-form'} onSubmit={verifyCode}>
            <div className="verification-code-row" aria-label="Verification code">
              {code.map((digit, index) => <input key={index} ref={(element) => { codeRefs.current[index] = element; }} value={digit} inputMode="numeric" maxLength={1} onChange={(event) => updateCode(index, event.target.value)} onKeyDown={(event) => { if (event.key === 'Backspace' && !code[index] && index > 0) codeRefs.current[index - 1]?.focus(); }} disabled={verificationComplete} />)}
            </div>
            <button className="auth-submit" type="submit" disabled={busy || verificationComplete}><ShieldCheck size={18} /><span>{busy ? t('authChecking') : t('authConfirm')}</span></button>
          </form>
        )}
        {status && <p className="auth-status"><Mail size={16} /> {status}</p>}
        {error && <p className="auth-error">{error}</p>}
      </div>
    </section>
  );
}

export function PasswordRequirements({ checks, t }) {
  const items = [['length', 'authPasswordLength'], ['uppercase', 'authPasswordUppercase'], ['lowercase', 'authPasswordLowercase'], ['number', 'authPasswordNumber'], ['special', 'authPasswordSpecial']];
  return <div className="password-requirements"><span>{t('authPasswordRules')}</span>{items.map(([key, label]) => <small className={checks[key] ? 'is-valid' : ''} key={key}>{checks[key] ? <Check size={14} /> : <X size={14} />}{t(label)}</small>)}</div>;
}
