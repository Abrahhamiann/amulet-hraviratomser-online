import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import callIcon from '../assets/contact/call.png';
import telegramIcon from '../assets/contact/telegram.png';
import whatsappIcon from '../assets/contact/whatsapp.jpg';
import { CONTACT_PHONE_DIGITS, CONTACT_PHONE_E164, CONTACT_TELEGRAM_URL } from '../data/contact.js';

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={isOpen ? 'floating-help expanded' : 'floating-help'} aria-label="Quick contact buttons">
      {isOpen && (
        <>
          <a className="floating-contact-link is-phone" href={`tel:${CONTACT_PHONE_E164}`} aria-label={`Call Amulet ${CONTACT_PHONE_E164}`}>
            <img src={callIcon} alt="" aria-hidden="true" />
          </a>
          <a className="floating-contact-link is-whatsapp" href={`https://wa.me/${CONTACT_PHONE_DIGITS}`} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${CONTACT_PHONE_E164}`}>
            <img src={whatsappIcon} alt="" aria-hidden="true" />
          </a>
          <a className="floating-contact-link is-telegram" href={CONTACT_TELEGRAM_URL} target="_blank" rel="noreferrer" aria-label="Telegram @amulet_invitiations">
            <img src={telegramIcon} alt="" aria-hidden="true" />
          </a>
        </>
      )}
      <button
        className="floating-chat"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? 'Close contact links' : 'Open contact links'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={25} />}
      </button>
    </div>
  );
}
