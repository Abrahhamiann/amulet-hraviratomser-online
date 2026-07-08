import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

function calculateGap(width) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;

  if (width <= minWidth) return minGap;
  if (width >= maxWidth) return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export default function CircularTestimonials({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {}
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);
  const imageContainerRef = useRef(null);
  const autoplayIntervalRef = useRef(null);

  const testimonialsLength = useMemo(() => testimonials.length, [testimonials]);
  const activeTestimonial = testimonials[activeIndex] || testimonials[0];

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonialsLength) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!autoplay || testimonialsLength < 2) return undefined;

    autoplayIntervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonialsLength);
    }, 5000);

    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [autoplay, testimonialsLength]);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'ArrowLeft') handlePrev();
      if (event.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleNext, handlePrev]);

  function getImageStyle(index) {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + testimonialsLength) % testimonialsLength === index;
    const isRight = (activeIndex + 1) % testimonialsLength === index;

    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: 'auto',
        transform: 'translateX(0px) translateY(0px) scale(1) rotateY(0deg)'
      };
    }

    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: 'auto',
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`
      };
    }

    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: 'auto',
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`
      };
    }

    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: 'none'
    };
  }

  if (!activeTestimonial) return null;

  const colorName = colors.name ?? '#17202b';
  const colorDesignation = colors.designation ?? '#ef382b';
  const colorTestimony = colors.testimony ?? '#4a5565';
  const colorArrowBg = colors.arrowBackground ?? '#17202b';
  const colorArrowFg = colors.arrowForeground ?? '#ffffff';
  const colorArrowHoverBg = colors.arrowHoverBackground ?? '#ef382b';

  return (
    <div className="circular-testimonials">
      <div className="circular-testimonials-grid">
        <div className="circular-image-container" ref={imageContainerRef}>
          {testimonials.map((testimonial, index) => (
            <img
              key={testimonial.src}
              src={testimonial.src}
              alt={testimonial.name}
              className="circular-testimonial-image"
              style={getImageStyle(index)}
            />
          ))}
        </div>
        <div className="circular-testimonial-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <h3 className="circular-name" style={{ color: colorName, fontSize: fontSizes.name ?? '1.75rem' }}>
                {activeTestimonial.name}
              </h3>
              <p className="circular-designation" style={{ color: colorDesignation, fontSize: fontSizes.designation ?? '1rem' }}>
                {activeTestimonial.designation}
              </p>
              <p className="circular-quote" style={{ color: colorTestimony, fontSize: fontSizes.quote ?? '1.05rem' }}>
                {activeTestimonial.quote.split(' ').map((word, index) => (
                  <motion.span
                    key={`${word}-${index}`}
                    initial={{ filter: 'blur(10px)', opacity: 0, y: 5 }}
                    animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut', delay: 0.025 * index }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="circular-arrow-buttons">
            <button
              className="circular-arrow-button"
              type="button"
              onClick={handlePrev}
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
              style={{ backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg }}
              aria-label="Previous event"
            >
              <FaArrowLeft size={18} color={colorArrowFg} />
            </button>
            <button
              className="circular-arrow-button"
              type="button"
              onClick={handleNext}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              style={{ backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg }}
              aria-label="Next event"
            >
              <FaArrowRight size={18} color={colorArrowFg} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
