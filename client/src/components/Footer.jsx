import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <Link className="footer-wordmark" to="/" aria-label="Amulet">
        <span>Amulet</span>
      </Link>
      <a className="footer-rsoft" href="https://rsoft.am" target="_blank" rel="noreferrer">&copy;2026 R'SOFT | All Rights Reserved</a>
    </footer>
  );
}
