import React from 'react';
import { ChevronDown, Search, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import ErrorState from '../components/ErrorState.jsx';
import Loading from '../components/Loading.jsx';
import TemplateCard from '../components/TemplateCard.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { categories } from '../data/categories.js';
import { getOccasionTemplate } from '../occasionTemplates/index.jsx';

export default function TemplatesPage() {
  const { t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const [templates, setTemplates] = useState([]);
  const [state, setState] = useState('loading');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const category = params.get('category') || '';
  const search = params.get('search') || '';
  const sort = params.get('sort') || 'newest';
  const sortOptions = [
    ['newest', t('newest')],
    ['price_asc', t('priceAsc')],
    ['price_desc', t('priceDesc')]
  ];
  const categoryOptions = [
    ['', t('allInvitations')],
    ...categories.map((item) => [item.key, t(item.key)])
  ];
  const activeCategory = categoryOptions.find(([value]) => value === category) || categoryOptions[0];
  const activeSort = sortOptions.find(([value]) => value === sort) || sortOptions[0];

  useEffect(() => {
    document.body.classList.add('templates-route');
    return () => document.body.classList.remove('templates-route');
  }, []);

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
      setTemplates(data.filter((template) => getOccasionTemplate(template)));
      setState('ready');
    }).catch(() => setState('error'));
  }, [query]);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next);
  };

  const chooseCategory = (value) => {
    update('category', value);
    setCategoryOpen(false);
  };
  const chooseSort = (value) => {
    update('sort', value);
    setSortOpen(false);
  };

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
      </div>

      <div className="template-type-dock" aria-label={t('templateChooserHint')}>
        <button type="button" className={!category ? 'is-active' : ''} onClick={() => chooseCategory('')}>{t('allInvitations')}</button>
        {categories.map((item) => (
          <button key={item.key} type="button" className={category === item.key ? 'is-active' : ''} onClick={() => chooseCategory(item.key)}>
            {t(item.key)}
          </button>
        ))}
      </div>

      <div className="catalog-category-picker">
        <button
          type="button"
          onClick={() => {
            setCategoryOpen((value) => !value);
            setSortOpen(false);
          }}
          aria-expanded={categoryOpen}
          aria-controls="catalog-category-menu"
        >
          <span>{activeCategory[1]}</span>
          <ChevronDown size={16} />
        </button>
        {categoryOpen && (
          <div className="catalog-category-menu" id="catalog-category-menu" role="listbox" aria-label={t('templateChooserHint')}>
            {categoryOptions.map(([value, label]) => (
              <button
                key={value || 'all'}
                type="button"
                className={value === category ? 'is-active' : ''}
                onClick={() => chooseCategory(value)}
                role="option"
                aria-selected={value === category}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="catalog-sort-row">
        <div className="catalog-sort-picker">
          <button
            type="button"
            onClick={() => {
              setSortOpen((value) => !value);
              setCategoryOpen(false);
            }}
            aria-expanded={sortOpen}
          >
            <span>{activeSort[1]}</span>
            <ChevronDown size={16} />
          </button>
          {sortOpen && (
            <div className="catalog-sort-menu" role="listbox" aria-label={t('sort')}>
              {sortOptions.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={value === sort ? 'is-active' : ''}
                  onClick={() => chooseSort(value)}
                  role="option"
                  aria-selected={value === sort}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {state === 'loading' && <Loading text={t('loading')} />}
      {state === 'error' && <ErrorState text={t('error')} />}
      {state === 'ready' && <div className="templates-grid catalog-grid">{templates.map((template) => <TemplateCard key={template._id} template={template} />)}</div>}
    </section>
  );
}
