import React from 'react';
import { LogIn, Mail, ShieldCheck, UserPlus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useLanguage } from '../context/LanguageContext.jsx';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function AuthPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const googleRef = useRef(null);
  const codeRefs = useRef([]);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [verificationEmail, setVerificationEmail] = useState('');
  const [code, setCode] = useState(Array(6).fill(''));
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const saveSession = ({ token, user }) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    window.dispatchEvent(new Event('amulet-auth-change'));
    navigate('/');
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
    loadGoogle().then(() => {
      if (cancelled || !window.google?.accounts?.id || !googleRef.current) return;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async ({ credential }) => {
          try {
            setError('');
            setBusy(true);
            const { data } = await api.post('/auth/google', { idToken: credential });
            saveSession(data);
          } catch (err) {
            setError(err.response?.data?.message || 'Google sign-in failed');
          } finally {
            setBusy(false);
          }
        }
      });
      googleRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text: mode === 'register' ? 'signup_with' : 'signin_with',
        width: Math.min(Math.max(googleRef.current.offsetWidth || 320, 240), 400)
      });
    });

    return () => {
      cancelled = true;
    };
  }, [mode]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setStatus('');

    try {
      if (mode === 'register') {
        const { data } = await api.post('/auth/register', form);
        setVerificationEmail(data.email);
        setCode(Array(6).fill(''));
        setStatus(t('authCodeSent'));
        window.setTimeout(() => codeRefs.current[0]?.focus(), 120);
        return;
      }

      const { data } = await api.post('/auth/login', {
        email: form.email,
        password: form.password
      });
      saveSession(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  const updateCode = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setCode((current) => {
      const next = [...current];
      next[index] = digit;
      return next;
    });
    if (digit && index < 5) codeRefs.current[index + 1]?.focus();
  };

  const handleCodeKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) codeRefs.current[index - 1]?.focus();
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    const joinedCode = code.join('');
    if (joinedCode.length !== 6) {
      setError(t('authCodeLength'));
      return;
    }

    try {
      setBusy(true);
      setError('');
      const { data } = await api.post('/auth/verify-email', {
        email: verificationEmail,
        code: joinedCode
      });
      setVerificationComplete(true);
      window.setTimeout(() => saveSession(data), 900);
    } catch (err) {
      const message = err.response?.data?.message;
      setError(message === 'Verification code is incorrect' ? t('authCodeWrong') : message || t('authCodeWrong'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <div className="auth-brand">
          {verificationEmail ? <Mail size={24} /> : <ShieldCheck size={24} />}
          <h1>{verificationEmail ? t('authVerifyTitle') : t('login')}</h1>
          <p>{verificationEmail ? t('authVerifyIntro').replace('{email}', verificationEmail) : t('authIntro')}</p>
        </div>

        {!verificationEmail ? (
          <>
            <div className="auth-tabs">
              <button type="button" className={mode === 'login' ? 'is-active' : ''} onClick={() => setMode('login')}><LogIn size={16} />{t('login')}</button>
              <button type="button" className={mode === 'register' ? 'is-active' : ''} onClick={() => setMode('register')}><UserPlus size={16} />{t('authRegister')}</button>
            </div>

            <form className="auth-form" onSubmit={submit}>
              {mode === 'register' && (
                <label>
                  <span>{t('contactName')}</span>
                  <input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder={t('authNamePlaceholder')} />
                </label>
              )}
              <label>
                <span>Email</span>
                <input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="name@example.com" required />
              </label>
              <label>
                <span>Password</span>
                <input type="password" value={form.password} onChange={(event) => update('password', event.target.value)} placeholder="••••••••" required minLength={6} />
              </label>
              <button className="auth-submit" type="submit" disabled={busy}>
                {mode === 'register' ? <UserPlus size={18} /> : <LogIn size={18} />}
                <span>{busy ? t('authWait') : mode === 'register' ? t('authCreateAccount') : t('authSignIn')}</span>
              </button>
            </form>

            <div className="auth-divider"><span>{t('authOr')}</span></div>
            <div className="google-auth-slot" ref={googleRef}>
              {!googleClientId && <span>{t('authGoogleMissing')}</span>}
            </div>
          </>
        ) : (
          <form className={verificationComplete ? 'verification-form is-complete' : 'verification-form'} onSubmit={verifyCode}>
            <div className="verification-code-row" aria-label="Verification code">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => { codeRefs.current[index] = element; }}
                  value={digit}
                  inputMode="numeric"
                  maxLength={1}
                  onChange={(event) => updateCode(index, event.target.value)}
                  onKeyDown={(event) => handleCodeKeyDown(index, event)}
                  disabled={verificationComplete}
                />
              ))}
            </div>
            <button className="auth-submit" type="submit" disabled={busy || verificationComplete}>
              <ShieldCheck size={18} />
              <span>{busy ? t('authChecking') : t('authConfirm')}</span>
            </button>
          </form>
        )}

        {status && <p className="auth-status"><Mail size={16} /> {status}</p>}
        {error && <p className="auth-error">{error}</p>}
      </div>
    </section>
  );
}
