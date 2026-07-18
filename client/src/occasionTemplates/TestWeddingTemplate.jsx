import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Heart,
  Music2,
  Pause,
  Pencil,
  Play,
  ShoppingBag,
  X
} from 'lucide-react';
import weddingChurchRed from '../assets/morph/wedding-church-red.jpg';
import weddingForest from '../assets/morph/wedding-forest-optimized.jpg';
import weddingSunset from '../assets/morph/wedding-sunset.jpg';
import weddingTemple from '../assets/morph/wedding-temple.jpg';
import weddingWhiteHall from '../assets/morph/wedding-white-hall.jpg';
import engagementRoses from '../assets/morph/engagement-roses.jpg';
import defaultHeroImage from '../assets/occasion/test-wedding-hero.jpg';
import perfectSong from '../assets/audio/ed-sheeran-perfect.mp3';
import { getConfiguredTemplateGallery, resolveTemplateImages } from './templateAssets.js';

const fallbackGallery = [
  defaultHeroImage,
  weddingSunset,
  weddingForest,
  weddingTemple,
  weddingWhiteHall,
  weddingChurchRed,
  engagementRoses
];

const petalColors = ['#e8d5a3', '#f0e6cc', '#d4c4a0', '#c9a96e', '#f5e6d3'];

const normalizeTemplateKey = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/[_\s]+/g, '-')
  .replace(/[^a-z0-9-]/g, '')
  .replace(/-+/g, '-');

export const isTestTemplate = (template) => {
  const values = [
    normalizeTemplateKey(template?.designKey),
    normalizeTemplateKey(template?.slug),
    normalizeTemplateKey(template?.title)
  ];

  return values.some((value) => ['test', 'test-wedding', 'testwedding'].includes(value));
};

export const getTestWeddingDraft = (template = {}) => {
  const gallery = getConfiguredTemplateGallery(template, fallbackGallery);
  const uniqueGallery = [...new Set(gallery)];

  return {
  mainNames: template.title || 'Արամ և Անի',
  eventDate: '2026-08-15',
  eventTime: '15:00',
  eventLocation: 'Սուրբ Գրիգոր Լուսավորիչ եկեղեցի, Երևան',
  eventMessage: template.description || 'Սիրելի հյուրեր, մեծ սիրով հրավիրում ենք Ձեզ կիսելու մեր կյանքի ամենագեղեցիկ օրը։ Ձեր ներկայությունը մեր տոնին կդարձնի այն առավել անմոռանալի։',
  image: uniqueGallery[0] || defaultHeroImage,
  gallery: uniqueGallery
  };
};

const splitNames = (value) => {
  const text = String(value || 'Արամ և Անի').trim();
  const parts = text.split(/\s*(?:և|եւ|&|\+|\/)\s*/i).filter(Boolean);
  if (parts.length >= 2) return [parts[0], parts.slice(1).join(' ')];
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return [words[0], words.slice(1).join(' ')];
  return [text || 'Արամ', 'Անի'];
};

const formatArmenianDate = (value, options = { day: 'numeric', month: 'long' }) => {
  if (!value) return '15 Օգոստոսի';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '15 Օգոստոսի';
  return new Intl.DateTimeFormat('hy-AM', options).format(date);
};

const getYear = (value) => {
  const date = value ? new Date(`${value}T00:00:00`) : null;
  return date && !Number.isNaN(date.getTime()) ? date.getFullYear() : 2026;
};

const getDaysLeft = (value) => {
  const date = value ? new Date(`${value}T23:59:59`) : null;
  if (!date || Number.isNaN(date.getTime())) return 0;
  return Math.max(0, Math.ceil((date - new Date()) / 86400000));
};

const normalizeGallery = (draft) => {
  const draftImages = resolveTemplateImages([draft?.image, ...(draft?.gallery || [])]);
  const images = [...draftImages, ...(draftImages.length ? [] : fallbackGallery)];
  return [...new Set(images)].slice(0, 6);
};

function MusicButton() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  return (
    <button
      className={`luxury-music-button${playing ? ' is-playing' : ''}`}
      type="button"
      onClick={toggleMusic}
      aria-label={playing ? 'Դադարեցնել երաժշտությունը' : 'Միացնել երաժշտությունը'}
    >
      <audio ref={audioRef} src={perfectSong} loop preload="metadata" />
      <span><Music2 size={16} /> Երաժշտություն</span>
      {playing ? <Pause size={18} /> : <Play size={18} />}
    </button>
  );
}

function FallingPetals() {
  const petals = useMemo(() => Array.from({ length: 18 }, (_, index) => ({
    id: index,
    left: Math.random() * 100,
    delay: Math.random() * 9,
    duration: 8 + Math.random() * 8,
    size: 7 + Math.random() * 12,
    color: petalColors[index % petalColors.length],
    rotation: Math.random() * 360
  })), []);

  return (
    <div className="luxury-petals" aria-hidden="true">
      {petals.map((petal) => (
        <span
          key={petal.id}
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            background: petal.color,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
            transform: `rotate(${petal.rotation}deg)`
          }}
        />
      ))}
    </div>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <motion.div
      className="luxury-section-title"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.65 }}
    >
      <span>{eyebrow}</span>
      <i />
      {title && <h2>{title}</h2>}
      {text && <p>{text}</p>}
    </motion.div>
  );
}

function TestWeddingInvite({ draft, price, mode = 'preview', onEdit, onOrder, loading, actions, rsvpForm, daysLeftText }) {
  const [firstName, secondName] = splitNames(draft?.mainNames);
  const gallery = normalizeGallery(draft);
  const heroImage = draft?.image || gallery[0] || defaultHeroImage;
  const dateText = formatArmenianDate(draft?.eventDate);
  const fullDateText = formatArmenianDate(draft?.eventDate, { year: 'numeric', month: 'long', day: 'numeric' });
  const year = getYear(draft?.eventDate);
  const daysLeft = daysLeftText || `${getDaysLeft(draft?.eventDate)} օր`;
  const [selectedImage, setSelectedImage] = useState(null);

  const schedule = [
    {
      time: draft?.eventTime || '15:00',
      title: 'Պսակադրություն',
      location: draft?.eventLocation || 'Սուրբ Գրիգոր Լուսավորիչ եկեղեցի',
      address: 'Հասցեն կարող եք փոփոխել պատվերի ժամանակ'
    },
    {
      time: '17:00',
      title: 'Ֆոտոսեսիա',
      location: 'Հիշարժան պահեր սիրելի հյուրերի հետ',
      address: 'Լոկացիան կարող եք հարմարեցնել Ձեր միջոցառմանը'
    },
    {
      time: '19:00',
      title: 'Հարսանյաց հանդիսություն',
      location: 'Ռեստորանային համալիր',
      address: 'Մանրամասները կարող եք նշել հրավերի խմբագրման մեջ'
    }
  ];

  const previewRsvpForm = (
    <form className="luxury-rsvp-form" onSubmit={(event) => event.preventDefault()}>
      <label>
        <span>Անուն, ազգանուն</span>
        <input type="text" placeholder="Մուտքագրեք Ձեր անունը" />
      </label>
      <label>
        <span>Հեռախոսահամար</span>
        <input type="tel" placeholder="+374" />
      </label>
      <fieldset>
        <legend>Մասնակցու՞մ եք</legend>
        <label><input type="radio" name="preview-attending" defaultChecked /> Այո, կգամ</label>
        <label><input type="radio" name="preview-attending" /> Ցավոք, չեմ կարող</label>
      </fieldset>
      <label>
        <span>Հյուրերի քանակ</span>
        <select defaultValue="1">
          {[1, 2, 3, 4, 5].map((count) => <option key={count} value={count}>{count}</option>)}
        </select>
      </label>
      <label className="luxury-rsvp-wide">
        <span>Մեկնաբանություն</span>
        <textarea rows="3" placeholder="Ձեր մաղթանքները..." />
      </label>
      <button className="luxury-gold-button" type="submit">Ուղարկել</button>
    </form>
  );

  return (
    <article className={`luxury-wedding-invite ${mode === 'public' ? 'is-public' : 'is-preview'}`}>
      <FallingPetals />

      <section className="luxury-hero" style={{ '--luxury-hero-image': `url(${heroImage})` }}>
        <div className="luxury-corner luxury-corner-tl" />
        <div className="luxury-corner luxury-corner-tr" />
        <div className="luxury-corner luxury-corner-bl" />
        <div className="luxury-corner luxury-corner-br" />
        {mode === 'preview' && (
          <motion.div
            className="luxury-floating-actions"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <span>{Number(price || 29000).toLocaleString()} AMD</span>
            <button className="btn btn-ghost" type="button" onClick={onEdit}>
              <Pencil size={18} />
              Խմբագրել
            </button>
            <button className="btn btn-primary" type="button" onClick={onOrder} disabled={loading}>
              <ShoppingBag size={18} />
              {loading ? 'Բեռնվում է...' : 'Պատվիրել'}
            </button>
          </motion.div>
        )}

        <motion.div
          className="luxury-hero-copy"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p>Պատրաստվեք մեր հարսանիքին</p>
          <h1>{firstName}</h1>
          <Heart size={26} />
          <h1>{secondName}</h1>
          <i />
          <strong>{fullDateText}</strong>
          <small>{draft?.eventLocation || 'Երևան, Հայաստան'}</small>
          <MusicButton />
        </motion.div>

        <a className="luxury-scroll-indicator" href="#test-wedding-details" aria-label="Իջնել հրավերի մանրամասներին">
          <span>Իջնել</span>
          <ChevronDown size={24} />
        </a>
      </section>

      <section className="luxury-countdown" id="test-wedding-details">
        <SectionTitle eyebrow="Մինչև մեր օրը" title={daysLeft} text="Կիսվելու ենք սիրով, ջերմությամբ և անմոռանալի պահերով։" />
        <div className="luxury-countdown-grid">
          {[
            [dateText, 'Ամսաթիվ'],
            [year, 'Տարի'],
            [draft?.eventTime || '15:00', 'Ժամ']
          ].map(([value, label], index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <strong>{value}</strong>
              <span>{label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.section
        className="luxury-story"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.22 }}
        transition={{ duration: 0.7 }}
      >
        <div>
          <SectionTitle
            eyebrow="Մեր պատմությունը"
            title={`${firstName} և ${secondName}`}
            text={draft?.eventMessage || 'Մեծ սիրով հրավիրում ենք Ձեզ մեր հարսանիքին։'}
          />
        </div>
        <div className="luxury-story-photo">
          <img src={gallery[1] || heroImage} alt={`${firstName} և ${secondName}`} />
        </div>
      </motion.section>

      <section className="luxury-gallery">
        <SectionTitle eyebrow="Պահերի պատկերասրահ" title="Սիրով ընտրված լուսանկարներ" />
        <div className="luxury-gallery-grid">
          {gallery.map((image, index) => (
            <motion.button
              className="luxury-gallery-item"
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedImage(image)}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
            >
              <img src={image} alt={`${firstName} և ${secondName} ${index + 1}`} loading={index > 1 ? 'lazy' : 'eager'} />
            </motion.button>
          ))}
        </div>
      </section>

      <section className="luxury-events">
        <SectionTitle eyebrow="Միջոցառման ծրագիր" title="Օրվա մանրամասները" />
        <div className="luxury-event-list">
          {schedule.map((event) => (
            <motion.div
              className="luxury-event-card"
              key={`${event.time}-${event.title}`}
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55 }}
            >
              <span>{event.time}</span>
              <div>
                <h3>{event.title}</h3>
                <p>{event.location}</p>
                <small>{event.address}</small>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="luxury-rsvp-section">
        <SectionTitle
          eyebrow="Հաստատեք Ձեր մասնակցությունը"
          title="Սպասում ենք Ձեր պատասխանին"
          text="Խնդրում ենք լրացնել ձևը, որպեսզի հրավիրողը տեսնի Ձեր պատասխանը։"
        />
        {rsvpForm || previewRsvpForm}
      </section>

      <footer className="luxury-footer">
        <h2>{firstName} & {secondName}</h2>
        <p>{fullDateText}</p>
        <i />
        <span>Սիրով սպասում ենք Ձեզ</span>
      </footer>

      {mode === 'public' && (
        <section className="luxury-order-panel">
          <div>
            <span>{daysLeft}</span>
            <strong>{draft?.eventLocation}</strong>
          </div>
          <div>{actions}</div>
        </section>
      )}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="luxury-gallery-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button type="button" onClick={() => setSelectedImage(null)} aria-label="Փակել նկարը"><X size={24} /></button>
              <img src={selectedImage} alt={`${firstName} և ${secondName}`} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export function TestWeddingCardPreview({ template }) {
  const gallery = normalizeGallery({ image: template?.mainImage, gallery: template?.gallery });
  const [firstName, secondName] = splitNames(template?.title || 'Արամ և Անի');

  return (
    <div className="luxury-wedding-card-preview" style={{ '--luxury-card-image': `url(${gallery[0] || defaultHeroImage})` }}>
      <div>
        <span>Հարսանեկան հրավեր</span>
        <strong>{firstName}</strong>
        <i>&</i>
        <strong>{secondName}</strong>
      </div>
    </div>
  );
}

export function TestWeddingLivePreview({ draft, price, onEdit, onOrder, loading }) {
  return (
    <TestWeddingInvite
      draft={draft}
      price={price}
      mode="preview"
      onEdit={onEdit}
      onOrder={onOrder}
      loading={loading}
    />
  );
}

export function TestWeddingInvitationView({ draft, daysLeftText, actions, rsvpForm }) {
  return (
    <TestWeddingInvite
      draft={draft}
      mode="public"
      daysLeftText={daysLeftText}
      actions={actions}
      rsvpForm={rsvpForm}
    />
  );
}
