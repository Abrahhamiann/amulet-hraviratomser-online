import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function PrivacyPage() {
  const { t } = useLanguage();
  const sections = t('privacySections');

  return (
    <section className="privacy-page">
      <div className="privacy-hero">
        <span><ShieldCheck size={18} /> {t('menuPrivacy')}</span>
        <h1>{t('privacyTitle')}</h1>
        <p>{t('privacyUpdated')}</p>
      </div>
      <div className="privacy-content">
        <p className="privacy-intro">{t('privacyIntro')}</p>
        {sections.map((section) => (
          <article className="privacy-card" key={section.title}>
            <h2>{section.title}</h2>
            {section.text?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.items && (
              <ul>
                {section.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
