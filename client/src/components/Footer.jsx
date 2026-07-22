import React from 'react';
import footerLogo from '../assets/footer-amulet-logo.png';

export default function Footer() {
  return (
    <footer className="footer">
      <img className="footer-logo" src={footerLogo} alt="Amulet" />
      <a className="footer-rsoft" href="https://rsoft.am" target="_blank" rel="noreferrer">&copy;2026 R'SOFT | All Rights Reserved</a>
    </footer>
  );
}
