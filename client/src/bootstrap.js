import { needsLegacy } from './utils/browserSupport.js';
import './styles.css';

if (!needsLegacy) {
  import('./main.jsx').catch(() => {
    const root = document.getElementById('root');
    root.textContent = 'Amulet could not load. ';
    const link = document.createElement('a');
    link.href = window.AmuletBrowserSupport.legacyUrl();
    link.textContent = 'Open the simple version';
    root.appendChild(link);
  });
}
