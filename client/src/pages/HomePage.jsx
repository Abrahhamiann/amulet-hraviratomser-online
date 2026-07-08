import React from 'react';
import { CreditCard, HelpCircle, Mail, MessageCircle, MonitorCheck, Pencil, Phone, Search, Send, Share2, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import api from '../api/axios.js';
import baptismChurch from '../assets/morph/baptism-church.webp';
import baptismLift from '../assets/morph/baptism-lift.jpg';
import birthdayCakeLights from '../assets/morph/birthday-cake-lights.jpg';
import corporateEvent from '../assets/morph/corporate-event.jpg';
import engagementSmile from '../assets/morph/engagement-smile.jpg';
import weddingForest from '../assets/morph/wedding-forest-optimized.jpg';
import weddingTemple from '../assets/morph/wedding-temple.jpg';
import Button from '../components/Button.jsx';
import FAQItem from '../components/FAQItem.jsx';
import TemplateCard from '../components/TemplateCard.jsx';
import CircularTestimonials from '../components/ui/CircularTestimonials.jsx';
import ScrollMorphHero from '../components/ui/ScrollMorphHero.jsx';
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
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 14;
    setOffset({ x, y });
  };

  return (
    <div
      className={`gallery-photo ${photo.className}`}
      style={{ '--gallery-index': index, '--tilt-x': `${offset.y * -1}deg`, '--tilt-y': `${offset.x}deg` }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      tabIndex={0}
    >
      <img src={photo.src} alt={label} loading={index > 2 ? 'lazy' : 'eager'} draggable="false" />
    </div>
  );
}

export default function HomePage() {
  const { t } = useLanguage();
  const roadmapRef = useRef(null);
  const [featured, setFeatured] = useState([]);
  const [socialsOpen, setSocialsOpen] = useState(false);
  const [roadmapProgress, setRoadmapProgress] = useState(0);

  useEffect(() => {
    api.get('/templates?featured=true').then(({ data }) => setFeatured(data)).catch(() => setFeatured([]));
  }, []);

  useEffect(() => {
    const section = roadmapRef.current;
    if (!section) return undefined;

    let frame = 0;
    const clamp = (value) => Math.min(1, Math.max(0, value));

    const updateRoadmap = () => {
      const stage = section.querySelector('.roadmap-stage') || section;
      const rect = stage.getBoundingClientRect();
      const viewport = window.innerHeight || document.documentElement.clientHeight || 1;
      const start = viewport * 0.72;
      const end = -(rect.height - viewport * 0.28);
      const range = Math.max(1, start - end);
      const next = clamp((start - rect.top) / range);

      setRoadmapProgress((current) => (Math.abs(current - next) > 0.003 ? next : current));
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
    src: {
      wedding: weddingForest,
      baptism: baptismChurch,
      birth: birthdayCakeLights,
      corporate: corporateEvent,
      partners: engagementSmile
    }[item.image]
  }));
  const roadmapLastIndex = Math.max(roadmapSteps.length - 1, 1);
  const activeRoadmapIndex = Math.min(roadmapSteps.length - 1, Math.max(0, Math.round(roadmapProgress * roadmapLastIndex)));
  const scrollToFaq = () => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <>
      <section className="photo-gallery-hero" aria-labelledby="gallery-title">
        <div className="gallery-grid-backdrop" aria-hidden="true" />
        <p className="gallery-kicker">{t('storiesKicker')}</p>
        <h1 id="gallery-title">
          {t('storiesTitle')} <span>{t('storiesTitleAccent')}</span>
        </h1>
        <div className="gallery-stage" aria-label={t('gallery')}>
          {galleryPhotos.map((photo, index) => (
            <GalleryPhoto key={photo.id} photo={photo} index={index} label={t(photo.altKey)} />
          ))}
        </div>
      </section>

      <section className="roadmap-section" aria-labelledby="roadmap-title" ref={roadmapRef} style={{ '--roadmap-progress': roadmapProgress }}>
        <div className="roadmap-heading">
          <h2 id="roadmap-title">{t('roadmapTitle')}</h2>
          <span />
        </div>
        <div className="roadmap-stage">
          <svg className="roadmap-line" viewBox="0 0 220 1320" preserveAspectRatio="none" aria-hidden="true">
            <path className="roadmap-line-muted" d="M112 0 C205 105 196 205 112 300 C22 405 24 505 112 620 C198 735 195 838 112 952 C28 1068 28 1180 112 1320" pathLength="1" />
            <path className="roadmap-line-live" d="M112 0 C205 105 196 205 112 300 C22 405 24 505 112 620 C198 735 195 838 112 952 C28 1068 28 1180 112 1320" pathLength="1" style={{ strokeDashoffset: 1 - roadmapProgress }} />
          </svg>
          <div className="roadmap-traveler-track" aria-hidden="true">
            <div className="roadmap-traveler" style={{ offsetDistance: `${roadmapProgress * 100}%` }}>
              <Mail size={30} />
            </div>
          </div>
          <div className="roadmap-items">
            {roadmapSteps.map((step, index) => {
              const Icon = roadmapIcons[index] || Sparkles;
              const stepPoint = index / roadmapLastIndex;
              const isVisible = roadmapProgress >= stepPoint - 0.055;
              const isPast = roadmapProgress > stepPoint + 0.08;
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

      <ScrollMorphHero />

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
            designation: '#ef382b',
            testimony: '#4a5565',
            arrowBackground: '#17202b',
            arrowForeground: '#ffffff',
            arrowHoverBackground: '#ef382b'
          }}
        />
        <div className="events-testimonials-actions">
          <Button to="/templates" className="red-pill">{t('chooseInvitation')}</Button>
          <Button to="/contact" variant="ghost" className="events-contact-link">{t('menuPartners')}</Button>
        </div>
      </section>

      <section className="section featured-amulet">
        <div className="amulet-heading">
          <Sparkles size={22} />
          <h2>{t('featured')}</h2>
        </div>
        <div className="templates-grid">{featured.slice(0, 3).map((template) => <TemplateCard key={template._id} template={template} />)}</div>
      </section>

      <section className="faq-amulet" id="faq">
        <h2>{t('faqTitle')}</h2>
        <strong>{t('faq')}</strong>
        <div className="faq-stack">
          {faqItems.map(([question, answer]) => <FAQItem key={question} question={question} answer={answer} />)}
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
