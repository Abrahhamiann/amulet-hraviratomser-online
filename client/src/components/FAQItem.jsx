import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import faqIcon from '../assets/home/faq-icon.png';

export default function FAQItem({ question, answer, index = 0, open = false, onToggle }) {
  const answerId = useId();

  return (
    <article className={open ? 'faq-item is-open' : 'faq-item'} style={{ '--faq-index': index }}>
      <button type="button" aria-expanded={open} aria-controls={answerId} onClick={onToggle}>
        <span className="faq-item-icon" aria-hidden="true"><img src={faqIcon} alt="" /></span>
        <span className="faq-item-copy"><strong>{question}</strong></span>
        <ChevronDown className={open ? 'rotate' : ''} size={18} aria-hidden="true" />
      </button>
      <div className="faq-answer" id={answerId} aria-hidden={!open}>
        <p>{answer}</p>
      </div>
    </article>
  );
}
