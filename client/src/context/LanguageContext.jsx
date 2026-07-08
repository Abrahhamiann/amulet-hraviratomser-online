import React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '../translations/translations.js';

const LanguageContext = createContext(null);

const getInitialLanguage = () => {
  const saved = localStorage.getItem('language');
  return translations[saved] ? saved : 'hy';
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (code) => {
    if (!translations[code]) return;
    localStorage.setItem('language', code);
    setLanguageState(code);
  };
  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key) => {
      if (Object.prototype.hasOwnProperty.call(translations[language] || {}, key)) return translations[language][key];
      if (Object.prototype.hasOwnProperty.call(translations.en, key)) return translations.en[key];
      return key;
    }
  }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
