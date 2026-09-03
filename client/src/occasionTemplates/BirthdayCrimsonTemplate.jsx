import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import birthdaySong from '../vendorTemplates/cnund1/src/assets/audio/happy-birthday.mp3';
import blackWilliamFont from '../vendorTemplates/cnund3/src/assets/fonts/BlackWilliam.otf?url';
import cakeIcon from '../vendorTemplates/cnund3/src/assets/images/cake.png';
import cocktails from '../vendorTemplates/cnund3/src/assets/images/cocktails.png';
import dinnerIcon from '../vendorTemplates/cnund3/src/assets/images/dinner.png';
import martiniIcon from '../vendorTemplates/cnund3/src/assets/images/martini.png';
import musicIcon from '../vendorTemplates/cnund3/src/assets/images/music.png';
import crimsonStyles from '../vendorTemplates/cnund3/src/styles.css?inline';
import { OriginalTemplateSurface, TemplateShell } from './OriginalTypeScriptTemplates.tsx';

const DEFAULTS = {
  name: 'Anna',
  age: 18,
  eventDate: '2027-07-09',
  time: '17:00',
  venue: 'Dvin Music Hall',
  address: '40 Paronyan St, Yerevan',
  mapUrl: 'https://maps.google.com',
  message: 'Սիրելի ընկերներ, սիրով հրավիրում եմ ձեզ իմ ծննդյան տոնին։ Եկեք միասին անցկացնենք գեղեցիկ երեկո՝ լի երաժշտությամբ, ուրախությամբ և անմոռանալի պահերով։',
  rsvpDeadline: '01.07.2027'
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const crimsonFontFace = `@font-face { font-family: 'BlackWilliam'; src: url('${blackWilliamFont}') format('opentype'); font-weight: 400; font-style: normal; font-display: swap; }`;
const crimsonThemeAliases = {
  accent: ['--red', '--red-soft'],
  text: ['--ink'],
  overlay: ['--pink', '--pink-2', '--paper']
};
const resolvedCrimsonStyles = `${crimsonStyles.replace('./assets/fonts/BlackWilliam.otf', blackWilliamFont)}

.cnund3-music-button {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 90;
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(182, 0, 16, .28);
  border-radius: 50%;
  background: rgba(255, 247, 248, .92);
  color: var(--red);
  box-shadow: 0 12px 32px rgba(143, 16, 25, .15);
  cursor: pointer;
  touch-action: manipulation;
  user-select: none;
  transition: transform .25s ease, background .25s ease, color .25s ease;
}
.cnund3-music-button:hover { transform: translateY(-3px); }
.cnund3-music-button.playing { background: var(--red); color: #fff; }
.cnund3-music-button svg { width: 24px; height: 24px; fill: currentColor; }

/* Keep long Armenian RSVP copy readable without splitting the end of a word. */
.rsvp-card .eyebrow-script {
  font-size: clamp(2.25rem, 5.8vw, 4.875rem);
  line-height: .94;
  overflow-wrap: normal;
  word-break: keep-all;
  hyphens: none;
}
.rsvp-card h2 {
  font-size: clamp(1.625rem, 3.6vw, 2.75rem);
  overflow-wrap: normal;
  word-break: keep-all;
  hyphens: none;
}

@media (max-width: 650px) { .cnund3-music-button { right: 12px; bottom: 12px; } }
@media (prefers-reduced-motion: reduce) { .cnund3-music-button { transition: none; } }`;

const getDateParts = (value) => {
  const date = new Date(`${value || DEFAULTS.eventDate}T12:00:00`);
  const safe = Number.isNaN(date.getTime()) ? new Date(`${DEFAULTS.eventDate}T12:00:00`) : date;
  return {
    month: MONTHS[safe.getMonth()],
    day: String(safe.getDate()).padStart(2, '0'),
    year: String(safe.getFullYear())
  };
};

function useCountdown(target) {
  const calculate = useCallback(() => {
    const targetTime = new Date(target).getTime();
    return Number.isFinite(targetTime) ? Math.max(0, targetTime - Date.now()) : 0;
  }, [target]);
  const [diff, setDiff] = useState(calculate);
  useEffect(() => {
    setDiff(calculate());
    const id = setInterval(() => setDiff(calculate()), 1000);
    return () => clearInterval(id);
  }, [calculate]);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60)
  };
}

function MusicGlyph({ playing }) {
  return playing
    ? <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="3.5" height="14" rx="1" /><rect x="14.5" y="5" width="3.5" height="14" rx="1" /></svg>
    : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v10.2a3.1 3.1 0 1 0 2 2.9V9.4l6-1.6v5.7a3.1 3.1 0 1 0 2 2.9V4.5L9 7V5Z" /></svg>;
}

function Rsvp({ draft, onRsvpSubmit }) {
  const settings = draft.rsvpSettings || {};
  const [attendance, setAttendance] = useState('yes');
  const [state, setState] = useState('idle');

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setState('loading');
    try {
      await onRsvpSubmit?.({
        guestName: String(data.get('name') || '').trim(),
        status: attendance === 'yes' ? 'attending' : 'declined',
        guestCount: Number(data.get('guests')) || 1,
        guestSide: 'other',
        phone: String(data.get('phone') || '').trim(),
        message: String(data.get('message') || '').trim()
      });
      setState('success');
      form.reset();
    } catch {
      setState('error');
    }
  };

  return <section className="rsvp section reveal" id="rsvp" data-editor-section="rsvp" hidden={draft.questionsVisible === false}>
    <div className="rsvp-card">
      <span className="script eyebrow-script">RSVP</span>
      <h2 data-editor-field="rsvpSettings.title">{settings.title || 'Կհանդիպե՞նք տոնին'}</h2>
      <p className="rsvp-lead" data-editor-field="rsvpSettings.description">{settings.description || `Խնդրում եմ հաստատել Ձեր ներկայությունը մինչև ${settings.deadline || DEFAULTS.rsvpDeadline}`}</p>
      <form onSubmit={submit}>
        <label className="field"><span>Անուն / ազգանուն</span><input name="name" required type="text" placeholder={settings.guestPlaceholder || 'Գրեք Ձեր անունը'} /></label>
        <div className="attendance">
          <button type="button" className={attendance === 'yes' ? 'active' : ''} onClick={() => setAttendance('yes')}><i /> {settings.attendingLabel || 'Սիրով կմասնակցեմ'}</button>
          <button type="button" className={attendance === 'no' ? 'active' : ''} onClick={() => setAttendance('no')}><i /> {settings.notAttendingLabel || 'Ցավոք, չեմ կարող գալ'}</button>
        </div>
        <div className="form-row">
          {settings.askGuestCount !== false ? <label className="field"><span>Հյուրերի քանակ</span><input name="guests" type="number" min="1" defaultValue="1" disabled={attendance === 'no'} /></label> : null}
          <label className="field"><span>Հեռախոս</span><input name="phone" type="tel" placeholder="+374 ..." /></label>
        </div>
        <label className="field"><span>Հաղորդագրություն</span><textarea name="message" rows="3" placeholder="Ցանկության դեպքում թողեք փոքրիկ հաղորդագրություն" /></label>
        <button className="submit" type="submit" disabled={state === 'loading'}>{state === 'loading' ? 'Ուղարկվում է…' : (settings.submitLabel || 'Ուղարկել')} <span>→</span></button>
        {state === 'success' ? <p className="success" role="status">Շնորհակալություն ♥ Պատասխանը պահպանվեց։</p> : null}
        {state === 'error' ? <p className="success" role="alert">Չհաջողվեց ուղարկել։ Խնդրում ենք փորձել կրկին։</p> : null}
      </form>
    </div>
  </section>;
}

function BirthdayCrimsonDocument({ draft, onRsvpSubmit }) {
  const rootRef = useRef(null);
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const name = draft.mainNames || DEFAULTS.name;
  const age = Math.max(1, Number(draft.templateTextOverrides?.['birthday-crimson-age']) || DEFAULTS.age);
  const date = useMemo(() => getDateParts(draft.eventDate), [draft.eventDate]);
  const venueData = (draft.mapLinks || []).find((item) => item?.visible !== false) || {};
  const time = venueData.time || draft.eventTime || DEFAULTS.time;
  const venue = venueData.label || DEFAULTS.venue;
  const address = venueData.address || draft.eventLocation || DEFAULTS.address;
  const mapUrl = venueData.url || draft.mapLink || DEFAULTS.mapUrl;
  const musicSource = draft.musicEnabled === false ? '' : (draft.musicUrl || birthdaySong);
  const countdown = useCountdown(`${draft.eventDate || DEFAULTS.eventDate}T${time}:00+04:00`);
  const countdownItems = [
    [String(countdown.days).padStart(2, '0'), 'օր'],
    [String(countdown.hours).padStart(2, '0'), 'ժամ'],
    [String(countdown.minutes).padStart(2, '0'), 'րոպե'],
    [String(countdown.seconds).padStart(2, '0'), 'վայրկյան']
  ];
  const override = (key, fallback) => draft.templateTextOverrides?.[key] || fallback;
  const timeline = [
    { time: override('birthday-crimson-timeline-1-time', '17:00'), text: override('birthday-crimson-timeline-1-text', 'Հյուրերի դիմավորում և welcome drinks'), icon: martiniIcon },
    { time: override('birthday-crimson-timeline-2-time', '18:00'), text: override('birthday-crimson-timeline-2-text', 'Ընթրիք և տոնական սեղան'), icon: dinnerIcon },
    { time: override('birthday-crimson-timeline-3-time', '19:00'), text: override('birthday-crimson-timeline-3-text', 'Երաժշտություն և պարեր'), icon: musicIcon },
    { time: override('birthday-crimson-timeline-4-time', '20:00'), text: override('birthday-crimson-timeline-4-text', 'Տորթի պահը'), icon: cakeIcon }
  ];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.14, rootMargin: '0px 0px -50px 0px' });
    root.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !musicSource) return undefined;
    audio.volume = 0.55;
    audio.loop = true;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    const tryPlay = async () => { try { await audio.play(); } catch { setPlaying(false); } };
    void tryPlay();
    const unlock = (event) => {
      if (event.target.closest?.('.cnund3-music-button') || !audio.paused) return;
      void tryPlay();
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      window.removeEventListener('pointerdown', unlock);
      audio.pause();
    };
  }, [musicSource]);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try { await audio.play(); } catch { setPlaying(false); }
    } else audio.pause();
  };

  const handleMusicPointerDown = (event) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    event.stopPropagation();
    void toggleMusic();
  };

  const handleMusicKeyDown = (event) => {
    if (event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    event.stopPropagation();
    void toggleMusic();
  };

  return <main ref={rootRef} className="page">
    {musicSource ? <audio ref={audioRef} src={musicSource} preload="auto" loop /> : null}
    {musicSource ? <button type="button" className={`cnund3-music-button ${playing ? 'playing' : ''}`} onPointerDown={handleMusicPointerDown} onKeyDown={handleMusicKeyDown} aria-label={playing ? 'Անջատել երաժշտությունը' : 'Միացնել երաժշտությունը'} aria-pressed={playing} data-editor-ignore="music"><MusicGlyph playing={playing} /></button> : null}
    <section className="hero" data-editor-section="hero" hidden={draft.heroVisible === false}>
      <div className="hero-number" aria-hidden="true">{age}</div><div className="hero-line" aria-hidden="true" /><div className="hero-heart" aria-hidden="true">♡</div>
      <div className="hero-copy"><h1 className="script"><span data-editor-field="mainNames">{name}</span>'s<br />birthday</h1><p className="hero-sub">LET'S CELEBRATE</p><a href="#details" className="hero-scroll">discover ↓</a></div>
    </section>

    <section className="details section reveal" id="details" data-editor-section="schedule" hidden={draft.openingVisible === false}>
      <span className="script section-script">Save the date</span>
      <div className="date-row" data-editor-ignore="calendar"><div className="date-side"><span>{date.month}</span></div><strong>{date.day}</strong><div className="date-side"><span>{time}</span></div></div>
      <div className="invite-copy"><h2 className="script">It's time to celebrate my<br /><span data-template-text-key="birthday-crimson-age" data-editor-input-mode="numeric">{age}</span>th birthday!</h2><p data-editor-field="eventMessage">{draft.eventMessage || DEFAULTS.message}</p></div>
      <div className="venue-block reveal"><span className="script venue-title">Restaurant</span><h3 data-editor-field="mapLinks.0.label">{venue}</h3><p data-editor-field="mapLinks.0.address">{address}</p><a href={mapUrl} target="_blank" rel="noreferrer">Քարտեզ ↗</a></div>
    </section>

    <section className="countdown section reveal" data-editor-section="schedule" data-editor-ignore="countdown" hidden={draft.receptionVisible === false}><span className="script section-script">The event will start</span><div className="countdown-grid">{countdownItems.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>

    <section className="timeline section" id="timeline" data-editor-section="schedule" hidden={draft.receptionVisible === false}>
      <div className="timeline-heading reveal"><span className="script section-script">Timeline</span><p>Օրվա փոքրիկ ծրագիրը</p></div>
      <div className="timeline-list">{timeline.map((item, index) => <article className="timeline-item reveal" key={index} style={{ '--delay': `${index * 80}ms` }}><div className="timeline-icon-shell"><img src={item.icon} alt="" /></div><strong data-template-text-key={`birthday-crimson-timeline-${index + 1}-time`}>{item.time}</strong><p data-template-text-key={`birthday-crimson-timeline-${index + 1}-text`}>{item.text}</p>{index < timeline.length - 1 ? <div className="timeline-arrow">⌄</div> : null}</article>)}</div>
    </section>

    <section className="dress section reveal" data-editor-section="dress" hidden={draft.dressCodeVisible === false}><span className="script section-script">Dress code</span><p data-editor-field="dressCode">{draft.dressCode || 'Կարմիր, վարդագույն և նուրբ փոշոտ երանգներ'}</p><div className="palette" aria-label="Dress code colors">{(draft.dressCodeColors?.length ? draft.dressCodeColors : [{ hex: '#b50010' }, { hex: '#d04450' }, { hex: '#e56f7a' }, { hex: '#f19aa4' }, { hex: '#f7c5cc' }]).map((color, index) => <i key={`${color.hex}-${index}`} style={{ backgroundColor: color.hex }} />)}</div><p className="script waiting" data-editor-field="closingMessage">{draft.closingMessage || `I will be waiting for all of you with love, your ${name}.`}</p></section>
    <Rsvp draft={draft} onRsvpSubmit={onRsvpSubmit} />
    <footer className="footer reveal" data-editor-section="closing" hidden={draft.finalMessageVisible === false}><div className="footer-heart">♡</div><span className="script">See you there</span><small data-editor-ignore="calendar">{date.day}.{date.month}.{date.year}</small></footer>
  </main>;
}

export const isBirthdayCrimsonTemplate = (template = {}) => [template.designKey, template.slug, template.title]
  .map((value) => String(value || '').trim().toLowerCase().replace(/[_\s]+/g, '-'))
  .some((value) => ['birthday-crimson', 'emma-birthday', 'cnund3'].includes(value));

export const getBirthdayCrimsonDraft = () => ({
  mainNames: DEFAULTS.name,
  eventDate: DEFAULTS.eventDate,
  eventTime: DEFAULTS.time,
  eventLocation: DEFAULTS.address,
  eventMessage: DEFAULTS.message,
  image: cocktails,
  gallery: [cocktails, cakeIcon, dinnerIcon, musicIcon, martiniIcon],
  mapLink: DEFAULTS.mapUrl,
  mapLinks: [{ label: DEFAULTS.venue, time: DEFAULTS.time, address: DEFAULTS.address, url: DEFAULTS.mapUrl, visible: true }],
  colors: {},
  dressCode: 'Կարմիր, վարդագույն և նուրբ փոշոտ երանգներ',
  dressCodeColors: [
    { name: 'Մուգ կարմիր', hex: '#b50010' },
    { name: 'Կարմիր', hex: '#d04450' },
    { name: 'Մարջանագույն', hex: '#e56f7a' },
    { name: 'Վարդագույն', hex: '#f19aa4' },
    { name: 'Բաց վարդագույն', hex: '#f7c5cc' }
  ],
  musicEnabled: true,
  musicUrl: birthdaySong,
  musicTitle: 'Happy Birthday',
  closingMessage: `I will be waiting for all of you with love, your ${DEFAULTS.name}.`,
  rsvpSettings: {
    title: 'Կհանդիպե՞նք տոնին',
    description: `Խնդրում եմ հաստատել Ձեր ներկայությունը մինչև ${DEFAULTS.rsvpDeadline}`,
    deadline: DEFAULTS.rsvpDeadline,
    guestPlaceholder: 'Գրեք Ձեր անունը',
    attendingLabel: 'Սիրով կմասնակցեմ',
    notAttendingLabel: 'Ցավոք, չեմ կարող գալ',
    submitLabel: 'Ուղարկել',
    askGuestCount: true,
    askMeal: false
  }
});

function BirthdayCrimsonTemplate(props) {
  const draft = props.draft || getBirthdayCrimsonDraft();
  const fontImport = `${crimsonFontFace} :host { --font-display: 'BlackWilliam', cursive; }`;
  return <TemplateShell props={props}><OriginalTemplateSurface css={resolvedCrimsonStyles} draft={draft} fontImport={fontImport} globalFontImport={crimsonFontFace} label="Կարմիր ձեռագիր ծննդյան հրավեր" themeVariableAliases={crimsonThemeAliases}><BirthdayCrimsonDocument draft={draft} onRsvpSubmit={props.onRsvpSubmit} /></OriginalTemplateSurface></TemplateShell>;
}

export const BirthdayCrimsonCardPreview = () => <div className="original-template-card-preview" style={{ background: '#fdecef' }}><img src={cocktails} alt="" style={{ objectFit: 'contain', objectPosition: 'right bottom' }} /><div /><span>React template</span><strong>Կարմիր տարեդարձ</strong></div>;
export const BirthdayCrimsonLivePreview = BirthdayCrimsonTemplate;
export const BirthdayCrimsonInvitationView = (props) => <BirthdayCrimsonTemplate {...props} mode="public" />;
