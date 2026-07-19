import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Pause, Pencil, Play, ShoppingBag } from 'lucide-react';
import weddingSong from '../assets/audio/ed-sheeran-perfect.mp3';
import midnightVowsDefault from '../assets/occasion/midnight-vows-default.jpg';
import weddingForest from '../assets/morph/wedding-forest-optimized.jpg';
import { getConfiguredTemplateGallery, resolveTemplateImages } from './templateAssets.js';

const DESIGN_KEY = 'midnight-vows';

const fallbackGallery = [
  midnightVowsDefault
];

const normalizeKey = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/[_\s]+/g, '-')
  .replace(/[^a-z0-9-]/g, '')
  .replace(/-+/g, '-');

const uniqueImages = (images = []) => [...new Set(images.filter((image) => typeof image === 'string' && image.trim()))];

const defaultColors = {
  accent: '#d8b98e',
  text: '#ffffff',
  overlay: '#202020'
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

const splitNames = (value) => {
  const text = String(value || 'Արամ և Անի').trim();
  const parts = text.split(/\s*(?:և|եւ|&|\+|\/)\s*/i).filter(Boolean);
  if (parts.length >= 2) return [parts[0], parts.slice(1).join(' ')];
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return [words[0], words.slice(1).join(' ')];
  return [text || 'Արամ', 'Անի'];
};

const formatDate = (value) => {
  const date = value ? new Date(`${value}T00:00:00`) : null;
  if (!date || Number.isNaN(date.getTime())) return '15.08.2026';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
};

export const isMidnightVowsTemplate = (template) => {
  const values = [
    normalizeKey(template?.designKey),
    normalizeKey(template?.slug),
    normalizeKey(template?.title)
  ];

  return values.some((value) => ['midnight-vows', 'midnight-vows-fullscreen', 'midnightvows', 'dark-wedding'].includes(value));
};

export const getMidnightVowsDraft = (template = {}) => {
  const sourceTemplate = template.galleryConfigured ? template : { ...template, mainImage: '' };
  const gallery = uniqueImages(getConfiguredTemplateGallery(sourceTemplate, fallbackGallery)).slice(0, 1);

  return {
    mainNames: template.title || 'Արամ և Անի',
    eventDate: '2026-08-15',
    eventTime: '15:00',
    eventLocation: 'Սուրբ Հռիփսիմե եկեղեցի',
    eventMessage: template.description || 'Սիրով հրավիրում ենք Ձեզ կիսել մեր կյանքի ամենագեղեցիկ օրը և Ձեր ներկայությամբ ջերմացնել մեր հարսանիքը։',
    mapLink: '',
    mapLinks: [],
    image: gallery[0] || weddingForest,
    gallery,
    colors: defaultColors
  };
};

function PreviewRsvpForm() {
  return (
    <form className="midnight-rsvp-form" onSubmit={(event) => event.preventDefault()}>
      <fieldset>
        <label><input type="radio" name="midnight-side" defaultChecked /> Հարսի կողմ</label>
        <label><input type="radio" name="midnight-side" /> Փեսայի կողմ</label>
      </fieldset>
      <label>
        <span>Անուն Ազգանուն</span>
        <input type="text" />
      </label>
      <fieldset>
        <label><input type="radio" name="midnight-answer" defaultChecked /> Սիրով կմասնակցենք</label>
        <label><input type="radio" name="midnight-answer" /> Ցավոք, չենք կարող ներկա լինել</label>
      </fieldset>
      <label>
        <span>Հյուրերի ընդհանուր թիվ</span>
        <input type="number" min="1" defaultValue="1" />
      </label>
      <label>
        <span>Մեկնաբանություն</span>
        <textarea rows="3" />
      </label>
      <button type="submit">Ուղարկել</button>
    </form>
  );
}

function EventBlock({ title, time, location, address, mapLink, delay = 0 }) {
  return (
    <motion.article
      className="midnight-event-block"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.62, delay }}
    >
      <i />
      <p>{title}</p>
      <strong>{time}</strong>
      <h3>{location}</h3>
      {address && <span>{address}</span>}
      <a href={mapLink || '#midnight-rsvp'} target={mapLink ? '_blank' : undefined} rel={mapLink ? 'noreferrer' : undefined}>Ինչպես հասնել</a>
    </motion.article>
  );
}

function MidnightVowsLayout({ draft, price, onEdit, onOrder, loading, actions, rsvpForm, daysLeftText, mode = 'preview' }) {
  const audioRef = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const draftImages = resolveTemplateImages([draft?.image, ...(draft?.gallery || [])]);
  const gallery = uniqueImages([...draftImages, ...(draftImages.length ? [] : fallbackGallery)]).slice(0, 1);
  const heroImage = draft?.image || gallery[0] || weddingForest;
  const [firstName, secondName] = splitNames(draft?.mainNames);
  const mapLinks = normalizeMapLinks(draft);
  const colors = { ...defaultColors, ...(draft?.colors || {}) };
  const particles = useMemo(() => Array.from({ length: 18 }, (_, index) => ({
    id: index,
    left: `${(index * 13) % 96}%`,
    delay: `${(index % 9) * 0.45}s`,
    duration: `${5 + (index % 5)}s`
  })), []);
  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMusicPlaying) {
      audio.pause();
      setIsMusicPlaying(false);
      return;
    }

    try {
      audio.volume = 0.72;
      await audio.play();
      setIsMusicPlaying(true);
    } catch {
      setIsMusicPlaying(false);
    }
  };

  useEffect(() => () => {
    audioRef.current?.pause();
  }, []);

  return (
    <article
      className={`midnight-vows-invite ${mode === 'public' ? 'is-public' : 'is-preview'}`}
      style={{
        '--midnight-accent': colors.accent,
        '--midnight-text': colors.text,
        '--midnight-overlay': colors.overlay
      }}
    >
      <audio ref={audioRef} src={weddingSong} preload="auto" loop />
      <div className="midnight-fixed-photo" aria-hidden="true">
        <img src={heroImage} alt="" loading="eager" decoding="async" fetchPriority="high" />
      </div>
      <div className="midnight-global-scrim" aria-hidden="true" />

      <div className="midnight-particles" aria-hidden="true">
        {particles.map((particle) => (
          <span key={particle.id} style={{ left: particle.left, animationDelay: particle.delay, animationDuration: particle.duration }} />
        ))}
      </div>

      <section className="midnight-cover">
        {mode === 'preview' && (
          <motion.div
            className="midnight-floating-actions"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
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
          className="midnight-cover-copy"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85 }}
        >
          <span>Հարսանեկան հրավեր</span>
          <h1>{firstName}</h1>
          <Heart size={28} />
          <h1>{secondName}</h1>
          <i />
          <strong>{formatDate(draft?.eventDate)}</strong>
          <p>{draft?.eventLocation}</p>
          <button
            className={`midnight-music-button${isMusicPlaying ? ' is-playing' : ''}`}
            type="button"
            onClick={toggleMusic}
            aria-label={isMusicPlaying ? 'Pause music' : 'Play music'}
          >
            {isMusicPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </motion.div>
      </section>

      <section className="midnight-message-section">
        <motion.div
          className="midnight-message-card"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.65 }}
        >
          <span>Սիրով հրավիրում ենք Ձեզ</span>
          <p>{draft?.eventMessage}</p>
          <strong>{formatDate(draft?.eventDate)}</strong>
        </motion.div>
      </section>

      <section className="midnight-schedule">
        <div className="midnight-section-overlay">
          <EventBlock
            title="Պսակադրություն"
            time={draft?.eventTime || '15:00'}
            location={draft?.eventLocation || 'Սուրբ Հռիփսիմե եկեղեցի'}
            mapLink={mapLinks[0]?.url}
          />
          <EventBlock
            title="Հարսանյաց հանդիսություն"
            time="17:30"
            location="Ռեստորանային համալիր"
            mapLink={mapLinks[1]?.url || mapLinks[0]?.url}
            delay={0.12}
          />
        </div>
      </section>

      <section className="midnight-rsvp-section" id="midnight-rsvp">
        <div className="midnight-rsvp-shell">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55 }}
          >
            Խնդրում ենք հաստատել Ձեր ներկայությունը
          </motion.h2>
          {rsvpForm || <PreviewRsvpForm />}
          <motion.div
            className="midnight-signature"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Heart size={58} />
            <p>Սիրով կսպասենք Ձեզ</p>
          </motion.div>
        </div>
      </section>

      {mode === 'public' && (
        <section className="midnight-public-actions">
          <div>
            <span>{daysLeftText}</span>
            <strong>{draft?.eventLocation}</strong>
          </div>
          <div>{actions}</div>
        </section>
      )}
    </article>
  );
}

export function MidnightVowsCardPreview({ template }) {
  const image = resolveTemplateImages([template?.mainImage, template?.gallery?.[0]])[0] || weddingForest;
  return (
    <div className="midnight-card-preview">
      <img src={image} alt={template?.title || 'Wedding invitation'} loading="lazy" />
    </div>
  );
}

export function MidnightVowsLivePreview(props) {
  return <MidnightVowsLayout {...props} />;
}

export function MidnightVowsInvitationView({ draft, daysLeftText, actions, rsvpForm }) {
  return (
    <MidnightVowsLayout
      draft={draft}
      daysLeftText={daysLeftText}
      actions={actions}
      rsvpForm={rsvpForm}
      mode="public"
    />
  );
}
