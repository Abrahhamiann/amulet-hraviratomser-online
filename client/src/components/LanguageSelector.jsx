import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { languages } from '../translations/translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const activeLanguage = languages.find((item) => item.code === language) || languages[0];

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const chooseLanguage = (code) => {
    setLanguage(code);
    setOpen(false);
  };

  return (
    <div className="language-picker" ref={rootRef}>
      <button className="language-select" type="button" onClick={() => setOpen((value) => !value)} aria-label="Language" aria-expanded={open}>
        <span>{activeLanguage.label}</span>
        <ChevronDown size={15} />
      </button>
      {open && (
        <div className="language-menu" role="listbox" aria-label="Language">
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              className={item.code === language ? 'is-active' : ''}
              onClick={() => chooseLanguage(item.code)}
              role="option"
              aria-selected={item.code === language}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
