import React from 'react';
import { ListFilter, Search, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import baptismChurch from '../assets/morph/baptism-church.webp';
import birthdayCakeLights from '../assets/morph/birthday-cake-lights.jpg';
import corporateEvent from '../assets/morph/corporate-event.jpg';
import engagementSmile from '../assets/morph/engagement-smile.jpg';
import weddingTemple from '../assets/morph/wedding-temple.jpg';
import ErrorState from '../components/ErrorState.jsx';
import Loading from '../components/Loading.jsx';
import TemplateCard from '../components/TemplateCard.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { categories } from '../data/categories.js';

const categoryImages = {
  wedding: weddingTemple,
  baptism: baptismChurch,
  birth: birthdayCakeLights,
  corporate: corporateEvent,
  engagement: engagementSmile
};

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

  const chooseCategory = (value) => update('category', value);

  return (
    <section className="templates-catalog-page">
      <div className="templates-catalog-hero">
        <span><Sparkles size={16} /> {t('templateCatalogKicker')}</span>
        <h1>{t('templates')}</h1>
        <p>{t('catalogIntro')}</p>
      </div>

      <div className="templates-search-shell">
        <label className="templates-search">
          <Search size={21} />
          <input value={search} onChange={(e) => update('search', e.target.value)} placeholder={t('search')} />
        </label>

        <div className="template-category-chips" aria-label={t('templateChooserTitle')}>
          {categories.map((item) => (
            <button
              key={item.key}
              type="button"
              className={category === item.key ? 'is-active' : ''}
              onClick={() => chooseCategory(item.key)}
            >
              <img src={categoryImages[item.key]} alt="" aria-hidden="true" />
              <span>{t(item.key)}</span>
            </button>
          ))}
        </div>

        <div className="template-catalog-notes">
          <span>{t('templatesAllLanguages')}</span>
          <span>{t('templatesFastDelivery')}</span>
        </div>
      </div>

      <div className="template-type-dock" aria-label={t('templateChooserHint')}>
        <button type="button" className={!category ? 'is-active' : ''} onClick={() => chooseCategory('')}>{t('allInvitations')}</button>
        {categories.map((item) => (
          <button key={item.key} type="button" className={category === item.key ? 'is-active' : ''} onClick={() => chooseCategory(item.key)}>
            {t(item.key)}
          </button>
        ))}
      </div>

      <div className="catalog-sort-row">
        <span><ListFilter size={16} /> {t('sort')}</span>
        <select value={sort} onChange={(e) => update('sort', e.target.value)}>
          <option value="newest">{t('newest')}</option>
          <option value="price_asc">{t('priceAsc')}</option>
          <option value="price_desc">{t('priceDesc')}</option>
        </select>
      </div>

      {state === 'loading' && <Loading text={t('loading')} />}
      {state === 'error' && <ErrorState text={t('error')} />}
      {state === 'ready' && <div className="templates-grid catalog-grid">{templates.map((template) => <TemplateCard key={template._id} template={template} />)}</div>}
    </section>
  );
}
