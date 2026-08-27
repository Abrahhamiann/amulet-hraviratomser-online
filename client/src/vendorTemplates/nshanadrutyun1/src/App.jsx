import { useEffect, useMemo, useRef, useState } from 'react'
import { MapPin, Pause, Play } from 'lucide-react'

import polaroid from './assets/images/polaroid.png'
import restaurant from './assets/images/restaurant.png'
import floral from './assets/images/floral.png'
import heart from './assets/images/heart.png'
import couple1 from './assets/images/couple-1.jpg'
import couple2 from './assets/images/couple-2.jpg'
import music from './assets/audio/music.mp3'

const CONFIG = {
  bride: 'Լիլիթ',
  groom: 'Տիգրան',
  dateISO: '2026-09-12T18:00:00+04:00',
  day: 12,
  month: 'ՍԵՊՏԵՄԲԵՐ',
  year: 2026,
  venue: {
    time: '18:00',
    title: 'Նշանադրության հանդիսություն',
    place: 'Afina Hall by Palladium',
    address: 'ք. Երևան, Գլինկա 17/5',
    map: 'https://maps.google.com',
  },
  rsvpDeadline: '01.09.2026',
}

function useCountdown(target) {
  const get = () => Math.max(0, new Date(target).getTime() - Date.now())
  const [diff, setDiff] = useState(get)

  useEffect(() => {
    const id = setInterval(() => setDiff(get()), 1000)
    return () => clearInterval(id)
  }, [target])

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function Polaroid({ src, className = '', alt = '' }) {
  return (
    <div className={`polaroid ${className}`}>
      <img className="polaroid-photo" src={src} alt={alt} />
      <img className="polaroid-frame" src={polaroid} alt="" aria-hidden="true" />
    </div>
  )
}

function RSVP() {
  const [attendance, setAttendance] = useState('yes')
  const [sent, setSent] = useState(false)

  return (
    <section className="rsvp reveal" id="rsvp">
      <div className="rsvp-card">
        <p className="kicker">ՀԱՍՏԱՏՈՒՄ</p>
        <h2>Կսպասենք Ձեր պատասխանին</h2>
        <p className="rsvp-note">
          Խնդրում ենք հաստատել ներկայությունը մինչև <b>{CONFIG.rsvpDeadline}</b>
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            setSent(true)
          }}
        >
          <label className="field">
            <span>Անուն / Ազգանուն</span>
            <input required placeholder="Ձեր անունը" />
          </label>

          <div className="attendance">
            <button
              type="button"
              onClick={() => setAttendance('yes')}
              className={attendance === 'yes' ? 'active' : ''}
            >
              <i /> Սիրով կմասնակցեմ
            </button>

            <button
              type="button"
              onClick={() => setAttendance('no')}
              className={attendance === 'no' ? 'active' : ''}
            >
              <i /> Ցավոք, չեմ կարող գալ
            </button>
          </div>

          <label className="field">
            <span>Հյուրերի քանակ</span>
            <input
              type="number"
              min="1"
              defaultValue="1"
              disabled={attendance === 'no'}
            />
          </label>

          <label className="field">
            <span>Մեկնաբանություն</span>
            <textarea rows="3" placeholder="Ցանկության դեպքում գրեք հաղորդագրություն" />
          </label>

          <button className="submit" type="submit">
            Ուղարկել <span>→</span>
          </button>

          {sent && <p className="success">Շնորհակալություն 🤍 Ձեր պատասխանը պահպանվեց։</p>}
        </form>
      </div>
    </section>
  )
}

export default function App() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const cd = useCountdown(CONFIG.dateISO)

  const values = useMemo(
    () => [
      [String(cd.days).padStart(2, '0'), 'օր'],
      [String(cd.hours).padStart(2, '0'), 'ժամ'],
      [String(cd.minutes).padStart(2, '0'), 'րոպե'],
      [String(cd.seconds).padStart(2, '0'), 'վայրկյան'],
    ],
    [cd]
  )

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            obs.unobserve(entry.target)
          }
        }),
      { threshold: 0.12, rootMargin: '0px 0px -55px 0px' }
    )

    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.38

    const unlock = async () => {
      if (audio.paused) {
        try {
          await audio.play()
          setPlaying(true)
        } catch {
          // Browser may block autoplay until user interaction.
        }
      }
      window.removeEventListener('pointerdown', unlock)
    }

    window.addEventListener('pointerdown', unlock, { passive: true })
    return () => window.removeEventListener('pointerdown', unlock)
  }, [])

  const toggleMusic = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  return (
    <main className="page">
      <audio ref={audioRef} src={music} loop preload="auto" />

      <button className="music" onClick={toggleMusic} aria-label="Music on/off">
        {playing ? <Pause size={19} /> : <Play size={19} />}
      </button>

      <section className="hero">
        <img src={floral} className="floral floral-a" alt="" />
        <img src={floral} className="floral floral-b" alt="" />

        <p className="hero-kicker">ՆՇԱՆԱԴՐՈՒԹՅԱՆ ՀՐԱՎԵՐ</p>

        <div className="hero-polaroid-wrap reveal">
          <Polaroid
            src={couple1}
            className="hero-polaroid"
            alt={`${CONFIG.groom} և ${CONFIG.bride}`}
          />
        </div>

        <div className="names reveal">
          <span>{CONFIG.groom}</span>
          <b>&</b>
          <span>{CONFIG.bride}</span>
        </div>

        <p className="hero-date">{CONFIG.day}.09.{CONFIG.year}</p>

        <a href="#story" className="scroll-down">
          ԲԱՑԵԼ ՀՐԱՎԵՐԸ <span>↓</span>
        </a>
      </section>

      <section className="story" id="story">
        <img src={floral} className="story-flower" alt="" />

        <div className="story-copy reveal">
          <p className="script-small">Սիրելի՛ ընտանիք և ընկերներ</p>
          <h1>Մեր պատմության նոր էջը ցանկանում ենք բացել Ձեր ներկայությամբ</h1>
          <p>
            Մեզ համար շատ կարևոր է այս գեղեցիկ օրը կիսել այն մարդկանց հետ,
            ովքեր մեր կողքին են եղել ամենաջերմ պահերին։ Սիրով հրավիրում ենք Ձեզ
            մեր նշանադրության տոնին։
          </p>
        </div>
      </section>

      <section className="calendar-section reveal">
        <p className="kicker">SAVE THE DATE</p>
        <h2>{CONFIG.month}</h2>

        <div className="calendar">
          <div className="week">
            <span>Երկ</span>
            <span>Երք</span>
            <span>Չոր</span>
            <span>Հնգ</span>
            <span>Ուրբ</span>
            <span>Շբթ</span>
            <span>Կիր</span>
          </div>

          <div className="days">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
              <div key={day} className={day === CONFIG.day ? 'selected' : ''}>
                {day === CONFIG.day && <img src={heart} alt="" />}
                <span>{day}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="venue-section reveal">
        <div className="venue-content">
          <p className="script-small venue-script">{CONFIG.venue.title}</p>
          <p className="venue-time">{CONFIG.venue.time}</p>
          <h2>{CONFIG.venue.place}</h2>

          <img
            src={restaurant}
            className="restaurant"
            alt={CONFIG.venue.place}
          />

          <p className="venue-address">{CONFIG.venue.address}</p>

          <a href={CONFIG.venue.map} target="_blank" rel="noreferrer">
            <MapPin size={17} /> Ինչպես հասնել
          </a>
        </div>
      </section>

      <section className="gallery">
        <div className="gallery-copy reveal">
          <p className="kicker">ՄԵՐ ՊԱՏՄՈՒԹՅՈՒՆԸ</p>
          <h2>Երկու սիրտ, մեկ որոշում</h2>
          <p>
            Այս օրը մեզ համար ոչ միայն նշանադրություն է, այլ նաև մեր համատեղ
            ճանապարհի ամենագեղեցիկ խոստումներից մեկը։
          </p>
        </div>

        <div className="gallery-cards">
          <Polaroid
            src={couple1}
            className="photo-left reveal"
            alt={`${CONFIG.groom} և ${CONFIG.bride}`}
          />

          <Polaroid
            src={couple2}
            className="photo-right reveal"
            alt={`${CONFIG.groom} և ${CONFIG.bride}`}
          />
        </div>
      </section>

      <section className="countdown reveal">
        <p className="kicker">ՄԻՆՉԵՎ ՄԵՐ ՕՐԸ</p>

        <div className="countdown-grid">
          {values.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <RSVP />

      <footer className="footer reveal">
        <img src={floral} alt="" />
        <p>Սիրով սպասում ենք Ձեզ</p>
        <h2>{CONFIG.groom} & {CONFIG.bride}</h2>
        <span>{CONFIG.day}.09.{CONFIG.year}</span>
      </footer>
    </main>
  )
}
