import React from 'react';
import { Calendar, Eye, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getOccasionTemplate } from '../occasionTemplates/index.jsx';
import { resolveTemplateImage } from '../occasionTemplates/templateAssets.js';

export default function TemplateCard({ template }) {
  const { t } = useLanguage();
  const occasionTemplate = getOccasionTemplate(template);
  const CardPreview = occasionTemplate?.CardPreview;
  const imagePosition = template.imagePosition || {};
  const x = Number.isFinite(Number(imagePosition.x)) ? Number(imagePosition.x) : 50;
  const y = Number.isFinite(Number(imagePosition.y)) ? Number(imagePosition.y) : 50;
  const zoom = Number.isFinite(Number(imagePosition.zoom)) ? Math.min(2, Math.max(1, Number(imagePosition.zoom))) : 1;
  const objectPosition = `${x}% ${y}%`;
  const mainImage = resolveTemplateImage(template.mainImage);

  return (
    <article className="template-card reveal">
      <Link to={`/templates/${template._id}`} className="template-image">
        {mainImage ? (
          <img
            src={mainImage}
            alt={template.title}
            loading="lazy"
            style={{
              '--template-image-zoom': zoom,
              objectPosition,
              transformOrigin: objectPosition
            }}
          />
        ) : CardPreview ? (
          <CardPreview template={template} />
        ) : (
          <span>{template.title}</span>
        )}
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
