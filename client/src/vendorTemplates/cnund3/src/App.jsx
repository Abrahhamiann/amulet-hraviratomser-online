import { useEffect, useMemo, useRef, useState } from 'react'
import cocktails from './assets/images/cocktails.png'
import cakeIcon from './assets/images/cake.png'
import dinnerIcon from './assets/images/dinner.png'
import musicIcon from './assets/images/music.png'
import martiniIcon from './assets/images/martini.png'

const CONFIG = {
  name: 'Anna',
  age: 18,
  dateISO: '2027-07-09T17:00:00+04:00',
  month: 'July',
  day: '09',
  year: '2027',
  time: '17:00',
  venue: 'Dvin Music Hall',
  address: '40 Paronyan St, Yerevan',
  map: 'https://maps.google.com',
  rsvpDeadline: '01.07.2027',
}

function useCountdown(target) {
  const calc = () => Math.max(0, new Date(target).getTime() - Date.now())
  const [diff, setDiff] = useState(calc)

  useEffect(() => {
    const id = setInterval(() => setDiff(calc()), 1000)
    return () => clearInterval(id)
  }, [target])

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function RSVP() {
  const [attendance, setAttendance] = useState('yes')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className="rsvp section reveal" id="rsvp">
      <div className="rsvp-card">
        <span className="script eyebrow-script">RSVP</span>
        <h2>Կհանդիպե՞նք տոնին</h2>
        <p className="rsvp-lead">
          Խնդրում եմ հաստատել Ձեր ներկայությունը մինչև <b>{CONFIG.rsvpDeadline}</b>
        </p>

        <form onSubmit={submit}>
          <label className="field">
            <span>Անուն / ազգանուն</span>
            <input required type="text" placeholder="Գրեք Ձեր անունը" />
          </label>

          <div className="attendance">
            <button
              type="button"
              className={attendance === 'yes' ? 'active' : ''}
              onClick={() => setAttendance('yes')}
            >
              <i /> Սիրով կմասնակցեմ
            </button>
            <button
              type="button"
              className={attendance === 'no' ? 'active' : ''}
              onClick={() => setAttendance('no')}
            >
              <i /> Ցավոք, չեմ կարող գալ
            </button>
          </div>

          <div className="form-row">
            <label className="field">
              <span>Հյուրերի քանակ</span>
              <input type="number" min="1" defaultValue="1" disabled={attendance === 'no'} />
            </label>
            <label className="field">
              <span>Հեռախոս</span>
              <input type="tel" placeholder="+374 ..." />
            </label>
          </div>

          <label className="field">
            <span>Հաղորդագրություն</span>
            <textarea rows="3" placeholder="Ցանկության դեպքում թողեք փոքրիկ հաղորդագրություն" />
          </label>

          <button className="submit" type="submit">Ուղարկել <span>→</span></button>
          {sent && <p className="success">Շնորհակալություն ♥ Պատասխանը պահպանվեց։</p>}
        </form>
      </div>
    </section>
  )
}

export default function App() {
  const countdown = useCountdown(CONFIG.dateISO)

  const countdownItems = useMemo(
    () => [
      [String(countdown.days).padStart(2, '0'), 'օր'],
      [String(countdown.hours).padStart(2, '0'), 'ժամ'],
      [String(countdown.minutes).padStart(2, '0'), 'րոպե'],
      [String(countdown.seconds).padStart(2, '0'), 'վայրկյան'],
    ],
    [countdown],
  )

  const timeline = [
    { time: '17:00', text: 'Հյուրերի դիմավորում և welcome drinks', icon: martiniIcon },
    { time: '18:00', text: 'Ընթրիք և տոնական սեղան', icon: dinnerIcon },
    { time: '19:00', text: 'Երաժշտություն և պարեր', icon: musicIcon },
    { time: '20:00', text: 'Տորթի պահը', icon: cakeIcon },
  ]

  useEffect(() => {
    const items = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -50px 0px' },
    )
    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-number" aria-hidden="true">{CONFIG.age}</div>
        <div className="hero-line" aria-hidden="true" />
        <div className="hero-heart" aria-hidden="true">♡</div>

        <div className="hero-copy">
          <h1 className="script">{CONFIG.name}'s<br />birthday</h1>
          <p className="hero-sub">LET'S CELEBRATE</p>
          <a href="#details" className="hero-scroll">discover ↓</a>
        </div>

        <img className="hero-cocktails" src={cocktails} alt="Birthday cocktails" />
      </section>

      <section className="details section reveal" id="details">
        <span className="script section-script">Save the date</span>

        <div className="date-row">
          <div className="date-side"><span>{CONFIG.month}</span></div>
          <strong>{CONFIG.day}</strong>
          <div className="date-side"><span>{CONFIG.time}</span></div>
        </div>

        <div className="invite-copy">
          <h2 className="script">It's time to celebrate my<br />{CONFIG.age}th birthday!</h2>
          <p>
            Սիրելի ընկերներ, սիրով հրավիրում եմ ձեզ իմ ծննդյան տոնին։
            Եկեք միասին անցկացնենք գեղեցիկ երեկո՝ լի երաժշտությամբ,
            ուրախությամբ և անմոռանալի պահերով։
          </p>
        </div>

        <div className="venue-block reveal">
          <span className="script venue-title">Restaurant</span>
          <h3>{CONFIG.venue}</h3>
          <p>{CONFIG.address}</p>
          <a href={CONFIG.map} target="_blank" rel="noreferrer">Քարտեզ ↗</a>
        </div>
      </section>

      <section className="countdown section reveal">
        <span className="script section-script">The event will start</span>
        <div className="countdown-grid">
          {countdownItems.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="timeline section" id="timeline">
        <div className="timeline-heading reveal">
          <span className="script section-script">Timeline</span>
          <p>Օրվա փոքրիկ ծրագիրը</p>
        </div>

        <div className="timeline-list">
          {timeline.map((item, index) => (
            <article className="timeline-item reveal" key={item.time} style={{ '--delay': `${index * 80}ms` }}>
              <div className="timeline-icon-shell">
                <img src={item.icon} alt="" />
              </div>
              <strong>{item.time}</strong>
              <p>{item.text}</p>
              {index < timeline.length - 1 && <div className="timeline-arrow">⌄</div>}
            </article>
          ))}
        </div>
      </section>

      <section className="dress section reveal">
        <span className="script section-script">Dress code</span>
        <p>Կարմիր, վարդագույն և նուրբ փոշոտ երանգներ</p>
        <div className="palette" aria-label="Dress code colors">
          {['#b50010', '#d04450', '#e56f7a', '#f19aa4', '#f7c5cc'].map((color) => (
            <i key={color} style={{ backgroundColor: color }} />
          ))}
        </div>
        <p className="script waiting">I will be waiting for all of you with love, your Anna.</p>
      </section>

      <RSVP />

      <footer className="footer reveal">
        <div className="footer-heart">♡</div>
        <span className="script">See you there</span>
        <small>{CONFIG.day}.{CONFIG.month}.{CONFIG.year}</small>
      </footer>
    </main>
  )
}
