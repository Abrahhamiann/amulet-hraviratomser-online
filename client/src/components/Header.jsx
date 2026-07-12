import React from 'react';
import { Menu, Phone, UserCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import Button from './Button.jsx';
import LanguageSelector from './LanguageSelector.jsx';

const getStoredUser = () => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    localStorage.removeItem('user');
    return null;
  }

  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

export default function Header() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(getStoredUser);
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

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());
    window.addEventListener('storage', syncUser);
    window.addEventListener('amulet-auth-change', syncUser);
    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('amulet-auth-change', syncUser);
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
        <div className="mobile-header-actions">
          {user && (
            <NavLink className="icon-btn profile-btn" to="/account" onClick={() => setOpen(false)} aria-label={t('accountTitle')}>
              <UserCircle size={22} />
            </NavLink>
          )}
          <div className="mobile-header-language">
            <LanguageSelector compact />
          </div>
          <button className="icon-btn menu-btn" onClick={() => setOpen((value) => !value)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <div className="mobile-language-row">
          <LanguageSelector />
        </div>
        <nav className="mobile-scroll-links" aria-label="Mobile quick navigation">
          {links.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>)}
          <a className="mobile-scroll-phone" href="tel:+37455710208"><Phone size={14} /> +374 55 710 208</a>
        </nav>
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
              {user && <NavLink to="/account" onClick={() => setOpen(false)}>{t('accountTitle')}</NavLink>}
              {!user && <NavLink to="/login" onClick={() => setOpen(false)}>{t('menuLogin')}</NavLink>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
