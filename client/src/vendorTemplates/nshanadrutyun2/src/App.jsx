import { useEffect, useMemo, useRef, useState } from 'react'

import goldHeart from './assets/images/gold-heart.png'
import coupleMountain from './assets/images/couple-mountain.jpg'
import coupleFlowers from './assets/images/couple-flowers.jpg'
import invitationSong from './assets/audio/invitation-song.mp3'

const CONFIG = {
  bride: 'Անի',
  groom: 'Արտավազդ',
  dateISO: '2026-09-10T18:00:00+04:00',
  displayDate: '10.09.2026',
  month: 'Սեպտեմբեր',
  year: '2026',
  day: 10,
  time: '18:00',
  venue: 'Dvin Music Hall',
  address: 'ք. Երևան, Պարոնյան 40',
  mapUrl: 'https://maps.google.com/?q=Dvin+Music+Hall+Yerevan',
  rsvpUntil: '03.09.2026',
}

function useCountdown(target) {
  const calc = () => Math.max(0, new Date(target).getTime() - Date.now())
  const [diff, setDiff] = useState(calc)

  useEffect(() => {
    const timer = window.setInterval(() => setDiff(calc()), 1000)
    return () => window.clearInterval(timer)
  }, [target])

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function MusicIcon({ playing }) {
  return playing ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18V5l10-2v13" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18V5l10-2v13" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
      <path d="M3 3l18 18" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function ScratchGate({ onPrimeAudio, onFinished }) {
  const canvasRef = useRef(null)
  const frameRef = useRef(null)
  const activePointer = useRef(null)
  const initialOpaque = useRef(0)
  const eraseEvents = useRef(0)
  const finishedRef = useRef(false)
  const [ready, setReady] = useState(false)
  const [started, setStarted] = useState(false)
  const [finishing, setFinishing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const frame = frameRef.current
    if (!canvas || !frame) return undefined

    const image = new Image()
    image.src = goldHeart

    const draw = () => {
      const rect = frame.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(1, Math.round(rect.width * dpr))
      const height = Math.max(1, Math.round(rect.height * dpr))
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.clearRect(0, 0, width, height)

      const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight)
      const drawWidth = image.naturalWidth * scale
      const drawHeight = image.naturalHeight * scale
      const x = (width - drawWidth) / 2
      const y = (height - drawHeight) / 2
      ctx.drawImage(image, x, y, drawWidth, drawHeight)

      const pixels = ctx.getImageData(0, 0, width, height).data
      let opaque = 0
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] > 32) opaque += 1
      }
      initialOpaque.current = opaque
      setReady(true)
    }

    const resizeObserver = new ResizeObserver(() => {
      if (image.complete && image.naturalWidth) draw()
    })
    resizeObserver.observe(frame)

    image.onload = draw
    return () => resizeObserver.disconnect()
  }, [])

  const checkProgress = () => {
    const canvas = canvasRef.current
    if (!canvas || !initialOpaque.current || finishedRef.current) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let remaining = 0
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 32) remaining += 1
    }

    const erased = 1 - remaining / initialOpaque.current
    if (erased >= 0.43) {
      finishedRef.current = true
      setFinishing(true)
      window.setTimeout(() => onFinished(), 850)
    }
  }

  const eraseAt = (clientX, clientY) => {
    const canvas = canvasRef.current
    if (!canvas || finishedRef.current) return

    const rect = canvas.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * canvas.width
    const y = ((clientY - rect.top) / rect.height) * canvas.height
    const radius = Math.max(32, rect.width * 0.095) * (canvas.width / rect.width)

    const ctx = canvas.getContext('2d')
    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    const gradient = ctx.createRadialGradient(x, y, radius * 0.08, x, y, radius)
    gradient.addColorStop(0, 'rgba(0,0,0,1)')
    gradient.addColorStop(0.66, 'rgba(0,0,0,.96)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    eraseEvents.current += 1
    if (eraseEvents.current % 4 === 0) checkProgress()
  }

  const handlePointerDown = (event) => {
    if (!ready || finishing) return
    setStarted(true)
    onPrimeAudio()
    activePointer.current = event.pointerId
    event.currentTarget.setPointerCapture?.(event.pointerId)
    eraseAt(event.clientX, event.clientY)
  }

  const handlePointerMove = (event) => {
    if (activePointer.current !== event.pointerId || finishing) return
    eraseAt(event.clientX, event.clientY)
  }

  const endPointer = (event) => {
    if (activePointer.current === event.pointerId) {
      activePointer.current = null
      checkProgress()
    }
  }

  return (
    <section
      className={`scratch-gate ${finishing ? 'is-finishing' : ''}`}
      data-editor-ignore="opening-gate"
    >
      <div className="gate-glow gate-glow-one" />
      <div className="gate-glow gate-glow-two" />

      <div className="gate-content">
        <p className="gate-kicker">ՆՇԱՆԱԴՐՈՒԹՅԱՆ ՀՐԱՎԵՐ</p>
        <h1>Մեր գեղեցիկ օրը սկսվում է այստեղ</h1>

        <div className="scratch-frame" ref={frameRef}>
          <div className="heart-reveal" aria-hidden="true">
            <small>ՄԻ ՓՈՔՐ ԲԱՑԵՔ</small>
            <strong>{CONFIG.displayDate}</strong>
            <span>և շարունակեք ներքև</span>
          </div>
          <canvas
            ref={canvasRef}
            className="scratch-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endPointer}
            onPointerCancel={endPointer}
            onPointerLeave={(event) => {
              if (event.pointerType === 'mouse') endPointer(event)
            }}
            aria-label="Ջնջեք ոսկեգույն սիրտը՝ հրավերը բացելու համար"
          />
          <div className="scratch-spark spark-one" />
          <div className="scratch-spark spark-two" />
          <div className="scratch-spark spark-three" />
        </div>

        <p className="gate-names"><span className="gate-groom">{CONFIG.groom}</span> <span>&</span> <span className="gate-bride">{CONFIG.bride}</span></p>
        <p className={`scratch-hint ${started ? 'is-active' : ''}`}>
          {started ? 'Շարունակեք ջնջել սիրտը' : 'Մատով կամ cursor-ով ջնջեք սիրտը'}
        </p>
      </div>
    </section>
  )
}

function CalendarStrip() {
  const dates = [8, 9, 10, 11, 12]
  return (
    <div className="calendar-strip" aria-label="Միջոցառման ամսաթիվը">
      {dates.map((date) =>
        date === CONFIG.day ? (
          <div className="calendar-heart" key={date}>
            <img src={goldHeart} alt="" />
            <span>{date}</span>
          </div>
        ) : (
          <div className="calendar-day" key={date}>{date}</div>
        ),
      )}
    </div>
  )
}

function RSVP() {
  const [attendance, setAttendance] = useState('yes')
  const [submitted, setSubmitted] = useState(false)

  const submit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <form className="rsvp-form" onSubmit={submit}>
      <label className="field-label" htmlFor="guest-name">Ձեր անուն/ազգանունը</label>
      <input id="guest-name" name="guestName" required placeholder="Օրինակ՝ Անի Մարտիրոսյան" />

      <div className="rsvp-question">
        <p>Կկարողանա՞ք ներկա գտնվել</p>
        <div className="choice-row">
          <button
            type="button"
            className={attendance === 'yes' ? 'choice active' : 'choice'}
            onClick={() => setAttendance('yes')}
            aria-pressed={attendance === 'yes'}
          >
            <span className="choice-dot" /> Այո, սիրով
          </button>
          <button
            type="button"
            className={attendance === 'no' ? 'choice active' : 'choice'}
            onClick={() => setAttendance('no')}
            aria-pressed={attendance === 'no'}
          >
            <span className="choice-dot" /> Ցավոք, ոչ
          </button>
        </div>
      </div>

      <label className="field-label" htmlFor="guest-count">Հյուրերի քանակը</label>
      <input
        id="guest-count"
        name="guestCount"
        type="number"
        min="1"
        defaultValue="1"
        disabled={attendance === 'no'}
      />

      <label className="field-label" htmlFor="note">Փոքրիկ ուղերձ մեզ</label>
      <textarea id="note" name="note" rows="3" placeholder="Ցանկության դեպքում գրեք այստեղ…" />

      <button className="submit-button" type="submit">Ուղարկել պատասխանը</button>
      {submitted && <p className="success-message" role="status">Շնորհակալ ենք։ Ձեր պատասխանը պահպանվեց 🤍</p>}
    </form>
  )
}

function Invitation({ playing, onToggleMusic }) {
  const invitationRef = useRef(null)
  const countdown = useCountdown(CONFIG.dateISO)

  useEffect(() => {
    const nodes = [...(invitationRef.current?.querySelectorAll('.reveal') || [])]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const countdownItems = useMemo(() => [
    ['օր', countdown.days],
    ['ժամ', countdown.hours],
    ['րոպե', countdown.minutes],
    ['վայրկյան', countdown.seconds],
  ], [countdown])

  return (
    <main className="invitation" ref={invitationRef}>
      <button className="music-button" type="button" onClick={onToggleMusic} aria-label={playing ? 'Անջատել երաժշտությունը' : 'Միացնել երաժշտությունը'}>
        <MusicIcon playing={playing} />
        <span>{playing ? 'Երաժշտություն՝ միացված' : 'Երաժշտություն՝ անջատված'}</span>
      </button>

      <section className="invite-hero section-shell">
        <div className="soft-petal petal-one" />
        <div className="soft-petal petal-two" />
        <div className="hero-card reveal visible">
          <img src={coupleMountain} alt="Զույգը լեռների ֆոնին" />
          <div className="hero-shade" />
          <p className="hero-kicker">ՆՇԱՆԱԴՐՈՒԹՅԱՆ ՀՐԱՎԵՐ</p>
          <h2><span className="hero-groom">{CONFIG.groom}</span><br />և <span className="hero-bride">{CONFIG.bride}</span></h2>
          <p className="hero-date">{CONFIG.displayDate}</p>
          <a className="hero-scroll" href="#story">ԲԱՑԵԼ ՀՐԱՎԵՐԸ <span>↓</span></a>
        </div>
      </section>

      <section id="story" className="story-section section-shell">
        <div className="story-copy reveal">
          <p className="section-eyebrow">ՍԻՐԵԼԻ՛ ՀՅՈՒՐԵՐ</p>
          <h2>Մեր կյանքի մի նոր էջ ուզում ենք սկսել Ձեր ներկայությամբ</h2>
          <p>
            Սիրելի՛ հարազատներ և ընկերներ, մեր կյանքի ամենանուրբ «այո»-ներից մեկը
            ցանկանում ենք նշել հենց Ձեզ հետ։ Սիրով հրավիրում ենք մեր նշանադրության երեկոյին։
          </p>
        </div>
      </section>

      <section className="date-section section-shell">
        <div className="date-block reveal">
          <h2>{CONFIG.month} {CONFIG.year}</h2>
          <CalendarStrip />
          <p className="date-caption">Պահեք այս օրը մեզ համար</p>
        </div>

        <figure className="photo-panel reveal">
          <img src={coupleFlowers} alt="Նշանադրված զույգը" />
          <figcaption>Մի փոքրիկ պահ՝ մեր մեծ օրվանից առաջ</figcaption>
        </figure>
      </section>

      <section className="venue-section section-shell">
        <div className="venue-card reveal">
          <div className="venue-icon"><LocationIcon /></div>
          <p className="section-eyebrow">ՆՇԱՆԱԴՐՈՒԹՅԱՆ ԵՐԵԿՈ</p>
          <h2>{CONFIG.time}</h2>
          <h3>{CONFIG.venue}</h3>
          <p>{CONFIG.address}</p>
          <a href={CONFIG.mapUrl} target="_blank" rel="noreferrer" className="outline-button">Ինչպես հասնել</a>
        </div>
      </section>

      <section className="countdown-section section-shell">
        <div className="countdown-copy reveal">
          <p className="section-eyebrow">ՄԵՐ ՀԱՆԴԻՊՄԱՆԸ ՄՆԱՑԵԼ Է</p>
          <div className="countdown-grid">
            {countdownItems.map(([label, value]) => (
              <div className="countdown-item" key={label}>
                <strong>{String(value).padStart(2, '0')}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="details-section section-shell">
        <div className="details-grid">
          <div className="details-photo reveal">
            <img src={coupleMountain} alt="Զույգի լուսանկար" />
          </div>
          <div className="details-copy reveal">
            <p className="section-eyebrow">ՄԻ ՓՈՔՐ ԽՆԴՐԱՆՔ</p>
            <h2>Թող երեկոն լինի գեղեցիկ ու անկաշկանդ</h2>
            <p>
              Մեզ համար ամենաթանկ նվերը Ձեր ներկայությունն է։ Եթե ցանկանում եք որևէ փոքրիկ
              ուշադրություն ցուցաբերել, ընտրեք այն, ինչ Ձեզ ամենաշատն է ուրախացնում։
            </p>
            <p>
              Հագուստի համար առաջարկում ենք հանգիստ, բնական և տոնական երանգներ՝ ivory,
              champagne, taupe, dusty rose և սև շեշտադրումներ։
            </p>
            <div className="palette" aria-label="Հագուստի առաջարկվող գույներ">
              {['#f1eadf', '#d7c7ae', '#b9a58d', '#a7837b', '#5d5149'].map((color) => (
                <span key={color} style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rsvp-section section-shell">
        <div className="rsvp-wrap reveal">
          <div className="rsvp-heading">
            <p className="section-eyebrow">ՀԱՍՏԱՏԵՔ ՆԵՐԿԱՅՈՒԹՅՈՒՆԸ</p>
            <h2>Սպասելու ենք Ձեր պատասխանին մինչև {CONFIG.rsvpUntil}</h2>
            <p>Լրացրեք փոքրիկ ձևը, որպեսզի կարողանանք ամեն ինչ պատրաստել սիրով և ուշադրությամբ։</p>
          </div>
          <RSVP />
        </div>
      </section>

      <footer className="invite-footer section-shell">
        <div className="footer-heart-wrap" aria-hidden="true">
          <img src={goldHeart} alt="" />
        </div>
        <p>Սիրով՝</p>
        <h2>{CONFIG.groom} & {CONFIG.bride}</h2>
        <span>{CONFIG.displayDate}</span>
      </footer>
    </main>
  )
}

export default function App({ forceOpen = false } = {}) {
  const audioRef = useRef(null)
  const [entered, setEntered] = useState(forceOpen)
  const [playing, setPlaying] = useState(false)
  const audioPrimed = useRef(false)

  useEffect(() => {
    if (forceOpen) setEntered(true)
  }, [forceOpen])

  useEffect(() => {
    if (entered) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [entered])

  const primeAudio = () => {
    const audio = audioRef.current
    if (!audio || audioPrimed.current) return
    audioPrimed.current = true
    audio.loop = true
    audio.volume = 0
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }

  const fadeMusicIn = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.play().then(() => {
      setPlaying(true)
      const target = 0.5
      let volume = audio.volume || 0
      const fade = window.setInterval(() => {
        volume = Math.min(target, volume + 0.035)
        audio.volume = volume
        if (volume >= target) window.clearInterval(fade)
      }, 55)
    }).catch(() => setPlaying(false))
  }

  const finishGate = () => {
    setEntered(true)
    window.scrollTo({ top: 0, behavior: 'auto' })
    window.setTimeout(fadeMusicIn, 120)
  }

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.volume = 0.5
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  return (
    <>
      <audio ref={audioRef} src={invitationSong} loop preload="auto" />
      {!entered && <ScratchGate onPrimeAudio={primeAudio} onFinished={finishGate} />}
      {entered && <Invitation playing={playing} onToggleMusic={toggleMusic} />}
    </>
  )
}
