import React from 'react';
import { Baby, Briefcase, Gem, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

const icons = { Heart, Sparkles, Baby, Briefcase, Gem };

export default function CategoryCard({ category }) {
  const { t } = useLanguage();
  const Icon = icons[category.icon] || Heart;
  return (
    <Link className="category-card reveal" to={`/templates?category=${category.key}`}>
      <span className="category-icon"><Icon size={24} /></span>
      <strong>{t(category.key)}</strong>
      <small>{t('viewTemplates')}</small>
    </Link>
  );
}
