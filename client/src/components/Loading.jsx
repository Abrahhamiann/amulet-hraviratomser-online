import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Loading({ text, fullScreen = false, inline = false }) {
  const { t } = useLanguage();
  return (
    <div className={`loading-state${fullScreen ? ' loading-state-fullscreen' : ''}${inline ? ' loading-state-inline' : ''}`} role="status" aria-live="polite">
      <span>{text ?? t('loading')}</span>
    </div>
  );
}
