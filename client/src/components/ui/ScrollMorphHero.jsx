import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import baptismChurch from '../../assets/morph/baptism-church.webp';
import baptismFamily from '../../assets/morph/baptism-family.jpg';
import baptismLift from '../../assets/morph/baptism-lift.jpg';
import baptismPriest from '../../assets/morph/baptism-priest.jpg';
import baptismSoft from '../../assets/morph/baptism-soft.webp';
import baptismVogue from '../../assets/morph/baptism-vogue.jpg';
import baptismWater from '../../assets/morph/baptism-water.jpg';
import birthday20 from '../../assets/morph/birthday-20.jpg';
import birthday37 from '../../assets/morph/birthday-37.jpg';
import birthdayBlue from '../../assets/morph/birthday-blue.jpg';
import birthdayCakeLights from '../../assets/morph/birthday-cake-lights.jpg';
import birthdayPhone from '../../assets/morph/birthday-phone.jpg';
import corporateEvent from '../../assets/morph/corporate-event.jpg';
import corporateWarm from '../../assets/morph/corporate-warm.jpg';
import engagementBouquetRed from '../../assets/morph/engagement-bouquet-red.jpg';
import engagementChandelier from '../../assets/morph/engagement-chandelier.jpg';
import engagementHand from '../../assets/morph/engagement-hand.jpg';
import engagementRing from '../../assets/morph/engagement-ring.jpg';
import engagementRoses from '../../assets/morph/engagement-roses.jpg';
import engagementSmile from '../../assets/morph/engagement-smile.jpg';
import weddingChurchDove from '../../assets/morph/wedding-church-dove.jpg';
import weddingChurchRed from '../../assets/morph/wedding-church-red.jpg';
import weddingForest from '../../assets/morph/wedding-forest-optimized.jpg';
import weddingSunset from '../../assets/morph/wedding-sunset.jpg';
import weddingTemple from '../../assets/morph/wedding-temple.jpg';
import weddingWhiteHall from '../../assets/morph/wedding-white-hall.jpg';
import { useLanguage } from '../../context/LanguageContext.jsx';

const CARD_WIDTH = 66;
const CARD_HEIGHT = 94;

const images = [
  baptismWater,
  baptismPriest,
  weddingForest,
  birthdayCakeLights,
  birthdayBlue,
  engagementRing,
  weddingWhiteHall,
  corporateWarm,
  corporateEvent,
  birthday37,
  birthday20,
  baptismChurch,
  baptismFamily,
  baptismLift,
  engagementHand,
  engagementRoses,
  engagementBouquetRed,
  engagementSmile,
  engagementChandelier,
  weddingSunset,
  baptismSoft,
  baptismVogue,
  weddingChurchDove,
  weddingChurchRed,
  weddingTemple,
  birthdayPhone
];

const labelKeys = [
  'baptism',
  'baptism',
  'wedding',
  'birth',
  'birth',
  'engagement',
  'wedding',
  'corporate',
  'corporate',
  'birth',
  'birth',
  'baptism',
  'baptism',
  'baptism',
  'engagement',
  'engagement',
  'engagement',
  'engagement',
  'engagement',
  'wedding',
  'baptism',
  'baptism',
  'wedding',
  'wedding',
  'wedding',
  'birth'
];

const TOTAL_IMAGES = images.length;

function lerp(start, end, value) {
  return start * (1 - value) + end * value;
}

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function FlipCard({ src, label, index, target }) {
  return (
    <motion.div
      className="scroll-morph-card"
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity
      }}
      transition={{ type: 'spring', stiffness: 42, damping: 16 }}
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      <motion.div
        className="scroll-morph-card-inner"
        whileHover={{ rotateY: 180 }}
        transition={{ duration: 0.55, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="scroll-morph-card-face scroll-morph-card-front">
          <img src={src} alt={`${label} ${index + 1}`} loading={index < 8 ? 'eager' : 'lazy'} />
        </div>
        <div className="scroll-morph-card-face scroll-morph-card-back">
          <span>{label}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ScrollMorphHero() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const [introPhase, setIntroPhase] = useState('scatter');
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [morph, setMorph] = useState(0);
  const [parallax, setParallax] = useState(0);

  const scatterPositions = useMemo(
    () => images.map((_, index) => {
      const angle = (index / images.length) * Math.PI * 2;
      return {
        x: Math.cos(angle) * (430 + (index % 4) * 50),
        y: Math.sin(angle) * (235 + (index % 5) * 28),
        rotation: (index % 2 ? 1 : -1) * (24 + index * 2.5),
        scale: 0.62,
        opacity: 0
      };
    }),
    []
  );

  useEffect(() => {
    const first = window.setTimeout(() => setIntroPhase('line'), 450);
    const second = window.setTimeout(() => setIntroPhase('circle'), 1850);

    return () => {
      window.clearTimeout(first);
      window.clearTimeout(second);
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height
      });
    });

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const start = viewport * 0.82;
      const end = -rect.height * 0.22;
      setMorph(clamp((start - rect.top) / Math.max(1, start - end)));
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const normalized = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    setParallax(normalized * 38);
  };

  return (
    <section
      className="scroll-morph-section"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setParallax(0)}
      aria-labelledby="scroll-morph-title"
    >
      <div className="scroll-morph-copy">
        <p>{t('invitationGallery')}</p>
        <h2 id="scroll-morph-title">{t('morphTitle')}</h2>
      </div>
      <div className="scroll-morph-stage" aria-label={t('invitationGallery')}>
        {images.map((src, index) => {
          const isMobile = size.width < 720;
          const arcProgress = Math.max(morph, 0.86);
          const minDimension = Math.min(size.width || 1, size.height || 1);
          const circleRadius = Math.min(minDimension * (isMobile ? 0.38 : 0.38), isMobile ? 176 : 328);
          const circleAngle = (index / TOTAL_IMAGES) * 360;
          const circleRad = (circleAngle * Math.PI) / 180;
          const circlePos = {
            x: Math.cos(circleRad) * circleRadius,
            y: Math.sin(circleRad) * circleRadius,
            rotation: circleAngle + 90
          };

          const arcRadius = Math.min(size.width * (isMobile ? 1.3 : 0.94), size.height * (isMobile ? 1.22 : 1.1));
          const spreadAngle = isMobile ? 172 : 188;
          const startAngle = -90 - spreadAngle / 2;
          const currentArcAngle = startAngle + (index * spreadAngle) / (TOTAL_IMAGES - 1);
          const arcRad = (currentArcAngle * Math.PI) / 180;
          const arcCenterY = size.height * (isMobile ? 0.71 : 0.76) + arcRadius * 0.12;
          const arcPos = {
            x: Math.cos(arcRad) * arcRadius + parallax * arcProgress,
            y: Math.sin(arcRad) * arcRadius + arcCenterY,
            rotation: currentArcAngle + 90,
            scale: isMobile ? 1.02 : 1.16
          };

          let target = scatterPositions[index];
          if (introPhase === 'line') {
            const spacing = isMobile ? 42 : 58;
            target = {
              x: index * spacing - (TOTAL_IMAGES * spacing) / 2,
              y: 18 * Math.sin(index * 0.8),
              rotation: 0,
              scale: 1,
              opacity: 1
            };
          }

          if (introPhase === 'circle') {
            target = {
              x: lerp(circlePos.x, arcPos.x, arcProgress),
              y: lerp(circlePos.y, arcPos.y, arcProgress),
              rotation: lerp(circlePos.rotation, arcPos.rotation, arcProgress),
              scale: lerp(1, arcPos.scale, arcProgress),
              opacity: 1
            };
          }

          return (
            <FlipCard
              key={`${labelKeys[index]}-${index}`}
              src={src}
              label={t(labelKeys[index])}
              index={index}
              target={target}
            />
          );
        })}
      </div>
    </section>
  );
}
