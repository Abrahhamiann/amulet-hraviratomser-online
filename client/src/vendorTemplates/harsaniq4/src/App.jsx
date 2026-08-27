import {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import {
  CalendarDays,
  Church,
  GlassWater,
  MapPin,
  Send,
  Sparkles
} from 'lucide-react'

import worldMap from './assets/images/world-map.png'
import heart from './assets/images/heart.png'
import coupleOne from './assets/images/couple-one.jpg'
import coupleTwo from './assets/images/couple-two.jpg'


const CONFIG = {
  bride: 'Աննա',
  groom: 'Արմեն',

  dateISO: '2026-08-27T15:00:00+04:00',

  day: 27,
  monthIndex: 7,
  month: 'Օգոստոս',
  year: 2026,

  rsvpDeadline: '20.08.2026',

  ceremony: {
    time: '15:00',
    title: 'Պսակադրություն',
    place: 'Սուրբ Գրիգոր Նարեկացի եկեղեցի',
    address: 'Վանաձոր',
    map: 'https://maps.google.com',
  },

  welcome: {
    time: '16:30',
    title: 'Հյուրերի դիմավորում',
    place: '«ՎԱՆ» ռեստորան',
    address: 'Վանաձոր, Աբովյան 104',
    map: 'https://maps.google.com',
  },

  reception: {
    time: '17:00',
    title: 'Հարսանեկան խնջույք',
    place: '«ՎԱՆ» ռեստորան',
    address: 'Վանաձոր',
    map: 'https://maps.google.com',
  },
}


/* =========================================================
   COUNTDOWN
========================================================= */

function useCountdown(target) {
  const getDiff = () => {
    return Math.max(
      0,
      new Date(target).getTime() - Date.now()
    )
  }

  const [diff, setDiff] = useState(getDiff)

  useEffect(() => {
    const timer = setInterval(() => {
      setDiff(getDiff())
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
   HERO MOVING TEXT
========================================================= */

function LoveBands() {
  const phrase = 'I Love You'

  return (
    <div
      className="love-bands"
      aria-hidden="true"
    >
      {Array.from(
        { length: 4 },
        (_, row) => (
          <div
            className={`
              love-row
              love-row-${row + 1}
            `}
            key={row}
          >
            {Array.from(
              { length: 8 },
              (_, index) => (
                <span key={index}>
                  {phrase}
                </span>
              )
            )}
          </div>
        )
      )}
    </div>
  )
}


/* =========================================================
   CALENDAR
========================================================= */

function Calendar() {
  const first = new Date(
    CONFIG.year,
    CONFIG.monthIndex,
    1
  ).getDay()

  const count = new Date(
    CONFIG.year,
    CONFIG.monthIndex + 1,
    0
  ).getDate()

  const cells = [
    ...Array(first).fill(null),

    ...Array.from(
      { length: count },
      (_, i) => i + 1
    ),
  ]

  const week = [
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
        {CONFIG.month.toUpperCase()}

        {' '}

        <span>
          {CONFIG.year}
        </span>
      </div>


      <div className="week-row">
        {week.map((day) => (
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

          const selected =
            day === CONFIG.day

          return (
            <span
              className={
                selected
                  ? 'selected-day'
                  : ''
              }
              key={day}
            >

              {selected && (
                <img
                  src={heart}
                  alt=""
                />
              )}

              <b>
                {day}
              </b>

            </span>
          )
        })}

      </div>


      <div className="save-date latin-script">
        save our date!
      </div>

    </div>
  )
}


/* =========================================================
   SCROLL ROADMAP
========================================================= */

function Roadmap() {
  const stageRef = useRef(null)
  const pathRef = useRef(null)

  const [route, setRoute] = useState({
    progress: 0,
    x: 0,
    y: 0,
    ready: false,
  })


  const steps = [
    {
      ...CONFIG.ceremony,
      icon: <Church />,
    },

    {
      ...CONFIG.welcome,
      icon: <MapPin />,
    },

    {
      ...CONFIG.reception,
      icon: <GlassWater />,
    },
  ]


  useEffect(() => {
    let frame = null

    const updateRoute = () => {
      const stage = stageRef.current
      const path = pathRef.current

      if (!stage || !path) {
        return
      }

      const rect =
        stage.getBoundingClientRect()

      const viewportHeight =
        window.innerHeight

      /*
        START:
        roadmap-ի վերևը հասնում է viewport-ի մոտ 72%-ին

        END:
        roadmap-ի վերջը հասնում է viewport-ի մոտ 22%-ին
      */

      const startTop =
        viewportHeight * 0.72

      const endTop =
        viewportHeight * 0.22 -
        rect.height

      const totalScroll =
        startTop - endTop

      let progress =
        (
          startTop -
          rect.top
        ) / totalScroll

      progress = Math.max(
        0,
        Math.min(1, progress)
      )


      /*
        SVG path-ի իրական երկարությունը
      */

      const pathLength =
        path.getTotalLength()

      const point =
        path.getPointAtLength(
          pathLength * progress
        )


      /*
        SVG viewBox = 760 x 980

        point-ը դարձնում ենք
        իրական HTML stage coordinate
      */

      const x =
        (
          point.x / 760
        ) * rect.width

      const y =
        (
          point.y / 980
        ) * rect.height


      setRoute({
        progress,
        x,
        y,
        ready: true,
      })
    }


    const scheduleUpdate = () => {
      if (frame) {
        cancelAnimationFrame(frame)
      }

      frame = requestAnimationFrame(
        updateRoute
      )
    }


    window.addEventListener(
      'scroll',
      scheduleUpdate,
      { passive: true }
    )

    window.addEventListener(
      'resize',
      scheduleUpdate
    )


    let observer = null

    if (
      typeof ResizeObserver !==
      'undefined'
    ) {
      observer =
        new ResizeObserver(
          scheduleUpdate
        )

      if (stageRef.current) {
        observer.observe(
          stageRef.current
        )
      }
    }


    scheduleUpdate()


    return () => {
      window.removeEventListener(
        'scroll',
        scheduleUpdate
      )

      window.removeEventListener(
        'resize',
        scheduleUpdate
      )

      observer?.disconnect()

      if (frame) {
        cancelAnimationFrame(frame)
      }
    }
  }, [])


  /*
    Սրտիկը երբ մոտենում է կանգառին,
    համապատասխան card-ը բացվում է։
  */

  const revealPoints = [
    0.10,
    0.38,
    0.67,
  ]


  return (
    <section
      className="
        roadmap-section
        section-shell
      "
      id="roadmap"
    >

      <div className="roadmap-heading reveal">

        <span>
          Օրվա ճանապարհը
        </span>

        <h2>
          Մեր սիրո քարտեզը
        </h2>

        <p>
          Երեք կանգառ, մեկ պատմություն և
          մի ամբողջ կյանք՝ միասին։
        </p>

      </div>


      <div
        className="route-stage"
        ref={stageRef}
      >

        {/* MAP */}

        <img
          src={worldMap}
          className="world-map"
          alt=""
        />


        {/* ROAD */}

        <svg
          className="route-line"
          viewBox="0 0 760 980"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            ref={pathRef}
            d="
              M410 70
              C180 210,
              620 330,
              330 470
              C120 575,
              610 680,
              370 910
            "
          />
        </svg>


        {/* MOVING HEART */}

        <div
          className={`
            route-traveller
            ${
              route.ready
                ? 'route-traveller-ready'
                : ''
            }
          `}
          style={{
            left: `${route.x}px`,
            top: `${route.y}px`,
          }}
          aria-hidden="true"
        >
          <img
            src={heart}
            alt=""
          />
        </div>


        {/* STOPS */}

        {steps.map(
          (step, index) => {

            const visible =
              route.progress >=
              revealPoints[index]

            return (
              <article
                className={`
                  route-stop
                  route-stop-${index + 1}
                  ${visible ? 'visible' : ''}
                `}
                key={step.time}
              >

                <div className="route-card">

                  <div className="route-icon">
                    {step.icon}
                  </div>


                  <strong>
                    {step.time}
                  </strong>


                  <h3>
                    {step.title}
                  </h3>


                  <p>
                    <b>
                      {step.place}
                    </b>

                    <br />

                    {step.address}
                  </p>


                  <a
                    href={step.map}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Քարտեզ
                  </a>

                </div>

              </article>
            )
          }
        )}

      </div>

    </section>
  )
}


/* =========================================================
   RSVP
========================================================= */

function RSVP() {
  const [
    attendance,
    setAttendance,
  ] = useState('yes')

  const [
    sent,
    setSent,
  ] = useState(false)


  const submitForm = (event) => {
    event.preventDefault()

    setSent(true)
  }


  return (
    <section
      className="
        rsvp-section
        section-shell
        reveal
      "
      id="rsvp"
    >

      <div className="rsvp-top">

        <span className="latin-script rsvp-latin">
          Cheers!
        </span>

        <h2>
          Հաստատեք Ձեր ներկայությունը
        </h2>

        <p>
          Խնդրում ենք պատասխանել մինչև{' '}

          <b>
            {CONFIG.rsvpDeadline}
          </b>
        </p>

      </div>


      <form
        className="rsvp-card"
        onSubmit={submitForm}
      >

        <label className="field full">

          <span>
            Անուն / Ազգանուն
          </span>

          <input
            required
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

            Այո, սիրով կգամ
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


        <label className="field full">

          <span>
            Մեկնաբանություն
          </span>

          <textarea
            rows="3"
            placeholder="Ցանկության դեպքում թողեք հաղորդագրություն"
          />

        </label>


        <button
          className="submit-btn"
          type="submit"
        >
          <Send size={18} />

          Ուղարկել
        </button>


        {sent && (
          <p className="thanks">
            Շնորհակալություն 🤍
            Ձեր պատասխանը պահպանվեց։
          </p>
        )}

      </form>

    </section>
  )
}


/* =========================================================
   APP
========================================================= */

export default function App() {
  const countdown =
    useCountdown(CONFIG.dateISO)


  const countdownItems =
    useMemo(
      () => [
        [
          String(
            countdown.days
          ).padStart(2, '0'),

          'օր',
        ],

        [
          String(
            countdown.hours
          ).padStart(2, '0'),

          'ժամ',
        ],

        [
          String(
            countdown.minutes
          ).padStart(2, '0'),

          'րոպե',
        ],

        [
          String(
            countdown.seconds
          ).padStart(2, '0'),

          'վայրկյան',
        ],
      ],

      [countdown]
    )


  /*
    GENERAL REVEAL
  */

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
            '0px 0px -40px 0px',
        }
      )


    document
      .querySelectorAll('.reveal')
      .forEach(
        (element) => {
          observer.observe(element)
        }
      )


    return () =>
      observer.disconnect()
  }, [])


  return (
    <main className="page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero">

        <div className="hero-top reveal in">

          <span className="tiny-label">
            ՄԵՐ ՀԱՐՍԱՆԻՔԸ
          </span>

          <h1>
            Սերը դա...
          </h1>

        </div>


        <div className="hero-art reveal in">

          <LoveBands />


          <div className="hero-photo-wrap">

            <img
              src={coupleOne}
              alt="Հարսանեկան լուսանկար"
              className="hero-photo"
            />

            <img
              src={heart}
              alt=""
              className="hero-heart"
            />

          </div>

        </div>


        <div className="hero-bottom reveal in">

          <p>
            ...լուռ ներկայություն՝
            մինչև կյանքի վերջ։
          </p>

          <a href="#invitation">
            Բացել հրավերը

            <span>
              ↓
            </span>
          </a>

        </div>

      </section>


      {/* =================================================
          INVITATION
      ================================================= */}

      <section
        className="
          invite-section
          section-shell
          reveal
        "
        id="invitation"
      >

        <div className="invite-copy">

          <Sparkles className="sparkle" />

          <span>
            Սիրելի հյուրեր
          </span>

          <h2>
            {CONFIG.bride}
            {' & '}
            {CONFIG.groom}
          </h2>

          <p>
            Սիրով հրավիրում ենք Ձեզ
            կիսելու մեզ հետ մեր կյանքի
            ամենակարևոր օրը։

            {' '}

            Ձեր ներկայությունը մեր տոնին
            կտա այն ջերմությունը, որը
            ցանկանում ենք հիշել ամբողջ
            կյանքում։
          </p>


          <div className="date-line">

            <CalendarDays />

            {CONFIG.day}
            {' '}
            {CONFIG.month},
            {' '}
            {CONFIG.year}

          </div>

        </div>


        <figure className="editorial-photo first-photo">

          <img
            src={coupleTwo}
            alt="Զույգի լուսանկար"
          />

          <figcaption className="latin-script">
            together, always.
          </figcaption>

        </figure>

      </section>


      {/* =================================================
          DATE
      ================================================= */}

      <section className="date-section section-shell">

        <Calendar />


        <div className="countdown-card reveal">

          <span>
            Մինչև մեր օրը
          </span>


          <div className="countdown-grid">

            {countdownItems.map(
              ([value, label]) => (
                <div
                  className="countdown-item"
                  key={label}
                >

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
          ROADMAP
      ================================================= */}

      <Roadmap />


      {/* =================================================
          MEMORY
      ================================================= */}

      <section
        className="
          memory-section
          section-shell
          reveal
        "
      >

        <figure className="editorial-photo large-photo">

          <img
            src={coupleOne}
            alt="Հարսանեկան լուսանկար"
          />

          <img
            src={heart}
            alt=""
            className="memory-heart"
          />

        </figure>


        <div className="memory-copy">

          <span className="latin-script big-latin">
            For little moments
          </span>

          <h2>
            Փոքրիկ մանրուքներ
          </h2>

          <p>
            Մեզ հետ բերեք Ձեր ժպիտները,
            ջերմությունը և լավ
            տրամադրությունը։

            {' '}

            Եթե ցանկանում եք՝ ընտրեք
            հանգիստ, մոնոխրոմ կամ
            գինեգույն երանգներ։
          </p>


          <div className="dress-code">

            {[
              '#2b2220',
              '#6b4942',
              '#a02f2f',
              '#c8897c',
              '#d8c9b8',
              '#f4efe8',
            ].map((color) => (
              <i
                style={{
                  background: color
                }}
                key={color}
              />
            ))}

          </div>


          <a
            className="telegram-btn"
            href="#rsvp"
          >
            Հաստատել մասնակցությունը →
          </a>

        </div>

      </section>


      {/* =================================================
          CHEERS
      ================================================= */}

      <section className="cheers-section reveal">

        <div
          className="cheers-lines"
          aria-hidden="true"
        >

          {Array.from(
            { length: 4 },
            (_, row) => (

              <div
                className={`
                  cheers-row
                  cheers-${row + 1}
                `}
                key={row}
              >

                {Array.from(
                  { length: 7 },
                  (_, index) => (
                    <span
                      className="latin-script"
                      key={index}
                    >
                      Cheers!
                    </span>
                  )
                )}

              </div>
            )
          )}

        </div>


        <div className="cheers-photo">

          <img
            src={coupleTwo}
            alt="Զույգի լուսանկար"
          />

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

        <img
          src={coupleTwo}
          alt="Զույգ"
        />


        <div className="with-love">

          <span>
            WITH
          </span>

          <strong className="latin-script">
            Love
          </strong>

        </div>


        <p>
          {CONFIG.bride}
          {' & '}
          {CONFIG.groom}
        </p>


        <small>
          {CONFIG.day}.
          {String(
            CONFIG.monthIndex + 1
          ).padStart(2, '0')}.
          {CONFIG.year}
        </small>

      </footer>

    </main>
  )
}
