import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, MapPin, Pause, Play, Send } from 'lucide-react';

const safeDate = (value) => {
  const date = new Date(`${value || '2026-10-16'}T12:00:00`);
  return Number.isNaN(date.getTime()) ? new Date('2026-10-16T12:00:00') : date;
};

const armenianWeekdays = ['Կիր', 'Երկ', 'Երք', 'Չր', 'Հնգ', 'Ուր', 'Շբ'];

function Countdown({ date, time }) {
  const target = useMemo(() => new Date(`${date || '2026-10-16'}T${time || '17:30'}:00`), [date, time]);
  const calculate = () => {
    const delta = Math.max(0, target.getTime() - Date.now());
    return {
      days: Math.floor(delta / 86400000),
      hours: Math.floor((delta / 3600000) % 24),
      minutes: Math.floor((delta / 60000) % 60),
      seconds: Math.floor((delta / 1000) % 60)
    };
  };
  const [left, setLeft] = useState(calculate);

  useEffect(() => {
    setLeft(calculate());
    const id = window.setInterval(() => setLeft(calculate()), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return (
    <div className="burgundy-countdown-grid" data-editor-ignore="countdown">
      {[["Օր", left.days], ["Ժամ", left.hours], ["Րոպե", left.minutes], ["Վայրկյան", left.seconds]].map(([label, value]) => (
        <div className="burgundy-countdown-cell" key={label}>
          <span>{String(value).padStart(2, '0')}</span><small>{label}</small>
        </div>
      ))}
    </div>
  );
}

export default function BurgundyRoadmapInvitation({ data, onRsvpSubmit }) {
  const rootRef = useRef(null);
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [submitState, setSubmitState] = useState('idle');
  const [error, setError] = useState('');
  const [guest, setGuest] = useState({ status: 'attending', guestSide: 'groom', guestName: '', guestCount: '1', message: '' });
  const eventDate = safeDate(data.eventDate);
  const visibleVenues = (data.venues || []).filter((venue) => venue?.visible !== false);
  const calendar = useMemo(() => [-2, -1, 0, 1, 2].map((offset) => {
    const next = new Date(eventDate);
    next.setDate(eventDate.getDate() + offset);
    return {
      day: String(next.getDate()).padStart(2, '0'),
      weekday: armenianWeekdays[next.getDay()],
      active: offset === 0
    };
  }), [data.eventDate]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const nodes = Array.from(root.querySelectorAll('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.14, rootMargin: '0px 0px -7% 0px' });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [visibleVenues.length]);

  useEffect(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, [data.musicUrl]);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    if (Number(data.musicStart) > 0 && audio.currentTime < Number(data.musicStart)) audio.currentTime = Number(data.musicStart);
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const submitRsvp = async (event) => {
    event.preventDefault();
    if (submitState === 'loading') return;
    setSubmitState('loading');
    setError('');
    try {
      await onRsvpSubmit?.({
        guestName: guest.guestName.trim(),
        status: guest.status,
        guestSide: guest.guestSide,
        guestCount: data.rsvp.askGuestCount ? Number(guest.guestCount) || 1 : undefined,
        message: guest.message.trim()
      });
      setSubmitState('sent');
    } catch {
      setError('Պատասխանը չհաջողվեց ուղարկել։ Խնդրում ենք փորձել կրկին։');
      setSubmitState('idle');
    }
  };

  return (
    <main ref={rootRef} className="burgundy-roadmap-template">
      <section className="burgundy-hero" data-editor-section="hero" style={{ '--burgundy-hero-image': `url("${data.images[0]}")` }}>
        <div className="burgundy-hero-bg" aria-hidden="true" />
        <div className="burgundy-hero-overlay" aria-hidden="true" />
        <div className="burgundy-hero-copy burgundy-hero-fade">
          <p className="burgundy-eyebrow burgundy-heading">Հարսանյաց հրավեր</p>
          <div className="burgundy-hero-date" data-editor-field="eventDate">{data.dateShort}</div>
        </div>
        <div className="burgundy-portrait-wrap burgundy-hero-rise">
          <div className="burgundy-portrait-ring burgundy-ring-one" /><div className="burgundy-portrait-ring burgundy-ring-two" />
          <img className="burgundy-portrait" src={data.images[1] || data.images[0]} alt={`${data.bride} և ${data.groom}՝ հարսանեկան լուսանկարում`} />
        </div>
        <h1 className="burgundy-names burgundy-heading burgundy-hero-fade-delay"><span data-editor-field="mainName.0">{data.bride}</span> և <span data-editor-field="mainName.1">{data.groom}</span></h1>
        <p className="burgundy-hero-note" data-editor-field="eventMessage">{data.eventMessage}</p>
        {data.musicEnabled ? <>
          <audio ref={audioRef} src={data.musicUrl} preload="metadata" onEnded={() => setPlaying(false)} onTimeUpdate={(event) => {
            if (Number(data.musicEnd) > 0 && event.currentTarget.currentTime >= Number(data.musicEnd)) {
              event.currentTarget.pause(); setPlaying(false);
            }
          }} />
          <button className={`burgundy-music${playing ? ' is-playing' : ''}`} type="button" onClick={toggleMusic} aria-label={playing ? 'Դադարեցնել երաժշտությունը' : 'Միացնել երաժշտությունը'}>
            {playing ? <Pause size={19} aria-hidden="true" /> : <Play size={19} aria-hidden="true" />}
          </button>
        </> : null}
        <a className="burgundy-scroll-cue" href="#burgundy-invite"><span />Բացահայտել</a>
      </section>

      <section id="burgundy-invite" className="burgundy-intro burgundy-section-pad" data-editor-section="opening">
        <div className="burgundy-narrow" data-reveal>
          <p className="burgundy-kicker burgundy-heading">Սիրելի՛ ընկերներ և բարեկամներ</p>
          <p className="burgundy-body-copy" data-editor-field="eventMessage">{data.eventMessage}</p>
        </div>
        <div className="burgundy-calendar-block" data-reveal data-editor-ignore="calendar">
          <p className="burgundy-calendar-title burgundy-heading">{data.monthLabel}</p>
          <div className="burgundy-calendar-row">
            {calendar.map((item) => <div className={`burgundy-cal-day${item.active ? ' active' : ''}`} key={`${item.day}-${item.weekday}`}><small>{item.weekday}</small><span>{item.day}</span>{item.active ? <i>♥</i> : null}</div>)}
          </div>
        </div>
      </section>

      <section className="burgundy-roadmap-section" data-editor-section="schedule">
        <div className="burgundy-section-head" data-reveal><span className="burgundy-tiny-label">OUR DAY</span><h2 className="burgundy-heading">Մեր օրվա ճանապարհը</h2><p>Հետևեք գինեգույն ուղուն՝ ամբողջ օրը մեզ հետ անցկացնելու համար։</p></div>
        <div className="burgundy-roadmap" data-reveal>
          <svg className="burgundy-road-svg" viewBox="0 0 500 1200" preserveAspectRatio="none" aria-hidden="true"><path className="burgundy-road-shadow" d="M250 0 C120 100,410 170,235 260 C55 355,430 420,270 520 C95 635,420 685,245 785 C80 885,420 950,250 1040 C130 1100,330 1150,245 1200"/><path className="burgundy-road-line" d="M250 0 C120 100,410 170,235 260 C55 355,430 420,270 520 C95 635,420 685,245 785 C80 885,420 950,250 1040 C130 1100,330 1150,245 1200"/><circle r="8" className="burgundy-moving-dot"><animateMotion dur="9s" repeatCount="indefinite" path="M250 0 C120 100,410 170,235 260 C55 355,430 420,270 520 C95 635,420 685,245 785 C80 885,420 950,250 1040 C130 1100,330 1150,245 1200" /></circle></svg>
          {visibleVenues.slice(0, 5).map((item, index) => <article className={`burgundy-road-card ${index % 2 ? 'right' : 'left'}`} style={{ '--i': index }} key={item.id || `${item.label}-${index}`} data-reveal><span className="burgundy-road-index">0{index + 1}</span><div className="burgundy-road-time burgundy-heading" data-editor-field={`mapLinks.${index}.time`}>{item.time || data.eventTime}</div><h3 data-editor-field={`mapLinks.${index}.label`}>{item.label}</h3><p>{item.subtitle || (index === 0 ? 'Պսակադրություն' : 'Հարսանյաց հանդիսություն')}</p>{item.address ? <a href={item.url || '#'} target="_blank" rel="noreferrer"><MapPin size={14} aria-hidden="true" /><span data-editor-field={`mapLinks.${index}.address`}>{item.address}</span></a> : null}</article>)}
        </div>
      </section>

      <section className="burgundy-photo-story burgundy-section-pad" data-editor-section="media">
        <div className="burgundy-photo-stack" data-reveal><figure className="burgundy-polaroid burgundy-p1"><img src={data.images[2] || data.images[0]} alt="Զույգի հարսանեկան լուսանկար" loading="lazy" /></figure><figure className="burgundy-polaroid burgundy-p2"><img src={data.images[3] || data.images[1] || data.images[0]} alt="Հարսանեկան հիշարժան պահ" loading="lazy" /></figure><div className="burgundy-story-stamp burgundy-heading">մենք + դուք<br />{data.dateStamp}</div></div>
        <div className="burgundy-countdown-card" data-reveal><span className="burgundy-tiny-label">SAVE THE DATE</span><h2 className="burgundy-heading">Մինչև մեր հանդիպումը</h2><Countdown date={data.eventDate} time={data.eventTime} /></div>
      </section>

      {data.dressCodeVisible ? <section className="burgundy-dresscode burgundy-section-pad" data-editor-section="dress"><div className="burgundy-narrow" data-reveal><span className="burgundy-tiny-label">DETAILS</span><h2 className="burgundy-heading">Հագուստի գույներ</h2><p className="burgundy-body-copy" data-editor-field="dressCode">{data.dressCode}</p><div className="burgundy-palette" aria-label="Հագուստի առաջարկվող գույներ">{data.dressCodeColors.map((color, index) => <i key={`${color.name}-${color.hex}`} data-dress-color-index={index} style={{ background: color.hex }} title={color.name}><span className="burgundy-visually-hidden">{color.name}</span></i>)}</div></div></section> : null}

      <section className="burgundy-rsvp burgundy-section-pad" data-editor-section="rsvp"><div className="burgundy-rsvp-inner" data-reveal><div className="burgundy-rsvp-copy"><span className="burgundy-tiny-label">RSVP</span><h2 className="burgundy-heading">{data.rsvp.title}</h2><p>{data.rsvp.description} {data.rsvp.deadline ? <strong>{data.rsvp.deadline}</strong> : null}</p><div className="burgundy-date-note"><CalendarDays size={18} aria-hidden="true" />{data.eventDateLabel}</div></div><form onSubmit={submitRsvp}>
        <fieldset><legend className="burgundy-heading">Կկարողանա՞ք մասնակցել</legend><label><input type="radio" name="burgundy-coming" checked={guest.status === 'attending'} onChange={() => setGuest((value) => ({ ...value, status: 'attending' }))} /> {data.rsvp.attendingLabel}</label><label><input type="radio" name="burgundy-coming" checked={guest.status === 'declined'} onChange={() => setGuest((value) => ({ ...value, status: 'declined' }))} /> {data.rsvp.notAttendingLabel}</label></fieldset>
        <fieldset><legend className="burgundy-heading">Ո՞ւմ կողմից եք</legend><label><input type="radio" name="burgundy-side" checked={guest.guestSide === 'groom'} onChange={() => setGuest((value) => ({ ...value, guestSide: 'groom' }))} /> Փեսայի կողմից</label><label><input type="radio" name="burgundy-side" checked={guest.guestSide === 'bride'} onChange={() => setGuest((value) => ({ ...value, guestSide: 'bride' }))} /> Հարսի կողմից</label></fieldset>
        <div className="burgundy-fields"><label><span>Անուն Ազգանուն</span><input required placeholder={data.rsvp.guestPlaceholder} value={guest.guestName} onChange={(event) => setGuest((value) => ({ ...value, guestName: event.target.value }))} /></label>{data.rsvp.askGuestCount ? <label><span>Հյուրերի քանակ</span><input type="number" min="1" max="10" value={guest.guestCount} onChange={(event) => setGuest((value) => ({ ...value, guestCount: event.target.value }))} /></label> : null}</div>
        <label className="burgundy-message"><span>Մեկնաբանություն</span><textarea rows="3" value={guest.message} onChange={(event) => setGuest((value) => ({ ...value, message: event.target.value }))} /></label><button className="burgundy-submit-btn" disabled={submitState === 'loading' || submitState === 'sent'}><Send size={17} aria-hidden="true" />{submitState === 'loading' ? 'Ուղարկվում է…' : submitState === 'sent' ? 'Պատասխանը գրանցված է' : data.rsvp.submitLabel}</button>{error ? <p className="burgundy-error" role="alert">{error}</p> : null}{submitState === 'sent' ? <p className="burgundy-success" role="status">Շնորհակալություն։ Ձեր պատասխանը ստացվեց։</p> : null}
      </form></div></section>

      <footer data-editor-section="closing"><div className="burgundy-footer-heart">♡</div><p className="burgundy-heading" data-editor-field="closingMessage">{data.closingMessage}</p><small>{data.bride} &amp; {data.groom} · {data.dateShort}</small></footer>
    </main>
  );
}
