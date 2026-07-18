import React, { useEffect, useMemo, useState } from 'react';
import { Music2, Pause, Pencil, ShoppingBag, X } from 'lucide-react';
import weddingForest from '../assets/morph/wedding-forest-optimized.jpg';
import weddingSunset from '../assets/morph/wedding-sunset.jpg';
import weddingTemple from '../assets/morph/wedding-temple.jpg';
import weddingWhiteHall from '../assets/morph/wedding-white-hall.jpg';
import weddingChurchRed from '../assets/morph/wedding-church-red.jpg';
import engagementRoses from '../assets/morph/engagement-roses.jpg';
import { getConfiguredTemplateGallery, resolveTemplateImages } from './templateAssets.js';

const DESIGN_KEY = 'romantic-gold';

const defaultGallery = [
  weddingSunset,
  weddingForest,
  weddingTemple,
  weddingWhiteHall,
  weddingChurchRed,
  engagementRoses
];

const uniqueImages = (images = []) => [...new Set(images.filter(Boolean))];

const formatArmenianDate = (value) => {
  if (!value) return '15 օգոստոսի, 2026';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('hy-AM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

const splitCoupleNames = (names = '') => {
  const normalized = String(names || '').trim();
  if (!normalized) return ['Արամ', 'Անի'];
  const parts = normalized.split(/\s*(?:և|&|\+)\s*/).filter(Boolean);
  if (parts.length >= 2) return [parts[0], parts.slice(1).join(' և ')];
  return [normalized, ''];
};

export const isRomanticGoldTemplate = (template) => (
  template?.designKey === DESIGN_KEY ||
  template?.slug?.trim().toLowerCase() === DESIGN_KEY
);

export const getRomanticGoldDraft = (template = {}) => {
  const gallery = uniqueImages(getConfiguredTemplateGallery(template, defaultGallery)).slice(0, 8);
  return {
    mainNames: template.title && template.title !== 'Romantic Gold' ? template.title : 'Արամ և Անի',
    eventDate: '2026-08-15',
    eventTime: '18:00',
    eventLocation: 'Երևան, Հայաստան',
    eventMessage: template.description || 'Սիրելի հյուրեր, մեծ սիրով հրավիրում ենք Ձեզ կիսելու մեր կյանքի ամենագեղեցիկ օրը։',
    image: gallery[0],
    gallery
  };
};

function Countdown({ date }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const target = new Date(`${date || '2026-08-15'}T18:00:00`).getTime();
  const difference = Math.max(0, target - now);
  const values = [
    ['օր', Math.floor(difference / 86400000)],
    ['ժամ', Math.floor((difference / 3600000) % 24)],
    ['րոպե', Math.floor((difference / 60000) % 60)],
    ['վայրկյան', Math.floor((difference / 1000) % 60)]
  ];

  return (
    <div className="romantic-countdown">
      {values.map(([label, value]) => (
        <article className="romantic-countdown-box" key={label}>
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{label}</span>
        </article>
      ))}
    </div>
  );
}

function RomanticGoldLayout({ draft, price, onEdit, onOrder, loading, actions, rsvpForm, publicMode = false }) {
  const [modalImage, setModalImage] = useState('');
  const [musicOn, setMusicOn] = useState(false);
  const draftImages = resolveTemplateImages([draft?.image, ...(draft?.gallery || [])]);
  const gallery = uniqueImages([...draftImages, ...(draftImages.length ? [] : defaultGallery)]).slice(0, 8);
  const heroImage = draft?.image || gallery[0] || weddingSunset;
  const [firstName, secondName] = splitCoupleNames(draft?.mainNames);
  const petals = useMemo(() => Array.from({ length: 18 }, (_, index) => ({
    id: index,
    left: `${(index * 17) % 100}%`,
    size: 8 + (index % 5) * 3,
    delay: `${(index % 9) * 0.8}s`,
    duration: `${9 + (index % 6)}s`
  })), []);

  const previewRsvpForm = (
    <form className="romantic-rsvp-form" onSubmit={(event) => event.preventDefault()}>
      <label>
        <span>Անուն, ազգանուն *</span>
        <input type="text" placeholder="Մուտքագրեք Ձեր անունը" />
      </label>
      <fieldset>
        <legend>Մասնակցու՞մ եք *</legend>
        <div className="romantic-radio-options">
          <label><input type="radio" name="romantic-preview-rsvp" defaultChecked /><span>Այո, կգամ</span></label>
          <label><input type="radio" name="romantic-preview-rsvp" /><span>Չեմ կարող գալ</span></label>
        </div>
      </fieldset>
      <label>
        <span>Հյուրերի քանակ</span>
        <input type="number" min="1" defaultValue="1" />
      </label>
      <label>
        <span>Հաղորդագրություն</span>
        <textarea rows="3" placeholder="Ձեր բարեմաղթանքը..." />
      </label>
      <button className="romantic-gold-button" type="submit">Ուղարկել</button>
    </form>
  );

  return (
    <article className="romantic-invite">
      <div className="romantic-petals" aria-hidden="true">
        {petals.map((petal) => (
          <span
            key={petal.id}
            style={{
              left: petal.left,
              width: petal.size,
              height: petal.size,
              animationDelay: petal.delay,
              animationDuration: petal.duration
            }}
          />
        ))}
      </div>

      <button
        className={musicOn ? 'romantic-music-button is-playing' : 'romantic-music-button'}
        type="button"
        aria-label={musicOn ? 'Անջատել երաժշտությունը' : 'Միացնել երաժշտությունը'}
        onClick={() => setMusicOn((current) => !current)}
      >
        {musicOn ? <Pause size={20} /> : <Music2 size={20} />}
      </button>

      <section className="romantic-hero" style={{ '--romantic-hero-image': `url(${heroImage})` }}>
        <span className="romantic-corner top-left" />
        <span className="romantic-corner top-right" />
        <span className="romantic-corner bottom-left" />
        <span className="romantic-corner bottom-right" />
        <div className="romantic-hero-content">
          <p className="romantic-eyebrow">Պատրաստվեք մեր հարսանիքին</p>
          <h1>{firstName}</h1>
          {secondName && <p className="romantic-ampersand">&amp;</p>}
          {secondName && <h1>{secondName}</h1>}
          <i />
          <p className="romantic-date">{formatArmenianDate(draft?.eventDate)}</p>
          <p className="romantic-location">{draft?.eventLocation || 'Երևան, Հայաստան'}</p>
        </div>
      </section>

      <section className="romantic-section romantic-white">
        <div className="romantic-container romantic-center">
          <p className="romantic-section-kicker">Մինչև միջոցառումը</p>
          <i className="romantic-divider" />
          <Countdown date={draft?.eventDate} />
        </div>
      </section>

      <section className="romantic-section romantic-cream">
        <div className="romantic-container romantic-center">
          <p className="romantic-section-kicker">Մեր պատմությունը</p>
          <i className="romantic-divider" />
          <div className="romantic-story-list">
            {[
              ['2019', 'Առաջին հանդիպում', 'Մենք հանդիպեցինք ընկերների միջոցառման ժամանակ, և այդ օրը դարձավ մեր պատմության սկիզբը։'],
              ['2021', 'Առաջին ճանապարհորդություն', 'Միասին բացահայտեցինք նոր վայրեր և հասկացանք, որ ուզում ենք կիսել կյանքի ամեն պահը։'],
              ['2025', 'Առաջարկություն', 'Մի գեղեցիկ երեկո հնչեց ամենասպասված հարցը, և պատասխանը եղավ՝ այո։']
            ].map(([year, title, text], index) => (
              <article className={index % 2 ? 'romantic-story-card reverse' : 'romantic-story-card'} key={year}>
                <div className="romantic-story-year"><span /><strong>{year}</strong></div>
                <div className="romantic-story-content">
                  <h2>{title}</h2>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="romantic-section romantic-white">
        <div className="romantic-container romantic-center">
          <p className="romantic-section-kicker">Նկարներ</p>
          <i className="romantic-divider" />
          <div className="romantic-gallery">
            {gallery.slice(0, 6).map((image, index) => (
              <button className="romantic-gallery-item" type="button" key={`${image}-${index}`} onClick={() => setModalImage(image)}>
                <img src={image} alt={`${draft?.mainNames || 'Հարսանեկան հրավեր'} ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="romantic-section romantic-cream">
        <div className="romantic-container romantic-event-container">
          <div className="romantic-center">
            <p className="romantic-section-kicker">Միջոցառման ծրագիր</p>
            <i className="romantic-divider" />
          </div>
          <div className="romantic-events">
            <article className="romantic-event-card">
              <time>{draft?.eventTime || '18:00'}</time>
              <div>
                <h2>Հիմնական արարողություն</h2>
                <p>{draft?.eventLocation || 'Երևան, Հայաստան'}</p>
                <address>{draft?.eventMessage}</address>
              </div>
            </article>
            <article className="romantic-event-card">
              <time>20:00</time>
              <div>
                <h2>Հարսանյաց հանդես</h2>
                <p>Տոնական երեկո սիրելի հյուրերի հետ</p>
                <address>{draft?.eventLocation || 'Երևան, Հայաստան'}</address>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="romantic-section romantic-white">
        <div className="romantic-container romantic-form-container">
          <div className="romantic-center">
            <p className="romantic-section-kicker">Հաստատեք Ձեր մասնակցությունը</p>
            <i className="romantic-divider" />
          </div>
          {rsvpForm || previewRsvpForm}
        </div>
      </section>

      <section className="romantic-template-actions">
        <div>
          <span>{publicMode ? 'Հրավերի հղումը կարող եք կիսվել հյուրերի հետ' : 'Հրավերի արժեքը'}</span>
          <strong>{publicMode ? formatArmenianDate(draft?.eventDate) : `${Number(price || 29000).toLocaleString()} AMD`}</strong>
        </div>
        <div>
          {publicMode ? actions : (
            <>
              <button className="btn btn-ghost" type="button" onClick={onEdit}>
                <Pencil size={18} />
                Խմբագրել
              </button>
              <button className="btn btn-primary" type="button" onClick={onOrder} disabled={loading}>
                <ShoppingBag size={18} />
                {loading ? 'Բեռնվում է...' : 'Պատվիրել այս հրավերը'}
              </button>
            </>
          )}
        </div>
      </section>

      <footer className="romantic-footer">
        <h2>{draft?.mainNames || 'Արամ և Անի'}</h2>
        <p>{formatArmenianDate(draft?.eventDate)}</p>
        <i className="romantic-divider" />
        <small>Սիրով սպասում ենք Ձեզ</small>
      </footer>

      {modalImage && (
        <div className="romantic-image-modal" role="dialog" aria-modal="true">
          <button type="button" onClick={() => setModalImage('')} aria-label="Փակել նկարը"><X size={28} /></button>
          <img src={modalImage} alt="Մեծացված նկար" />
        </div>
      )}
    </article>
  );
}

export function RomanticGoldCardPreview({ template }) {
  const draft = getRomanticGoldDraft(template);
  const [firstName, secondName] = splitCoupleNames(draft.mainNames);

  return (
    <div className="romantic-card-preview" style={{ '--romantic-card-image': `url(${draft.image || weddingSunset})` }}>
      <span>Հարսանեկան հրավեր</span>
      <strong>{firstName}{secondName ? ` & ${secondName}` : ''}</strong>
      <em>{formatArmenianDate(draft.eventDate)}</em>
    </div>
  );
}

export function RomanticGoldLivePreview(props) {
  return <RomanticGoldLayout {...props} />;
}

export function RomanticGoldInvitationView({ draft, actions, rsvpForm }) {
  return <RomanticGoldLayout draft={draft} actions={actions} rsvpForm={rsvpForm} publicMode />;
}
