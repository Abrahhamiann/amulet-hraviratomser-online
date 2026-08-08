import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export default function TypewriterTestimonials({ testimonials, title, subtitle }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(null);
  const [typedText, setTypedText] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    window.clearTimeout(timerRef.current);
    const text = active === null ? '' : testimonials[active]?.text || '';
    if (!text) { setTypedText(''); return undefined; }
    if (reduceMotion) { setTypedText(text); return undefined; }
    let index = 0;
    setTypedText('');
    const type = () => {
      index += 1;
      setTypedText(text.slice(0, index));
      if (index < text.length) timerRef.current = window.setTimeout(type, 22);
    };
    timerRef.current = window.setTimeout(type, 80);
    return () => window.clearTimeout(timerRef.current);
  }, [active, reduceMotion, testimonials]);

  return (
    <section className="typewriter-testimonials" aria-labelledby="about-testimonials-title">
      <header>
        <span>Amulet stories</span>
        <h2 id="about-testimonials-title">{title}</h2>
        <p>{subtitle}</p>
      </header>
      <div className="typewriter-testimonial-avatars">
        {testimonials.map((item, index) => {
          const bubbleAnchor = index === 0 ? 18 : index === testimonials.length - 1 ? 82 : 50;
          return (
          <motion.article
            className={active === index ? 'is-active' : ''}
            key={`${item.name}-${index}`}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(null)}
            onClick={() => setActive((current) => current === index ? null : index)}
            whileHover={reduceMotion ? undefined : { y: -4, scale: 1.035 }}
          >
            <button type="button" aria-label={`${item.name}: ${item.text}`} aria-expanded={active === index}>
              <img src={item.image} alt="" />
            </button>
            <AnimatePresence>
              {active === index && (
                <motion.div className="typewriter-testimonial-bubble" style={{ x: `-${bubbleAnchor}%`, '--testimonial-bubble-anchor': `${bubbleAnchor}%` }} initial={reduceMotion ? false : { opacity: 0, y: 8, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: .96 }} transition={{ duration: .22 }}>
                  <p>{typedText}<i aria-hidden="true" /></p>
                  <strong>{item.name}</strong>
                  <small>{item.jobtitle}</small>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
          );
        })}
      </div>
    </section>
  );
}
