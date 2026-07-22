import React from 'react';
import { Bot, CreditCard, HelpCircle, Mail, MessageCircle, MonitorCheck, Pencil, Phone, Search, Send, Share2, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import baptismChurch from '../assets/morph/baptism-church.webp';
import baptismLift from '../assets/morph/baptism-lift.jpg';
import birthdayCakeLights from '../assets/morph/birthday-cake-lights.jpg';
import corporateEvent from '../assets/morph/corporate-event.jpg';
import engagementSmile from '../assets/morph/engagement-smile.jpg';
import weddingForest from '../assets/morph/wedding-forest-optimized.jpg';
import weddingTemple from '../assets/morph/wedding-temple.jpg';
import homePhones from '../assets/home/amulet-iphones-transparent.png';
import homeDeviceSuite from '../assets/home/amulet-device-suite.png';
import api from '../api/axios.js';
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
  const creationFlowRef = useRef(null);
  const [socialsOpen, setSocialsOpen] = useState(false);
  const [faqChatOpen, setFaqChatOpen] = useState(false);
  const [chatFaqIndex, setChatFaqIndex] = useState(0);
  const [displayedChatFaqIndex, setDisplayedChatFaqIndex] = useState(0);
  const [chatTyping, setChatTyping] = useState(false);
  const [serverFaqItems, setServerFaqItems] = useState([]);
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

  useEffect(() => {
    const section = creationFlowRef.current;
    if (!section) return undefined;

    const items = Array.from(section.querySelectorAll('.flow-reveal'));
    const revealItems = () => {
      section.classList.add('is-visible');
      items.forEach((item, index) => {
        window.setTimeout(() => item.classList.add('is-visible'), index * 140);
      });
    };

    if (!('IntersectionObserver' in window)) {
      revealItems();
      return undefined;
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

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let isMounted = true;

    api.get('/faq')
      .then(({ data }) => {
        const items = Array.isArray(data?.items)
          ? data.items
            .filter((item) => item?.question && item?.answer && item.active !== false)
            .map((item) => [item.question, item.answer])
          : [];
        if (isMounted) setServerFaqItems(items);
      })
      .catch(() => {
        if (isMounted) setServerFaqItems([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const fallbackFaqItems = t('faqItems');
  const faqItems = serverFaqItems.length ? serverFaqItems : fallbackFaqItems;
  const roadmapSteps = t('roadmapSteps');
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

  useEffect(() => {
    if (!faqItems.length) return undefined;
    if (!faqChatOpen) {
      setChatTyping(false);
      return undefined;
    }

    setChatTyping(true);
    const timeout = window.setTimeout(() => {
      setDisplayedChatFaqIndex(chatFaqIndex);
      setChatTyping(false);
    }, 920);

    return () => window.clearTimeout(timeout);
  }, [chatFaqIndex, faqChatOpen, faqItems.length]);

  useEffect(() => {
    if (!faqItems.length) return;
    if (chatFaqIndex > faqItems.length - 1) {
      setChatFaqIndex(0);
      setDisplayedChatFaqIndex(0);
    }
  }, [chatFaqIndex, faqItems.length]);

  return (
    <>
      <section className="photo-gallery-hero" aria-labelledby="gallery-title">
        <div className="home-intro-media" aria-hidden="true">
          {/* Previous iPhone-only hero image. Kept for quick rollback if needed. */}
          {/* <img src={homePhones} alt="" draggable="false" /> */}
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

      {/* Previous roadmap section, temporarily hidden.
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
      */}

      <section className="creation-flow-section" aria-labelledby="creation-flow-title" ref={creationFlowRef}>
        <div className="creation-flow-heading">
          <h2 id="creation-flow-title">{t('creationFlowTitle')}</h2>
          <p>{t('creationFlowSubtitle')}</p>
        </div>
        <div className="creation-flow-layout">
          <div className="creation-flow-steps">
            {creationSteps.map((step, index) => {
              const Icon = [Search, Pencil, Share2][index] || Sparkles;
              return (
                <article className="creation-flow-step flow-reveal" key={step.title} style={{ '--flow-index': index }}>
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
        {faqChatOpen && (
          <div className="faq-chatbot is-open" role="dialog" aria-label={`${t('brand')} ${t('faq')}`}>
            <div className="faq-chatbot-header">
              <span><Bot size={18} /> {t('faq')}</span>
              <button type="button" onClick={() => setFaqChatOpen(false)} aria-label="Close FAQ chat"><X size={18} /></button>
            </div>
            <div className="faq-chatbot-body">
              <div className="faq-chatbot-greeting">
                <Bot size={18} />
                <p>{t('faqTitle')}</p>
              </div>
              <div className="faq-chatbot-questions" aria-label={t('faqTitle')}>
                {faqItems.map(([question], index) => (
                  <button
                    key={question}
                    type="button"
                    className={chatFaqIndex === index ? 'is-active' : ''}
                    onClick={() => setChatFaqIndex(index)}
                    aria-pressed={chatFaqIndex === index}
                  >
                    {question}
                  </button>
                ))}
              </div>
              {chatTyping ? (
                <div className="faq-chatbot-answer is-typing" aria-live="polite">
                  <span><Bot size={16} /></span>
                  <p><i /> <i /> <i /></p>
                </div>
              ) : (
                <div className="faq-chatbot-answer" key={displayedChatFaqIndex} aria-live="polite">
                  <span><Bot size={16} /></span>
                  <p>{faqItems[displayedChatFaqIndex]?.[1]}</p>
                </div>
              )}
            </div>
          </div>
        )}
        {socialsOpen && (
          <>
            <a href="mailto:hello@amulet.local" aria-label="Email Amulet"><Mail size={23} /></a>
            <a href="viber://chat?number=%2B37477805607" aria-label="Viber"><Phone size={23} /></a>
            <a href="https://wa.me/37477805607" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={24} /></a>
            <a href="https://t.me/" target="_blank" rel="noreferrer" aria-label="Telegram"><Send size={23} /></a>
          </>
        )}
        <button
          className={faqChatOpen ? 'floating-question is-active' : 'floating-question'}
          type="button"
          onClick={() => setFaqChatOpen((value) => !value)}
          aria-label={t('faq')}
          aria-expanded={faqChatOpen}
        >
          <HelpCircle size={28} />
        </button>
        <button className="floating-chat" type="button" onClick={() => setSocialsOpen((value) => !value)} aria-label="Open social links">
          {socialsOpen ? <X size={24} /> : <MessageCircle size={25} />}
        </button>
      </div>
    </>
  );
}
