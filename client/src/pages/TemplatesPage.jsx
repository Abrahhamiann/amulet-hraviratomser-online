import React from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import ErrorState from '../components/ErrorState.jsx';
import Loading from '../components/Loading.jsx';
import TemplateCard from '../components/TemplateCard.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { categories } from '../data/categories.js';

export default function TemplatesPage() {
  const { t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const [templates, setTemplates] = useState([]);
  const [state, setState] = useState('loading');
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const loadMoreRef = useRef(null);
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

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    setState('loading');
    setTemplates([]);
    api.get('/templates', {
      signal: controller.signal,
      params: { limit: 24, category: category || undefined, search: debouncedSearch || undefined, sort }
    }).then(({ data }) => {
      setTemplates(data.items || []);
      setNextCursor(data.nextCursor || null);
      setHasMore(Boolean(data.hasMore));
      setState('ready');
    }).catch((error) => {
      if (error?.code !== 'ERR_CANCELED') setState('error');
    });
    return () => controller.abort();
  }, [category, debouncedSearch, sort]);

  const loadMore = useCallback(async () => {
    if (!hasMore || !nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const { data } = await api.get('/templates', {
        params: { limit: 24, cursor: nextCursor, category: category || undefined, search: debouncedSearch || undefined, sort }
      });
      setTemplates((current) => [...current, ...(data.items || [])]);
      setNextCursor(data.nextCursor || null);
      setHasMore(Boolean(data.hasMore));
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [category, debouncedSearch, hasMore, loadingMore, nextCursor, sort]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void loadMore();
    }, { rootMargin: '600px 0px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

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
        <h1>{t('templates')}</h1>
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
      {state === 'ready' && <>
        <div className="templates-grid catalog-grid">{templates.map((template, index) => <TemplateCard key={template._id} template={template} priority={index < 5} />)}</div>
        {hasMore && <div ref={loadMoreRef} className="catalog-load-more" aria-hidden="true" />}
        {loadingMore && <Loading text={t('loading')} />}
      </>}
    </section>
  );
}
