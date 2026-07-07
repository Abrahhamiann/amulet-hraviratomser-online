import React from 'react';
import { CreditCard, HelpCircle, Mail, MessageCircle, MonitorCheck, Pencil, Phone, Search, Send, Share2, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import iphoneFrame from '../assets/iphone-frame.png';
import angelBg from '../assets/landing/angel-bg.jpg';
import baptismBg from '../assets/landing/baptism-bg.webp';
import birthdayBg from '../assets/landing/birthday-bg.jpg';
import iphone17Frame from '../assets/landing/iphone17-frame.png';
import weddingBg from '../assets/landing/wedding-bg.jpg';
import Button from '../components/Button.jsx';
import FAQItem from '../components/FAQItem.jsx';
import TemplateCard from '../components/TemplateCard.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const eventBands = [
  {
    key: 'wedding',
    titleKey: 'weddingTitle',
    subtitleKey: 'weddingSubtitle',
    tone: 'wedding',
    bg: weddingBg,
    phoneKeys: ['phoneWeddingNames', 'phoneWeddingDate']
  },
  {
    key: 'baptism',
    titleKey: 'baptismTitle',
    subtitleKey: 'baptismSubtitle',
    tone: 'baptism',
    bg: baptismBg,
    accent: angelBg,
    phoneKeys: ['phoneBaptismName', 'phoneBlessedDay']
  },
  {
    key: 'birth',
    titleKey: 'birthTitle',
    subtitleKey: 'birthSubtitle',
    tone: 'birthday',
    bg: birthdayBg,
    phoneKeys: ['phoneBirthday', 'phoneWeddingDate']
  },
  {
    key: 'corporate',
    titleKey: 'corporateTitle',
    subtitleKey: 'corporateSubtitle',
    tone: 'corporate',
    bg: weddingBg,
    phoneKeys: ['phoneCorporate', 'corporate']
  }
];

const roadmapIcons = [Search, MonitorCheck, Pencil, Sparkles, CreditCard, Share2, MessageCircle];

function PhoneMock({ label, tone = 'paper', small = false, frame = 'classic', tilt = 'left' }) {
  const frameSrc = frame === 'pro' ? iphone17Frame : iphoneFrame;
  return (
    <div className={small ? `phone-mock small ${tone} tilt-${tilt}` : `phone-mock ${tone} tilt-${tilt}`}>
      <div className="phone-screen">
        <span>{label}</span>
      </div>
      <img src={frameSrc} alt="iPhone invitation preview" />
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

  const hashtags = t('hashtags');
  const faqItems = t('faqItems');
  const roadmapSteps = t('roadmapSteps');
  const roadmapLastIndex = Math.max(roadmapSteps.length - 1, 1);
  const activeRoadmapIndex = Math.min(roadmapSteps.length - 1, Math.max(0, Math.round(roadmapProgress * roadmapLastIndex)));
  const scrollToFaq = () => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <>
      <section className="amulet-hero">
        <div className="hero-light-orbit" />
        <h1>{t('heroTitle')}</h1>
        <div className="hero-showcase" aria-label="Invitation examples">
          <div className="landmark landmark-left">LOVE</div>
          <div className="hero-device-stage">
            <PhoneMock label={t('heroDevice')} tone="paper" frame="pro" />
            <PhoneMock label={t('heroRsvp')} tone="wedding" small frame="pro" tilt="right" />
          </div>
          <div className="landmark landmark-right">JOY</div>
        </div>
        <Button to="/order" className="red-pill">{t('orderNow')}</Button>
      </section>

      <section className="amulet-search">
        <Search size={18} />
        <Link to="/templates">{hashtags[0]}</Link>
        <Link to="/templates?category=wedding">{hashtags[1]}</Link>
        <Link to="/templates?category=baptism">{hashtags[2]}</Link>
        <Link to="/templates?category=birth">{hashtags[3]}</Link>
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

      <section className="amulet-bands">
        {eventBands.map((band, index) => (
          <article
            className={`event-band ${band.tone}`}
            key={band.key}
            style={{ '--band-bg': `url("${band.bg}")`, '--accent-bg': band.accent ? `url("${band.accent}")` : 'none' }}
          >
            <div className="band-photo-layer" />
            {band.accent && <div className="angel-layer" aria-hidden="true" />}
            <div className="band-copy">
              <h2>{t(band.titleKey)}</h2>
              <p>{t(band.subtitleKey)}</p>
              <Button to={`/templates?category=${band.key}`} variant="ghost" className="outline-red">{t('chooseInvitation')}</Button>
            </div>
            <div className="band-phones">
              <PhoneMock label={t(band.phoneKeys[0])} tone={band.tone} small frame="pro" tilt={index % 2 ? 'right' : 'left'} />
              <PhoneMock label={t(band.phoneKeys[1])} tone={band.tone} small tilt={index % 2 ? 'left' : 'right'} />
            </div>
          </article>
        ))}
      </section>

      <section className="partner-band" style={{ '--band-bg': `url("${birthdayBg}")` }}>
        <div className="band-photo-layer" />
        <h2>{t('partnerTitle')}</h2>
        <p>{t('partnerSubtitle')}</p>
        <div className="partner-phones">
          <PhoneMock label="Cheers" tone="partner" small frame="pro" tilt="left" />
          <PhoneMock label="Guests" tone="partner" small tilt="right" />
        </div>
        <Button to="/contact" variant="ghost">{t('partnerLogin')}</Button>
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
