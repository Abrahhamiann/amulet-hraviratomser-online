import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQItem({ question, answer, open = false, onToggle }) {
  return (
    <div className={open ? 'faq-item is-open' : 'faq-item'}>
      <button onClick={onToggle} aria-expanded={open}>
        <span>{question}</span>
        <ChevronDown className={open ? 'rotate' : ''} size={18} />
      </button>
      <div className="faq-answer" aria-hidden={!open}>
        <p>{answer}</p>
      </div>
    </div>
  );
}
