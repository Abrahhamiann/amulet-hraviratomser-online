import React from 'react';
import { Link } from 'react-router-dom';
import { COMPANY_SITE_URL } from '../config/env.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import paymentMethodsLogo from '../assets/payments/arca-mastercard-visa.png';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <Link className="footer-wordmark" to="/" aria-label="Amulet">
        <span>Amulet</span>
      </Link>
      <div className="footer-meta">
        <a className="footer-rsoft" href={COMPANY_SITE_URL} target="_blank" rel="noreferrer">&copy;2026 R'SOFT | {t('allRightsReserved')}</a>
        <div className="footer-payments footer-payments-new" role="group" aria-label={t('paymentMethods')}>
          <img
            className="footer-payment-methods-logo"
            src={paymentMethodsLogo}
            alt="ArCa, Mastercard, Visa"
            width="2172"
            height="600"
            loading="lazy"
          />
        </div>
      </div>
    </footer>
  );
}
