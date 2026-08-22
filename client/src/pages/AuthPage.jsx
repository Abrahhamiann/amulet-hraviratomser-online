import React, { useEffect, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Check, LogIn, Mail, Phone, ShieldCheck, UserPlus, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import questioningWarningAnimation from '../assets/animations/questioning-warning.lottie?url';
import Loading from '../components/Loading.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { startStripeCheckout } from '../utils/checkout.js';
import { getApiErrorKey, getLocalizedApiError } from '../utils/apiErrors.js';

import { GOOGLE_CLIENT_ID as googleClientId } from '../config/env.js';

const GOOGLE_SCRIPT_ID = 'google-identity-services';
let googleScriptPromise;

const sanitizePhoneInput = (value) => {
  const rawValue = String(value || '');
  const prefix = rawValue.trimStart().startsWith('+') ? '+' : '';
  return `${prefix}${rawValue.replace(/\D/g, '')}`.slice(0, 16);
};

const loadGoogleIdentity = () => {
  if (window.google?.accounts?.id) return Promise.resolve(window.google.accounts.id);
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    let script = document.getElementById(GOOGLE_SCRIPT_ID)
      || document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    const timeoutId = window.setTimeout(() => handleError(), 12_000);
    const cleanup = () => {
      window.clearTimeout(timeoutId);
      script?.removeEventListener('load', handleLoad);
      script?.removeEventListener('error', handleError);
    };
    const handleLoad = () => {
      cleanup();
      if (script) script.dataset.loaded = 'true';
      if (window.google?.accounts?.id) resolve(window.google.accounts.id);
      else reject(new Error('Google Identity Services is unavailable'));
    };
    const handleError = () => {
      cleanup();
      script?.remove();
      reject(new Error('Google Identity Services failed to load'));
    };

    if (!script) {
      script = document.createElement('script');
      script.id = GOOGLE_SCRIPT_ID;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });
    if (script.dataset.loaded === 'true') handleLoad();
  }).catch((error) => {
    googleScriptPromise = undefined;
    throw error;
  });

  return googleScriptPromise;
};

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { initialized, setAuthenticatedUser, user } = useAuth();
  const { t } = useLanguage();
  const googleRef = useRef(null);
  const googleButtonRef = useRef(null);
  const emailInputRef = useRef(null);
  const identifierInputRef = useRef(null);
  const existingEmailLoginRef = useRef(null);
  const codeRefs = useRef([]);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', identifier: '', password: '', confirmPassword: '' });
  const [verificationEmail, setVerificationEmail] = useState('');
  const [code, setCode] = useState(Array(6).fill(''));
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [existingEmailWarningOpen, setExistingEmailWarningOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [googleStatus, setGoogleStatus] = useState(googleClientId ? 'loading' : 'missing');
  const [googleLoadAttempt, setGoogleLoadAttempt] = useState(0);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const requestedPath = typeof location.state?.returnTo === 'string'
    && location.state.returnTo.startsWith('/')
    && !location.state.returnTo.startsWith('//')
    ? location.state.returnTo
    : '/';
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
    navigate(requestedPath, { replace: true });
  };

  useEffect(() => {
    if (!googleClientId || !googleRef.current || !googleButtonRef.current) return undefined;
    let cancelled = false;
    let resizeObserver;
    let renderFrame = 0;
    let scheduleRender = () => {};
    setGoogleStatus('loading');
    loadGoogleIdentity().then(() => {
      if (cancelled || !window.google?.accounts?.id || !googleRef.current || !googleButtonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async ({ credential }) => {
          try {
            setError(''); setBusy(true);
            const { data } = await api.post('/auth/google', { idToken: credential });
            saveSession(data);
          } catch (err) { setError(getLocalizedApiError(err, t, { fallbackKey: 'authGoogleFailed' })); }
          finally { setBusy(false); }
        }
      });
      let renderedWidth = 0;
      const renderGoogleButton = () => {
        const slot = googleRef.current;
        const button = googleButtonRef.current;
        if (cancelled || !slot || !button) return;
        const availableWidth = Math.floor(slot.getBoundingClientRect().width);
        if (availableWidth < 1) return;
        const width = Math.min(400, availableWidth);
        if (width === renderedWidth && button.querySelector('iframe')) return;
        renderedWidth = width;
        button.replaceChildren();
        window.google.accounts.id.renderButton(button, {
          theme: 'outline', size: 'large', shape: 'pill', text: mode === 'register' ? 'signup_with' : 'signin_with',
          width
        });
        setGoogleStatus('ready');
      };
      scheduleRender = () => {
        window.cancelAnimationFrame(renderFrame);
        renderFrame = window.requestAnimationFrame(renderGoogleButton);
      };
      renderGoogleButton();
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(scheduleRender);
        resizeObserver.observe(googleRef.current);
      }
      window.addEventListener('resize', scheduleRender);
      document.fonts?.ready?.then(scheduleRender);
    }).catch(() => {
      if (!cancelled) setGoogleStatus('error');
    });
    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      window.removeEventListener('resize', scheduleRender);
      window.cancelAnimationFrame(renderFrame);
    };
  }, [mode, googleLoadAttempt, initialized]);

  useEffect(() => {
    if (!existingEmailWarningOpen) return undefined;
    existingEmailLoginRef.current?.focus();
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setExistingEmailWarningOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [existingEmailWarningOpen]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const changeMode = (nextMode) => { setMode(nextMode); setError(''); setStatus(''); };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true); setError(''); setStatus('');
    try {
      if (mode === 'register') {
        if (!Object.values(passwordChecks).every(Boolean)) throw new Error(t('authPasswordRulesError'));
        if (form.password !== form.confirmPassword) throw new Error(t('authPasswordsMismatch'));
        const { data } = await api.post('/auth/register', form, { timeout: 25_000 });
        setVerificationEmail(data.email);
        setCode(Array(6).fill(''));
        setStatus(t('authCodeSent'));
        window.setTimeout(() => codeRefs.current[0]?.focus(), 120);
        return;
      }
      const { data } = await api.post('/auth/login', { identifier: form.identifier, password: form.password });
      saveSession(data);
    } catch (err) {
      if (mode === 'register' && getApiErrorKey(err) === 'authAccountExists') {
        setExistingEmailWarningOpen(true);
      } else {
        setError(getLocalizedApiError(err, t, { networkKey: 'authRequestFailed' }));
      }
    }
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
    } catch (err) { setError(getLocalizedApiError(err, t, { fallbackKey: 'authCodeWrong' })); }
    finally { setBusy(false); }
  };

  if (!initialized) return <Loading text={t('loading')} />;
  if (user) return <Navigate to={requestedPath} replace />;

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
            <form className="auth-form" onSubmit={submit} noValidate>
              {mode === 'register' && <label><span>{t('contactName')}</span><input autoComplete="name" value={form.name} onChange={(event) => update('name', event.target.value)} placeholder={t('authNamePlaceholder')} required /></label>}
              {mode === 'register' ? (
                <>
                  <label><span>Email</span><input ref={emailInputRef} type="email" autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} required /></label>
                  <label><span>{t('phone')}</span><div className="auth-input-icon"><Phone size={17} /><input type="tel" inputMode="tel" pattern="[+]?[0-9]*" maxLength={16} autoComplete="tel" value={form.phone} onChange={(event) => update('phone', sanitizePhoneInput(event.target.value))} required /></div></label>
                </>
              ) : <label><span>{t('authIdentifier')}</span><input ref={identifierInputRef} autoComplete="username" value={form.identifier} onChange={(event) => update('identifier', event.target.value)} required /></label>}
              <label><span>{t('password')}</span><input type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={form.password} onChange={(event) => update('password', event.target.value)} required minLength={8} maxLength={128} /></label>
              {mode === 'register' && (
                <>
                  <label><span>{t('authRepeatPassword')}</span><input type="password" autoComplete="new-password" value={form.confirmPassword} onChange={(event) => update('confirmPassword', event.target.value)} required minLength={8} maxLength={128} /></label>
                  <PasswordRequirements checks={passwordChecks} t={t} />
                </>
              )}
              {mode === 'login' && <Link className="auth-forgot-link" to="/forgot-password">{t('authForgotPassword')}</Link>}
              <button className="auth-submit" type="submit" disabled={busy}>{mode === 'register' ? <UserPlus size={18} /> : <LogIn size={18} />}<span>{busy ? t('authWait') : mode === 'register' ? t('authRegister') : t('login')}</span></button>
            </form>
            <div className="auth-divider"><span>{t('authOr')}</span></div>
            <div className={`google-auth-slot is-${googleStatus}`} ref={googleRef}>
              <div className="google-auth-button" ref={googleButtonRef} />
              {googleStatus === 'missing' && <span>{t('authGoogleMissing')}</span>}
              {googleStatus === 'loading' && <span className="google-auth-loading" aria-live="polite">{t('authGoogleLoading')}</span>}
              {googleStatus === 'error' && <button className="google-auth-retry" type="button" onClick={() => setGoogleLoadAttempt((attempt) => attempt + 1)}>{t('authGoogleRetry')}</button>}
            </div>
          </>
        ) : (
          <form className={verificationComplete ? 'verification-form is-complete' : 'verification-form'} onSubmit={verifyCode} noValidate>
            <div className="verification-code-row" aria-label="Verification code">
              {code.map((digit, index) => <input key={index} ref={(element) => { codeRefs.current[index] = element; }} value={digit} inputMode="numeric" maxLength={1} onChange={(event) => updateCode(index, event.target.value)} onKeyDown={(event) => { if (event.key === 'Backspace' && !code[index] && index > 0) codeRefs.current[index - 1]?.focus(); }} disabled={verificationComplete} />)}
            </div>
            <button className="auth-submit" type="submit" disabled={busy || verificationComplete}><ShieldCheck size={18} /><span>{busy ? t('authChecking') : t('authConfirm')}</span></button>
          </form>
        )}
        {status && <p className="auth-status"><Mail size={16} /> {status}</p>}
        {error && <p className="auth-error" role="alert">{error}</p>}
      </div>
      {existingEmailWarningOpen && createPortal(
        <div
          className="auth-required-backdrop auth-existing-email-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setExistingEmailWarningOpen(false);
          }}
        >
          <section
            className="auth-required-modal auth-existing-email-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="existing-email-title"
            aria-describedby="existing-email-description"
          >
            <button
              className="auth-required-close"
              type="button"
              aria-label={t('close')}
              onClick={() => {
                setExistingEmailWarningOpen(false);
                window.setTimeout(() => emailInputRef.current?.focus(), 0);
              }}
            >
              <X size={20} />
            </button>
            <span className="auth-required-animation auth-existing-email-animation" aria-hidden="true">
              <DotLottieReact src={questioningWarningAnimation} autoplay={!prefersReducedMotion} loop={false} />
            </span>
            <h2 id="existing-email-title">{t('authExistingEmailTitle')}</h2>
            <p id="existing-email-description">{t('authExistingEmailText')}</p>
            <div className="auth-existing-email-actions">
              <button
                ref={existingEmailLoginRef}
                className="btn btn-primary auth-required-login"
                type="button"
                onClick={() => {
                  setForm((current) => ({ ...current, identifier: current.email }));
                  setExistingEmailWarningOpen(false);
                  changeMode('login');
                  window.setTimeout(() => identifierInputRef.current?.focus(), 0);
                }}
              >
                <LogIn size={18} />
                {t('login')}
              </button>
              <Link className="auth-existing-email-reset" to="/forgot-password" onClick={() => setExistingEmailWarningOpen(false)}>
                {t('authForgotPassword')}
              </Link>
            </div>
          </section>
        </div>,
        document.body
      )}
    </section>
  );
}

export function PasswordRequirements({ checks, t }) {
  const items = [['length', 'authPasswordLength'], ['uppercase', 'authPasswordUppercase'], ['lowercase', 'authPasswordLowercase'], ['number', 'authPasswordNumber'], ['special', 'authPasswordSpecial']];
  return <div className="password-requirements"><span>{t('authPasswordRules')}</span>{items.map(([key, label]) => <small className={checks[key] ? 'is-valid' : ''} key={key}>{checks[key] ? <Check size={14} /> : <X size={14} />}{t(label)}</small>)}</div>;
}
