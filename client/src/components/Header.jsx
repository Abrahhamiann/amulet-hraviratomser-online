import React from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import Button from './Button.jsx';
import LanguageSelector from './LanguageSelector.jsx';

export default function Header() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const links = [
    ['/', t('home')],
    ['/templates', t('templates')],
    ['/about', t('about')],
    ['/contact', t('contact')]
  ];
  return (
    <header className="site-header">
      <div className="nav-shell">
        <NavLink to="/" className="logo" onClick={() => setOpen(false)}>{t('brand')}</NavLink>
        <nav className="nav-links">
          {links.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>)}
          <a className="header-phone" href="tel:+37477805607"><Phone size={16} /> +374 77 805 607</a>
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
            <NavLink to="/templates?category=wedding" onClick={() => setOpen(false)}>{t('weddingTitle')}</NavLink>
            <NavLink to="/templates?category=baptism" onClick={() => setOpen(false)}>{t('baptismTitle')}</NavLink>
            <NavLink to="/templates?category=birth" onClick={() => setOpen(false)}>{t('birthTitle')}</NavLink>
            <NavLink to="/templates?category=corporate" onClick={() => setOpen(false)}>{t('corporateTitle')}</NavLink>
            <NavLink to="/contact" onClick={() => setOpen(false)}>{t('menuPartners')}</NavLink>
            <NavLink to="/about" onClick={() => setOpen(false)}>{t('about')}</NavLink>
            <NavLink to="/admin/login" onClick={() => setOpen(false)}>{t('menuLogin')}</NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
