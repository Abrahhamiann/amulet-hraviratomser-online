import React, { useEffect, useMemo, useState } from 'react';
import { Check, Search } from 'lucide-react';
import api from '../../api/axios.js';
import { resolveTemplateImage } from '../../occasionTemplates/templateAssets.js';
import { useEditor } from './EditorContext.jsx';
import { EmptyState, PanelHeader } from './EditorControls.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function TemplatesPanel() {
  const { template, actions } = useEditor();
  const { t } = useLanguage();
  const categoryLabels = { birth: t('birth'), wedding: t('wedding'), engagement: t('engagement'), baptism: t('baptism'), birthday: t('birthday'), corporate: t('corporate') };
  const [templates, setTemplates] = useState([]);
  const [state, setState] = useState('loading');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/templates?sort=newest').then(({ data }) => {
      if (!active) return;
      setTemplates(Array.isArray(data) ? data : []);
      setState('ready');
    }).catch(() => active && setState('error'));
    return () => { active = false; };
  }, []);

  const groups = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return templates.filter((item) => `${item.title} ${item.category}`.toLowerCase().includes(normalized)).reduce((result, item) => {
      const category = item.category || 'other';
      if (!result[category]) result[category] = [];
      result[category].push(item);
      return result;
    }, {});
  }, [query, templates]);

  return (
    <div className="invite-editor-panel">
      <PanelHeader title={t('editorTemplates')} subtitle={t('editorTemplatesSubtitle')} />
      <div className="invite-editor-template-search"><Search size={15} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('editorSearchTemplate')} /></div>
      {state === 'loading' && <div className="invite-editor-template-skeleton">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</div>}
      {state === 'error' && <EmptyState title={t('editorTemplatesLoadError')} text={t('editorReopenHint')} />}
      {state === 'ready' && !Object.keys(groups).length && <EmptyState title={t('nothingFound')} text={t('editorTryAnotherSearch')} />}
      {Object.entries(groups).map(([category, items]) => <section className="invite-editor-template-group" key={category}><h3>{categoryLabels[category] || category}</h3><div>{items.map((item) => {
        const selected = String(item._id) === String(template._id);
        return <button key={item._id} type="button" className={selected ? 'is-selected' : ''} onClick={() => !selected && actions.onSelectTemplate?.(item._id)} aria-pressed={selected}><span><img src={resolveTemplateImage(item.mainImage || item.gallery?.[0])} alt={item.title} />{selected && <i><Check size={12} /></i>}</span><strong>{item.title}</strong><small>{Number(item.price || 0).toLocaleString()} AMD</small></button>;
      })}</div></section>)}
    </div>
  );
}
