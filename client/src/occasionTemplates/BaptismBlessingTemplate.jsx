import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Pause, Pencil, Play, ShoppingBag } from 'lucide-react';
import baptismSong from '../assets/audio/yiruma-river-flows-in-you.mp3';
import babyChurchImage from '../assets/baptism/baptism-baby-church.png';
import envelopeImage from '../assets/baptism/baptism-envelope.png';
import familyImage from '../assets/baptism/baptism-family.png';
import baptismFamilyPhoto from '../assets/morph/baptism-family.jpg';
import baptismLiftPhoto from '../assets/morph/baptism-lift.jpg';
import baptismPriestPhoto from '../assets/morph/baptism-priest.jpg';
import baptismSoftPhoto from '../assets/morph/baptism-soft.webp';
import baptismVoguePhoto from '../assets/morph/baptism-vogue.jpg';
import baptismWaterPhoto from '../assets/morph/baptism-water.jpg';
import { getConfiguredTemplateGallery, resolveTemplateImages } from './templateAssets.js';

const fallbackGallery = [
  babyChurchImage,
  familyImage,
  baptismFamilyPhoto,
  baptismLiftPhoto,
  baptismPriestPhoto,
  baptismSoftPhoto,
  baptismVoguePhoto,
  baptismWaterPhoto
];

const defaultColors = {
  accent: '#d8b98e',
  text: '#ffffff',
  overlay: '#241f1a'
};

const normalizeKey = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/[_\s]+/g, '-')
  .replace(/[^a-z0-9-]/g, '')
  .replace(/-+/g, '-');

const uniqueImages = (images = []) => [...new Set(images.filter((image) => typeof image === 'string' && image.trim()))];

const isDecorativeIconImage = (image) => /baptism-(angel|candle|church-icon|cross|dove)(?:[.-])/.test(String(image || ''));
const isEnvelopeImage = (image) => /baptism-envelope(?:[.-])/.test(String(image || ''));

const formatDate = (value) => {
  const date = value ? new Date(`${value}T00:00:00`) : null;
  if (!date || Number.isNaN(date.getTime())) return '20.09.2026';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
};

const formatLongDate = (value) => {
  const date = value ? new Date(`${value}T00:00:00`) : null;
  if (!date || Number.isNaN(date.getTime())) return '22 Հոկտեմբերի 2026';
  const months = [
    'Հունվարի',
    'Փետրվարի',
    'Մարտի',
    'Ապրիլի',
    'Մայիսի',
    'Հունիսի',
    'Հուլիսի',
    'Օգոստոսի',
    'Սեպտեմբերի',
    'Հոկտեմբերի',
    'Նոյեմբերի',
    'Դեկտեմբերի'
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const splitNames = (value) => {
  const text = String(value || 'Մարիա').trim();
  return text || 'Մարիա';
};

const getCountdown = (dateValue) => {
  const date = dateValue ? new Date(`${dateValue}T00:00:00`) : null;
  if (!date || Number.isNaN(date.getTime())) return { days: '00', hours: '00', minutes: '00' };
  const diff = Math.max(0, date.getTime() - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0')
  };
};

const revealVariants = {
  hidden: { opacity: 0, y: 38 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] }
  }
};

const scrollRevealProps = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount: 0.42 },
  variants: revealVariants
};

const normalizeMapLinks = (draft) => {
  const links = Array.isArray(draft?.mapLinks) ? draft.mapLinks : [];
  const normalized = links
    .map((item, index) => ({
      label: String(item?.label || `Քարտեզ ${index + 1}`).trim(),
      url: String(item?.url || '').trim()
    }))
    .filter((item) => item.url);

  if (draft?.mapLink && !normalized.some((item) => item.url === draft.mapLink)) {
    normalized.unshift({ label: 'Քարտեզ', url: draft.mapLink });
  }

  return normalized;
};

export const isBaptismBlessingTemplate = (template) => {
  const values = [
    normalizeKey(template?.designKey),
    normalizeKey(template?.slug),
    normalizeKey(template?.title)
  ];

  return values.some((value) => ['baptism-blessing', 'baptismblessing', 'baptism-envelope'].includes(value));
};

export const getBaptismBlessingDraft = (template = {}) => {
  const sourceTemplate = template.galleryConfigured ? template : { ...template, mainImage: '' };
  const gallery = uniqueImages(getConfiguredTemplateGallery(sourceTemplate, fallbackGallery))
    .filter((image) => !isEnvelopeImage(image));

  return {
    mainNames: template.title || 'Մարիա',
    eventDate: '2026-10-22',
    eventTime: '15:00',
    eventLocation: 'Սուրբ Գրիգոր Լուսավորիչ եկեղեցի, Երևան',
    eventMessage: template.description || 'Սիրով հրավիրում ենք Ձեզ կիսելու մեր փոքրիկի մկրտության լուսավոր օրը։ Ձեր ներկայությունը մեզ համար մեծ օրհնություն կլինի։',
    mapLink: '',
    mapLinks: [],
    image: gallery[1] || gallery[0] || familyImage,
    gallery,
    colors: defaultColors
  };
};

function MusicButton({ audioRef, isMusicPlaying, setIsMusicPlaying }) {
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
    <button
      className={`baptism-music-button${isMusicPlaying ? ' is-playing' : ''}`}
      type="button"
      onClick={toggleMusic}
      aria-label={isMusicPlaying ? 'Pause music' : 'Play music'}
    >
      {isMusicPlaying ? <Pause size={20} /> : <Play size={20} />}
    </button>
  );
}

function MapButton({ url }) {
  if (!url) {
    return (
      <span className="baptism-map-button is-disabled" aria-disabled="true">
        Ինչպես հասնել
      </span>
    );
  }

  return (
    <a className="baptism-map-button" href={url} target="_blank" rel="noreferrer">
      Ինչպես հասնել
    </a>
  );
}

function PreviewBaptismRsvpForm() {
  return (
    <form className="baptism-preview-rsvp-form test-wedding-rsvp-form" onSubmit={(event) => event.preventDefault()}>
      <label className="field">
        <span>Անուն Ազգանուն</span>
        <input className="input" type="text" />
      </label>
      <fieldset className="rsvp-choice-group">
        <legend>Մասնակցություն</legend>
        <label className="rsvp-radio"><input type="radio" name="baptism-answer" defaultChecked /><span>Սիրով կմասնակցենք</span></label>
        <label className="rsvp-radio"><input type="radio" name="baptism-answer" /><span>Ցավոք, չենք կարող ներկա լինել</span></label>
      </fieldset>
      <label className="field">
        <span>Հյուրերի թիվ</span>
        <input className="input" type="number" min="1" defaultValue="1" />
      </label>
      <label className="field">
        <span>Հաղորդագրություն</span>
        <textarea className="input" rows="4" />
      </label>
      <button className="btn" type="submit">Ուղարկել</button>
    </form>
  );
}

function BaptismLayout({ draft, price, onEdit, onOrder, loading, actions, rsvpForm, daysLeftText, mode = 'preview' }) {
  const audioRef = useRef(null);
  const contentRef = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [countdown, setCountdown] = useState(() => getCountdown(draft?.eventDate));
  const draftImages = resolveTemplateImages([draft?.image, ...(draft?.gallery || [])]);
  const gallery = uniqueImages([...draftImages, ...(draftImages.length ? [] : fallbackGallery)])
    .filter((image) => !isEnvelopeImage(image));
  const envelope = envelopeImage;
  const heroImage = draft?.image && !isEnvelopeImage(draft.image) ? draft.image : gallery[1] || gallery[0] || familyImage;
  const babyPortrait = gallery[1] || babyChurchImage;
  const ceremonyPhoto = gallery[3] || baptismPriestPhoto;
  const partyPhoto = gallery[4] || baptismFamilyPhoto;
  const scenePhotos = uniqueImages([
    heroImage,
    babyPortrait,
    baptismFamilyPhoto,
    baptismLiftPhoto,
    baptismPriestPhoto,
    baptismSoftPhoto,
    baptismVoguePhoto,
    baptismWaterPhoto,
    ...gallery.filter((image) => image !== envelope && !isDecorativeIconImage(image))
  ]);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const name = splitNames(draft?.mainNames);
  const mapLinks = normalizeMapLinks(draft);
  const colors = { ...defaultColors, ...(draft?.colors || {}) };
  const familyItems = [draft?.groomFamilyTitle, draft?.brideFamilyTitle].filter(Boolean);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown(draft?.eventDate)), 1000);
    return () => window.clearInterval(timer);
  }, [draft?.eventDate]);

  useEffect(() => {
    if (!isEnvelopeOpen || scenePhotos.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActivePhotoIndex((index) => (index + 1) % scenePhotos.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [isEnvelopeOpen, scenePhotos.length]);

  useEffect(() => () => {
    audioRef.current?.pause();
  }, []);

  const openInvitation = async () => {
    setIsEnvelopeOpen(true);
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.volume = 0.62;
        await audio.play();
        setIsMusicPlaying(true);
      } catch {
        setIsMusicPlaying(false);
      }
    }
    window.setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1050);
  };

  return (
    <article
      className={`baptism-blessing-invite ${mode === 'public' ? 'is-public' : 'is-preview'}${isEnvelopeOpen ? ' is-open' : ''}`}
      style={{
        '--baptism-accent': colors.accent,
        '--baptism-text': colors.text,
        '--baptism-paper': colors.overlay,
        '--baptism-overlay': colors.overlay
      }}
    >
      <audio ref={audioRef} src={baptismSong} preload="auto" loop />

      {mode === 'preview' && (
        <motion.div
          className="baptism-floating-actions"
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

      <section className="baptism-envelope-scene" aria-label="Baptism invitation envelope">
        <motion.button
          className="baptism-envelope-button"
          type="button"
          onClick={openInvitation}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          aria-expanded={isEnvelopeOpen}
        >
          <img src={envelope} alt="Բացել մկրտության հրավերը" />
        </motion.button>
      </section>

      <motion.div
        ref={contentRef}
        className="baptism-content-reveal"
        initial="hidden"
        animate={isEnvelopeOpen ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 1.15, staggerChildren: 0.24, delayChildren: 0.28 } }
        }}
        aria-hidden={!isEnvelopeOpen}
      >
        <div className="baptism-fixed-photo" aria-hidden="true">
          {scenePhotos.map((image, index) => (
            <img
              key={`fixed-${image}-${index}`}
              className={index === activePhotoIndex ? 'is-active' : ''}
              src={image}
              alt=""
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
          ))}
        </div>
        <div className="baptism-global-scrim" aria-hidden="true" />

        <motion.section className="baptism-hero baptism-photo-screen" variants={revealVariants}>
          <div className="baptism-hero-copy">
            <span>ՄԿՐՏՈՒԹՅԱՆ ՀՐԱՎԵՐ</span>
            <h1>{name}</h1>
            <strong>{formatDate(draft?.eventDate)}</strong>
            <MusicButton audioRef={audioRef} isMusicPlaying={isMusicPlaying} setIsMusicPlaying={setIsMusicPlaying} />
          </div>
        </motion.section>

        <motion.section className="baptism-countdown-section baptism-photo-screen" {...scrollRevealProps}>
          <div className="baptism-countdown-card">
            <span>Մնաց</span>
            <div className="baptism-countdown-grid">
              <strong>{countdown.days}<small>օր</small></strong>
              <strong>{countdown.hours}<small>ժամ</small></strong>
              <strong>{countdown.minutes}<small>րոպե</small></strong>
              <strong>{countdown.seconds}<small>վայրկյան</small></strong>
            </div>
          </div>
          <div className="baptism-message-copy baptism-overlay-copy">
            <h2>Հարգելի հյուրեր</h2>
            {draft?.openingVisible !== false && <p>{draft?.eventMessage}</p>}
            {draft?.familyVisible !== false && familyItems.length > 0 && (
              <div className="baptism-family-note">
                {familyItems.map((item) => <span key={item}>{item}</span>)}
              </div>
            )}
            <span>Սպասում ենք Ձեզ</span>
            <strong>{formatLongDate(draft?.eventDate)}</strong>
          </div>
        </motion.section>

        {draft?.receptionVisible !== false && <motion.section className="baptism-event-section baptism-photo-screen" {...scrollRevealProps}>
          <div className="baptism-event-row">
            <img className="baptism-location-photo" src={ceremonyPhoto} alt="" loading="lazy" decoding="async" />
            <span>Մկրտություն</span>
            <strong>{draft?.eventTime || '15:00'}</strong>
            <b>{draft?.eventLocation}</b>
            <MapButton url={mapLinks[0]?.url} />
          </div>
        </motion.section>}

        {draft?.receptionVisible !== false && <motion.section className="baptism-party-section baptism-photo-screen" {...scrollRevealProps}>
          <div className="baptism-party-content">
            <img className="baptism-location-photo" src={partyPhoto} alt="" loading="lazy" decoding="async" />
            <span>Խնջույք</span>
            <strong>17:00</strong>
            <b>{mapLinks[1]?.label || 'Տոնական հանդիպում'}</b>
            <MapButton url={mapLinks[1]?.url} />
          </div>
        </motion.section>}

        {draft?.questionsVisible !== false && <motion.section className="baptism-rsvp-section baptism-photo-screen" {...scrollRevealProps}>
          <div className="baptism-rsvp-shell">
            <h2>Խնդրում ենք հաստատել Ձեր ներկայությունը մինչև {formatDate(draft?.eventDate)}</h2>
            {draft?.rsvpQuestion && <p className="baptism-form-note">{draft.rsvpQuestion}</p>}
            {rsvpForm || <PreviewBaptismRsvpForm />}
            <div className="baptism-signature">{draft?.finalMessageVisible !== false && draft?.closingMessage ? draft.closingMessage : 'Սիրով սպասում ենք Ձեզ'}</div>
          </div>
        </motion.section>}

        {mode === 'public' && (
          <motion.section className="baptism-public-actions" variants={revealVariants}>
            <div>
              <span>{daysLeftText}</span>
              <strong>{draft?.eventLocation}</strong>
            </div>
            <div>{actions}</div>
          </motion.section>
        )}
      </motion.div>
    </article>
  );
}

export function BaptismBlessingCardPreview({ template }) {
  return (
    <div className="baptism-card-preview">
      <img src={envelopeImage} alt={template?.title || 'Baptism invitation'} loading="lazy" />
    </div>
  );
}

export function BaptismBlessingLivePreview(props) {
  return <BaptismLayout {...props} />;
}

export function BaptismBlessingInvitationView({ draft, daysLeftText, actions, rsvpForm }) {
  return (
    <BaptismLayout
      draft={draft}
      daysLeftText={daysLeftText}
      actions={actions}
      rsvpForm={rsvpForm}
      mode="public"
    />
  );
}
