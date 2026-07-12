import React from 'react';
import { CreditCard, HelpCircle, Mail, MessageCircle, MonitorCheck, Pencil, Phone, Search, Send, Share2, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import baptismChurch from '../assets/morph/baptism-church.webp';
import baptismLift from '../assets/morph/baptism-lift.jpg';
import birthdayCakeLights from '../assets/morph/birthday-cake-lights.jpg';
import corporateEvent from '../assets/morph/corporate-event.jpg';
import engagementSmile from '../assets/morph/engagement-smile.jpg';
import weddingForest from '../assets/morph/wedding-forest-optimized.jpg';
import weddingTemple from '../assets/morph/wedding-temple.jpg';
import Button from '../components/Button.jsx';
import FAQItem from '../components/FAQItem.jsx';
import TestimonialV2 from '../components/ui/TestimonialV2.jsx';
import CircularTestimonials from '../components/ui/CircularTestimonials.jsx';
// import ScrollMorphHero from '../components/ui/ScrollMorphHero.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const roadmapIcons = [Search, MonitorCheck, Pencil, Sparkles, CreditCard, Share2, MessageCircle];

const galleryPhotos = [
  {
    id: 1,
    src: weddingTemple,
    altKey: 'wedding',
    className: 'gallery-card-one'
  },
  {
    id: 2,
    src: baptismLift,
    altKey: 'baptism',
    className: 'gallery-card-two'
  },
  {
    id: 3,
    src: engagementSmile,
    altKey: 'engagement',
    className: 'gallery-card-three'
  },
  {
    id: 4,
    src: birthdayCakeLights,
    altKey: 'birth',
    className: 'gallery-card-four'
  },
  {
    id: 5,
    src: corporateEvent,
    altKey: 'corporate',
    className: 'gallery-card-five'
  }
];

function GalleryPhoto({ photo, index, label }) {
  return (
    <div
      className={`gallery-photo ${photo.className}`}
      style={{ '--gallery-index': index }}
      tabIndex={0}
    >
      <img src={photo.src} alt={label} loading={index > 2 ? 'lazy' : 'eager'} draggable="false" />
    </div>
  );
}

export default function HomePage() {
  const { t } = useLanguage();
  const roadmapRef = useRef(null);
  const [socialsOpen, setSocialsOpen] = useState(false);
  const [activeRoadmapIndex, setActiveRoadmapIndex] = useState(0);
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  useEffect(() => {
    const section = roadmapRef.current;
    if (!section) return undefined;

    let frame = 0;
    const clamp = (value) => Math.min(1, Math.max(0, value));

    const updateRoadmap = () => {
      const stage = section.querySelector('.roadmap-stage') || section;
      const rect = stage.getBoundingClientRect();
      const viewport = window.innerHeight || document.documentElement.clientHeight || 1;
      const start = viewport * 0.88;
      const end = -(rect.height - viewport * 0.34);
      const range = Math.max(1, start - end);
      const next = clamp((start - rect.top) / range);
      const textProgress = clamp(next + 0.12);
      const steps = Number(section.dataset.steps || 1);
      const nextIndex = Math.min(steps - 1, Math.max(0, Math.floor(textProgress * steps)));

      section.style.setProperty('--roadmap-progress', next.toFixed(4));
      setActiveRoadmapIndex((current) => (current === nextIndex ? current : nextIndex));
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateRoadmap);
    };

    updateRoadmap();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  const faqItems = t('faqItems');
  const roadmapSteps = t('roadmapSteps');
  const eventTestimonials = t('eventTestimonials').map((item) => ({
    ...item,
    category: {
      wedding: 'wedding',
      baptism: 'baptism',
      birth: 'birth',
      corporate: 'corporate',
      partners: 'corporate'
    }[item.image],
    src: {
      wedding: weddingForest,
      baptism: baptismChurch,
      birth: birthdayCakeLights,
      corporate: corporateEvent,
      partners: engagementSmile
    }[item.image]
  }));
  const activeEventCategory = eventTestimonials[activeEventIndex]?.category || '';
  const activeInvitationPath = activeEventCategory ? `/templates?category=${activeEventCategory}` : '/templates';
  const scrollToFaq = () => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <>
      <section className="photo-gallery-hero" aria-labelledby="gallery-title">
        <div className="gallery-grid-backdrop" aria-hidden="true" />
        <p className="gallery-kicker">{t('storiesKicker')}</p>
        <h1 id="gallery-title">
          {t('storiesTitle')}{t() ? <span>{t()}</span> : null}
        </h1>
        <div className="gallery-stage" aria-label={t('gallery')}>
          {galleryPhotos.map((photo, index) => (
            <GalleryPhoto key={photo.id} photo={photo} index={index} label={t(photo.altKey)} />
          ))}
        </div>
      </section>

      <section className="roadmap-section" aria-labelledby="roadmap-title" ref={roadmapRef} data-steps={roadmapSteps.length} style={{ '--roadmap-progress': 0 }}>
        <div className="roadmap-heading">
          <h2 id="roadmap-title">{t('roadmapTitle')}</h2>
          <span />
        </div>
        <div className="roadmap-stage">
          <svg className="roadmap-line" viewBox="0 0 220 1180" preserveAspectRatio="none" aria-hidden="true">
            <path className="roadmap-line-muted" d="M112 0 C205 94 196 183 112 268 C22 362 24 451 112 554 C198 657 195 749 112 851 C28 955 28 1055 112 1180" pathLength="1" />
            <path className="roadmap-line-live" d="M112 0 C205 94 196 183 112 268 C22 362 24 451 112 554 C198 657 195 749 112 851 C28 955 28 1055 112 1180" pathLength="1" />
          </svg>
          <div className="roadmap-traveler-track" aria-hidden="true">
            <div className="roadmap-traveler">
              <Mail size={30} />
            </div>
          </div>
          <div className="roadmap-items">
            {roadmapSteps.map((step, index) => {
              const Icon = roadmapIcons[index] || Sparkles;
              const isVisible = activeRoadmapIndex >= index;
              const isPast = activeRoadmapIndex > index;
              const isActive = activeRoadmapIndex === index;
              const sideClass = index % 2 === 0 ? 'is-left' : 'is-right';
              const stateClass = `${isVisible ? 'is-visible' : 'is-upcoming'} ${isPast ? 'is-past' : ''} ${isActive ? 'is-active' : ''}`;

              return (
                <article className={`roadmap-step ${sideClass} ${stateClass}`} key={step.title} style={{ '--step-index': index }}>
                  <div className="roadmap-step-icon"><Icon size={24} /></div>
                  <div className="roadmap-step-copy">
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Temporarily hidden. Uncomment this line when the invitation morph gallery is needed again. */}
      {/* <ScrollMorphHero /> */}

      <section className="events-testimonials-section" aria-labelledby="events-testimonials-title">
        <div className="events-testimonials-heading">
          <p>{t('eventsKicker')}</p>
          <h2 id="events-testimonials-title">{t('eventsTitle')}</h2>
        </div>
        <CircularTestimonials
          testimonials={eventTestimonials}
          autoplay
          colors={{
            name: '#17202b',
            designation: '#d8b98e',
            testimony: '#4a5565',
            arrowBackground: '#17202b',
            arrowForeground: '#ffffff',
            arrowHoverBackground: '#d8b98e'
          }}
          onActiveChange={setActiveEventIndex}
        />
        <div className="events-testimonials-actions">
          <Button to={activeInvitationPath} className="red-pill">{t('chooseInvitation')}</Button>
          <Button to="/contact" variant="ghost" className="events-contact-link">{t('menuPartners')}</Button>
        </div>
      </section>

      <TestimonialV2 />

      <section className="faq-amulet" id="faq">
        <h2>{t('faqTitle')}</h2>
        <strong>{t('faq')}</strong>
        <div className="faq-stack">
          {faqItems.map(([question, answer], index) => (
            <FAQItem
              key={question}
              question={question}
              answer={answer}
              open={activeFaqIndex === index}
              onToggle={() => setActiveFaqIndex((current) => (current === index ? null : index))}
            />
          ))}
        </div>
      </section>

      <div className={socialsOpen ? 'floating-help expanded' : 'floating-help'} aria-label="Quick contact buttons">
        {socialsOpen && (
          <>
            <a href="mailto:hello@amulet.local" aria-label="Email Amulet"><Mail size={23} /></a>
            <a href="viber://chat?number=%2B37477805607" aria-label="Viber"><Phone size={23} /></a>
            <a href="https://wa.me/37477805607" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={24} /></a>
            <a href="https://t.me/" target="_blank" rel="noreferrer" aria-label="Telegram"><Send size={23} /></a>
          </>
        )}
        <button className="floating-question" type="button" onClick={scrollToFaq} aria-label={t('faq')}><HelpCircle size={28} /></button>
        <button className="floating-chat" type="button" onClick={() => setSocialsOpen((value) => !value)} aria-label="Open social links">
          {socialsOpen ? <X size={24} /> : <MessageCircle size={25} />}
        </button>
      </div>
    </>
  );
}
