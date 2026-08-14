import React from 'react';
import { Menu, Phone, UserCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164 } from '../data/contact.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import LanguageSelector from './LanguageSelector.jsx';

export default function Header() {
  const { t } = useLanguage();
  const { user, initialized } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = [
    ['/', t('home')],
    ['/templates', t('templates')],
    ['/about', t('about')],
    ['/contact', t('contact')]
  ];
  const desktopOverlayLinks = [
    ['/templates?category=wedding', t('weddingTitle')],
    ['/templates?category=baptism', t('baptismTitle')],
    ['/templates?category=birth', t('birthTitle')],
    ['/templates?category=corporate', t('corporateTitle')],
    ['/templates?category=engagement', t('engagement')],
    ['/contact', t('menuPartners')],
    ['/privacy', t('menuPrivacy')]
  ];
  const mobileOverlayLinks = [...links, ['/privacy', t('menuPrivacy')]];

  useEffect(() => {
    let frame = 0;

    const updateHeader = () => {
      const next = window.scrollY > 18;
      setScrolled((current) => (current === next ? current : next));
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateHeader);
    };

    updateHeader();
    window.addEventListener('scroll', requestUpdate, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const scrollY = window.scrollY;
    const { style } = document.body;
    const previous = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      width: style.width
    };

    document.body.classList.add('nav-lock');
    style.position = 'fixed';
    style.top = `-${scrollY}px`;
    style.left = '0';
    style.right = '0';
    style.width = '100%';

    return () => {
      document.body.classList.remove('nav-lock');
      style.position = previous.position;
      style.top = previous.top;
      style.left = previous.left;
      style.right = previous.right;
      style.width = previous.width;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const brandLogo = (
    <img className="logo-image" src={logoImage} alt={t('brand')} width="72" height="72" />
  );

  const overlay = (
    <div className="nav-overlay" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <button className="nav-overlay-close" onClick={() => setOpen(false)} aria-label="Close menu"><X size={34} /></button>
      <div className="nav-overlay-panel">
        <NavLink to="/" className="logo overlay-logo" onClick={() => setOpen(false)}>{brandLogo}</NavLink>
        <p className="nav-overlay-tagline">{t('menuTagline')}</p>
        <div className="nav-overlay-links nav-overlay-links-desktop">
          {desktopOverlayLinks.map(([to, label], index) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              style={{ '--menu-index': index }}
            >
              {label}
            </NavLink>
          ))}
        </div>
        <div className="nav-overlay-links nav-overlay-links-mobile">
          {mobileOverlayLinks.map(([to, label], index) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              style={{ '--menu-index': index }}
            >
              {label}
            </NavLink>
          ))}
        </div>
        <a className="nav-overlay-phone" href={`tel:${CONTACT_PHONE_E164}`} onClick={() => setOpen(false)}>
          <Phone size={18} />
          <span>{CONTACT_PHONE_DISPLAY}</span>
        </a>
        <div className="nav-overlay-secondary">
          {user && <NavLink to="/account" onClick={() => setOpen(false)}>{t('accountTitle')}</NavLink>}
          {!user && <NavLink to="/login" onClick={() => setOpen(false)}>{t('menuLogin')}</NavLink>}
        </div>
      </div>
    </div>
  );

  return (
    <header className={scrolled || open ? 'site-header is-scrolled' : 'site-header'}>
      <div className="nav-shell">
        <NavLink to="/" className="logo" onClick={() => setOpen(false)}>{brandLogo}</NavLink>
        <nav className="nav-links">
          {links.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>)}
          <a className="header-phone" href={`tel:${CONTACT_PHONE_E164}`}><Phone size={16} /> {CONTACT_PHONE_DISPLAY}</a>
          <LanguageSelector />
        </nav>
        <div className="mobile-header-actions">
          <div className="mobile-header-language">
            <LanguageSelector compact />
          </div>
          {initialized && (user ? (
            <NavLink className="icon-btn profile-btn" to="/account" onClick={() => setOpen(false)} aria-label={t('accountTitle')}>
              <UserCircle size={22} aria-hidden="true" />
            </NavLink>
          ) : (
            <NavLink className="icon-btn header-auth-btn" to="/login" onClick={() => setOpen(false)}>
              {t('menuLogin')}
            </NavLink>
          ))}
          <button className="icon-btn menu-btn" onClick={() => setOpen((value) => !value)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && typeof document !== 'undefined' && createPortal(overlay, document.body)}
    </header>
  );
}
