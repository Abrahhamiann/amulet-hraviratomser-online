import React from 'react';
import { ExternalLink, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios.js';
import Button from '../components/Button.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Loading from '../components/Loading.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function TemplateDetailsPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [template, setTemplate] = useState(null);
  const [state, setState] = useState('loading');

  useEffect(() => {
    api.get(`/templates/${id}`).then(({ data }) => {
      setTemplate(data);
      setState('ready');
    }).catch(() => setState('error'));
  }, [id]);

  if (state === 'loading') return <Loading text={t('loading')} />;
  if (state === 'error') return <ErrorState text={t('error')} />;

  return (
    <section className="section page-top details-grid">
      <div className="details-media">
        <img src={template.mainImage} alt={template.title} />
      </div>
      <div className="details-copy">
        <span className="eyebrow">{t(template.category)}</span>
        <h1>{template.title}</h1>
        <strong className="price">{Number(template.price).toLocaleString()} AMD</strong>
        <p>{template.description}</p>
        <h3>{t('features')}</h3>
        <ul className="feature-list">{template.features?.map((item) => <li key={item}>{item}</li>)}</ul>
        <div className="hero-actions">
          <Button to={`/order?template=${template._id}`}><ShoppingBag size={18} />{t('orderThis')}</Button>
          <Button variant="secondary" to="/invite/sample-rose"><ExternalLink size={18} />{t('livePreview')}</Button>
        </div>
      </div>
      <div className="gallery-strip">
        {template.gallery?.map((image, index) => <img key={index} src={image} alt={`${template.title} ${index + 1}`} />)}
      </div>
    </section>
  );
}
