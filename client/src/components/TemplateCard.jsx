import React from 'react';
import { Calendar, Eye, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function TemplateCard({ template }) {
  const { t } = useLanguage();

  return (
    <article className="template-card reveal">
      <Link to={`/templates/${template._id}`} className="template-image">
        {template.mainImage ? <img src={template.mainImage} alt={template.title} loading="lazy" /> : <span>{template.title}</span>}
      </Link>
      <div className="template-body">
        <div className="card-meta"><Calendar size={16} /> {t(template.category)}</div>
        <h3>{template.title}</h3>
        <p>{template.description}</p>
        <div className="card-foot">
          <strong>{Number(template.price).toLocaleString()} AMD</strong>
          <div className="card-actions">
            <a className="btn btn-ghost" href={`/templates/${template._id}/live`} target="_blank" rel="noreferrer">
              <Eye size={16} />
              {t('preview')}
            </a>
            <a className="btn btn-primary" href={`/templates/${template._id}/live`} target="_blank" rel="noreferrer">
              <ShoppingBag size={16} />
              {t('order')}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
