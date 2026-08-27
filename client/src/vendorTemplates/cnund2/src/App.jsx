import { useEffect, useMemo, useRef, useState } from 'react'

import background from './assets/images/background.png'
import flowers from './assets/images/flowers.png'
import birthdaySong from './assets/audio/happy-birthday.mp3'


const CONFIG = {
  name: 'Արմեն',
  age: 2,

  dateISO: '2026-07-26T18:00:00+04:00',
  dateText: '26 Հուլիսի 2026',

  time: '18:00',

  venue: '«Տորենա» ռեստորան',
  address: 'Երևան, Աբովյան 12',

  mapUrl: 'https://maps.google.com',

  rsvpDeadline: '15.07.2026',
}


/* ======================================================
   COUNTDOWN
====================================================== */

function useCountdown(target) {
  const calc = () =>
    Math.max(
      0,
      new Date(target).getTime() - Date.now()
    )

  const [diff, setDiff] = useState(calc)

  useEffect(() => {
    const id = setInterval(() => {
      setDiff(calc())
    }, 1000)

    return () => clearInterval(id)
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


/* ======================================================
   MUSIC ICON
====================================================== */

function MusicIcon({ playing }) {
  if (playing) {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <rect
          x="6.3"
          y="5"
          width="3.2"
          height="14"
          rx="1.2"
        />

        <rect
          x="14.5"
          y="5"
          width="3.2"
          height="14"
          rx="1.2"
        />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="
          M9 5
          v10.2
          a3.1 3.1 0 1 0 2 2.9
          V9.4
          l6-1.6
          v5.7
          a3.1 3.1 0 1 0 2 2.9
          V4.5
          L9 7
          V5Z
        "
      />
    </svg>
  )
}


/* ======================================================
   CAKE ICON
====================================================== */

function CakeIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <path
        d="
          M17 28
          h30
          a6 6 0 0 1 6 6
          v17
          H11
          V34
          a6 6 0 0 1 6-6Z
        "
      />

      <path
        d="
          M11 38
          c7 4 11-4 18 0
          s11-4 18 0
          6-2 6-2
        "
      />

      <path d="M18 51v5M46 51v5M12 56h40" />

      <path
        d="
          M32 11
          c5 5 3 10 0 12
          -3-2-5-7 0-12Z
        "
      />

      <path d="M32 23v5" />
    </svg>
  )
}


/* ======================================================
   PIN ICON
====================================================== */

function PinIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <path
        d="
          M32 57
          S14 39 14 25
          a18 18 0 1 1 36 0
          c0 14-18 32-18 32Z
        "
      />

      <circle
        cx="32"
        cy="25"
        r="6"
      />
    </svg>
  )
}


/* ======================================================
   GIFT ICON
====================================================== */

function GiftIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <rect
        x="10"
        y="27"
        width="44"
        height="29"
        rx="3"
      />

      <path d="M8 20h48v10H8zM32 20v36" />

      <path
        d="
          M31 20
          c-7-1-14-3-14-9
          0-4 3-6 6-5
          6 1 8 9 8 14Z

          M33 20
          c7-1 14-3 14-9
          0-4-3-6-6-5
          -6 1-8 9-8 14Z
        "
      />
    </svg>
  )
}


/* ======================================================
   CALENDAR
====================================================== */

function Calendar() {
  const month = 6
  const year = 2026
  const selected = 26

  const first =
    new Date(year, month, 1).getDay()

  const days =
    new Date(
      year,
      month + 1,
      0
    ).getDate()

  const cells = [
    ...Array(first).fill(null),

    ...Array.from(
      { length: days },
      (_, i) => i + 1
    ),
  ]

  const weekdays = [
    'Կիր',
    'Երկ',
    'Երք',
    'Չոր',
    'Հնգ',
    'Ուր',
    'Շբ',
  ]

  return (
    <div className="calendar-card reveal">
      <div className="calendar-title">
        Հուլիս
        {' '}
        <span>
          2026
        </span>
      </div>

      <div className="week-row">
        {weekdays.map((day) => (
          <span key={day}>
            {day}
          </span>
        ))}
      </div>

      <div className="days-grid">
        {cells.map((day, index) => {
          if (!day) {
            return (
              <span
                key={`empty-${index}`}
              />
            )
          }

          return (
            <span
              key={day}
              className={
                day === selected
                  ? 'selected'
                  : ''
              }
            >
              {day}
            </span>
          )
        })}
      </div>
    </div>
  )
}


/* ======================================================
   ROADMAP
====================================================== */

function Roadmap() {
  const steps = [
    {
      time: '17:30',

      title:
        'Հյուրերի դիմավորում',

      text:
        'Հանդիպում ենք, ժպտում ու սկսում տոնը',

      icon:
        <PinIcon />,
    },

    {
      time: '18:00',

      title:
        'Ծննդյան խնջույք',

      text:
        'Խաղեր, երաժշտություն ու ուրախ պահեր',

      icon:
        <GiftIcon />,
    },

    {
      time: '19:30',

      title:
        'Տորթի պահը',

      text:
        'Մոմեր, ցանկություն և ամենաքաղցր պահը',

      icon:
        <CakeIcon />,
    },
  ]

  return (
    <section
      className="
        roadmap-section
        section-shell
        reveal
      "
    >
      <div className="section-heading">
        <span>
          Օրվա ծրագիր
        </span>

        <h2>
          Մեր փոքրիկ տոնի
          ճանապարհը
        </h2>
      </div>

      <div className="roadmap">
        <div
          className="road-line"
          aria-hidden="true"
        />

        {steps.map(
          (step, index) => (
            <article
              className="road-step"
              key={step.time}
              style={{
                '--delay':
                  `${index * 120}ms`,
              }}
            >
              <div className="road-icon">
                {step.icon}
              </div>

              <div className="road-copy">
                <strong>
                  {step.time}
                </strong>

                <h3>
                  {step.title}
                </h3>

                <p>
                  {step.text}
                </p>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  )
}


/* ======================================================
   RSVP
====================================================== */

function RSVP() {
  const [
    attending,
    setAttending,
  ] = useState('yes')

  const [
    sent,
    setSent,
  ] = useState(false)

  const submit = (event) => {
    event.preventDefault()

    setSent(true)
  }

  return (
    <section
      className="
        rsvp-wrap
        section-shell
        reveal
      "
      id="rsvp"
    >
      <div
        className="
          rsvp-decor
          rsvp-decor-left
        "
        aria-hidden="true"
      >
        <img
          src={flowers}
          alt=""
        />
      </div>

      <div
        className="
          rsvp-decor
          rsvp-decor-right
        "
        aria-hidden="true"
      >
        <img
          src={flowers}
          alt=""
        />
      </div>


      <div
        className="
          section-heading
          rsvp-heading
        "
      >
        <span>
          Կհանդիպե՞նք
        </span>

        <h2>
          Սիրով սպասում ենք
          Ձեր պատասխանին
        </h2>

        <p>
          Խնդրում ենք հաստատել
          մասնակցությունը մինչև{' '}
          {CONFIG.rsvpDeadline}
        </p>
      </div>


      <form
        className="rsvp-form"
        onSubmit={submit}
      >
        <label className="field full">
          <span>
            Անուն Ազգանուն
          </span>

          <input
            required
            placeholder="Գրեք Ձեր անունը"
          />
        </label>


        <div
          className="attendance"
          role="group"
          aria-label="Մասնակցություն"
        >
          <button
            type="button"
            className={
              attending === 'yes'
                ? 'active'
                : ''
            }
            onClick={() =>
              setAttending('yes')
            }
          >
            <i />

            Այո, սիրով կգամ
          </button>


          <button
            type="button"
            className={
              attending === 'no'
                ? 'active'
                : ''
            }
            onClick={() =>
              setAttending('no')
            }
          >
            <i />

            Ցավոք, չեմ կարող գալ
          </button>
        </div>


        <div className="form-grid">
          <label className="field">
            <span>
              Հյուրերի քանակ
            </span>

            <input
              type="number"
              min="1"
              defaultValue="1"
              disabled={
                attending === 'no'
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


        <label className="field full">
          <span>
            Մեկնաբանություն
          </span>

          <textarea
            rows="3"
            placeholder="
              Ցանկության դեպքում
              թողեք հաղորդագրություն
            "
          />
        </label>


        <button
          className="submit-btn"
          type="submit"
        >
          Ուղարկել պատասխանը
        </button>


        {sent && (
          <div className="thanks">
            Շնորհակալություն 🤍
            Ձեր պատասխանը պահպանվեց։
          </div>
        )}
      </form>
    </section>
  )
}


/* ======================================================
   APP
====================================================== */

export default function App() {
  const audioRef = useRef(null)

  const [
    playing,
    setPlaying,
  ] = useState(false)

  const countdown =
    useCountdown(
      CONFIG.dateISO
    )


  const countdownItems =
    useMemo(
      () => [
        [
          String(
            countdown.days
          ).padStart(2, '0'),
          'Օր',
        ],

        [
          String(
            countdown.hours
          ).padStart(2, '0'),
          'Ժամ',
        ],

        [
          String(
            countdown.minutes
          ).padStart(2, '0'),
          'Րոպե',
        ],

        [
          String(
            countdown.seconds
          ).padStart(2, '0'),
          'Վայրկյան',
        ],
      ],

      [countdown]
    )


  /* SCROLL REVEAL */

  useEffect(() => {
    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                entry.isIntersecting
              ) {
                entry.target.classList.add(
                  'in'
                )

                observer.unobserve(
                  entry.target
                )
              }
            }
          )
        },

        {
          threshold: 0.12,

          rootMargin:
            '0px 0px -50px 0px',
        }
      )

    document
      .querySelectorAll('.reveal')
      .forEach(
        (element) =>
          observer.observe(element)
      )

    return () =>
      observer.disconnect()
  }, [])


  /* AUTOPLAY */

  useEffect(() => {
    const audio =
      audioRef.current

    if (!audio) {
      return
    }

    audio.volume = 0.55
    audio.loop = true


    const tryAutoplay =
      async () => {
        try {
          await audio.play()

          setPlaying(true)
        } catch {
          setPlaying(false)
        }
      }


    tryAutoplay()


    const unlock =
      async (event) => {
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
            // Browser blocked autoplay
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


  /* MUSIC BUTTON */

  const toggleMusic =
    async () => {
      const audio =
        audioRef.current

      if (!audio) {
        return
      }


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
    <main
      className="page"
      style={{
        '--page-bg':
          `url(${background})`,
      }}
    >
      <audio
        ref={audioRef}
        src={birthdaySong}
        preload="auto"
        loop
      />


      {/* MUSIC */}

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
        <MusicIcon
          playing={playing}
        />

        <span>
          {playing
            ? 'Երգը միացված է'
            : 'Միացնել երգը'}
        </span>
      </button>


      {/* HERO */}

      <section className="hero">
        <div className="hero-glow" />


        <img
          src={flowers}
          alt=""
          className="
            hero-flower
            hero-flower-a
          "
        />


        <img
          src={flowers}
          alt=""
          className="
            hero-flower
            hero-flower-b
          "
        />


        <div className="hero-copy reveal in">
          <span className="hero-kicker">
            Սիրելի բարեկամներ
          </span>


          <h1>
            Հրավիրում ենք Ձեզ
            <br />

            մեր փոքրիկ{' '}

            <em>
              {CONFIG.name}
            </em>
            -ի

            <br />

            ծննդյան տոնին
          </h1>


          <div
            className="age-composition"
            aria-label={
              `${CONFIG.age} տարեկան`
            }
          >
            <div className="age-number">
              {CONFIG.age}
            </div>

            <img
              src={flowers}
              alt=""
              className="age-flowers"
            />

            <span className="age-label">
              տարեկան
            </span>
          </div>


          <p className="hero-note">
            Միասին ստեղծենք
            գունավոր հիշողություններով
            լի մի օր։
          </p>


          <a
            className="scroll-link"
            href="#details"
          >
            Բացահայտել հրավերը

            <b>
              ↓
            </b>
          </a>
        </div>
      </section>


      {/* INTRO */}

      <section
        className="
          intro-section
          section-shell
          reveal
        "
        id="details"
      >
        <div className="section-heading">
          <span>
            Սիրով սպասում ենք Ձեզ
          </span>

          <h2>
            {CONFIG.dateText}
          </h2>

          <p>
            Մեր փոքրիկի ժպիտը
            այս օրը ավելի պայծառ
            կլինի Ձեր ներկայությամբ։
          </p>
        </div>

        <Calendar />
      </section>


      {/* COUNTDOWN */}

      <section
        className="
          countdown-section
          reveal
        "
      >
        <div className="countdown-card">
          <span className="countdown-kicker">
            Մինչև տոնը մնացել է
          </span>

          <div className="countdown-grid">
            {countdownItems.map(
              ([value, label]) => (
                <div
                  className="count-item"
                  key={label}
                >
                  <strong>
                    {value}
                  </strong>

                  <span>
                    {label}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </section>


      {/* VENUE */}

      <section
        className="
          venue-section
          section-shell
          reveal
        "
      >
        <div className="section-heading">
          <span>
            Վայր և ժամ
          </span>

          <h2>
            Հանդիպում ենք այստեղ
          </h2>
        </div>


        <div className="venue-card">
          <div className="venue-icon">
            <PinIcon />
          </div>

          <div className="venue-copy">
            <span className="venue-time">
              {CONFIG.time}
            </span>

            <h3>
              {CONFIG.venue}
            </h3>

            <p>
              {CONFIG.address}
            </p>

            <a
              href={CONFIG.mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              Ինչպես հասնել
            </a>
          </div>
        </div>
      </section>


      <Roadmap />


      {/* GIFT */}

      <section
        className="
          wish-section
          reveal
        "
      >
        <div className="wish-card">
          <GiftIcon />

          <div>
            <span>
              Մի փոքր խնդրանք
            </span>

            <h2>
              Ձեր ներկայությունը
              մեր լավագույն նվերն է
            </h2>

            <p>
              Եթե ցանկանաք նաև նվեր բերել,
              ընտրեք այն, ինչը կուրախացնի
              փոքրիկին և կդառնա ջերմ
              հիշողություն։
            </p>
          </div>
        </div>
      </section>


      <RSVP />


      {/* FOOTER */}

      <footer className="footer">
        <img
          src={flowers}
          alt=""
        />

        <span>
          Սիրով՝ {CONFIG.name}-ի
          ընտանիքը
        </span>

        <small>
          {CONFIG.dateText}
        </small>
      </footer>
    </main>
  )
}
