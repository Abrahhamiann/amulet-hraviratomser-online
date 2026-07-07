import React from 'react';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import ErrorState from '../components/ErrorState.jsx';
import Loading from '../components/Loading.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import TemplateCard from '../components/TemplateCard.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { categories } from '../data/categories.js';

export default function TemplatesPage() {
  const { t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const [templates, setTemplates] = useState([]);
  const [state, setState] = useState('loading');
  const category = params.get('category') || '';
  const search = params.get('search') || '';
  const sort = params.get('sort') || 'newest';

  const query = useMemo(() => {
    const next = new URLSearchParams();
    if (category) next.set('category', category);
    if (search) next.set('search', search);
    if (sort) next.set('sort', sort);
    return next;
  }, [category, search, sort]);

  useEffect(() => {
    setState('loading');
    api.get(`/templates?${query}`).then(({ data }) => {
      setTemplates(data);
      setState('ready');
    }).catch(() => setState('error'));
  }, [query]);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next);
  };

  return (
    <section className="section page-top">
      <SectionTitle title={t('templates')} text={t('catalogIntro')} />
      <div className="filters">
        <label><Search size={18} /><input value={search} onChange={(e) => update('search', e.target.value)} placeholder={t('search')} /></label>
        <select value={category} onChange={(e) => update('category', e.target.value)}>
          <option value="">{t('all')}</option>
          {categories.map((item) => <option key={item.key} value={item.key}>{t(item.key)}</option>)}
        </select>
        <select value={sort} onChange={(e) => update('sort', e.target.value)}>
          <option value="newest">{t('newest')}</option>
          <option value="price_asc">{t('priceAsc')}</option>
          <option value="price_desc">{t('priceDesc')}</option>
        </select>
      </div>
      {state === 'loading' && <Loading text={t('loading')} />}
      {state === 'error' && <ErrorState text={t('error')} />}
      {state === 'ready' && <div className="templates-grid">{templates.map((template) => <TemplateCard key={template._id} template={template} />)}</div>}
    </section>
  );
}
