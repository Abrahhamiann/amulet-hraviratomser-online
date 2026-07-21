import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import SectionTitle from '../components/SectionTitle.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function AboutPage() {
  const { t } = useLanguage();
  const paragraphs = t('aboutParagraphs');
  const benefits = t('aboutBenefits');
  const safeParagraphs = Array.isArray(paragraphs) ? paragraphs : [t('aboutP1'), t('aboutP2'), t('aboutP3')];
  const safeBenefits = Array.isArray(benefits) ? benefits : [];

  return (
    <section className="section page-top about-page">
      <div className="about-hero">
        <div className="about-hero-copy">
          <SectionTitle title={t('aboutTitle')} text={t('aboutIntro')} />
          <div className="about-story-panel">
            {safeParagraphs.map((text, index) => (
              <p style={{ '--about-delay': `${index * 90}ms` }} key={text}>{text}</p>
            ))}
            <strong>{t('aboutSignature')}</strong>
          </div>
        </div>
      </div>

      <div className="about-benefits-wrap">
        <div className="about-benefits-head">
          <span>{t('aboutBenefitsTitle')}</span>
        </div>
        <div className="about-benefits-grid">
          {safeBenefits.map((item, index) => (
            <div className="about-benefit-card" style={{ '--about-delay': `${index * 70}ms` }} key={item}>
              <CheckCircle2 size={19} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
