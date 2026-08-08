import React from 'react';
import SectionTitle from '../components/SectionTitle.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import TypewriterTestimonials from '../components/ui/TypewriterTestimonials.jsx';
import { makeTestimonials } from '../components/ui/TestimonialV2.jsx';
import avatarOne from '../assets/morph/wedding-sunset.jpg';
import avatarTwo from '../assets/morph/baptism-family.jpg';
import avatarThree from '../assets/morph/engagement-smile.jpg';
import avatarFour from '../assets/morph/birthday-blue.jpg';
import avatarFive from '../assets/morph/corporate-warm.jpg';
import avatarSix from '../assets/morph/wedding-forest-optimized.jpg';

export default function AboutPage() {
  const { t, language } = useLanguage();
  const aboutParagraphs = t('aboutParagraphs') || [t('aboutP1'), t('aboutP2'), t('aboutP3')];
  const aboutBenefits = t('aboutBenefits') || [];
  const avatars = [avatarOne, avatarTwo, avatarThree, avatarFour, avatarFive, avatarSix];
  const testimonials = makeTestimonials(language).slice(0, 6).map((item, index) => ({
    ...item,
    image: avatars[index],
    jobtitle: t('customerTestimonialsKicker')
  }));

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
      <TypewriterTestimonials testimonials={testimonials} title={t('customerTestimonialsTitle')} subtitle={t('customerTestimonialsSubtitle')} />
    </section>
  );
}
