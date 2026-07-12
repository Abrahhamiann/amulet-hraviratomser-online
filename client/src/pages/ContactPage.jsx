import React from 'react';
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import api from '../api/axios.js';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { required, toForm } from '../utils/forms.js';

export default function ContactPage() {
  const { t } = useLanguage();
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const data = toForm(event);
    const nextErrors = required(data, ['name', 'phone', 'email', 'message']);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setStatus('loading');
    try {
      await api.post('/contact', data);
      formElement.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="section page-top contact-grid">
      <div>
        <SectionTitle title={t('contact')} text={t('contactIntro')} />
        <div className="contact-list">
          <span><Phone size={18} /> {t('contactPhoneValue')}</span>
          <span><Mail size={18} /> {t('contactEmailValue')}</span>
          <span><MapPin size={18} /> {t('contactAddressValue')}</span>
          <span>{t('contactInstagramValue')}</span>
        </div>
      </div>
      <form className="panel-form" onSubmit={submit}>
        <Input label={t('contactName')} name="name" error={errors.name} />
        <Input label={t('phone')} name="phone" type="tel" error={errors.phone} />
        <Input label={t('email')} name="email" type="email" error={errors.email} />
        <Input label={t('message')} name="message" as="textarea" rows="5" error={errors.message} />
        <Button disabled={status === 'loading'}>{status === 'loading' ? t('loading') : t('submit')}</Button>
        {status === 'success' && (
          <div className="form-success-card" role="status" aria-live="polite">
            <CheckCircle2 size={22} />
            <div>
              <strong>{t('successContact')}</strong>
              <span>{t('successContactDetails')}</span>
            </div>
          </div>
        )}
        {status === 'error' && <p className="form-error">{t('error')}</p>}
      </form>
    </section>
  );
}
