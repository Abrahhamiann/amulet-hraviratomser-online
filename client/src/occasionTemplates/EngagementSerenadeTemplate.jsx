import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Pause, Pencil, Play, ShoppingBag } from 'lucide-react';
import engagementSong from '../assets/audio/john-legend-all-of-you.mp3';
import calendarRing from '../assets/engagement/decor/calendar-diamond-ring.png';
import loveMark from '../assets/engagement/decor/love-mark.png';
import engagementBouquet from '../assets/morph/engagement-bouquet-red.jpg';
import engagementChandelier from '../assets/morph/engagement-chandelier.jpg';
import engagementHand from '../assets/morph/engagement-hand.jpg';
import engagementRing from '../assets/morph/engagement-ring.jpg';
import engagementRoses from '../assets/morph/engagement-roses.jpg';
import engagementSmile from '../assets/morph/engagement-smile.jpg';
import weddingSunset from '../assets/morph/wedding-sunset.jpg';
import { getConfiguredTemplateGallery, resolveTemplateImages } from './templateAssets.js';

const fallbackGallery = [
  weddingSunset,
  engagementSmile,
  engagementHand,
  engagementRing,
  engagementRoses,
  engagementBouquet,
  engagementChandelier
];

const defaultColors = {
  accent: '#efe4d8',
  text: '#ffffff',
  overlay: '#2b211b'
};

const normalizeKey = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/[_\s]+/g, '-')
  .replace(/[^a-z0-9-]/g, '')
  .replace(/-+/g, '-');

const uniqueImages = (images = []) => [...new Set(images.filter((image) => typeof image === 'string' && image.trim()))];

const splitNames = (value) => {
  const text = String(value || 'Զավեն & Լիլիթ').trim();
  const parts = text.split(/\s*(?:և|եւ|&|\+|\/)\s*/i).filter(Boolean);
  if (parts.length >= 2) return [parts[0], parts.slice(1).join(' ')];

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return [words[0], words.slice(1).join(' ')];

  return [text || 'Զավեն', ''];
};

const formatDate = (value) => {
  const date = value ? new Date(`${value}T00:00:00`) : null;
  if (!date || Number.isNaN(date.getTime())) return '26.09.2026';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
};

const getMonthName = (value) => {
  const date = value ? new Date(`${value}T00:00:00`) : new Date('2026-09-26T00:00:00');
  const months = [
    'Հունվար',
    'Փետրվար',
    'Մարտ',
    'Ապրիլ',
    'Մայիս',
    'Հունիս',
    'Հուլիս',
    'Օգոստոս',
    'Սեպտեմբեր',
    'Հոկտեմբեր',
    'Նոյեմբեր',
    'Դեկտեմբեր'
  ];

  if (Number.isNaN(date.getTime())) return 'Սեպտեմբեր';
  return months[date.getMonth()];
};

const getWeekDays = (value) => {
  const date = value ? new Date(`${value}T00:00:00`) : new Date('2026-09-26T00:00:00');
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  const labels = ['Երկ', 'Երք', 'Չրք', 'Հնգ', 'Ուրբ', 'Շբթ', 'Կիր'];

  return labels.map((label, index) => {
    const itemDate = new Date(start);
    itemDate.setDate(start.getDate() + index + 1);
    return {
      label,
      day: itemDate.getDate(),
      active: itemDate.toDateString() === date.toDateString()
    };
  });
};

const normalizeMapLinks = (draft) => {
  const links = Array.isArray(draft?.mapLinks) ? draft.mapLinks : [];
  const normalized = links
    .map((item, index) => ({
      label: String(item?.label || `Քարտեզ ${index + 1}`).trim(),
      time: String(item?.time || '').trim(),
      address: String(item?.address || '').trim(),
      url: String(item?.url || '').trim()
    }))
    .filter((item) => item.label || item.time || item.address || item.url);

  if (draft?.mapLink && !normalized.some((item) => item.url === draft.mapLink)) {
    normalized.unshift({ label: 'Քարտեզ', url: draft.mapLink });
  }

  return normalized;
};

const normalizeEventPlaces = (draft) => {
  const links = Array.isArray(draft?.mapLinks) ? draft.mapLinks : [];
  const places = links
    .map((item, index) => ({
      label: String(item?.label || `Վայր ${index + 1}`).trim(),
      time: String(item?.time || '').trim(),
      address: String(item?.address || '').trim(),
      url: String(item?.url || '').trim()
    }))
    .filter((item) => item.label || item.time || item.address || item.url);

  if (!places.length) {
    return [{
      label: 'Latar Hall',
      time: draft?.eventTime || '17:00',
      address: draft?.eventLocation || '',
      url: draft?.mapLink || ''
    }];
  }

  return places.map((place, index) => ({
    ...place,
    time: place.time || (index === 0 ? draft?.eventTime || '' : ''),
    address: place.address || (index === 0 ? draft?.eventLocation || '' : '')
  }));
};

const getCountdown = (dateValue) => {
  const date = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date('2026-09-26T00:00:00');
  const diff = Math.max(0, date.getTime() - Date.now());
  return {
    days: String(Math.floor(diff / 86400000)).padStart(2, '0'),
    hours: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
    minutes: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0')
  };
};

const getHeroNameSize = (firstName, secondName) => {
  const length = `${firstName || ''}${secondName || ''}`.replace(/\s/g, '').length;
  if (length > 70) return 'clamp(1.8rem, 3vw, 3.9rem)';
  if (length > 52) return 'clamp(2rem, 3.8vw, 4.8rem)';
  if (length > 38) return 'clamp(2.25rem, 4.8vw, 5.8rem)';
  if (length > 26) return 'clamp(2.7rem, 6.2vw, 7rem)';
  return 'clamp(3.6rem, 8.6vw, 8.8rem)';
};

const revealProps = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 1.15, ease: [0.22, 1, 0.36, 1] }
};

const textRevealContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.18 }
  }
};

const textRevealItem = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.15, ease: [0.22, 1, 0.36, 1] }
  }
};

export const isEngagementSerenadeTemplate = (template) => {
  const values = [
    normalizeKey(template?.designKey),
    normalizeKey(template?.slug),
    normalizeKey(template?.title)
  ];

  return values.some((value) => ['engagement-serenade', 'engagementserenade', 'engagement-photo', 'proposal-lake'].includes(value));
};

export const getEngagementSerenadeDraft = (template = {}) => {
  const sourceTemplate = template.galleryConfigured ? template : { ...template, mainImage: '' };
  const gallery = uniqueImages(getConfiguredTemplateGallery(sourceTemplate, fallbackGallery));

  return {
    mainNames: template.title || 'Զավեն & Լիլիթ',
    eventDate: '2026-09-26',
    eventTime: '17:00',
    eventLocation: 'Latar Hall, Հասցե՝ Երևան, Միկոյան 58 փող. 5',
    eventMessage: template.description || 'Հարգելի բարեկամներ և ընկերներ, սիրով հրավիրում ենք Ձեզ կիսելու մեզ համար կարևոր նշանադրության օրը։',
    mapLink: '',
    mapLinks: [],
    image: gallery[0] || weddingSunset,
    gallery,
    colors: defaultColors
  };
};

function PreviewEngagementRsvpForm() {
  return (
    <form className="engagement-preview-rsvp-form test-wedding-rsvp-form" onSubmit={(event) => event.preventDefault()}>
      <fieldset className="rsvp-choice-group">
        <legend>Հյուրի կողմը</legend>
        <label className="rsvp-radio"><input type="radio" name="engagement-side" defaultChecked /><span>Հարսնացուի կողմ</span></label>
        <label className="rsvp-radio"><input type="radio" name="engagement-side" /><span>Փեսացուի կողմ</span></label>
      </fieldset>
      <label className="field">
        <span>Անուն Ազգանուն</span>
        <input className="input" type="text" />
      </label>
      <fieldset className="rsvp-choice-group">
        <legend>Մասնակցություն</legend>
        <label className="rsvp-radio"><input type="radio" name="engagement-answer" defaultChecked /><span>Կգամ</span></label>
        <label className="rsvp-radio"><input type="radio" name="engagement-answer" /><span>Չեմ կարողանա գալ</span></label>
      </fieldset>
      <label className="field">
        <span>Հյուրերի թիվ</span>
        <input className="input" type="number" min="1" defaultValue="1" />
      </label>
      <label className="field">
        <span>Մեկնաբանություն</span>
        <textarea className="input" rows="3" />
      </label>
      <button className="btn" type="submit">Պատասխանել</button>
    </form>
  );
}

function MapButton({ url }) {
  if (!url) {
    return <span className="engagement-map-button is-disabled" aria-disabled="true">Ինչպես հասնել</span>;
  }

  return (
    <a className="engagement-map-button" href={url} target="_blank" rel="noreferrer">
      Ինչպես հասնել
    </a>
  );
}

function EngagementLayout({ draft, price, onEdit, onOrder, loading, actions, rsvpForm, daysLeftText, mode = 'preview' }) {
  const audioRef = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [countdown, setCountdown] = useState(() => getCountdown(draft?.eventDate));
  const draftImages = resolveTemplateImages([draft?.image, ...(draft?.gallery || [])]);
  const gallery = uniqueImages([...draftImages, ...(draftImages.length ? [] : fallbackGallery)]).slice(0, 8);
  const [firstName, secondName] = splitNames(draft?.mainNames);
  const heroNameSize = getHeroNameSize(firstName, secondName);
  const mapLinks = normalizeMapLinks(draft);
  const eventPlaces = normalizeEventPlaces(draft);
  const weekDays = getWeekDays(draft?.eventDate);
  const monthName = getMonthName(draft?.eventDate);
  const colors = { ...defaultColors, ...(draft?.colors || {}) };
  const familyItems = [draft?.groomFamilyTitle, draft?.brideFamilyTitle].filter(Boolean);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown(draft?.eventDate)), 1000);
    return () => window.clearInterval(timer);
  }, [draft?.eventDate]);

  useEffect(() => {
    if (gallery.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActivePhotoIndex((index) => (index + 1) % gallery.length);
    }, 4300);
    return () => window.clearInterval(timer);
  }, [gallery.length]);

  useEffect(() => () => {
    audioRef.current?.pause();
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMusicPlaying) {
      audio.pause();
      setIsMusicPlaying(false);
      return;
    }

    try {
      audio.volume = 0.68;
      await audio.play();
      setIsMusicPlaying(true);
    } catch {
      setIsMusicPlaying(false);
    }
  };

  return (
    <article
      className={`engagement-serenade-invite ${mode === 'public' ? 'is-public' : 'is-preview'}`}
      style={{
        '--engagement-accent': colors.accent,
        '--engagement-text': colors.text,
        '--engagement-overlay': colors.overlay
      }}
    >
      <audio ref={audioRef} src={engagementSong} preload="auto" loop />
      <div className="engagement-fixed-photo" aria-hidden="true">
        {gallery.map((image, index) => (
          <img
            key={`${image}-${index}`}
            className={index === activePhotoIndex ? 'is-active' : ''}
            src={image}
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority={index < 2 ? 'high' : 'auto'}
          />
        ))}
      </div>
      <div className="engagement-global-scrim" aria-hidden="true" />

      {mode === 'preview' && (
        <motion.div
          className="engagement-floating-actions"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
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

      <section className="engagement-cover engagement-photo-screen">
        <motion.div
          className="engagement-cover-copy"
          initial="hidden"
          animate="visible"
          variants={textRevealContainer}
        >
          <motion.span variants={textRevealItem}>ՆՇԱՆԱԴՐՈՒԹՅԱՆ ՀՐԱՎԵՐ</motion.span>
          <motion.h1
            className={secondName ? 'has-two-names' : 'has-one-name'}
            variants={textRevealItem}
            style={{ '--engagement-name-size': heroNameSize }}
          >
            <b>{firstName}</b>
            {secondName && <em>&</em>}
            {secondName && <b>{secondName}</b>}
          </motion.h1>
          <motion.i variants={textRevealItem} />
          <motion.strong variants={textRevealItem}>{formatDate(draft?.eventDate)}</motion.strong>
          <motion.button
            className={`engagement-music-button${isMusicPlaying ? ' is-playing' : ''}`}
            type="button"
            onClick={toggleMusic}
            aria-label={isMusicPlaying ? 'Pause music' : 'Play music'}
            variants={textRevealItem}
          >
            {isMusicPlaying ? <Pause size={19} /> : <Play size={19} />}
          </motion.button>
        </motion.div>
      </section>

      <motion.section
        className={`engagement-details engagement-photo-screen${eventPlaces.length > 2 ? ' has-many-places' : ''}`}
        style={{ '--engagement-place-count': eventPlaces.length }}
        {...revealProps}
      >
        <motion.div className="engagement-message-copy" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.45 }} variants={textRevealContainer}>
          <motion.h2 variants={textRevealItem}>Հարգելի բարեկամներ<br />և ընկերներ,</motion.h2>
          {draft?.openingVisible !== false && <motion.p variants={textRevealItem}>{draft?.eventMessage}</motion.p>}
          {draft?.familyVisible !== false && familyItems.length > 0 && (
            <motion.div className="engagement-family-note" variants={textRevealItem}>
              {familyItems.map((item) => <span key={item}>{item}</span>)}
            </motion.div>
          )}
          <motion.span variants={textRevealItem}>{monthName}</motion.span>
        </motion.div>
        <div className="engagement-week">
          {weekDays.map((item) => (
            <div className={item.active ? 'is-active' : ''} key={`${item.label}-${item.day}`}>
              <span>{item.label}</span>
              <strong>{item.day}</strong>
              {item.active && (
                <img
                  src={calendarRing}
                  alt=""
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
        {draft?.receptionVisible !== false && <motion.div className="engagement-location" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.45 }} variants={textRevealContainer}>
          <motion.i variants={textRevealItem} />
          <motion.div
            className="engagement-place-list"
            initial={false}
            animate="visible"
            variants={textRevealContainer}
          >
            {eventPlaces.map((place, index) => (
              <motion.div
                className="engagement-place-card"
                initial={false}
                animate="visible"
                variants={textRevealItem}
                key={`${place.label}-${place.time}-${place.address}-${place.url}-${index}`}
              >
                {place.time && <strong>{place.time}</strong>}
                <b>{place.label}</b>
                {place.address && <span>{place.address}</span>}
                <MapButton url={place.url} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>}
      </motion.section>

      {draft?.questionsVisible !== false && <motion.section className="engagement-rsvp-section engagement-photo-screen" {...revealProps}>
        <motion.div className="engagement-rsvp-shell" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={textRevealContainer}>
          <motion.h2 variants={textRevealItem}>Շնորհակալ կլինենք, եթե նախապես հաստատեք Ձեր ներկայությունը</motion.h2>
          {draft?.rsvpQuestion && <motion.p className="engagement-form-note" variants={textRevealItem}>{draft.rsvpQuestion}</motion.p>}
          {rsvpForm || <PreviewEngagementRsvpForm />}
          <motion.img className="engagement-love-mark" src={loveMark} alt="" aria-hidden="true" loading="lazy" variants={textRevealItem} />
          <motion.p variants={textRevealItem}>Սիրով սպասում ենք Ձեզ</motion.p>
        </motion.div>
      </motion.section>}

      <motion.section className="engagement-final engagement-photo-screen" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={textRevealContainer}>
        <motion.div variants={textRevealItem}><CalendarDays size={28} /></motion.div>
        <motion.span variants={textRevealItem}>{countdown.days} օր · {countdown.hours} ժամ · {countdown.minutes} րոպե</motion.span>
        <motion.strong variants={textRevealItem}>{firstName}{secondName ? ` & ${secondName}` : ''}</motion.strong>
        {draft?.finalMessageVisible !== false && draft?.closingMessage && <motion.p variants={textRevealItem}>{draft.closingMessage}</motion.p>}
        <motion.p variants={textRevealItem}>{draft?.eventLocation}</motion.p>
        {mode === 'public' && (
          <div className="engagement-public-actions">
            <div>
              <span>{daysLeftText}</span>
              <strong>{draft?.eventLocation}</strong>
            </div>
            <div>{actions}</div>
          </div>
        )}
      </motion.section>
    </article>
  );
}

export function EngagementSerenadeCardPreview({ template }) {
  const image = resolveTemplateImages([template?.mainImage, template?.gallery?.[0]])[0] || weddingSunset;
  return (
    <div className="engagement-card-preview">
      <img src={image} alt={template?.title || 'Engagement invitation'} loading="lazy" />
      <span>Engagement</span>
    </div>
  );
}

export function EngagementSerenadeLivePreview(props) {
  return <EngagementLayout {...props} />;
}

export function EngagementSerenadeInvitationView({ draft, daysLeftText, actions, rsvpForm }) {
  return (
    <EngagementLayout
      draft={draft}
      daysLeftText={daysLeftText}
      actions={actions}
      rsvpForm={rsvpForm}
      mode="public"
    />
  );
}
