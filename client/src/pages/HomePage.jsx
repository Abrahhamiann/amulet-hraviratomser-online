import React from 'react';
import { Pencil, Search, Share2, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import baptismChurch from '../assets/morph/baptism-church.webp';
import baptismLift from '../assets/morph/baptism-lift.jpg';
import birthdayCakeLights from '../assets/morph/birthday-cake-lights.jpg';
import corporateEvent from '../assets/morph/corporate-event.jpg';
import engagementSmile from '../assets/morph/engagement-smile.jpg';
import weddingForest from '../assets/morph/wedding-forest-optimized.jpg';
import weddingTemple from '../assets/morph/wedding-temple.jpg';
import homeDeviceSuite from '../assets/home/amulet-device-suite.png';
import Button from '../components/Button.jsx';
import FAQItem from '../components/FAQItem.jsx';
import TestimonialV2 from '../components/ui/TestimonialV2.jsx';
import CircularTestimonials from '../components/ui/CircularTestimonials.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const occasionLinks = [
  { category: 'wedding', image: weddingTemple },
  { category: 'baptism', image: baptismLift },
  { category: 'birth', image: birthdayCakeLights },
  { category: 'corporate', image: corporateEvent },
  { category: 'engagement', image: engagementSmile }
];

const creationVideoUrl = 'https://youtu.be/WUPRFyeUwCU?si=sAyLMnUu_QknEBLF';

function getYouTubeStartSeconds(value) {
  if (!value) return '';
  if (/^\d+$/.test(value)) return value;

  const hours = Number(value.match(/(\d+)h/)?.[1] || 0);
  const minutes = Number(value.match(/(\d+)m/)?.[1] || 0);
  const seconds = Number(value.match(/(\d+)s/)?.[1] || 0);
  const total = (hours * 3600) + (minutes * 60) + seconds;
  return total ? String(total) : '';
}

function getYouTubeEmbedUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, '');
    let videoId = '';
    let embedPath = '';

    if (host === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0] || '';
    } else if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const pathParts = url.pathname.split('/').filter(Boolean);
      if (url.pathname === '/watch') videoId = url.searchParams.get('v') || '';
      if (['embed', 'shorts', 'live'].includes(pathParts[0])) videoId = pathParts[1] || '';
    }

    const listId = url.searchParams.get('list');
    const start = getYouTubeStartSeconds(url.searchParams.get('start') || url.searchParams.get('t'));
    const params = new URLSearchParams();
    if (listId && videoId) params.set('list', listId);
    if (start) params.set('start', start);

    if (videoId) {
      embedPath = `/embed/${videoId}`;
    } else if (listId) {
      embedPath = '/embed/videoseries';
      params.set('list', listId);
    }

    return embedPath
      ? `https://www.youtube-nocookie.com${embedPath}${params.toString() ? `?${params}` : ''}`
      : rawUrl;
  } catch {
    return rawUrl;
  }
}

export default function HomePage() {
  const { language, t } = useLanguage();
  const creationFlowRef = useRef(null);
  const faqRef = useRef(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  useEffect(() => {
    const section = creationFlowRef.current;
    if (!section) return undefined;

    const items = Array.from(section.querySelectorAll('.flow-reveal'));
    const timers = [];
    const revealItems = () => {
      section.classList.add('is-visible');
      items.forEach((item, index) => {
        timers.push(window.setTimeout(() => item.classList.add('is-visible'), index * 140));
      });
    };

    if (!('IntersectionObserver' in window)) {
      revealItems();
      return () => timers.forEach((timer) => window.clearTimeout(timer));
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealItems();
          observer.disconnect();
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -18% 0px' });

    observer.observe(section);

    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [language]);

  useEffect(() => {
    const section = faqRef.current;
    if (!section) return undefined;
    if (!('IntersectionObserver' in window)) {
      section.classList.add('is-visible');
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      section.classList.add('is-visible');
      observer.disconnect();
    }, { threshold: 0.12, rootMargin: '0px 0px -12% 0px' });
    observer.observe(section);
    return () => observer.disconnect();
  }, [language]);

  const staticFaqItems = t('faqItems');
  const creationSteps = t('creationSteps');
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

  return (
    <>
      <section className="photo-gallery-hero" aria-labelledby="gallery-title">
        <div className="home-intro-media" aria-hidden="true">
          <img className="home-device-suite" src={homeDeviceSuite} alt="" draggable="false" />
        </div>
        <div className="home-intro-copy">
          <h1 id="gallery-title">{t('newHeroTitle')}</h1>
          <p>{t('newHeroText')}</p>
          <div className="home-intro-actions">
            <Button to="/templates" className="red-pill">{t('viewTemplates')}</Button>
            <Button to="/about" variant="ghost" className="home-about-btn">{t('about')}</Button>
          </div>
        </div>
      </section>

      <nav className="occasion-browser-section" aria-labelledby="occasion-browser-title">
        <div className="occasion-browser-heading">
          <span>{t('occasionBrowserKicker')}</span>
          <h2 id="occasion-browser-title" className="home-section-heading">{t('occasionBrowserTitle')}</h2>
        </div>
        <div className="occasion-browser-list">
          {occasionLinks.map((occasion) => (
            <Link
              key={occasion.category}
              className="occasion-browser-link"
              to={`/templates?category=${occasion.category}`}
              aria-label={`${t('viewTemplates')}: ${t(occasion.category)}`}
            >
              <span className="occasion-browser-image">
                <img src={occasion.image} alt="" loading="lazy" />
              </span>
              <strong>{t(occasion.category)}</strong>
            </Link>
          ))}
        </div>
      </nav>

      <section className="creation-flow-section" aria-labelledby="creation-flow-title" ref={creationFlowRef}>
        <div className="creation-flow-heading">
          <h2 id="creation-flow-title" className="home-section-heading">{t('creationFlowTitle')}</h2>
          <p>{t('creationFlowSubtitle')}</p>
        </div>
        <div className="creation-flow-layout">
          <div className="creation-flow-steps">
            {creationSteps.map((step, index) => {
              const Icon = [Search, Pencil, Share2][index] || Sparkles;
              return (
                <article className="creation-flow-step flow-reveal" key={`creation-step-${index}`} style={{ '--flow-index': index }}>
                  <span className="creation-step-icon"><Icon size={24} /></span>
                  <div>
                    <small>{t('step')} {index + 1}</small>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="creation-flow-video flow-reveal" style={{ '--flow-index': creationSteps.length }}>
            <div className="creation-video-card creation-video-embed">
              <iframe
                src={getYouTubeEmbedUrl(creationVideoUrl)}
                title={t('creationFlowTitle')}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
        <Button to="/templates" className="red-pill creation-flow-cta">{t('startCreating')}</Button>
      </section>

      <section className="events-testimonials-section" aria-labelledby="events-testimonials-title">
        <div className="events-testimonials-heading">
          <p>{t('eventsKicker')}</p>
          <h2 id="events-testimonials-title" className="home-section-heading">{t('eventsTitle')}</h2>
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

      <section className="faq-amulet" id="faq" ref={faqRef} aria-labelledby="faq-title">
        <header className="faq-amulet-heading faq-reveal">
          <span>{t('faq')}</span>
          <h2 className="home-section-heading" id="faq-title">{t('faqTitle')}</h2>
          <p>{t('faqSubtitle')}</p>
        </header>
        <div className="faq-stack">
          {staticFaqItems.map(([question, answer], index) => (
            <FAQItem
              key={question}
              question={question}
              answer={answer}
              index={index}
              open={activeFaqIndex === index}
              onToggle={() => setActiveFaqIndex((current) => (current === index ? null : index))}
            />
          ))}
        </div>
      </section>

    </>
  );
}
