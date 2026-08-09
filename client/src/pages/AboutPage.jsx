import React from 'react';
import SectionTitle from '../components/SectionTitle.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function AboutPage() {
  const { t } = useLanguage();
  const aboutParagraphs = t('aboutParagraphs') || [t('aboutP1'), t('aboutP2'), t('aboutP3')];
  const aboutBenefits = t('aboutBenefits') || [];

  return (
    <section className="section page-top about-page">
      <SectionTitle title={t('aboutTitle')} text={t('aboutIntro')} />
      <div className="content-panel">
        {aboutParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="about-signature">{t('aboutSignature')}</p>
        <div className="about-benefits">
          <h2>{t('aboutBenefitsTitle')}</h2>
          <ul>
            {aboutBenefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>
        <p>{t('aboutCompanyCredit')}</p>
      </div>
    </section>
  );
}
