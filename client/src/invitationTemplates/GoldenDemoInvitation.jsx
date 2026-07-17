import React from 'react';
import { CalendarDays, Clock, MapPin, ShoppingBag, Sparkles } from 'lucide-react';
import Button from '../components/Button.jsx';
import weddingImage from '../assets/morph/wedding-sunset.jpg';

export const goldenDemoInitialData = {
  fullName: 'Aram Hakobyan & Lilit Sargsyan',
  eventDate: '2026-09-14',
  eventTime: '18:00',
  eventLocation: 'Elegant Hall, Yerevan',
  message: 'Together with our families, we invite you to celebrate a warm evening of love, music, and unforgettable moments.',
  price: 29000,
  images: [weddingImage]
};

const formatDate = (value) => {
  if (!value) return 'September 14, 2026';
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(`${value}T00:00:00`));
};

export default function GoldenDemoInvitation({ data, onEdit, onBuy }) {
  const heroImage = data.images?.[0] || weddingImage;

  return (
    <article className="demo-invite-template">
      <div className="demo-invite-hero">
        <img src={heroImage} alt={data.fullName} />
        <div className="demo-invite-scrim" />
        <div className="demo-invite-content">
          <span><Sparkles size={16} /> Ոսկե հրավեր</span>
          <h1>{data.fullName}</h1>
          <p>{data.message}</p>
        </div>
      </div>

      <div className="demo-invite-details">
        <div>
          <CalendarDays size={20} />
          <span>{formatDate(data.eventDate)}</span>
        </div>
        <div>
          <Clock size={20} />
          <span>{data.eventTime}</span>
        </div>
        <div>
          <MapPin size={20} />
          <span>{data.eventLocation}</span>
        </div>
      </div>

      <div className="demo-invite-footer">
        <div>
          <span>Հրավերի արժեքը</span>
          <strong>{Number(data.price).toLocaleString()} AMD</strong>
        </div>
        <div className="demo-invite-actions">
          <Button type="button" variant="ghost" onClick={onEdit}>Խմբագրել հրավերը</Button>
          <Button type="button" className="buy-demo-btn" onClick={onBuy}>
            <ShoppingBag size={18} />
            Գնել
          </Button>
        </div>
      </div>
    </article>
  );
}
