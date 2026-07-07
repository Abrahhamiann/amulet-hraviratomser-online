import React from 'react';
import SectionTitle from '../components/SectionTitle.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <section className="section page-top about-page">
      <SectionTitle title={t('aboutTitle')} text={t('aboutIntro')} />
      <div className="content-panel">
        <p>{t('aboutP1')}</p>
        <p>{t('aboutP2')}</p>
        <p>{t('aboutP3')}</p>
      </div>
    </section>
  );
}
