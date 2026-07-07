import React from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import { translations } from '../translations/translations.js';

const LanguageContext = createContext(null);

const getInitialLanguage = () => {
  const saved = localStorage.getItem('language');
  return translations[saved] ? saved : 'hy';
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(getInitialLanguage);
  const setLanguage = (code) => {
    if (!translations[code]) return;
    localStorage.setItem('language', code);
    setLanguageState(code);
  };
  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key) => translations[language]?.[key] || translations.en[key] || key
  }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
