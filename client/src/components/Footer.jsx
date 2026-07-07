import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div>
        <Link to="/" className="logo">{t('brand')}</Link>
        <p>{t('footerText')}</p>
      </div>
      <div className="footer-links">
        <Link to="/templates">{t('templates')}</Link>
        <Link to="/about">{t('about')}</Link>
        <Link to="/contact">{t('contact')}</Link>
        <Link to="/admin/login">{t('login')}</Link>
      </div>
    </footer>
  );
}
