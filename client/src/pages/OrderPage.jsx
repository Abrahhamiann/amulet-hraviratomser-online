import React from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { categories } from '../data/categories.js';
import { languages } from '../translations/translations.js';
import { required, toForm } from '../utils/forms.js';

const normalizeDateValue = (value) => {
  if (!value) return value;
  const match = String(value).match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (match) return `${match[3]}-${match[2]}-${match[1]}`;
  return value;
};

const cleanOrderPayload = (data) => {
  const payload = Object.fromEntries(
    Object.entries(data)
      .map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
      .filter(([, value]) => value !== '')
  );
  payload.eventDate = normalizeDateValue(payload.eventDate);
  return payload;
};

export default function OrderPage() {
  const { t, language } = useLanguage();
  const [params] = useSearchParams();
  const [templates, setTemplates] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    api.get('/templates').then(({ data }) => setTemplates(data)).catch(() => setTemplates([]));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const data = cleanOrderPayload(toForm(event));
    const nextErrors = required(data, ['fullName', 'phone', 'email', 'eventType', 'eventDate', 'eventTime', 'eventLocation', 'mainNames']);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setStatus('loading');
    setServerError('');
    try {
      await api.post('/orders', data);
      formElement.reset();
      setStatus('success');
    } catch (error) {
      const message = error?.response?.data?.message;
      setServerError(message || (error?.request ? t('orderConnectionError') : t('orderErrorDetails')));
      setStatus('error');
    }
  };

  return (
    <section className="section page-top form-page">
      <SectionTitle title={t('orderCustom')} text={t('orderIntro')} />
      <form className="panel-form" onSubmit={submit}>
        <Input label={t('fullName')} name="fullName" error={errors.fullName} />
        <Input label={t('phone')} name="phone" type="tel" error={errors.phone} />
        <Input label={t('email')} name="email" type="email" error={errors.email} />
        <Input label={t('eventType')} name="eventType" as="select" error={errors.eventType}>
          <option value="">-</option>
          {categories.map((item) => <option key={item.key} value={item.key}>{t(item.key)}</option>)}
        </Input>
        <Input label={t('selectedTemplate')} name="templateId" as="select" defaultValue={params.get('template') || ''}>
          <option value="">{t('customDesign')}</option>
          {templates.map((item) => <option key={item._id} value={item._id}>{item.title}</option>)}
        </Input>
        <Input label={t('eventDate')} name="eventDate" type="date" error={errors.eventDate} />
        <Input label={t('eventTime')} name="eventTime" type="time" error={errors.eventTime} />
        <Input label={t('eventLocation')} name="eventLocation" error={errors.eventLocation} />
        <Input label={t('mapLink')} name="mapLink" />
        <Input label={t('mainNames')} name="mainNames" error={errors.mainNames} />
        <Input label={t('preferredLanguage')} name="preferredLanguage" as="select" defaultValue={language}>
          {languages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
        </Input>
        <Input label={t('eventMessage')} name="eventMessage" as="textarea" rows="4" />
        <Input label={t('notes')} name="notes" as="textarea" rows="4" />
        <Button type="submit" disabled={status === 'loading'}>{status === 'loading' ? t('loading') : t('submit')}</Button>
        {status === 'success' && <p className="success">{t('successOrder')}</p>}
        {status === 'error' && <p className="form-error">{serverError || t('error')}</p>}
      </form>
    </section>
  );
}
