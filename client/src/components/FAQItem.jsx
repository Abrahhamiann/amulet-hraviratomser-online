import React, { useId } from 'react';
import {
  CalendarClock,
  ChevronDown,
  Clock3,
  CreditCard,
  Image,
  Languages,
  MapPin,
  Palette,
  PencilLine,
  Share2,
  ShieldCheck,
  Smartphone,
  Users
} from 'lucide-react';

const faqIcons = [
  CreditCard,
  Clock3,
  Share2,
  Languages,
  PencilLine,
  Smartphone,
  Users,
  MapPin,
  Image,
  CalendarClock,
  ShieldCheck,
  Palette
];

export default function FAQItem({ question, answer, index = 0, open = false, onToggle }) {
  const answerId = useId();
  const Icon = faqIcons[index % faqIcons.length];

  return (
    <article className={open ? 'faq-item is-open' : 'faq-item'} style={{ '--faq-index': index }}>
      <button type="button" aria-expanded={open} aria-controls={answerId} onClick={onToggle}>
        <span className="faq-item-icon" aria-hidden="true"><Icon size={19} /></span>
        <span className="faq-item-copy"><strong>{question}</strong></span>
        <ChevronDown className={open ? 'rotate' : ''} size={18} aria-hidden="true" />
      </button>
      <div className="faq-answer" id={answerId} aria-hidden={!open}>
        <p>{answer}</p>
      </div>
    </article>
  );
}
