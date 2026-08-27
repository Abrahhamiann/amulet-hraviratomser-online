import { useEffect, useMemo, useRef, useState } from 'react'
import heroBase from './assets/hero-base.png'
import astronaut from './assets/decor/astronaut.png'
import cake from './assets/decor/cake.png'
import balloons from './assets/decor/balloons.png'
import stars from './assets/decor/stars.png'
import song from './assets/audio/happy-birthday.mp3'

const CONFIG = {
  childName: 'Արմենի',
  age: 4,
  eventDate: '2027-01-13T17:00:00+04:00',
  dateLabel: '13 հունվարի 2027',
  monthTitle: 'Հունվար',
  year: 2027,
  selectedDay: 13,
  time: '17:00',
  venue: 'Մանկական ժամանցի կենտրոն',
  address: 'Երևան, օրինակելի հասցե 24',
  mapUrl: 'https://maps.google.com/?q=Yerevan',
}

const WEEKDAYS = ['Երկ', 'Երք', 'Չոր', 'Հնգ', 'Ուրբ', 'Շբթ', 'Կիր']

function useCountdown(target) {
  const calculate = () => Math.max(0, new Date(target).getTime() - Date.now())
  const [diff, setDiff] = useState(calculate)

  useEffect(() => {
    const id = setInterval(() => setDiff(calculate()), 1000)
    return () => clearInterval(id)
  }, [target])

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function buildCalendar(year, monthIndex) {
  const first = new Date(year, monthIndex, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const jsDay = first.getDay()
  const mondayIndex = (jsDay + 6) % 7
  const cells = Array(mondayIndex).fill(null)

  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function MusicButton({ isPlaying, onClick }) {
  return (
    <button
      className={`music-button ${isPlaying ? 'playing' : ''}`}
      onClick={onClick}
      type="button"
      aria-label={isPlaying ? 'Անջատել երաժշտությունը' : 'Միացնել երաժշտությունը'}
      title={isPlaying ? 'Անջատել երաժշտությունը' : 'Միացնել երաժշտությունը'}
    >
      <span className="music-orbit" />
      <span className="music-symbol">{isPlaying ? 'Ⅱ' : '♪'}</span>
      <span className="equalizer" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </button>
  )
}

function Hero({ isPlaying, onToggleMusic }) {
  return (
    <section className="hero" id="top">
      <img className="hero-base" src={heroBase} alt="" aria-hidden="true" />

      <div className="hero-layer hero-stars">
        <img src={stars} alt="" />
      </div>

      <div className="hero-layer hero-astronaut">
        <img src={astronaut} alt="" />
      </div>

      <div className="hero-layer hero-cake">
        <img src={cake} alt="" />
      </div>

      <div className="hero-layer hero-balloons">
        <img src={balloons} alt="" />
      </div>

      <div className="hero-copy">
        <span className="hero-kicker">Դու հրավիրված ես</span>
        <h1>
          <span>{CONFIG.childName}</span>
          <strong>{CONFIG.age}</strong>
          <span>ամյակին</span>
        </h1>
        <p>Գանք միասին ստեղծելու մի օր՝ լի ծիծաղով, խաղերով ու տիեզերական տրամադրությամբ։</p>
        <a className="scroll-cue" href="#invite" aria-label="Իջնել ներքև">
          <span />
          <span />
        </a>

        <div className="hero-music-control">
          <span className="hero-music-label">
            {isPlaying ? 'Երաժշտությունը միացված է' : 'Միացնել երաժշտությունը'}
          </span>
          <MusicButton isPlaying={isPlaying} onClick={onToggleMusic} />
        </div>
      </div>
    </section>
  )
}

function InvitationIntro() {
  return (
    <section className="section intro-section reveal" id="invite">
      <div className="section-shell intro-shell">
        <div className="mini-space-scene" aria-hidden="true">
          <img src={astronaut} alt="" />
          <span className="mini-star one">✦</span>
          <span className="mini-star two">✧</span>
        </div>

        <div className="intro-copy">
          <span className="eyebrow">✦ Սիրով հրավիրում ենք</span>
          <h2>{CONFIG.childName}ի ծննդյան տոնին</h2>
          <p>
            Մեզ համար շատ կարևոր է այս օրը կիսել սիրելի մարդկանց հետ։
            Սպասում ենք քեզ՝ միասին նշելու {CONFIG.age}-ամյակը և ստեղծելու ամենաջերմ հիշողությունները։
          </p>
        </div>
      </div>
    </section>
  )
}

function CalendarSection() {
  const cells = useMemo(() => buildCalendar(CONFIG.year, 0), [])

  return (
    <section className="section calendar-section reveal">
      <div className="section-shell calendar-shell">
        <div className="calendar-side-art" aria-hidden="true">
          <img src={cake} alt="" />
        </div>

        <div className="calendar-panel">
          <span className="eyebrow">◷ Պահիր օրը</span>
          <h2>{CONFIG.monthTitle} {CONFIG.year}</h2>
          <div className="weekdays">
            {WEEKDAYS.map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="calendar-grid">
            {cells.map((day, index) => (
              <span
                key={`${day ?? 'empty'}-${index}`}
                className={day === CONFIG.selectedDay ? 'selected-day' : day ? '' : 'empty'}
              >
                {day}
              </span>
            ))}
          </div>
          <p className="calendar-note">{CONFIG.dateLabel} • {CONFIG.time}</p>
        </div>
      </div>
    </section>
  )
}

function VenueSection() {
  return (
    <section className="section venue-section reveal">
      <div className="section-shell venue-card">
        <div className="venue-art" aria-hidden="true">
          <img src={balloons} alt="" />
        </div>

        <div className="venue-content">
          <span className="eyebrow">⌖ Հանդիպման վայրը</span>
          <h2>{CONFIG.venue}</h2>
          <p>{CONFIG.address}</p>
          <div className="venue-meta">
            <span>◷ {CONFIG.time}</span>
            <span>▣ {CONFIG.dateLabel}</span>
          </div>
          <a className="primary-btn" href={CONFIG.mapUrl} target="_blank" rel="noreferrer">
            Քարտեզ
            ⌖
          </a>
        </div>
      </div>
    </section>
  )
}

function CountdownSection() {
  const time = useCountdown(CONFIG.eventDate)
  const items = [
    [String(time.days).padStart(2, '0'), 'օր'],
    [String(time.hours).padStart(2, '0'), 'ժամ'],
    [String(time.minutes).padStart(2, '0'), 'րոպե'],
    [String(time.seconds).padStart(2, '0'), 'վրկ'],
  ]

  return (
    <section className="section countdown-section reveal">
      <div className="section-shell countdown-shell">
        <span className="eyebrow">✦ Մնացել է</span>
        <h2>Մինչև մեր տիեզերական օրը</h2>
        <div className="countdown-grid">
          {items.map(([value, label]) => (
            <div className="countdown-item" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RSVPSection() {
  const [status, setStatus] = useState('yes')
  const [sent, setSent] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <section className="section rsvp-section reveal">
      <div className="section-shell rsvp-shell">
        <div className="rsvp-copy">
          <span className="eyebrow">♡ Սիրով սպասում ենք քեզ</span>
          <h2>Հաստատի՛ր մասնակցությունդ</h2>
          <p>Խնդրում ենք լրացնել փոքրիկ ձևաթուղթը, որպեսզի կարողանանք ամեն ինչ պատրաստել քեզ համար։</p>
          <img className="rsvp-astronaut" src={astronaut} alt="" aria-hidden="true" />
        </div>

        <form className="rsvp-form" onSubmit={handleSubmit}>
          <label>
            <span>Անուն, ազգանուն</span>
            <input name="name" type="text" placeholder="Գրիր անունդ" required />
          </label>

          <fieldset>
            <legend>Կկարողանա՞ս գալ</legend>
            <div className="choice-row">
              <button
                type="button"
                className={status === 'yes' ? 'choice active' : 'choice'}
                onClick={() => setStatus('yes')}
              >
                Այո, սիրով
              </button>
              <button
                type="button"
                className={status === 'no' ? 'choice active' : 'choice'}
                onClick={() => setStatus('no')}
              >
                Ցավոք, ոչ
              </button>
            </div>
          </fieldset>

          <label>
            <span>Հյուրերի քանակ</span>
            <select name="guests" defaultValue="1">
              <option value="1">1 հյուր</option>
              <option value="2">2 հյուր</option>
              <option value="3">3 հյուր</option>
              <option value="4">4 հյուր</option>
            </select>
          </label>

          <label>
            <span>Փոքրիկ հաղորդագրություն</span>
            <textarea name="message" rows="4" placeholder="Ցանկություն, հարց կամ հաղորդագրություն…" />
          </label>

          <button className="submit-btn" type="submit">
            Ուղարկել
            ➤
          </button>

          {sent && (
            <div className="success-message">
              Շնորհակալություն 💜 Պատասխանը գրանցված է։
            </div>
          )}
        </form>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <img src={stars} alt="" aria-hidden="true" />
      <h2>Սպասում ենք քեզ ✦</h2>
      <p>{CONFIG.childName} • {CONFIG.age} տարեկան</p>
    </footer>
  )
}

export default function App() {
  const audioRef = useRef(null)
  const userControlled = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.55
    audio.loop = true
    audio.playsInline = true

    const syncPlay = () => setIsPlaying(true)
    const syncPause = () => setIsPlaying(false)

    audio.addEventListener('play', syncPlay)
    audio.addEventListener('pause', syncPause)

    // Առաջին իսկ պահին փորձում ենք երգը միացնել։
    // Desktop browser-ներում սա հաճախ աշխատում է անմիջապես։
    const tryAutoplay = async () => {
      try {
        await audio.play()
        setIsPlaying(true)
        return true
      } catch {
        setIsPlaying(false)
        return false
      }
    }

    tryAutoplay()

    // Safari/Chrome-ը կարող են արգելափակել ձայնով autoplay-ը։
    // Այդ դեպքում առաջին ցանկացած interaction-ի պահին (ոչ միայն music button)
    // երգը կմիանա ինքնաբերաբար։
    const unlockAudio = async () => {
      if (userControlled.current || !audio.paused) return

      const started = await tryAutoplay()
      if (started) removeUnlockListeners()
    }

    const removeUnlockListeners = () => {
      document.removeEventListener('pointerdown', unlockAudio)
      document.removeEventListener('touchstart', unlockAudio)
      document.removeEventListener('keydown', unlockAudio)
    }

    document.addEventListener('pointerdown', unlockAudio, { passive: true })
    document.addEventListener('touchstart', unlockAudio, { passive: true })
    document.addEventListener('keydown', unlockAudio)

    const handlePageShow = () => {
      if (!userControlled.current && audio.paused) tryAutoplay()
    }

    window.addEventListener('pageshow', handlePageShow)

    return () => {
      audio.removeEventListener('play', syncPlay)
      audio.removeEventListener('pause', syncPause)
      removeUnlockListeners()
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14 },
    )

    document.querySelectorAll('.reveal').forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  async function toggleMusic() {
    const audio = audioRef.current
    if (!audio) return

    userControlled.current = true

    if (audio.paused) {
      try {
        await audio.play()
      } catch {
        setIsPlaying(false)
      }
    } else {
      audio.pause()
    }
  }

  return (
    <main>
      <audio ref={audioRef} src={song} autoPlay loop preload="auto" />
      <Hero isPlaying={isPlaying} onToggleMusic={toggleMusic} />
      <InvitationIntro />
      <CalendarSection />
      <VenueSection />
      <CountdownSection />
      <RSVPSection />
      <Footer />
    </main>
  )
}
