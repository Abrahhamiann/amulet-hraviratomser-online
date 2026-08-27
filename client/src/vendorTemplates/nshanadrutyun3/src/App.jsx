import { useEffect, useMemo, useState } from 'react'

import heart from './assets/images/heart.png'
import couple1 from './assets/images/couple-1.jpg'
import couple2 from './assets/images/couple-2.jpg'
import couple3 from './assets/images/couple-3.jpg'
import couple4 from './assets/images/couple-4.jpg'
import couple5 from './assets/images/couple-5.jpg'
import restaurantImage from './assets/images/restaurant.png'

const CONFIG = {
  bride: 'Աննա',
  groom: 'Կարեն',
  dateISO: '2026-09-05T18:00:00+04:00',
  day: 5,
  month: 'ՍԵՊՏԵՄԲԵՐ',
  monthNumber: 8,
  year: 2026,
  restaurant: 'DVIN MUSIC HALL',
  address: 'ք․ Երևան, Պարոնյան 40',
  mapUrl: 'https://maps.google.com',
  rsvpDeadline: '01.09.2026',
}

const photos = [couple1, couple2, couple3, couple4, couple5]

function useCountdown(target) {
  const calculate = () => Math.max(0, new Date(target).getTime() - Date.now())
  const [diff, setDiff] = useState(calculate)

  useEffect(() => {
    const id = window.setInterval(() => setDiff(calculate()), 1000)
    return () => window.clearInterval(id)
  }, [target])

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <div className={`reveal ${className}`} style={{ '--delay': `${delay}ms` }}>
      {children}
    </div>
  )
}

function FilmHoles() {
  return (
    <>
      <div className="film-holes film-holes-left" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => <i key={i} />)}
      </div>
      <div className="film-holes film-holes-right" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => <i key={i} />)}
      </div>
    </>
  )
}

function Calendar() {
  const daysInMonth = new Date(CONFIG.year, CONFIG.monthNumber + 1, 0).getDate()
  const mondayFirst = (new Date(CONFIG.year, CONFIG.monthNumber, 1).getDay() + 6) % 7
  const cells = [
    ...Array.from({ length: mondayFirst }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <section className="section calendar-section" id="date">
      <div className="calendar-year" aria-hidden="true">{CONFIG.year}</div>
      <Reveal className="section-heading-wrap">
        <p className="kicker">ՄԵՐ ՕՐԸ</p>
        <h2>{CONFIG.month}</h2>
      </Reveal>

      <Reveal className="calendar" delay={100}>
        <div className="weekdays">
          {['Երկ', 'Երք', 'Չրք', 'Հնգ', 'Ուրբ', 'Շբթ', 'Կիր'].map((day) => <span key={day}>{day}</span>)}
        </div>
        <div className="calendar-grid">
          {cells.map((day, index) => (
            <div key={`${day}-${index}`} className={`calendar-cell ${day === CONFIG.day ? 'selected' : ''}`}>
              {day === CONFIG.day && (
                <img className="calendar-heart" src={heart} alt="" aria-hidden="true" />
              )}
              {day && <span>{day}</span>}
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="diagonal-film" delay={180}>
        {[couple2, couple3, couple4].map((photo, i) => (
          <div className="diagonal-frame" key={photo}>
            <img src={photo} alt={`Նշանադրության լուսանկար ${i + 1}`} />
          </div>
        ))}
      </Reveal>
    </section>
  )
}

function Countdown() {
  const countdown = useCountdown(CONFIG.dateISO)
  const values = [
    ['օր', countdown.days],
    ['ժամ', countdown.hours],
    ['րոպե', countdown.minutes],
    ['վրկ', countdown.seconds],
  ]

  return (
    <section className="section countdown-section">
      <Reveal>
        <p className="kicker">ՄԻՆՉԵՎ ՄԵՐ ԵՐԵԿՈՆ</p>
        <h2 className="countdown-title">Մնացել է...</h2>
      </Reveal>
      <Reveal className="countdown" delay={100}>
        {values.map(([label, value]) => (
          <div className="countdown-cell" key={label}>
            <strong>{String(value).padStart(2, '0')}</strong>
            <span>{label}</span>
          </div>
        ))}
      </Reveal>
    </section>
  )
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 58s18-16 18-34A18 18 0 1 0 14 24c0 18 18 34 18 34Z" />
      <circle cx="32" cy="24" r="6" />
    </svg>
  )
}

function RSVP() {
  const [attending, setAttending] = useState('yes')
  const [sent, setSent] = useState(false)

  const submit = (event) => {
    event.preventDefault()
    setSent(true)
  }

  return (
    <section className="section rsvp-section" id="rsvp">
      <Reveal className="film-card rsvp-film">
        <FilmHoles />
        <div className="rsvp-inner">
          <p className="kicker light">ՀԱՐՑԱԹԵՐԹԻԿ</p>
          <h2>Կլինե՞ք մեզ հետ</h2>
          <p className="rsvp-copy">Խնդրում ենք հաստատել Ձեր ներկայությունը մինչև <b>{CONFIG.rsvpDeadline}</b>։</p>
          <form onSubmit={submit}>
            <label className="field-label" htmlFor="guest-name">Ձեր անունը / ազգանունը</label>
            <input id="guest-name" name="name" required autoComplete="name" />

            <fieldset>
              <legend>Կկարողանա՞ք ներկա գտնվել</legend>
              <label className="choice">
                <input type="radio" name="attending" value="yes" checked={attending === 'yes'} onChange={() => setAttending('yes')} />
                <span /> Այո, սիրով
              </label>
              <label className="choice">
                <input type="radio" name="attending" value="no" checked={attending === 'no'} onChange={() => setAttending('no')} />
                <span /> Ցավոք, չեմ կարողանա
              </label>
            </fieldset>

            <label className="field-label" htmlFor="guests">Հյուրերի քանակը</label>
            <input id="guests" name="guests" type="number" min="1" defaultValue="2" disabled={attending === 'no'} />

            <button type="submit">Ուղարկել</button>
            {sent && <p className="success" role="status">Շնորհակալ ենք 💛 Ձեր պատասխանը գրանցված է։</p>}
          </form>
        </div>
      </Reveal>
    </section>
  )
}

function App() {
  const [slide, setSlide] = useState(0)
  const sliderPhotos = useMemo(() => [couple5, couple1, couple4, couple3], [])

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -7% 0px' },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <main className="invitation">
      <section className="hero section">
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <Reveal className="save-the-date">
          <span>SAVE</span> <em>the</em> <span>DATE</span>
        </Reveal>

        <Reveal className="hero-film" delay={120}>
          <div className="hero-grid">
            {[couple1, couple2, couple3, couple4].map((photo, index) => (
              <figure key={photo}>
                <img src={photo} alt={`Աննա և Կարեն — լուսանկար ${index + 1}`} />
              </figure>
            ))}
          </div>
          <div className="hero-info">
            <p>05.09.2026</p>
            <h1><span className="hero-groom">{CONFIG.groom}</span> <span>և</span> <span className="hero-bride">{CONFIG.bride}</span></h1>
          </div>
        </Reveal>

        <Reveal className="intro" delay={220}>
          <p className="kicker">ՆՇԱՆԱԴՐՈՒԹՅԱՆ ՀՐԱՎԵՐ</p>
          <h2>Սիրելի՛ հյուրեր</h2>
          <p>
            Մեր պատմության ամենագեղեցիկ էջերից մեկը ցանկանում ենք սկսել Ձեր ներկայությամբ։
            Սիրով հրավիրում ենք միասին նշելու մեր նշանադրության օրը։
          </p>
        </Reveal>
      </section>

      <Calendar />

      <section className="section location-section" id="location">
        <Reveal>
          <p className="kicker">ՀԱՆԴԻՊՄԱՆ ՎԱՅՐԸ</p>
          <h2>Տեղակայումը</h2>
        </Reveal>
        <Reveal className="venue-card" delay={120}>
          <div className="venue-icon"><LocationIcon /></div>
          <p className="venue-time">18:00</p>
          <h3>{CONFIG.restaurant}</h3>
          <p>{CONFIG.address}</p>
          <img className="venue-image" src={restaurantImage} alt={`${CONFIG.restaurant} ռեստորանի պատկեր`} />
          <a href={CONFIG.mapUrl} target="_blank" rel="noreferrer">Քարտեզ <span>↗</span></a>
        </Reveal>
      </section>

      <section className="section plan-section">
        <Reveal className="film-card plan-film">
          <FilmHoles />
          <p className="kicker light">ՄԵՐ ԵՐԵԿՈՆ</p>
          <h2>Օրվա ծրագիր</h2>
          <div className="timeline-list">
            {[
              ['18:00', 'Հյուրերի դիմավորում'],
              ['18:30', 'Նշանադրության արարողություն'],
              ['19:00', 'Ընթրիք և կենացներ'],
              ['21:00', 'Երաժշտություն և պար'],
            ].map(([time, text], i) => (
              <Reveal className="timeline-row" delay={i * 80} key={time}>
                <strong>{time}</strong>
                <i />
                <span>{text}</span>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="section dress-section">
        <Reveal>
          <p className="kicker">ՄԵՐ ԳՈՒՆԱՊՆԱԿԸ</p>
          <h2>DRESS CODE</h2>
          <p className="dress-copy">Ուրախ կլինենք, եթե Ձեր կերպարում օգտագործեք այս գունապնակին մոտ երանգներ։</p>
        </Reveal>
        <Reveal className="swatches" delay={100}>
          {['#160708', '#4b1118', '#71131f', '#9e4d50', '#ddcfc1'].map((color) => (
            <span key={color} style={{ backgroundColor: color }} />
          ))}
        </Reveal>

        <Reveal className="photo-slider" delay={180}>
          <button aria-label="Նախորդ լուսանկարը" onClick={() => setSlide((slide - 1 + sliderPhotos.length) % sliderPhotos.length)}>‹</button>
          <div className="slider-window">
            {sliderPhotos.map((photo, index) => (
              <img
                key={photo}
                src={photo}
                alt={`Զույգի լուսանկար ${index + 1}`}
                className={index === slide ? 'active' : ''}
              />
            ))}
          </div>
          <button aria-label="Հաջորդ լուսանկարը" onClick={() => setSlide((slide + 1) % sliderPhotos.length)}>›</button>
        </Reveal>
      </section>

      <Countdown />
      <RSVP />

      <section className="closing section">
        <Reveal>
          <img src={heart} alt="" aria-hidden="true" />
          <p>Սիրով սպասում ենք Ձեզ</p>
          <h2>{CONFIG.groom} և {CONFIG.bride}</h2>
        </Reveal>
      </section>
    </main>
  )
}

export default App
