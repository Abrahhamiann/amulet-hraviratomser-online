import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronDown, Heart, MapPin, Pause, Play, Send, Volume2 } from 'lucide-react';

const armenianMonths = [
  'ՀՈՒՆՎԱՐ', 'ՓԵՏՐՎԱՐ', 'ՄԱՐՏ', 'ԱՊՐԻԼ', 'ՄԱՅԻՍ', 'ՀՈՒՆԻՍ',
  'ՀՈՒԼԻՍ', 'ՕԳՈՍՏՈՍ', 'ՍԵՊՏԵՄԲԵՐ', 'ՀՈԿՏԵՄԲԵՐ', 'ՆՈՅԵՄԲԵՐ', 'ԴԵԿՏԵՄԲԵՐ'
];

const parseEventDate = (value) => {
  const normalized = String(value || '').trim();
  const isoMatch = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  const displayMatch = normalized.match(/^(\d{1,2})\D+(\d{1,2})\D+(\d{4})$/);
  const match = isoMatch || displayMatch;
  if (!match) return null;

  const [year, month, day] = isoMatch
    ? [Number(match[1]), Number(match[2]), Number(match[3])]
    : [Number(match[3]), Number(match[2]), Number(match[1])];
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
};

const safeDate = (value) => {
  return parseEventDate(value) || new Date(2027, 6, 18, 12, 0, 0, 0);
};

const countdownTarget = (dateValue, timeValue) => {
  const date = safeDate(dateValue);
  const timeMatch = String(timeValue || '').match(/^(\d{1,2}):(\d{2})/);
  const hours = timeMatch ? Number(timeMatch[1]) : 14;
  const minutes = timeMatch ? Number(timeMatch[2]) : 30;
  date.setHours(hours >= 0 && hours <= 23 ? hours : 14, minutes >= 0 && minutes <= 59 ? minutes : 30, 0, 0);
  return date.getTime();
};

function Countdown({ date, time }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const values = useMemo(() => {
    const diff = Math.max(0, countdownTarget(date, time) - now);
    return [
      ['օր', Math.floor(diff / 86400000)],
      ['ժամ', Math.floor((diff / 3600000) % 24)],
      ['րոպե', Math.floor((diff / 60000) % 60)],
      ['վրկ', Math.floor((diff / 1000) % 60)]
    ];
  }, [date, now, time]);

  return (
    <div className="silk-vows-countdown" aria-label="Հետհաշվարկ" data-editor-ignore="countdown">
      {values.map(([label, value]) => (
        <div className="silk-vows-countdown-cell" key={label}>
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function SilkVowsInvitation({ data, onRsvpSubmit }) {
  const [playing, setPlaying] = useState(false);
  const [submitState, setSubmitState] = useState('idle');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ guestName: '', guestSide: 'bride', status: 'attending', guestCount: 1, message: '' });
  const audioRef = useRef(null);
  const inviteRef = useRef(null);
  const templateRef = useRef(null);
  const eventDate = safeDate(data.eventDate);
  const visibleVenues = (data.venues || []).filter((venue) => venue?.visible !== false);
  const combinedNameLength = `${data.bride || ''}${data.groom || ''}`.replace(/\s+/g, '').length;
  const heroNameClass = combinedNameLength > 30
    ? ' is-very-long'
    : combinedNameLength > 20 ? ' is-long' : '';

  useEffect(() => {
    setPlaying(false);
    audioRef.current?.pause();
  }, [data.musicUrl]);

  useEffect(() => {
    const root = templateRef.current;
    if (!root) return undefined;

    const revealItems = Array.from(root.querySelectorAll('.silk-vows-reveal'));
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [visibleVenues.length]);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    if (data.musicStart > 0 && audio.currentTime < data.musicStart) audio.currentTime = data.musicStart;
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
        guestName: form.guestName.trim(),
        status: form.status,
        guestCount: data.rsvp.askGuestCount ? Number(form.guestCount) || 1 : undefined,
        guestSide: form.guestSide,
        message: form.message.trim()
      });
      setSubmitState('sent');
    } catch {
      setError('Պատասխանը չհաջողվեց ուղարկել։ Խնդրում ենք փորձել կրկին։');
      setSubmitState('idle');
    }
  };

  const scrollToInvite = () => inviteRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <main ref={templateRef} className="silk-vows-template">
      <section className="silk-vows-hero" data-editor-section="hero" style={{ '--silk-hero-image': `url("${data.images[0]}")` }}>
        <div className="silk-vows-hero-photo" aria-hidden="true" />
        <div className="silk-vows-hero-shade" />
        <div className="silk-vows-hero-content">
          <p className="silk-vows-micro" data-editor-field="eventDate">{data.dateShort}</p>
          <h1 className={heroNameClass}><span data-editor-field="mainName.0">{data.bride}</span><em>&amp;</em><span data-editor-field="mainName.1">{data.groom}</span></h1>
          <p className="silk-vows-hero-sub">մեր սիրո ամենակարևոր օրը</p>

          {data.musicEnabled && data.musicUrl ? (
            <>
              <audio
                ref={audioRef}
                src={data.musicUrl}
                preload="metadata"
                onEnded={() => setPlaying(false)}
                onTimeUpdate={(event) => {
                  if (data.musicEnd > data.musicStart && event.currentTarget.currentTime >= data.musicEnd) {
                    event.currentTarget.pause();
                    setPlaying(false);
                  }
                }}
              />
              <button className="silk-vows-music-button" type="button" onClick={toggleMusic} aria-pressed={playing} aria-label={playing ? 'Դադարեցնել երաժշտությունը' : 'Միացնել երաժշտությունը'}>
                <span className="silk-vows-music-icon" aria-hidden="true">
                  {playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
                </span>
                <span>{playing ? 'Դադար' : data.musicTitle || 'Երաժշտություն'}</span>
              </button>
            </>
          ) : null}
        </div>

        <button className="silk-vows-scroll-cue" type="button" onClick={scrollToInvite} aria-label="Դիտել հրավերը">
          <span>Դիտել հրավերը</span><ChevronDown size={22} aria-hidden="true" />
        </button>
      </section>

      <section
        ref={inviteRef}
        className="silk-vows-silk-section silk-vows-intro"
        id="silk-vows-invite"
        data-editor-section="hero"
      >
        <div className="silk-vows-ornament silk-vows-reveal"><Heart size={18} fill="currentColor" aria-hidden="true" /></div>
        <p className="silk-vows-script-label silk-vows-reveal">Սիրելի՛ ընկերներ և հարազատներ</p>
        <h2 className="silk-vows-reveal">Մենք ամուսնանում ենք</h2>
        <p className="silk-vows-lead silk-vows-reveal" data-editor-field="eventMessage">{data.eventMessage}</p>
        <div className="silk-vows-date-card silk-vows-reveal" data-editor-ignore="calendar">
          <span>{armenianMonths[eventDate.getMonth()]}</span>
          <strong>{eventDate.getDate()}</strong>
          <span>{eventDate.getFullYear()}</span>
        </div>
        <div className="silk-vows-reveal"><Countdown date={data.eventDate} time={visibleVenues[0]?.time || data.eventTime} /></div>
      </section>

      <section
        className="silk-vows-schedule silk-vows-silk-section"
        data-editor-section="schedule"
      >
        <div className="silk-vows-section-heading silk-vows-reveal">
          <span>Օրվա ծրագիր</span>
          <h2>Մեր հանդիպման վայրերը</h2>
        </div>
        <div className="silk-vows-timeline">
          {visibleVenues.map((venue, index) => (
            <article className={`silk-vows-location-card silk-vows-reveal${index % 2 ? ' is-reverse' : ''}`} key={venue.id || `${venue.label}-${index}`}>
              <div className="silk-vows-location-info">
                <div className="silk-vows-time-badge" data-editor-field={`mapLinks.${index}.time`}>{venue.time}</div>
                <p>{index === 0 ? 'ՊՍԱԿԱԴՐՈՒԹՅՈՒՆ' : 'ՀԱՐՍԱՆՅԱՑ ՀԱՆԴԻՍՈՒԹՅՈՒՆ'}</p>
                <h3 data-editor-field={`mapLinks.${index}.label`}>{venue.label || `Վայր ${index + 1}`}</h3>
                {venue.address ? <div className="silk-vows-address"><MapPin size={16} aria-hidden="true" /><span data-editor-field={`mapLinks.${index}.address`}>{venue.address}</span></div> : null}
                {venue.url ? <a href={venue.url} target="_blank" rel="noreferrer">ԻՆՉՊԵՍ ՀԱՍՆԵԼ</a> : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="silk-vows-quote" data-editor-section="closing">
        <div className="silk-vows-quote-content silk-vows-reveal">
          <p>«Երբ երկու պատմություն դառնում է մեկ ճանապարհ»</p>
          <span>{data.bride} &amp; {data.groom}</span>
        </div>
      </section>

      <section
        className="silk-vows-rsvp silk-vows-silk-section"
        data-editor-section="rsvp"
      >
        <div className="silk-vows-rsvp-card silk-vows-reveal">
          <div className="silk-vows-rsvp-copy">
            <p className="silk-vows-script-label">Մենք կսպասենք ձեզ</p>
            <h2>{data.rsvp.title}</h2>
            <p>{data.rsvp.description} {data.rsvp.deadline ? <strong>{data.rsvp.deadline}</strong> : null}</p>
            <div className="silk-vows-mini-note"><CalendarDays size={18} aria-hidden="true" /> {data.eventDateLabel}</div>
          </div>

          <form onSubmit={submitRsvp} className="silk-vows-rsvp-form">
            <fieldset className="silk-vows-radio-row">
              <legend>Ո՞ւմ կողմից եք հրավիրված</legend>
              <label><input type="radio" name="silk-side" checked={form.guestSide === 'bride'} onChange={() => setForm((value) => ({ ...value, guestSide: 'bride' }))} /> Հարսի կողմից</label>
              <label><input type="radio" name="silk-side" checked={form.guestSide === 'groom'} onChange={() => setForm((value) => ({ ...value, guestSide: 'groom' }))} /> Փեսայի կողմից</label>
            </fieldset>
            <label className="silk-vows-field"><span>Անուն Ազգանուն</span><input required value={form.guestName} placeholder={data.rsvp.guestPlaceholder} onChange={(event) => setForm((value) => ({ ...value, guestName: event.target.value }))} /></label>
            <fieldset className="silk-vows-radio-row silk-vows-attendance">
              <legend>Մասնակցություն</legend>
              <label><input type="radio" name="silk-attend" checked={form.status === 'attending'} onChange={() => setForm((value) => ({ ...value, status: 'attending' }))} /> {data.rsvp.attendingLabel}</label>
              <label><input type="radio" name="silk-attend" checked={form.status === 'declined'} onChange={() => setForm((value) => ({ ...value, status: 'declined' }))} /> {data.rsvp.notAttendingLabel}</label>
            </fieldset>
            {data.rsvp.askGuestCount ? <label className="silk-vows-field"><span>Հյուրերի թիվը</span><input type="number" min="1" value={form.guestCount} onChange={(event) => setForm((value) => ({ ...value, guestCount: event.target.value }))} /></label> : null}
            <label className="silk-vows-field"><span>Մեկնաբանություն</span><textarea rows="3" value={form.message} placeholder="Եթե ունեք հարց կամ հատուկ ցանկություն" onChange={(event) => setForm((value) => ({ ...value, message: event.target.value }))} /></label>
            <button type="submit" className="silk-vows-submit" disabled={submitState === 'loading' || submitState === 'sent'}>
              <Send size={18} aria-hidden="true" />
              {submitState === 'loading' ? 'Ուղարկվում է…' : submitState === 'sent' ? 'Պատասխանը գրանցված է' : data.rsvp.submitLabel}
            </button>
            {error ? <p className="silk-vows-form-error" role="alert">{error}</p> : null}
            {submitState === 'sent' ? <p className="silk-vows-form-success" role="status">Շնորհակալություն․ Ձեր պատասխանը ստացվեց։</p> : null}
          </form>
        </div>
        <div className="silk-vows-signature silk-vows-reveal">{data.bride.charAt(0)} &amp; {data.groom.charAt(0)}</div>
      </section>

      <footer className="silk-vows-closing" data-editor-section="closing">
        <Volume2 size={16} aria-hidden="true" /><span>{data.closingMessage}</span>
      </footer>
    </main>
  );
}
