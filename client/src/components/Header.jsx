import React from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import Button from './Button.jsx';
import LanguageSelector from './LanguageSelector.jsx';

export default function Header() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = [
    ['/', t('home')],
    ['/templates', t('templates')],
    ['/about', t('about')],
    ['/contact', t('contact')]
  ];
  const overlayLinks = [
    ['/templates?category=wedding', t('weddingTitle')],
    ['/templates?category=baptism', t('baptismTitle')],
    ['/templates?category=birth', t('birthTitle')],
    ['/templates?category=corporate', t('corporateTitle')],
    ['/templates?category=engagement', t('engagement')],
    ['/contact', t('menuPartners')],
    ['/privacy', t('menuPrivacy')]
  ];

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

  return (
    <header className={scrolled || open ? 'site-header is-scrolled' : 'site-header'}>
      <div className="nav-shell">
        <NavLink to="/" className="logo" onClick={() => setOpen(false)}>{t('brand')}</NavLink>
        <nav className="nav-links">
          {links.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>)}
          <a className="header-phone" href="tel:+37455710208"><Phone size={16} /> +374 55 710 208</a>
          <LanguageSelector />
          <Button to="/order" className="nav-cta">{t('orderNow')}</Button>
        </nav>
        <button className="icon-btn menu-btn" onClick={() => setOpen((value) => !value)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="nav-overlay" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button className="nav-overlay-close" onClick={() => setOpen(false)} aria-label="Close menu"><X size={34} /></button>
          <div className="nav-overlay-panel">
            <NavLink to="/" className="logo overlay-logo" onClick={() => setOpen(false)}>{t('brand')}</NavLink>
            <p className="nav-overlay-tagline">{t('menuTagline')}</p>
            <div className="nav-overlay-links">
              {overlayLinks.map(([to, label], index) => (
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
            <div className="nav-overlay-secondary">
              <NavLink to="/about" onClick={() => setOpen(false)}>{t('about')}</NavLink>
              <NavLink to="/admin/login" onClick={() => setOpen(false)}>{t('menuLogin')}</NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
