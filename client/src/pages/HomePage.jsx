import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Pencil, Search, Share2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CREATION_VIDEO_URL } from '../config/env.js';
import baptismLift from '../assets/morph/baptism-lift.jpg';
import birthdayCakeLights from '../assets/morph/birthday-cake-lights.jpg';
import corporateEvent from '../assets/morph/corporate-event.jpg';
import engagementSmile from '../assets/morph/engagement-smile.jpg';
import weddingTemple from '../assets/morph/wedding-temple.jpg';
import homeDeviceSuite from '../assets/home/amulet-device-suite.webp';
import iphoneTutorialFrame from '../assets/editor-devices/iphone-device-frame-clean.png';
import '../components/tutorialDevice.css';
import macbookWeddingScreen from '../assets/home/macbook-wedding-screen.png';
import api from '../api/axios.js';
import Button from '../components/Button.jsx';
import FAQItem from '../components/FAQItem.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const TestimonialV2 = lazy(() => import('../components/ui/TestimonialV2.jsx'));

const occasionLinks = [
  { category: 'wedding', image: weddingTemple },
  { category: 'baptism', image: baptismLift },
  { category: 'birth', image: birthdayCakeLights },
  { category: 'corporate', image: corporateEvent },
  { category: 'engagement', image: engagementSmile }
];

const creationVideoUrl = CREATION_VIDEO_URL;

function DeferredTestimonials() {
  const [ready, setReady] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || ready) return undefined;
    if (!('IntersectionObserver' in window)) {
      setReady(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setReady(true);
      observer.disconnect();
    }, { rootMargin: '600px 0px' });
    observer.observe(container);
    return () => observer.disconnect();
  }, [ready]);

  return (
    <div className={`customer-testimonials-deferred${ready ? ' is-ready' : ''}`} ref={containerRef}>
      {ready && (
        <Suspense fallback={<div className="customer-testimonials-placeholder" aria-hidden="true" />}>
          <TestimonialV2 />
        </Suspense>
      )}
    </div>
  );
}

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
  const [managedFaqItems, setManagedFaqItems] = useState(null);
  const [faqReadyToLoad, setFaqReadyToLoad] = useState(false);

  useEffect(() => {
    if (!faqReadyToLoad) return undefined;
    let active = true;
    let requestVersion = 0;
    const refresh = () => {
      const version = ++requestVersion;
      api.get('/faq', { params: { language, fresh: Date.now() } })
      .then(({ data }) => {
        if (active && version === requestVersion && Array.isArray(data?.items)) setManagedFaqItems(data.items);
      })
      .catch(() => {});
    };
    refresh();
    const events = new EventSource(`${api.defaults.baseURL}/faq/events`, { withCredentials: true });
    events.addEventListener('changed', refresh);
    window.addEventListener('focus', refresh);
    return () => { active = false; events.close(); window.removeEventListener('focus', refresh); };
  }, [faqReadyToLoad, language]);

  useEffect(() => {
    const section = faqRef.current;
    if (!section || faqReadyToLoad) return undefined;
    if (!('IntersectionObserver' in window)) {
      setFaqReadyToLoad(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setFaqReadyToLoad(true);
      observer.disconnect();
    }, { rootMargin: '600px 0px' });
    observer.observe(section);
    return () => observer.disconnect();
  }, [faqReadyToLoad]);

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

  const staticFaqItems = managedFaqItems !== null
    ? managedFaqItems.map((item) => [item.question, item.answer])
    : t('faqItems');
  const creationSteps = t('creationSteps');

  return (
    <>
      <section className="photo-gallery-hero" aria-labelledby="gallery-title">
        <div className="home-intro-media" aria-hidden="true">
          <svg
            className="home-device-suite"
            viewBox="0 0 1448 1086"
            width="1448"
            height="1086"
            focusable="false"
          >
            <defs>
              <clipPath id="home-macbook-screen">
                <rect x="128" y="145" width="1068" height="693" />
              </clipPath>
              <clipPath id="home-phone-foreground">
                <path d="M1076 1086V367Q1076 297 1146 297H1448V1086Z" />
              </clipPath>
            </defs>
            <image href={homeDeviceSuite} width="1448" height="1086" />
            <image href={macbookWeddingScreen} x="128" y="145" width="1068" height="693"
              preserveAspectRatio="xMidYMid slice" clipPath="url(#home-macbook-screen)" />
            <image href={homeDeviceSuite} width="1448" height="1086" clipPath="url(#home-phone-foreground)" />
          </svg>
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
            <div className="creation-tutorial-device">
              <div className="creation-tutorial-screen">
                {creationVideoUrl.split('?')[0].endsWith('.mp4') ? <video
                  src={creationVideoUrl}
                  poster="/media/amulet-tutorial-poster.jpg"
                  controls
                  playsInline
                  preload="none"
                  aria-label={t('creationFlowTitle')}
                /> : <iframe
                  src={getYouTubeEmbedUrl(creationVideoUrl)}
                  title={t('creationFlowTitle')}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />}
              </div>
              <img className="creation-tutorial-frame" src={iphoneTutorialFrame} alt="" width="852" height="1846" loading="lazy" aria-hidden="true" />
            </div>
          </div>
        </div>
        <Button to="/templates" className="red-pill creation-flow-cta">{t('startCreating')}</Button>
      </section>

      <DeferredTestimonials />

      <section className="faq-amulet" id="faq" ref={faqRef} aria-labelledby="faq-title">
        <header className="faq-amulet-heading faq-reveal">
          <h2 className="home-section-heading" id="faq-title">{t('faqTitle')}</h2>
        </header>
        <div className="faq-stack">
          {[0, 1].map((column) => (
            <div className="faq-column" key={column}>
              {staticFaqItems.map(([question, answer], index) => (
                index % 2 === column ? (
                  <FAQItem
                    key={question}
                    question={question}
                    answer={answer}
                    index={index}
                    open={activeFaqIndex === index}
                    onToggle={() => setActiveFaqIndex((current) => (current === index ? null : index))}
                  />
                ) : null
              ))}
            </div>
          ))}
        </div>
      </section>

    </>
  );
}
