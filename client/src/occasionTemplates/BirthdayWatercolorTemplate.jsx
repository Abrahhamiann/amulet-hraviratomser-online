import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import birthdaySong from '../vendorTemplates/cnund2/src/assets/audio/happy-birthday.mp3';
import bubbleSansFont from '../vendorTemplates/cnund2/src/assets/fonts/BubbleSans.otf?url';
import background from '../vendorTemplates/cnund2/src/assets/images/background.png';
import flowers from '../vendorTemplates/cnund2/src/assets/images/flowers.png';
import watercolorStyles from '../vendorTemplates/cnund2/src/styles.css?inline';
import { OriginalTemplateSurface, TemplateShell } from './OriginalTypeScriptTemplates.tsx';

const DEFAULTS = {
  name: 'Արմեն',
  age: 2,
  eventDate: '2026-07-26',
  time: '18:00',
  venue: '«Տորենա» ռեստորան',
  address: 'Երևան, Աբովյան 12',
  mapUrl: 'https://maps.google.com',
  message: 'Միասին ստեղծենք գունավոր հիշողություններով լի մի օր։',
  rsvpDeadline: '15.07.2026'
};

const MONTHS = ['Հունվար', 'Փետրվար', 'Մարտ', 'Ապրիլ', 'Մայիս', 'Հունիս', 'Հուլիս', 'Օգոստոս', 'Սեպտեմբեր', 'Հոկտեմբեր', 'Նոյեմբեր', 'Դեկտեմբեր'];
const MONTHS_GENITIVE = ['Հունվարի', 'Փետրվարի', 'Մարտի', 'Ապրիլի', 'Մայիսի', 'Հունիսի', 'Հուլիսի', 'Օգոստոսի', 'Սեպտեմբերի', 'Հոկտեմբերի', 'Նոյեմբերի', 'Դեկտեմբերի'];
const WEEKDAYS = ['Կիր', 'Երկ', 'Երք', 'Չոր', 'Հնգ', 'Ուր', 'Շբ'];
const watercolorFontFace = `@font-face { font-family: "Bubble Sans"; src: url('${bubbleSansFont}') format('opentype'); font-weight: 400; font-style: normal; font-display: swap; }`;
const watercolorThemeAliases = {
  accent: ['--blue', '--blue-dark', '--peach', '--peach-light', '--gold'],
  text: ['--ink', '--ink-soft'],
  overlay: ['--paper', '--white']
};
const resolvedWatercolorStyles = `${watercolorStyles.replace('./assets/fonts/BubbleSans.otf', bubbleSansFont)}

/* Amulet integration fix: Bubble Sans needs its full line box so the age glyph is not clipped. */
.age-number {
  line-height: 1;
}`;

const getDateParts = (value) => {
  const date = new Date(`${value || DEFAULTS.eventDate}T12:00:00`);
  const safe = Number.isNaN(date.getTime()) ? new Date(`${DEFAULTS.eventDate}T12:00:00`) : date;
  return {
    year: safe.getFullYear(),
    monthIndex: safe.getMonth(),
    selectedDay: safe.getDate(),
    monthTitle: MONTHS[safe.getMonth()],
    dateText: `${safe.getDate()} ${MONTHS_GENITIVE[safe.getMonth()]} ${safe.getFullYear()}`
  };
};

const buildCalendar = (year, monthIndex) => {
  const first = new Date(year, monthIndex, 1).getDay();
  const days = new Date(year, monthIndex + 1, 0).getDate();
  return [...Array(first).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)];
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

function MusicIcon({ playing }) {
  if (playing) return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.3" y="5" width="3.2" height="14" rx="1.2" /><rect x="14.5" y="5" width="3.2" height="14" rx="1.2" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v10.2a3.1 3.1 0 1 0 2 2.9V9.4l6-1.6v5.7a3.1 3.1 0 1 0 2 2.9V4.5L9 7V5Z" /></svg>;
}

function CakeIcon() {
  return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M17 28h30a6 6 0 0 1 6 6v17H11V34a6 6 0 0 1 6-6Z" /><path d="M11 38c7 4 11-4 18 0s11-4 18 0 6-2 6-2" /><path d="M18 51v5M46 51v5M12 56h40" /><path d="M32 11c5 5 3 10 0 12-3-2-5-7 0-12Z" /><path d="M32 23v5" /></svg>;
}

function PinIcon() {
  return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 57S14 39 14 25a18 18 0 1 1 36 0c0 14-18 32-18 32Z" /><circle cx="32" cy="25" r="6" /></svg>;
}

function GiftIcon() {
  return <svg viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="27" width="44" height="29" rx="3" /><path d="M8 20h48v10H8zM32 20v36" /><path d="M31 20c-7-1-14-3-14-9 0-4 3-6 6-5 6 1 8 9 8 14ZM33 20c7-1 14-3 14-9 0-4-3-6-6-5-6 1-8 9-8 14Z" /></svg>;
}

function Calendar({ date }) {
  const cells = useMemo(() => buildCalendar(date.year, date.monthIndex), [date.monthIndex, date.year]);
  return <div className="calendar-card reveal" data-editor-ignore="calendar"><div className="calendar-title">{date.monthTitle} <span>{date.year}</span></div><div className="week-row">{WEEKDAYS.map((day) => <span key={day}>{day}</span>)}</div><div className="days-grid">{cells.map((day, index) => day ? <span key={day} className={day === date.selectedDay ? 'selected' : ''}>{day}</span> : <span key={`empty-${index}`} />)}</div></div>;
}

function Roadmap() {
  const steps = [
    { time: '17:30', title: 'Հյուրերի դիմավորում', text: 'Հանդիպում ենք, ժպտում ու սկսում տոնը', icon: <PinIcon /> },
    { time: '18:00', title: 'Ծննդյան խնջույք', text: 'Խաղեր, երաժշտություն ու ուրախ պահեր', icon: <GiftIcon /> },
    { time: '19:30', title: 'Տորթի պահը', text: 'Մոմեր, ցանկություն և ամենաքաղցր պահը', icon: <CakeIcon /> }
  ];
  return <section className="roadmap-section section-shell reveal" data-editor-section="schedule"><div className="section-heading"><span>Օրվա ծրագիր</span><h2>Մեր փոքրիկ տոնի ճանապարհը</h2></div><div className="roadmap"><div className="road-line" aria-hidden="true" />{steps.map((step, index) => <article className="road-step" key={step.time} style={{ '--delay': `${index * 120}ms` }}><div className="road-icon">{step.icon}</div><div className="road-copy"><strong>{step.time}</strong><h3>{step.title}</h3><p>{step.text}</p></div></article>)}</div></section>;
}

function Rsvp({ draft, onRsvpSubmit }) {
  const [attending, setAttending] = useState('yes');
  const [state, setState] = useState('idle');
  const settings = draft.rsvpSettings || {};
  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setState('loading');
    try {
      await onRsvpSubmit?.({
        guestName: String(data.get('name') || '').trim(),
        status: attending === 'yes' ? 'attending' : 'declined',
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
  return <section className="rsvp-wrap section-shell reveal" id="rsvp" data-editor-section="rsvp" hidden={draft.questionsVisible === false}><div className="rsvp-decor rsvp-decor-left" aria-hidden="true"><img src={flowers} alt="" /></div><div className="rsvp-decor rsvp-decor-right" aria-hidden="true"><img src={flowers} alt="" /></div><div className="section-heading rsvp-heading"><span>Կհանդիպե՞նք</span><h2 data-editor-field="rsvpSettings.title">{settings.title || 'Սիրով սպասում ենք Ձեր պատասխանին'}</h2><p data-editor-field="rsvpSettings.description">{settings.description || `Խնդրում ենք հաստատել մասնակցությունը մինչև ${settings.deadline || DEFAULTS.rsvpDeadline}`}</p></div><form className="rsvp-form" onSubmit={submit}><label className="field full"><span>Անուն Ազգանուն</span><input name="name" required placeholder={settings.guestPlaceholder || 'Գրեք Ձեր անունը'} /></label><div className="attendance" role="group" aria-label="Մասնակցություն"><button type="button" className={attending === 'yes' ? 'active' : ''} onClick={() => setAttending('yes')}><i />{settings.attendingLabel || 'Այո, սիրով կգամ'}</button><button type="button" className={attending === 'no' ? 'active' : ''} onClick={() => setAttending('no')}><i />{settings.notAttendingLabel || 'Ցավոք, չեմ կարող գալ'}</button></div><div className="form-grid">{settings.askGuestCount !== false ? <label className="field"><span>Հյուրերի քանակ</span><input name="guests" type="number" min="1" defaultValue="1" disabled={attending === 'no'} /></label> : null}<label className="field"><span>Հեռախոս</span><input name="phone" type="tel" placeholder="+374 ..." /></label></div><label className="field full"><span>Մեկնաբանություն</span><textarea name="message" rows="3" placeholder="Ցանկության դեպքում թողեք հաղորդագրություն" /></label><button className="submit-btn" type="submit" disabled={state === 'loading'}>{state === 'loading' ? 'Ուղարկվում է…' : (settings.submitLabel || 'Ուղարկել պատասխանը')}</button>{state === 'success' ? <div className="thanks" role="status">Շնորհակալություն 🤍 Ձեր պատասխանը պահպանվեց։</div> : null}{state === 'error' ? <div className="thanks" role="alert">Չհաջողվեց ուղարկել։ Խնդրում ենք փորձել կրկին։</div> : null}</form></section>;
}

function BirthdayWatercolorDocument({ draft, onRsvpSubmit }) {
  const documentRef = useRef(null);
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const date = useMemo(() => getDateParts(draft.eventDate), [draft.eventDate]);
  const age = Math.max(1, Number(draft.templateTextOverrides?.['birthday-watercolor-age']) || DEFAULTS.age);
  const name = draft.mainNames || DEFAULTS.name;
  const firstVenue = (draft.mapLinks || []).find((venue) => venue?.visible !== false) || {};
  const time = firstVenue.time || draft.eventTime || DEFAULTS.time;
  const venue = firstVenue.label || DEFAULTS.venue;
  const address = firstVenue.address || draft.eventLocation || DEFAULTS.address;
  const mapUrl = firstVenue.url || draft.mapLink || DEFAULTS.mapUrl;
  const musicSource = draft.musicEnabled === false ? '' : (draft.musicUrl || birthdaySong);
  const countdown = useCountdown(`${draft.eventDate || DEFAULTS.eventDate}T${time}:00+04:00`);
  const countdownItems = [
    [String(countdown.days).padStart(2, '0'), 'Օր'],
    [String(countdown.hours).padStart(2, '0'), 'Ժամ'],
    [String(countdown.minutes).padStart(2, '0'), 'Րոպե'],
    [String(countdown.seconds).padStart(2, '0'), 'Վայրկյան']
  ];

  useEffect(() => {
    const root = documentRef.current;
    if (!root) return undefined;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    root.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !musicSource) return undefined;
    audio.volume = 0.55;
    audio.loop = true;
    const syncPlay = () => setPlaying(true);
    const syncPause = () => setPlaying(false);
    const tryAutoplay = async () => {
      try { await audio.play(); setPlaying(true); return true; }
      catch { setPlaying(false); return false; }
    };
    const unlock = async (event) => {
      if (event.target.closest?.('.music-button') || !audio.paused) return;
      if (await tryAutoplay()) window.removeEventListener('pointerdown', unlock);
    };
    audio.addEventListener('play', syncPlay);
    audio.addEventListener('pause', syncPause);
    void tryAutoplay();
    window.addEventListener('pointerdown', unlock, { passive: true });
    return () => {
      audio.removeEventListener('play', syncPlay);
      audio.removeEventListener('pause', syncPause);
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

  return <main ref={documentRef} className="page" style={{ '--page-bg': `url(${background})` }}>
    {musicSource ? <audio ref={audioRef} src={musicSource} preload="auto" loop /> : null}
    <button className={`music-button ${playing ? 'playing' : ''}`} onClick={toggleMusic} aria-label={playing ? 'Անջատել երաժշտությունը' : 'Միացնել երաժշտությունը'} data-editor-ignore="music"><MusicIcon playing={playing} /><span>{playing ? 'Երգը միացված է' : 'Միացնել երգը'}</span></button>
    <section className="hero" data-editor-section="hero" hidden={draft.heroVisible === false}><div className="hero-glow" /><img src={flowers} alt="" className="hero-flower hero-flower-a" /><img src={flowers} alt="" className="hero-flower hero-flower-b" /><div className="hero-copy reveal in"><span className="hero-kicker">Սիրելի բարեկամներ</span><h1>Հրավիրում ենք Ձեզ<br />մեր փոքրիկ <em data-editor-field="mainNames">{name}</em>-ի<br />ծննդյան տոնին</h1><div className="age-composition" aria-label={`${age} տարեկան`}><div className="age-number" data-template-text-key="birthday-watercolor-age" data-editor-input-mode="numeric">{age}</div><img src={flowers} alt="" className="age-flowers" /><span className="age-label">տարեկան</span></div><p className="hero-note" data-editor-field="eventMessage">{draft.eventMessage || DEFAULTS.message}</p><a className="scroll-link" href="#details">Բացահայտել հրավերը <b>↓</b></a></div></section>
    <section className="intro-section section-shell reveal" id="details" data-editor-section="schedule" hidden={draft.openingVisible === false}><div className="section-heading"><span>Սիրով սպասում ենք Ձեզ</span><h2 data-editor-ignore="calendar">{date.dateText}</h2><p>Մեր փոքրիկի ժպիտը այս օրը ավելի պայծառ կլինի Ձեր ներկայությամբ։</p></div><Calendar date={date} /></section>
    <section className="countdown-section reveal" data-editor-section="schedule" data-editor-ignore="countdown" hidden={draft.receptionVisible === false}><div className="countdown-card"><span className="countdown-kicker">Մինչև տոնը մնացել է</span><div className="countdown-grid">{countdownItems.map(([value, label]) => <div className="count-item" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></div></section>
    <section className="venue-section section-shell reveal" data-editor-section="schedule" hidden={draft.receptionVisible === false}><div className="section-heading"><span>Վայր և ժամ</span><h2>Հանդիպում ենք այստեղ</h2></div><div className="venue-card"><div className="venue-icon"><PinIcon /></div><div className="venue-copy"><span className="venue-time" data-editor-ignore="calendar">{time}</span><h3 data-editor-field="mapLinks.0.label">{venue}</h3><p data-editor-field="mapLinks.0.address">{address}</p><a href={mapUrl} target="_blank" rel="noreferrer">Ինչպես հասնել</a></div></div></section>
    <Roadmap />
    <section className="wish-section reveal" data-editor-section="closing"><div className="wish-card"><GiftIcon /><div><span>Մի փոքր խնդրանք</span><h2>Ձեր ներկայությունը մեր լավագույն նվերն է</h2><p>Եթե ցանկանաք նաև նվեր բերել, ընտրեք այն, ինչը կուրախացնի փոքրիկին և կդառնա ջերմ հիշողություն։</p></div></div></section>
    <Rsvp draft={draft} onRsvpSubmit={onRsvpSubmit} />
    <footer className="footer" data-editor-section="closing" hidden={draft.finalMessageVisible === false}><img src={flowers} alt="" /><span data-editor-field="closingMessage">{draft.closingMessage || `Սիրով՝ ${name}-ի ընտանիքը`}</span><small data-editor-ignore="calendar">{date.dateText}</small></footer>
  </main>;
}

export const isBirthdayWatercolorTemplate = (template = {}) => [template.designKey, template.slug, template.title]
  .map((value) => String(value || '').trim().toLowerCase().replace(/[_\s]+/g, '-'))
  .some((value) => ['birthday-watercolor', 'watercolor-birthday', 'cnund2'].includes(value));

export const getBirthdayWatercolorDraft = () => ({
  mainNames: DEFAULTS.name,
  eventDate: DEFAULTS.eventDate,
  eventTime: DEFAULTS.time,
  eventLocation: DEFAULTS.address,
  eventMessage: DEFAULTS.message,
  image: background,
  gallery: [background, flowers],
  mapLink: DEFAULTS.mapUrl,
  mapLinks: [{ label: DEFAULTS.venue, time: DEFAULTS.time, address: DEFAULTS.address, url: DEFAULTS.mapUrl, visible: true }],
  colors: {},
  musicEnabled: true,
  musicUrl: birthdaySong,
  musicTitle: 'Happy Birthday · Watercolor',
  closingMessage: `Սիրով՝ ${DEFAULTS.name}-ի ընտանիքը`,
  rsvpSettings: {
    title: 'Սիրով սպասում ենք Ձեր պատասխանին',
    description: `Խնդրում ենք հաստատել մասնակցությունը մինչև ${DEFAULTS.rsvpDeadline}`,
    deadline: DEFAULTS.rsvpDeadline,
    guestPlaceholder: 'Գրեք Ձեր անունը',
    attendingLabel: 'Այո, սիրով կգամ',
    notAttendingLabel: 'Ցավոք, չեմ կարող գալ',
    submitLabel: 'Ուղարկել պատասխանը',
    askGuestCount: true,
    askMeal: false
  }
});

function BirthdayWatercolorTemplate(props) {
  const draft = props.draft || getBirthdayWatercolorDraft();
  const fontImport = `${watercolorFontFace} :host { --font-body: "Bubble Sans", Arial, sans-serif; --font-display: "Bubble Sans", Arial, sans-serif; }`;
  return <TemplateShell props={props}><OriginalTemplateSurface css={resolvedWatercolorStyles} draft={draft} fontImport={fontImport} globalFontImport={watercolorFontFace} label="Ջրաներկ ծննդյան հրավեր" themeVariableAliases={watercolorThemeAliases}><BirthdayWatercolorDocument draft={draft} onRsvpSubmit={props.onRsvpSubmit} /></OriginalTemplateSurface></TemplateShell>;
}

export const BirthdayWatercolorCardPreview = () => <div className="original-template-card-preview"><img src={background} alt="" /><img src={flowers} alt="" style={{ position: 'absolute', inset: 'auto -12% -24% auto', width: '72%', opacity: .82 }} /><div /><span>React template</span><strong>Ջրաներկ տարեդարձ</strong></div>;
export const BirthdayWatercolorLivePreview = BirthdayWatercolorTemplate;
export const BirthdayWatercolorInvitationView = (props) => <BirthdayWatercolorTemplate {...props} mode="public" />;
