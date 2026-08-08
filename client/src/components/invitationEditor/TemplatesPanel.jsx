import React, { useEffect, useMemo, useState } from 'react';
import { Check, Search } from 'lucide-react';
import api from '../../api/axios.js';
import { resolveTemplateImage } from '../../occasionTemplates/templateAssets.js';
import { useEditor } from './EditorContext.jsx';
import { EmptyState, PanelHeader } from './EditorControls.jsx';

const categoryLabels = {
  wedding: 'Հարսանեկան',
  engagement: 'Նշանադրություն',
  baptism: 'Կնունք',
  birthday: 'Ծնունդ',
  corporate: 'Կորպորատիվ'
};

export default function TemplatesPanel() {
  const { template, actions } = useEditor();
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
      <PanelHeader title="Ձևանմուշներ" subtitle="Ընտրեք այլ հրավեր և շարունակեք խմբագրումը նոր դիզայնով։" />
      <div className="invite-editor-template-search"><Search size={15} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Փնտրել ձևանմուշ..." /></div>
      {state === 'loading' && <div className="invite-editor-template-skeleton">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</div>}
      {state === 'error' && <EmptyState title="Չհաջողվեց բեռնել ձևանմուշները" text="Փակեք և կրկին բացեք խմբագրիչը։" />}
      {state === 'ready' && !Object.keys(groups).length && <EmptyState title="Ոչինչ չի գտնվել" text="Փորձեք այլ որոնման բառ։" />}
      {Object.entries(groups).map(([category, items]) => <section className="invite-editor-template-group" key={category}><h3>{categoryLabels[category] || category}</h3><div>{items.map((item) => {
        const selected = String(item._id) === String(template._id);
        return <button key={item._id} type="button" className={selected ? 'is-selected' : ''} onClick={() => !selected && actions.onSelectTemplate?.(item._id)} aria-pressed={selected}><span><img src={resolveTemplateImage(item.mainImage || item.gallery?.[0])} alt={item.title} />{selected && <i><Check size={12} /></i>}</span><strong>{item.title}</strong><small>{Number(item.price || 0).toLocaleString()} AMD</small></button>;
      })}</div></section>)}
    </div>
  );
}

