import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQItem({ question, answer, open = false, onToggle }) {
  const answerId = useId();

  return (
    <div className={open ? 'faq-item is-open' : 'faq-item'} onClick={onToggle}>
      <button type="button" aria-expanded={open} aria-controls={answerId}>
        <span>{question}</span>
        <ChevronDown className={open ? 'rotate' : ''} size={18} />
      </button>
      <div className="faq-answer" id={answerId} aria-hidden={!open}>
        <p>{answer}</p>
      </div>
    </div>
  );
}
