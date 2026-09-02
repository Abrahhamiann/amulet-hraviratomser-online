import { useEffect, useRef, useState } from 'react'
import {
  CalendarDays,
  ChevronDown,
  MapPin,
  Pause,
  Play,
  Shield,
  Users,
  Send,
  Clock3,
} from 'lucide-react'

import emblem from './assets/army-emblem.png'
import song from './assets/invitation-song.mp3'
import soldierPhoto from './assets/soldier-photo.jpg'

const INVITATION = {
  name: 'Նարեկ',
  title: 'Բանակ ճանապարհելու հրավեր',
  date: '25.05.2026',
  time: '17:00',
  venue: 'NRENI ՌԵՍՏՈՐԱՆ',
  address: 'ք. Վերին Դվին, Նորակերտ թաղամաս 2-րդ փողոց, 2/24',
  mapUrl: 'https://maps.google.com',
  rsvpDeadline: '20.05.2026',
}

function Reveal({ children, direction = 'up', delay = 0, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -55px 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal reveal-${direction} ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--delay': `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function MusicButton({ audioRef, playing, setPlaying }) {
  const toggle = async () => {
    if (!audioRef.current) return

    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
      return
    }

    try {
      await audioRef.current.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }

  return (
    <button
      className={`music-button ${playing ? 'is-playing' : ''}`}
      onClick={toggle}
      aria-label={playing ? 'Դադարեցնել երգը' : 'Միացնել երգը'}
      type="button"
    >
      <span className="music-ring ring-one" />
      <span className="music-ring ring-two" />
      {playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
    </button>
  )
}

function App() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [attending, setAttending] = useState('yes')
  const [guests, setGuests] = useState(1)
  const [form, setForm] = useState({ name: '', note: '' })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    const stop = () => setPlaying(false)
    audio?.addEventListener('ended', stop)
    return () => audio?.removeEventListener('ended', stop)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main className="page-shell">
      <audio ref={audioRef} src={song} preload="metadata" />
      <div className="fixed-bg" aria-hidden="true" />
      <div className="global-overlay" aria-hidden="true" />

      <section className="hero section">
        <div className="top-tricolor" aria-hidden="true"><span /><span /><span /></div>
        <div className="hero-haze haze-a" aria-hidden="true" />
        <div className="hero-haze haze-b" aria-hidden="true" />
        <div className="military-grid" aria-hidden="true" />

        <div className="hero-content">
          <div className="eyebrow hero-enter enter-1">ՀՐԱՎԵՐ</div>

          <div className="hero-emblem-wrap hero-enter enter-2">
            <span className="emblem-orbit orbit-one" />
            <span className="emblem-orbit orbit-two" />
            <div className="emblem-glow" />
            <img className="hero-emblem" src={emblem} alt="Բանակային խորհրդանշան" />
          </div>

          <div className="hero-copy">
            <p className="hero-kicker hero-enter enter-3">Մի կարևոր օրվա առիթով</p>
            <h1 className="hero-enter enter-4">{INVITATION.name}</h1>
            <p className="hero-title hero-enter enter-5">{INVITATION.title}</p>
          </div>

          <div className="music-zone hero-enter enter-6">
            <MusicButton audioRef={audioRef} playing={playing} setPlaying={setPlaying} />
            <span>{playing ? 'Երգը հնչում է' : 'Միացնել երգը'}</span>
          </div>
        </div>

        <a className="scroll-cue" href="#invite" aria-label="Շարունակել ներքև">
          <span>Շարունակել</span>
          <ChevronDown size={20} />
        </a>
      </section>

      <section className="section intro-section" id="invite">
        <div className="section-inner intro-layout">
          <Reveal direction="left" className="photo-reveal">
            <div className="soldier-photo-wrapper">
              <div className="photo-shadow-card" />
              <div className="photo-frame">
                <img className="soldier-photo" src={soldierPhoto} alt={`${INVITATION.name}-ի լուսանկարը`} />
                <div className="photo-vignette" />
                <div className="photo-shine" />
              </div>
              <span className="photo-corner top-left" />
              <span className="photo-corner bottom-right" />
            </div>
          </Reveal>

          <div className="intro-copy">
            <Reveal direction="scale" delay={100}>
              <div className="small-emblem"><img src={emblem} alt="" /></div>
            </Reveal>
            <Reveal delay={180}>
              <p className="script-title">Սիրելի՛ հարազատներ և ընկերներ,</p>
            </Reveal>
            <Reveal delay={300}>
              <p className="body-copy">
                Սիրով հրավիրում ենք Ձեզ ներկա գտնվելու {INVITATION.name}-ի զինվորական ծառայության ճանապարհման առիթով կազմակերպվող մեր ընտանեկան երեկոյին։
              </p>
            </Reveal>
            <Reveal delay={420}>
              <p className="body-copy soft-copy">
                Թող այս օրը դառնա ուժի, հպարտության, բարեմաղթանքի ու ջերմ հիշողությունների գեղեցիկ սկիզբ։ Ձեր ներկայությունը մեզ համար իսկապես կարևոր է։
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section details-section">
        <div className="section-inner">
          <Reveal>
            <div className="section-heading">
              <span className="round-icon"><Shield size={22} /></span>
              <p>Հանդիպման մանրամասներ</p>
              <h2>{INVITATION.date}</h2>
            </div>
          </Reveal>

          <div className="detail-grid">
            <Reveal direction="left" delay={100}>
              <article className="detail-card">
                <span className="card-icon"><Clock3 size={27} /></span>
                <small>Ժամը</small>
                <strong>{INVITATION.time}</strong>
              </article>
            </Reveal>

            <Reveal direction="up" delay={220}>
              <article className="detail-card">
                <span className="card-icon"><CalendarDays size={27} /></span>
                <small>Ամսաթիվ</small>
                <strong>{INVITATION.date}</strong>
              </article>
            </Reveal>

            <Reveal direction="right" delay={340}>
              <article className="detail-card venue-card">
                <span className="card-icon"><MapPin size={27} /></span>
                <small>Վայրը</small>
                <strong>{INVITATION.venue}</strong>
                <p>{INVITATION.address}</p>
                <a href={INVITATION.mapUrl} target="_blank" rel="noreferrer">Ինչպես հասնել</a>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section quote-section">
        <div className="quote-glow" aria-hidden="true" />
        <div className="section-inner narrow">
          <Reveal direction="scale">
            <div className="quote-symbol">“</div>
          </Reveal>
          <Reveal delay={180}>
            <blockquote>
              Թող հայրենիքի ճանապարհը լինի պատվաբեր, ծառայությունը՝ խաղաղ, իսկ վերադարձը՝ հաղթական ու սպասված։
            </blockquote>
          </Reveal>
          <Reveal direction="scale" delay={360}>
            <div className="ornament"><span /></div>
          </Reveal>
        </div>
      </section>

      <section className="section rsvp-section">
        <div className="section-inner form-wrap">
          <Reveal>
            <div className="section-heading rsvp-heading">
              <span className="round-icon"><Users size={22} /></span>
              <p>Խնդրում ենք հաստատել</p>
              <h2>Ձեր ներկայությունը</h2>
              <span className="deadline">Պատասխանեք մինչև {INVITATION.rsvpDeadline}</span>
            </div>
          </Reveal>

          <form className="rsvp-form" onSubmit={submit}>
            <Reveal delay={100}>
              <label className="field-label">
                Անուն Ազգանուն
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Գրեք Ձեր անունը"
                />
              </label>
            </Reveal>

            <Reveal delay={200}>
              <div className="radio-group">
                <label className="radio-row">
                  <input type="radio" name="attending" checked={attending === 'yes'} onChange={() => setAttending('yes')} />
                  <span>Սիրով, կմասնակցեմ</span>
                </label>
                <label className="radio-row">
                  <input type="radio" name="attending" checked={attending === 'no'} onChange={() => setAttending('no')} />
                  <span>Ցավոք, չեմ կարող ներկա լինել</span>
                </label>
              </div>
            </Reveal>

            {attending === 'yes' && (
              <div className="guest-picker guest-enter">
                <span>Հյուրերի թիվ</span>
                <div className="counter">
                  <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))}>−</button>
                  <strong>{guests}</strong>
                  <button type="button" onClick={() => setGuests(Math.min(10, guests + 1))}>+</button>
                </div>
              </div>
            )}

            <Reveal delay={300}>
              <label className="field-label">
                Մեկնաբանություն <small>(պարտադիր չէ)</small>
                <textarea
                  rows="4"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Ցանկության դեպքում գրեք հաղորդագրություն"
                />
              </label>
            </Reveal>

            <Reveal direction="scale" delay={400}>
              <button className="submit-button" type="submit">
                <Send size={18} /> Ուղարկել պատասխանը
              </button>
            </Reveal>

            {sent && <p className="success-message">Շնորհակալություն։ Ձեր պատասխանը պահպանվեց demo տարբերակում։</p>}
          </form>
        </div>
      </section>

      <footer className="footer">
        <Reveal direction="scale"><img src={emblem} alt="" /></Reveal>
        <Reveal delay={120}><p>Սիրով սպասում ենք Ձեզ</p></Reveal>
        <Reveal delay={220}><span>AMULET · Online Invitation</span></Reveal>
      </footer>
    </main>
  )
}

export default App
