import { useEffect, useMemo, useRef, useState } from 'react'

import bellPhoto from './assets/bell-photo.jpg'
import schoolPhoto from './assets/school.jpg'
import venuePhoto from './assets/venue.jpg'
import song from './assets/verjin-zang.mp3'

const CONFIG = {
  year: 2026,
  className: '9-ի Բ դասարան',
  dateISO: '2026-05-25T11:00:00+04:00',
  monthTitle: 'Մայիս 2026',
  day: 25,
  schoolTitle: 'Ավարտական միջոցառումը տեղի կունենա մեր դպրոցի հանդիսությունների դահլիճում',
  schoolTime: 'ժամը 11:00-ին',
  schoolMap: 'https://www.google.com/maps',
  venueTitle: 'Ավարտական խնջույքը տեղի կունենա «Afina by Palladium» ռեստորանում',
  venueTime: 'ժամը 17:30-ին',
  venueMap: 'https://www.google.com/maps/search/?api=1&query=Afina+by+Palladium',
  telegram: 'https://t.me/',
}

function useCountdown(target) {
  const calc = () => Math.max(0, new Date(target).getTime() - Date.now())
  const [diff, setDiff] = useState(calc)

  useEffect(() => {
    const timer = setInterval(() => setDiff(calc()), 1000)
    return () => clearInterval(timer)
  }, [target])

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function BellIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 72 82" fill="none" aria-hidden="true">
      <path d="M36 11C39.8 11 42.8 8.2 42.8 4.7H29.2C29.2 8.2 32.2 11 36 11Z" />
      <path d="M36 11V16" />
      <path d="M17 54H55C50.8 48.5 49 42.5 49 34.5C49 25.4 43.5 18 36 18C28.5 18 23 25.4 23 34.5C23 42.5 21.2 48.5 17 54Z" />
      <path d="M13 58H59" />
      <path d="M29.5 62C29.5 70.8 42.5 70.8 42.5 62" />
      <path d="M8 36C5 38.5 4 42 4 45" className="bell-motion-line bell-motion-left" />
      <path d="M64 36C67 38.5 68 42 68 45" className="bell-motion-line bell-motion-right" />
    </svg>
  )
}

function BellLineArt() {
  return (
    <svg className="hero-bell-art" viewBox="0 0 620 250" fill="none" aria-hidden="true">
      <path d="M24 205C103 199 132 158 203 165C275 172 296 211 356 201C413 191 429 153 477 165C525 177 537 211 596 205" />
      <path d="M344 12C354 28 353 45 350 62C345 89 331 104 313 124" />
      <path d="M358 4C374 15 381 34 381 49C382 72 375 86 365 99" />
      <path d="M309 20C289 30 283 56 286 74C289 95 301 107 318 120" />
      <path d="M289 42C273 55 272 75 280 91C286 103 299 111 313 119" />
      <path d="M319 120C309 132 304 148 304 169H363C361 149 356 132 346 120" />
      <path d="M304 169C313 177 354 177 363 169" />
      <path d="M329 177C329 187 334 194 340 194C347 194 350 187 350 177" />
      <path d="M318 119C327 102 335 84 343 69C350 55 362 54 369 63C376 72 373 87 362 98" />
      <path d="M343 70C331 59 316 62 311 74C306 86 312 99 324 104" />
      <path d="M332 82C324 71 310 72 304 83C298 95 306 109 320 112" />
      <path d="M354 105C343 107 336 116 336 127" />
    </svg>
  )
}

function MusicButton({ isPlaying, onToggle }) {
  return (
    <button
      type="button"
      className={`music-button ${isPlaying ? 'is-playing' : 'is-paused'}`}
      onClick={onToggle}
      aria-label={isPlaying ? 'Անջատել երաժշտությունը' : 'Միացնել երաժշտությունը'}
      title={isPlaying ? 'Անջատել երաժշտությունը' : 'Միացնել երաժշտությունը'}
    >
      <span className="music-icon">{isPlaying ? 'Ⅱ' : '▶'}</span>
      <span className="music-rings" aria-hidden="true"><i /><i /><i /></span>
    </button>
  )
}

function Calendar() {
  const weeks = [
    ['', '', '', '', '1', '2', '3'],
    ['4', '5', '6', '7', '8', '9', '10'],
    ['11', '12', '13', '14', '15', '16', '17'],
    ['18', '19', '20', '21', '22', '23', '24'],
    ['25', '26', '27', '28', '29', '30', '31'],
  ]

  return (
    <div className="calendar-card reveal">
      <h3>{CONFIG.monthTitle}</h3>
      <div className="weekdays">
        {['Երկ', 'Երք', 'Չրք', 'Հնգ', 'Ուրբ', 'Շբթ', 'Կիր'].map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="calendar-grid">
        {weeks.flatMap((week, wi) => week.map((day, di) => {
          const active = Number(day) === CONFIG.day
          return (
            <div className={`calendar-day ${active ? 'active' : ''}`} key={`${wi}-${di}`}>
              {day}
              {active && (
                <span className="calendar-bell-wrap">
                  <BellIcon className="date-bell" />
                </span>
              )}
            </div>
          )
        }))}
      </div>
    </div>
  )
}

function EventCard({ image, children, time, href, reverse = false }) {
  return (
    <article className={`event-card reveal ${reverse ? 'reverse' : ''}`}>
      <div className="event-image-wrap">
        <img src={image} alt="Միջոցառման վայր" className="event-image" />
      </div>
      <div className="event-copy">
        <p>{children}</p>
        <strong>{time}</strong>
        <p className="event-address" />
        <a className="map-button" href={href} target="_blank" rel="noreferrer">Քարտեզ</a>
      </div>
    </article>
  )
}

function Countdown({ countdown }) {
  return (
    <section className="countdown-section reveal">
      <div className="countdown-card">
        <p>ՄՆԱՑԵԼ Է</p>
        <div className="countdown-grid">
          {countdown.map(([value, label], index) => (
            <div className="countdown-part" key={label}>
              <div className="countdown-number-row">
                <strong>{value}</strong>
                {index < countdown.length - 1 && <span className="countdown-colon" aria-hidden="true">:</span>}
              </div>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RSVP() {
  const [name, setName] = useState('')
  const [attendance, setAttendance] = useState('yes')
  const [guests, setGuests] = useState('1')
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)

  function submit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className="rsvp-section reveal">
      <div className="rsvp-heading">
        <p className="eyebrow">Սպասում ենք Ձեզ</p>
        <h2>ՀԱՐՑԱԹԵՐԹԻԿ</h2>
        <p>Խնդրում ենք լրացնել կարճ ձևաթուղթը, որպեսզի կարողանանք ճիշտ կազմակերպել օրը։</p>
      </div>

      <form onSubmit={submit} className="rsvp-form">
        <div className="form-field full-width">
          <label htmlFor="guest-name">Ձեր անունը և ազգանունը</label>
          <input
            id="guest-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Օրինակ՝ Անի Սարգսյան"
            required
          />
        </div>

        <fieldset className="attendance-field full-width">
          <legend>Կկարողանա՞ք ներկա գտնվել միջոցառմանը</legend>
          <div className="attendance-options">
            <label className={`attendance-option ${attendance === 'yes' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="attendance"
                value="yes"
                checked={attendance === 'yes'}
                onChange={(e) => setAttendance(e.target.value)}
              />
              <span className="option-check">✓</span>
              <span><strong>Այո, սիրով</strong><small>Կմասնակցեմ միջոցառմանը</small></span>
            </label>

            <label className={`attendance-option ${attendance === 'no' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="attendance"
                value="no"
                checked={attendance === 'no'}
                onChange={(e) => setAttendance(e.target.value)}
              />
              <span className="option-check">✓</span>
              <span><strong>Ցավոք, չեմ կարողանա</strong><small>Այս անգամ չեմ կարող ներկա լինել</small></span>
            </label>
          </div>
        </fieldset>

        <div className="form-field">
          <label htmlFor="guest-count">Հյուրերի քանակը</label>
          <input
            id="guest-count"
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            disabled={attendance === 'no'}
          />
        </div>

        <div className="form-field full-width">
          <label htmlFor="guest-comment">Մեկնաբանություն <span>(ըստ ցանկության)</span></label>
          <textarea
            id="guest-comment"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Կարող եք այստեղ թողնել Ձեր հաղորդագրությունը"
          />
        </div>

        <button type="submit" className="submit-button full-width">Ուղարկել պատասխանը</button>
        {sent && <div className="success-message full-width">Շնորհակալություն, Ձեր պատասխանը գրանցված է 🤍</div>}
      </form>

      <div className="ribbon" aria-hidden="true">
        <span className="ribbon-knot" />
        <span className="ribbon-left" />
        <span className="ribbon-right" />
      </div>
    </section>
  )
}

export default function App() {
  const audioRef = useRef(null)
  const userControlled = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const time = useCountdown(CONFIG.dateISO)

  const countdown = useMemo(() => [
    [String(time.days).padStart(2, '0'), 'ՕՐ'],
    [String(time.hours).padStart(2, '0'), 'ԺԱՄ'],
    [String(time.minutes).padStart(2, '0'), 'ՐՈՊԵ'],
    [String(time.seconds).padStart(2, '0'), 'ՎՐԿ'],
  ], [time])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.14 })

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.58
    audio.loop = true

    const syncPlay = () => setIsPlaying(true)
    const syncPause = () => setIsPlaying(false)
    audio.addEventListener('play', syncPlay)
    audio.addEventListener('pause', syncPause)

    const start = async () => {
      try {
        await audio.play()
      } catch {
        setIsPlaying(false)
      }
    }

    start()

    const unlock = async (event) => {
      if (userControlled.current) return
      if (event.target instanceof Element && event.target.closest('.music-button')) return
      if (audio.paused) {
        try {
          await audio.play()
        } catch {
          return
        }
      }
      document.removeEventListener('pointerdown', unlock)
      document.removeEventListener('keydown', unlock)
    }

    document.addEventListener('pointerdown', unlock, { passive: true })
    document.addEventListener('keydown', unlock)

    return () => {
      audio.removeEventListener('play', syncPlay)
      audio.removeEventListener('pause', syncPause)
      document.removeEventListener('pointerdown', unlock)
      document.removeEventListener('keydown', unlock)
    }
  }, [])

  const toggleMusic = async () => {
    const audio = audioRef.current
    if (!audio) return
    userControlled.current = true

    if (audio.paused) {
      try {
        await audio.play()
      } catch (err) {
        console.error(err)
      }
    } else {
      audio.pause()
    }
  }

  const scrollDown = (event) => {
    event.currentTarget.getRootNode().querySelector('#welcome')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main>
      <audio ref={audioRef} src={song} autoPlay loop preload="auto" />
      <MusicButton isPlaying={isPlaying} onToggle={toggleMusic} />

      <section className="hero-section">
        <div className="hero-inner">
          <BellLineArt />
          <div className="hero-title-wrap">
            <h1>Վերջին <span>զանգ</span></h1>
            <div className="hero-year">{CONFIG.year}</div>
            <p>{CONFIG.className}</p>
          </div>
          <button className="scroll-cue" type="button" onClick={scrollDown} aria-label="Դիտել հրավերը">
            <span>⌄</span>
          </button>
        </div>
      </section>

      <section id="welcome" className="welcome-section reveal">
        <p className="eyebrow">Մեր վերջին դպրոցական օրը</p>
        <h2>Սիրելի ուսուցիչներ, ծնողներ և հարազատներ</h2>
        <p className="lead">
          Սիրով հրավիրում ենք միասին նշելու մեր <strong>«Վերջին զանգը»</strong>՝
          մի օր, որտեղ կխառնվեն հուզմունքը, շնորհակալությունն ու նոր ճանապարհի սպասումը։
        </p>
        <img src={bellPhoto} alt="Դպրոցական զանգ" className="bell-photo" />
      </section>

      <section className="date-section">
        <Calendar />
      </section>

      <section className="events-section">
        <EventCard image={schoolPhoto} href={CONFIG.schoolMap} time={CONFIG.schoolTime}>
          {CONFIG.schoolTitle}
        </EventCard>

        <EventCard image={venuePhoto} href={CONFIG.venueMap} time={CONFIG.venueTime} reverse>
          {CONFIG.venueTitle}
        </EventCard>
      </section>

      <Countdown countdown={countdown} />

      <section className="telegram-section reveal">
        <p className="eyebrow">Հիշողությունները միասին</p>
        <h2>TELEGRAM ՉԱՏ</h2>
        <p>
          Մեր Telegram խմբում կարող եք տեսնել նորությունները, կիսվել լուսանկարներով և պահպանել վերջին զանգի ամենաջերմ պահերը։
        </p>
        <a href={CONFIG.telegram} target="_blank" rel="noreferrer" className="telegram-button">Միանալ</a>
      </section>

      <RSVP />

      <footer>
        <BellLineArt />
        <p>Սիրով՝ 9-ի Բ դասարան</p>
      </footer>
    </main>
  )
}
