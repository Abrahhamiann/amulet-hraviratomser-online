import React from 'react';
import { languages } from '../translations/translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  return (
    <select className="language-select" value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Language">
      {languages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
    </select>
  );
}
