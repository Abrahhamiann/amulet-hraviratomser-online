import { useEffect, useMemo, useRef, useState } from 'react'

import babyPhoto from './assets/images/baby.jpg'
import churchIcon from './assets/images/church.png'
import champagneIcon from './assets/images/champagne.png'
import angelIcon from './assets/images/angel.png'
import crossIcon from './assets/images/cross.png'
import baptismMusic from './assets/audio/baptism-music.mp3'


const CONFIG = {
  childName: 'Մարիա',

  dateISO: '2026-10-22T15:00:00+04:00',

  day: '22',
  month: 'ՀՈԿՏԵՄԲԵՐԻ',
  year: '2026',

  fullDate: '22.10.2026',

  rsvpDeadline: '01.10.2026',

  ceremony: {
    time: '15:00',
    title: 'Սուրբ Մկրտություն',
    place: 'Սուրբ Գրիգոր Լուսավորիչ մայր եկեղեցի',
    address: 'ք. Երևան, Երվանդ Քոչարի փ.',
    map: 'https://maps.google.com',
  },

  reception: {
    time: '17:00',
    title: 'Տոնական ընթրիք',
    place: 'DVIN MUSIC HALL',
    address: 'ք. Երևան, Պարոնյան 40',
    map: 'https://maps.google.com',
  },
}


/* =========================================================
   COUNTDOWN
========================================================= */

function useCountdown(target) {
  const calculate = () => {
    return Math.max(
      0,
      new Date(target).getTime() - Date.now()
    )
  }

  const [diff, setDiff] = useState(calculate)

  useEffect(() => {
    const timer = setInterval(() => {
      setDiff(calculate())
    }, 1000)

    return () => clearInterval(timer)
  }, [target])

  return {
    days: Math.floor(diff / 86400000),

    hours: Math.floor(
      (diff / 3600000) % 24
    ),

    minutes: Math.floor(
      (diff / 60000) % 60
    ),

    seconds: Math.floor(
      (diff / 1000) % 60
    ),
  }
}


/* =========================================================
   MUSIC ICON
========================================================= */

function MusicIcon({ playing }) {
  if (playing) {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <rect
          x="6"
          y="5"
          width="4"
          height="14"
          rx="1.5"
        />

        <rect
          x="14"
          y="5"
          width="4"
          height="14"
          rx="1.5"
        />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M8 5.2v13.6L19 12 8 5.2Z" />
    </svg>
  )
}


/* =========================================================
   EVENT CARD
========================================================= */

function EventCard({
  item,
  icon,
  reverse = false,
  number,
}) {
  return (
    <article
      className={`
        event-card
        venue-reveal
        ${reverse ? 'event-card-reverse' : ''}
      `}
    >
      <span className="event-number">
        {number}
      </span>

      <div className="event-icon-shell">
        <div className="event-icon-glow" />

        <img
          src={icon}
          alt=""
          className="event-icon"
        />
      </div>

      <div className="event-copy">
        <span className="event-label">
          {reverse
            ? 'Տոնական երեկո'
            : 'Մկրտության արարողություն'}
        </span>

        <span className="event-time">
          {item.time}
        </span>

        <h3>
          {item.title}
        </h3>

        <strong>
          {item.place}
        </strong>

        <p>
          {item.address}
        </p>

        <a
          href={item.map}
          target="_blank"
          rel="noreferrer"
        >
          <span>
            Ինչպես հասնել
          </span>

          <b>
            ↗
          </b>
        </a>
      </div>
    </article>
  )
}


/* =========================================================
   RSVP
========================================================= */

function RSVP() {
  const [attendance, setAttendance] =
    useState('yes')

  const [sent, setSent] =
    useState(false)

  const submit = (event) => {
    event.preventDefault()
    setSent(true)
  }

  return (
    <section
      className="rsvp-section section-shell reveal"
      id="rsvp"
    >
      <div className="rsvp-card">

        <div className="rsvp-decoration">
          <span />
          <img src={crossIcon} alt="" />
          <span />
        </div>

        <div className="rsvp-heading">

          <span className="eyebrow">
            Կհանդիպե՞նք
          </span>

          <h2>
            Հաստատեք Ձեր
            <br />
            ներկայությունը
          </h2>

          <p>
            Խնդրում ենք պատասխանել մինչև{' '}

            <b>
              {CONFIG.rsvpDeadline}
            </b>
          </p>

        </div>


        <form onSubmit={submit}>

          <label className="field">
            <span>
              Անուն / Ազգանուն
            </span>

            <input
              required
              type="text"
              placeholder="Գրեք Ձեր անունը"
            />
          </label>


          <div className="attendance">

            <button
              type="button"
              className={
                attendance === 'yes'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setAttendance('yes')
              }
            >
              <i />

              <span>
                Այո, սիրով կմասնակցեմ
              </span>
            </button>


            <button
              type="button"
              className={
                attendance === 'no'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setAttendance('no')
              }
            >
              <i />

              <span>
                Ցավոք, չեմ կարող գալ
              </span>
            </button>

          </div>


          <div className="form-row">

            <label className="field">
              <span>
                Հյուրերի քանակ
              </span>

              <input
                type="number"
                min="1"
                defaultValue="1"
                disabled={
                  attendance === 'no'
                }
              />
            </label>


            <label className="field">
              <span>
                Հեռախոս
              </span>

              <input
                type="tel"
                placeholder="+374 ..."
              />
            </label>

          </div>


          <label className="field">
            <span>
              Մեկնաբանություն
            </span>

            <textarea
              rows="3"
              placeholder="Ցանկության դեպքում թողեք հաղորդագրություն"
            />
          </label>


          <button
            className="submit-button"
            type="submit"
          >
            <span>
              Ուղարկել
            </span>

            <b>
              →
            </b>
          </button>


          {sent && (
            <p className="success-message">
              Շնորհակալություն 🤍 Ձեր պատասխանը պահպանվեց։
            </p>
          )}

        </form>

      </div>
    </section>
  )
}


/* =========================================================
   APP
========================================================= */

export default function App() {
  const audioRef = useRef(null)

  const [playing, setPlaying] =
    useState(false)


  const countdown =
    useCountdown(
      CONFIG.dateISO
    )


  const countdownItems =
    useMemo(
      () => [
        [
          String(countdown.days)
            .padStart(2, '0'),
          'օր',
        ],

        [
          String(countdown.hours)
            .padStart(2, '0'),
          'ժամ',
        ],

        [
          String(countdown.minutes)
            .padStart(2, '0'),
          'րոպե',
        ],

        [
          String(countdown.seconds)
            .padStart(2, '0'),
          'վայրկյան',
        ],
      ],
      [countdown]
    )


  /* =====================================================
     NORMAL REVEAL
  ===================================================== */

  useEffect(() => {
    const elements =
      document.querySelectorAll('.reveal')

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in')

              observer.unobserve(
                entry.target
              )
            }
          })
        },
        {
          threshold: 0.12,
          rootMargin:
            '0px 0px -60px 0px',
        }
      )

    elements.forEach((element) => {
      observer.observe(element)
    })

    return () => {
      observer.disconnect()
    }
  }, [])


  /* =====================================================
     VENUE CARDS REVEAL
  ===================================================== */

  useEffect(() => {
    const cards =
      document.querySelectorAll(
        '.venue-reveal'
      )

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(
                'in'
              )

              observer.unobserve(
                entry.target
              )
            }
          })
        },
        {
          threshold: 0.18,
          rootMargin:
            '0px 0px -14% 0px',
        }
      )

    cards.forEach((card) => {
      observer.observe(card)
    })

    return () => {
      observer.disconnect()
    }
  }, [])


  /* =====================================================
     MUSIC
  ===================================================== */

  useEffect(() => {
    const audio =
      audioRef.current

    if (!audio) return

    audio.volume = 0.45
    audio.loop = true

    const tryPlay = async () => {
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    }

    tryPlay()


    const unlock = async (event) => {
      if (
        event.target.closest?.(
          '.music-button'
        )
      ) {
        return
      }

      if (audio.paused) {
        try {
          await audio.play()
          setPlaying(true)
        } catch {
          // browser blocked autoplay
        }
      }

      window.removeEventListener(
        'pointerdown',
        unlock
      )
    }


    window.addEventListener(
      'pointerdown',
      unlock,
      {
        passive: true,
      }
    )


    return () => {
      window.removeEventListener(
        'pointerdown',
        unlock
      )
    }
  }, [])


  const toggleMusic = async () => {
    const audio =
      audioRef.current

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

      <audio
        ref={audioRef}
        src={baptismMusic}
        preload="auto"
        loop
      />


      {/* MUSIC BUTTON */}

      <button
        className={`
          music-button
          ${playing ? 'playing' : ''}
        `}
        onClick={toggleMusic}
        aria-label={
          playing
            ? 'Անջատել երաժշտությունը'
            : 'Միացնել երաժշտությունը'
        }
      >
        <MusicIcon playing={playing} />
      </button>


      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero">

        <div className="hero-photo-wrap">

          <img
            src={babyPhoto}
            className="hero-photo"
            alt="Փոքրիկ"
          />

          <div className="hero-overlay" />


          <div className="hero-content">

            <img
              src={crossIcon}
              className="hero-cross"
              alt=""
            />

            <span className="hero-name">
              {CONFIG.childName}
            </span>

            <h1>
              ՍՈՒՐԲ
              <br />
              ՄԿՐՏՈՒԹՅՈՒՆ
            </h1>

            <p>
              {CONFIG.fullDate}
            </p>

          </div>

        </div>


        <div
          className="hero-ornament"
          aria-hidden="true"
        >
          <span />
          <i />
          <span />
        </div>


        <a
          className="scroll-cue"
          href="#invitation"
        >
          <span>
            Բացել հրավերը
          </span>

          <b>
            ↓
          </b>
        </a>

      </section>


      {/* =================================================
          INVITATION
      ================================================= */}

      <section
        className="invitation-section"
        id="invitation"
      >

        {/* LEFT ANGEL */}

        <div
          className="
            angel-shell
            angel-shell-left
          "
          aria-hidden="true"
        >
          <div className="angel-halo" />

          <img
            src={angelIcon}
            className="angel angel-left"
            alt=""
          />
        </div>


        {/* RIGHT ANGEL */}

        <div
          className="
            angel-shell
            angel-shell-right
          "
          aria-hidden="true"
        >
          <div className="angel-halo" />

          <img
            src={angelIcon}
            className="angel angel-right"
            alt=""
          />
        </div>


        <div className="invitation-copy reveal">

          <span className="eyebrow">
            Սիրելի հյուրեր
          </span>

          <h2>
            Սիրով հրավիրում ենք Ձեզ
          </h2>

          <p>
            մեզ հետ կիսելու{' '}
            {CONFIG.childName}-ի կյանքի
            այս լուսավոր ու օրհնված օրը՝
            Սուրբ Մկրտության խորհուրդը։
            {' '}
            Ձեր ներկայությունը մեր տոնը
            կդարձնի ավելի ջերմ և հիշարժան։
          </p>

        </div>


        <div className="date-emblem reveal">

          <span>
            {CONFIG.day}
          </span>

          <strong>
            {CONFIG.month}
          </strong>

          <small>
            {CONFIG.year}
          </small>

        </div>


        {/* =================================================
            LOCATIONS — NO ROADMAP
        ================================================= */}

        <div className="locations-section">

          <div className="locations-heading reveal">

            <span className="eyebrow">
              Օրվա վայրերը
            </span>

            <h2>
              Մեր տոնական օրվա
              <br />
              կարևոր վայրերը
            </h2>

            <p>
              Scroll արեք ներքև՝ վայրերը հերթով բացահայտելու համար
            </p>

          </div>


          <div className="events-grid">

            <EventCard
              number="01"
              item={CONFIG.ceremony}
              icon={churchIcon}
            />


            <EventCard
              number="02"
              item={CONFIG.reception}
              icon={champagneIcon}
              reverse
            />

          </div>

        </div>

      </section>


      {/* =================================================
          COUNTDOWN
      ================================================= */}

      <section
        className="
          photo-countdown
          section-shell
          reveal
        "
      >

        <div className="countdown-photo">

          <img
            src={babyPhoto}
            alt="Փոքրիկ"
          />

          <div className="countdown-shade" />


          <span className="countdown-title">
            ՄԿՐՏՈՒԹՅԱՆԸ ՄՆԱՑ
          </span>


          <div className="countdown-grid">

            {countdownItems.map(
              ([value, label]) => (
                <div key={label}>

                  <strong>
                    {value}
                  </strong>

                  <small>
                    {label}
                  </small>

                </div>
              )
            )}

          </div>

        </div>

      </section>


      {/* =================================================
          BLESSING
      ================================================= */}

      <section
        className="
          blessing-section
          section-shell
          reveal
        "
      >

        <div className="blessing-angel-shell">

          <div className="blessing-halo" />

          <img
            src={angelIcon}
            className="blessing-angel"
            alt=""
          />

        </div>


        <div className="blessing-copy">

          <img
            src={crossIcon}
            className="blessing-cross"
            alt=""
          />

          <span className="eyebrow">
            Մի փոքր խնդրանք
          </span>

          <h2>
            Թող այս օրը մնա
            <br />
            ջերմ հիշողություն
          </h2>

          <p>
            Սիրով խնդրում ենք տոնին
            ներկայանալ խաղաղ, բաց և
            նուրբ երանգներով։
            {' '}
            Ամենաթանկ նվերը մեզ համար
            Ձեր ներկայությունն ու
            օրհնությունն է։
          </p>


          <div
            className="palette"
            aria-label="Հագուստի գունապնակ"
          >
            {[
              '#2f3031',
              '#6a6562',
              '#9b8f87',
              '#c8aa96',
              '#e4d2c1',
              '#f6f0e9',
            ].map((color) => (
              <i
                key={color}
                style={{
                  background: color,
                }}
              />
            ))}
          </div>

        </div>

      </section>


      {/* =================================================
          RSVP
      ================================================= */}

      <RSVP />


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="footer reveal">

        <div className="footer-line" />

        <img
          src={crossIcon}
          alt=""
        />

        <span>
          Սիրով սպասում ենք Ձեզ
        </span>

        <h2>
          {CONFIG.childName}
        </h2>

        <small>
          {CONFIG.fullDate}
        </small>

      </footer>

    </main>
  )
}
