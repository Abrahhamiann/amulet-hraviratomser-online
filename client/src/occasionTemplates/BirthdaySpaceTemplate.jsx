import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import heroBase from '../vendorTemplates/cnund1/src/assets/hero-base.png';
import astronaut from '../vendorTemplates/cnund1/src/assets/decor/astronaut.png';
import cake from '../vendorTemplates/cnund1/src/assets/decor/cake.png';
import balloons from '../vendorTemplates/cnund1/src/assets/decor/balloons.png';
import stars from '../vendorTemplates/cnund1/src/assets/decor/stars.png';
import song from '../vendorTemplates/cnund1/src/assets/audio/happy-birthday.mp3';
import birthdaySpaceFont from '../vendorTemplates/cnund1/src/assets/fonts/BubbleSans.otf?url';
import cardImage from '../vendorTemplates/cnund1/src/assets/final-reference.png';
import birthdaySpaceStyles from '../vendorTemplates/cnund1/src/styles.css?inline';
import { OriginalTemplateSurface, TemplateShell } from './OriginalTypeScriptTemplates.tsx';

const resolvedBirthdaySpaceStyles = birthdaySpaceStyles.replace(
  './assets/fonts/BubbleSans.otf',
  birthdaySpaceFont
);
const birthdaySpaceFontFace = `@font-face { font-family: 'BubbleSans'; src: url('${birthdaySpaceFont}') format('opentype'); font-weight: 400; font-style: normal; font-display: swap; }`;

const DEFAULTS = {
  childName: 'Արմենի',
  age: 4,
  eventDate: '2027-01-13',
  time: '17:00',
  venue: 'Մանկական ժամանցի կենտրոն',
  address: 'Երևան, օրինակելի հասցե 24',
  mapUrl: 'https://maps.google.com/?q=Yerevan',
  message: 'Գանք միասին ստեղծելու մի օր՝ լի ծիծաղով, խաղերով ու տիեզերական տրամադրությամբ։'
};

const WEEKDAYS = ['Երկ', 'Երք', 'Չոր', 'Հնգ', 'Ուրբ', 'Շբթ', 'Կիր'];
const MONTHS = ['Հունվար', 'Փետրվար', 'Մարտ', 'Ապրիլ', 'Մայիս', 'Հունիս', 'Հուլիս', 'Օգոստոս', 'Սեպտեմբեր', 'Հոկտեմբեր', 'Նոյեմբեր', 'Դեկտեմբեր'];
const MONTHS_GENITIVE = ['հունվարի', 'փետրվարի', 'մարտի', 'ապրիլի', 'մայիսի', 'հունիսի', 'հուլիսի', 'օգոստոսի', 'սեպտեմբերի', 'հոկտեմբերի', 'նոյեմբերի', 'դեկտեմբերի'];

const getDateParts = (value) => {
  const date = new Date(`${value || DEFAULTS.eventDate}T12:00:00`);
  const safeDate = Number.isNaN(date.getTime()) ? new Date(`${DEFAULTS.eventDate}T12:00:00`) : date;
  return {
    year: safeDate.getFullYear(),
    monthIndex: safeDate.getMonth(),
    selectedDay: safeDate.getDate(),
    monthTitle: MONTHS[safeDate.getMonth()],
    dateLabel: `${safeDate.getDate()} ${MONTHS_GENITIVE[safeDate.getMonth()]} ${safeDate.getFullYear()}`
  };
};

const buildCalendar = (year, monthIndex) => {
  const first = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells = Array((first.getDay() + 6) % 7).fill(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
};

const useCountdown = (target) => {
  const calculate = useCallback(() => Math.max(0, new Date(target).getTime() - Date.now()), [target]);
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
};

function MusicButton({ isPlaying, onClick }) {
  return <button className={`music-button ${isPlaying ? 'playing' : ''}`} onClick={onClick} type="button" aria-label={isPlaying ? 'Անջատել երաժշտությունը' : 'Միացնել երաժշտությունը'} title={isPlaying ? 'Անջատել երաժշտությունը' : 'Միացնել երաժշտությունը'}>
    <span className="music-orbit" />
    <span className="music-symbol">{isPlaying ? 'Ⅱ' : '♪'}</span>
    <span className="equalizer" aria-hidden="true"><i /><i /><i /></span>
  </button>;
}

function BirthdaySpaceDocument({ draft, onRsvpSubmit }) {
  const documentRef = useRef(null);
  const audioRef = useRef(null);
  const userControlled = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rsvpState, setRsvpState] = useState('idle');
  const [status, setStatus] = useState('yes');
  const date = useMemo(() => getDateParts(draft.eventDate), [draft.eventDate]);
  const cells = useMemo(() => buildCalendar(date.year, date.monthIndex), [date.monthIndex, date.year]);
  const age = Math.max(1, Number(draft.templateTextOverrides?.['birthday-space-age']) || DEFAULTS.age);
  const childName = draft.mainNames || DEFAULTS.childName;
  const firstVenue = (draft.mapLinks || []).find((venue) => venue?.visible !== false) || {};
  const time = firstVenue.time || draft.eventTime || DEFAULTS.time;
  const venue = firstVenue.label || DEFAULTS.venue;
  const address = firstVenue.address || draft.eventLocation || DEFAULTS.address;
  const mapUrl = firstVenue.url || draft.mapLink || DEFAULTS.mapUrl;
  const eventTarget = `${draft.eventDate || DEFAULTS.eventDate}T${time || DEFAULTS.time}:00+04:00`;
  const countdown = useCountdown(eventTarget);
  const musicSource = draft.musicEnabled === false ? '' : (draft.musicUrl || song);
  const rsvp = draft.rsvpSettings || {};

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !musicSource) return undefined;
    audio.volume = 0.55;
    audio.loop = true;
    audio.playsInline = true;
    const syncPlay = () => setIsPlaying(true);
    const syncPause = () => setIsPlaying(false);
    const tryAutoplay = async () => {
      try { await audio.play(); setIsPlaying(true); return true; }
      catch { setIsPlaying(false); return false; }
    };
    const removeUnlockListeners = () => {
      document.removeEventListener('pointerdown', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
    const unlockAudio = async () => {
      if (userControlled.current || !audio.paused) return;
      if (await tryAutoplay()) removeUnlockListeners();
    };
    const handlePageShow = () => { if (!userControlled.current && audio.paused) void tryAutoplay(); };
    audio.addEventListener('play', syncPlay);
    audio.addEventListener('pause', syncPause);
    void tryAutoplay();
    document.addEventListener('pointerdown', unlockAudio, { passive: true });
    document.addEventListener('touchstart', unlockAudio, { passive: true });
    document.addEventListener('keydown', unlockAudio);
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      audio.removeEventListener('play', syncPlay);
      audio.removeEventListener('pause', syncPause);
      removeUnlockListeners();
      window.removeEventListener('pageshow', handlePageShow);
      audio.pause();
    };
  }, [musicSource]);

  useEffect(() => {
    const root = documentRef.current;
    if (!root) return undefined;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.14 });
    root.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    userControlled.current = true;
    if (audio.paused) {
      try { await audio.play(); } catch { setIsPlaying(false); }
    } else audio.pause();
  };

  const scrollToInvitation = (event) => {
    event.preventDefault();
    documentRef.current?.querySelector('#invite')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submitRsvp = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setRsvpState('loading');
    try {
      await onRsvpSubmit?.({
        guestName: String(formData.get('name') || '').trim(),
        status: status === 'yes' ? 'attending' : 'declined',
        guestCount: Number(formData.get('guests')) || 1,
        guestSide: 'other',
        message: String(formData.get('message') || '').trim()
      });
      setRsvpState('success');
      form.reset();
    } catch {
      setRsvpState('error');
    }
  };

  const countdownItems = [
    [String(countdown.days).padStart(2, '0'), 'օր'],
    [String(countdown.hours).padStart(2, '0'), 'ժամ'],
    [String(countdown.minutes).padStart(2, '0'), 'րոպե'],
    [String(countdown.seconds).padStart(2, '0'), 'վրկ']
  ];

  return <main ref={documentRef}>
    {musicSource ? <audio ref={audioRef} src={musicSource} autoPlay loop preload="auto" /> : null}
    <section className="hero birthday-space-hero" id="top" data-editor-section="hero" hidden={draft.heroVisible === false}>
      <img className="hero-base" src={heroBase} alt="" aria-hidden="true" />
      <div className="hero-layer hero-stars"><img src={stars} alt="" /></div>
      <div className="hero-layer hero-astronaut"><img src={astronaut} alt="" /></div>
      <div className="hero-layer hero-cake"><img src={cake} alt="" /></div>
      <div className="hero-layer hero-balloons"><img src={balloons} alt="" /></div>
      <div className="hero-copy">
        <span className="hero-kicker">Դու հրավիրված ես</span>
        <h1><span data-editor-field="mainNames">{childName}</span><strong data-template-text-key="birthday-space-age" data-editor-input-mode="numeric">{age}</strong><span>ամյակին</span></h1>
        <p data-editor-field="eventMessage">{draft.eventMessage || DEFAULTS.message}</p>
        <a className="scroll-cue" href="#invite" aria-label="Իջնել ներքև" onClick={scrollToInvitation}><span /><span /></a>
        <div className="hero-music-control" data-editor-ignore="music"><span className="hero-music-label">{isPlaying ? 'Երաժշտությունը միացված է' : 'Միացնել երաժշտությունը'}</span><MusicButton isPlaying={isPlaying} onClick={toggleMusic} /></div>
      </div>
    </section>

    <section className="section intro-section reveal" id="invite" data-editor-section="hero" hidden={draft.openingVisible === false}>
      <div className="section-shell intro-shell">
        <div className="mini-space-scene" aria-hidden="true"><img src={astronaut} alt="" /><span className="mini-star one">✦</span><span className="mini-star two">✧</span></div>
        <div className="intro-copy"><span className="eyebrow">✦ Սիրով հրավիրում ենք</span><h2>{childName}ի ծննդյան տոնին</h2><p>Մեզ համար շատ կարևոր է այս օրը կիսել սիրելի մարդկանց հետ։ Սպասում ենք քեզ՝ միասին նշելու {age}-ամյակը և ստեղծելու ամենաջերմ հիշողությունները։</p></div>
      </div>
    </section>

    <section className="section calendar-section reveal" data-editor-section="schedule" hidden={draft.receptionVisible === false}>
      <div className="section-shell calendar-shell">
        <div className="calendar-side-art" aria-hidden="true"><img src={cake} alt="" /></div>
        <div className="calendar-panel" data-editor-ignore="calendar"><span className="eyebrow">◷ Պահիր օրը</span><h2>{date.monthTitle} {date.year}</h2><div className="weekdays">{WEEKDAYS.map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{cells.map((day, index) => <span key={`${day ?? 'empty'}-${index}`} className={day === date.selectedDay ? 'selected-day' : day ? '' : 'empty'}>{day}</span>)}</div><p className="calendar-note">{date.dateLabel} • {time}</p></div>
      </div>
    </section>

    <section className="section venue-section reveal" data-editor-section="schedule" hidden={draft.receptionVisible === false}>
      <div className="section-shell venue-card"><div className="venue-art" aria-hidden="true"><img src={balloons} alt="" /></div><div className="venue-content"><span className="eyebrow">⌖ Հանդիպման վայրը</span><h2 data-editor-field="mapLinks.0.label">{venue}</h2><p data-editor-field="mapLinks.0.address">{address}</p><div className="venue-meta" data-editor-ignore="calendar"><span>◷ {time}</span><span>▣ {date.dateLabel}</span></div><a className="primary-btn" href={mapUrl} target="_blank" rel="noreferrer">Քարտեզ ⌖</a></div></div>
    </section>

    <section className="section countdown-section reveal" data-editor-section="schedule" data-editor-ignore="countdown" hidden={draft.receptionVisible === false}>
      <div className="section-shell countdown-shell"><span className="eyebrow">✦ Մնացել է</span><h2>Մինչև մեր տիեզերական օրը</h2><div className="countdown-grid">{countdownItems.map(([value, label]) => <div className="countdown-item" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></div>
    </section>

    <section className="section rsvp-section reveal birthday-space-rsvp" data-editor-section="rsvp" hidden={draft.questionsVisible === false}>
      <div className="section-shell rsvp-shell"><div className="rsvp-copy"><span className="eyebrow">♡ Սիրով սպասում ենք քեզ</span><h2 data-editor-field="rsvpSettings.title">{rsvp.title || 'Հաստատի՛ր մասնակցությունդ'}</h2><p data-editor-field="rsvpSettings.description">{rsvp.description || 'Խնդրում ենք լրացնել փոքրիկ ձևաթուղթը, որպեսզի կարողանանք ամեն ինչ պատրաստել քեզ համար։'}</p><img className="rsvp-astronaut" src={astronaut} alt="" aria-hidden="true" /></div>
        <form className="rsvp-form" onSubmit={submitRsvp}><label><span>Անուն, ազգանուն</span><input name="name" type="text" placeholder={rsvp.guestPlaceholder || 'Գրիր անունդ'} required /></label><fieldset><legend>Կկարողանա՞ս գալ</legend><div className="choice-row"><button type="button" className={status === 'yes' ? 'choice active' : 'choice'} onClick={() => setStatus('yes')}>{rsvp.attendingLabel || 'Այո, սիրով'}</button><button type="button" className={status === 'no' ? 'choice active' : 'choice'} onClick={() => setStatus('no')}>{rsvp.notAttendingLabel || 'Ցավոք, ոչ'}</button></div></fieldset>
          {rsvp.askGuestCount !== false ? <label><span>Հյուրերի քանակ</span><input name="guests" type="number" min="1" step="1" inputMode="numeric" defaultValue="1" required /></label> : null}
          <label><span>Փոքրիկ հաղորդագրություն</span><textarea name="message" rows="4" placeholder="Ցանկություն, հարց կամ հաղորդագրություն…" /></label><button className="submit-btn" type="submit" disabled={rsvpState === 'loading'}>{rsvpState === 'loading' ? 'Ուղարկվում է…' : (rsvp.submitLabel || 'Ուղարկել')} ➤</button>{rsvpState === 'success' ? <div className="success-message" role="status">Շնորհակալություն 💜 Պատասխանը գրանցված է։</div> : null}{rsvpState === 'error' ? <div className="success-message" role="alert">Չհաջողվեց ուղարկել։ Խնդրում ենք փորձել կրկին։</div> : null}</form>
      </div>
    </section>

    <footer className="footer birthday-space-closing" data-editor-section="closing" hidden={draft.finalMessageVisible === false}><img src={stars} alt="" aria-hidden="true" /><h2>{draft.closingMessage || 'Սպասում ենք քեզ ✦'}</h2><p>{childName} • {age} տարեկան</p></footer>
  </main>;
}

export const isBirthdaySpaceTemplate = (template = {}) => [template.designKey, template.slug, template.title]
  .map((value) => String(value || '').trim().toLowerCase().replace(/[_\s]+/g, '-'))
  .some((value) => ['birthday-space', 'space-birthday', 'cnund1'].includes(value));

export const getBirthdaySpaceDraft = () => ({
  mainNames: DEFAULTS.childName,
  eventDate: DEFAULTS.eventDate,
  eventTime: DEFAULTS.time,
  eventLocation: DEFAULTS.address,
  eventMessage: DEFAULTS.message,
  image: cardImage,
  gallery: [cardImage],
  mapLink: DEFAULTS.mapUrl,
  mapLinks: [{ label: DEFAULTS.venue, time: DEFAULTS.time, address: DEFAULTS.address, url: DEFAULTS.mapUrl, visible: true }],
  colors: {},
  musicEnabled: true,
  musicUrl: song,
  musicTitle: 'Happy Birthday',
  closingMessage: 'Սպասում ենք քեզ ✦',
  rsvpSettings: {
    title: 'Հաստատի՛ր մասնակցությունդ',
    description: 'Խնդրում ենք լրացնել փոքրիկ ձևաթուղթը, որպեսզի կարողանանք ամեն ինչ պատրաստել քեզ համար։',
    guestPlaceholder: 'Գրիր անունդ',
    attendingLabel: 'Այո, սիրով',
    notAttendingLabel: 'Ցավոք, ոչ',
    submitLabel: 'Ուղարկել',
    askGuestCount: true,
    askMeal: false
  }
});

function BirthdaySpaceTemplate(props) {
  const draft = props.draft || getBirthdaySpaceDraft();
  const fontImport = `${birthdaySpaceFontFace} :host { --font-body: 'BubbleSans', system-ui, sans-serif; --font-display: 'BubbleSans', system-ui, sans-serif; }`;
  return <TemplateShell props={props}><OriginalTemplateSurface css={resolvedBirthdaySpaceStyles} draft={draft} fontImport={fontImport} globalFontImport={birthdaySpaceFontFace} label="Տիեզերական ծննդյան հրավեր"><BirthdaySpaceDocument draft={draft} onRsvpSubmit={props.onRsvpSubmit} /></OriginalTemplateSurface></TemplateShell>;
}

export const BirthdaySpaceCardPreview = () => <div className="original-template-card-preview"><img src={cardImage} alt="" /><div /><span>React template</span><strong>Տիեզերական տարեդարձ</strong></div>;
export const BirthdaySpaceLivePreview = BirthdaySpaceTemplate;
export const BirthdaySpaceInvitationView = (props) => <BirthdaySpaceTemplate {...props} mode="public" />;
