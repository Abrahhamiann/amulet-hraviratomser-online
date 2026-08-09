import { useEffect, useState, type CSSProperties } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import './stagger-testimonials.css';

type Testimonial = { id: number | string; name: string; text: string };

type Props = {
  testimonials: Testimonial[];
  title: string;
  subtitle?: string;
};

const SQRT_5000 = Math.sqrt(5000);

export default function StaggerTestimonials({ testimonials, title, subtitle }: Props) {
  const [cardSize, setCardSize] = useState(365);
  const [items, setItems] = useState(testimonials);

  useEffect(() => setItems(testimonials), [testimonials]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 640px)');
    const updateSize = () => setCardSize(media.matches ? 365 : 290);
    updateSize();
    media.addEventListener('change', updateSize);
    return () => media.removeEventListener('change', updateSize);
  }, []);

  const move = (steps: number) => {
    if (!steps) return;
    setItems((current) => {
      const next = [...current];
      if (steps > 0) {
        for (let index = 0; index < steps; index += 1) {
          const first = next.shift();
          if (first) next.push(first);
        }
      } else {
        for (let index = 0; index > steps; index -= 1) {
          const last = next.pop();
          if (last) next.unshift(last);
        }
      }
      return next;
    });
  };

  return (
    <section className="about-stagger-testimonials" aria-labelledby="about-stagger-title">
      <header>
        <span>AMULET STORIES</span>
        <h2 id="about-stagger-title">{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>
      <div className="stagger-testimonial-stage">
        {items.map((item, index) => {
          const position = index - Math.floor(items.length / 2);
          const centered = position === 0;
          return (
            <button
              type="button"
              key={item.id}
              className={centered ? 'stagger-testimonial-card is-center' : 'stagger-testimonial-card'}
              onClick={() => move(position)}
              aria-label={`${item.name}․ ${item.text}`}
              style={{
                '--card-size': `${cardSize}px`,
                '--card-x': `${(cardSize / 1.5) * position}px`,
                '--card-y': `${centered ? -65 : position % 2 ? 15 : -15}px`,
                '--card-rotate': `${centered ? 0 : position % 2 ? 2.5 : -2.5}deg`,
                '--card-z': String(Math.max(0, 20 - Math.abs(position))),
                clipPath: 'polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, 50px 100%, 0 100%, 0 0)'
              } as CSSProperties}
            >
              <span className="stagger-fold" aria-hidden="true" style={{ width: SQRT_5000 }} />
              <Quote size={30} aria-hidden="true" />
              <strong>«{item.text}»</strong>
              <span className="stagger-testimonial-name">— {item.name}</span>
            </button>
          );
        })}
        <div className="stagger-testimonial-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Նախորդ կարծիքը"><ChevronLeft /></button>
          <button type="button" onClick={() => move(1)} aria-label="Հաջորդ կարծիքը"><ChevronRight /></button>
        </div>
      </div>
    </section>
  );
}
