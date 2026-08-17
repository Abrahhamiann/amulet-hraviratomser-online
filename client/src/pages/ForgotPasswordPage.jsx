import React, { useRef, useState } from 'react';
import { ArrowLeft, Check, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { PasswordRequirements } from './AuthPage.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getLocalizedApiError } from '../utils/apiErrors.js';

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const refs = useRef([]);
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(Array(6).fill(''));
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const checks = { length: password.length >= 8, uppercase: /[A-Z]/.test(password), lowercase: /[a-z]/.test(password), number: /\d/.test(password), special: /[^A-Za-z0-9]/.test(password) };
  const run = async (action) => { setBusy(true); setError(''); try { await action(); } catch (err) { setError(getLocalizedApiError(err, t)); } finally { setBusy(false); } };
  const sendCode = (event) => { event.preventDefault(); run(async () => { await api.post('/auth/forgot-password', { email }); setStep('code'); window.setTimeout(() => refs.current[0]?.focus(), 100); }); };
  const verifyCode = (event) => { event.preventDefault(); if (code.join('').length !== 6) return setError(t('authCodeLength')); run(async () => { const { data } = await api.post('/auth/verify-reset-code', { email, code: code.join('') }); setResetToken(data.resetToken); setStep('password'); }); };
  const savePassword = (event) => { event.preventDefault(); if (!Object.values(checks).every(Boolean)) return setError(t('authPasswordRulesError')); if (password !== confirmPassword) return setError(t('authPasswordsMismatch')); run(async () => { await api.post('/auth/reset-password', { email, resetToken, password, confirmPassword }); setStep('complete'); window.setTimeout(() => navigate('/login', { replace: true }), 1400); }); };
  const copy = { email: ['authResetTitle', 'authResetIntro'], code: ['authResetCodeTitle', 'authResetCodeIntro'], password: ['authNewPasswordTitle', 'authNewPasswordIntro'], complete: ['authResetCompleteTitle', 'authResetCompleteIntro'] }[step];
  return <section className="auth-page password-reset-page"><div className="auth-panel password-reset-panel">
    <Link className="password-reset-back" to="/login"><ArrowLeft size={17} />{t('login')}</Link>
    <div className="auth-brand">{step === 'complete' ? <Check size={26} /> : step === 'password' ? <KeyRound size={26} /> : step === 'code' ? <ShieldCheck size={26} /> : <Mail size={26} />}<h1>{t(copy[0])}</h1><p>{t(copy[1]).replace('{email}', email)}</p></div>
    {step === 'email' && <form className="auth-form" onSubmit={sendCode} noValidate><label><span>Email</span><input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required /></label><button className="auth-submit" disabled={busy}><Mail size={18} />{busy ? t('authWait') : t('authSendResetCode')}</button></form>}
    {step === 'code' && <form className="verification-form" onSubmit={verifyCode} noValidate><div className="verification-code-row">{code.map((digit, index) => <input key={index} ref={(el) => { refs.current[index] = el; }} value={digit} inputMode="numeric" maxLength={1} onChange={(e) => { const value = e.target.value.replace(/\D/g, '').slice(-1); setCode((current) => current.map((item, i) => i === index ? value : item)); if (value && index < 5) refs.current[index + 1]?.focus(); }} />)}</div><button className="auth-submit" disabled={busy}><ShieldCheck size={18} />{busy ? t('authChecking') : t('authConfirm')}</button></form>}
    {step === 'password' && <form className="auth-form" onSubmit={savePassword} noValidate><label><span>{t('authNewPassword')}</span><input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} /></label><label><span>{t('authRepeatPassword')}</span><input type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} /></label><PasswordRequirements checks={checks} t={t} /><button className="auth-submit" disabled={busy}><KeyRound size={18} />{busy ? t('authWait') : t('authSavePassword')}</button></form>}
    {step === 'complete' && <div className="password-reset-success"><Check size={24} />{t('authResetCompleteIntro')}</div>}
    {error && <p className="auth-error">{error}</p>}
  </div></section>;
}
