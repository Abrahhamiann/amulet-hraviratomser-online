import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span>{question}</span>
        <ChevronDown className={open ? 'rotate' : ''} size={18} />
      </button>
      {open && <p>{answer}</p>}
    </div>
  );
}
