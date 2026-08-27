import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import envelopeImage from './assets/images/envelope.png'
import heroCouple from './assets/images/hero-couple.jpg'
import ringsPhoto from './assets/images/rings.jpg'
import portraitPhoto from './assets/images/portrait.jpg'

import envelopeVideo from './assets/media/envelope-opening.mp4'
import loveStory from './assets/media/love-story.mp3'


// ======================================================
// CONFIG
// ======================================================

const CONFIG = {
  bride: 'Աննա',
  groom: 'Արմեն',

  dateISO: '2027-06-25T17:00:00+04:00',

  day: '25',
  month: 'Հունիս',
  monthNumber: '06',
  year: '2027',

  ceremony: {
    time: '13:00',
    title: 'Պսակադրություն',
    place: 'Սուրբ Գրիգոր Լուսավորիչ եկեղեցի',
    map: 'https://maps.google.com',
  },

  reception: {
    time: '17:00',
    title: 'Հարսանյաց հանդիսություն',
    place: 'Ռեստորանային համալիր',
    map: 'https://maps.google.com',
  },
}


// ======================================================
// COUNTDOWN
// ======================================================

function useCountdown(target) {
  const calculate = () =>
    Math.max(
      0,
      new Date(target).getTime() - Date.now()
    )

  const [difference, setDifference] =
    useState(calculate)

  useEffect(() => {
    const timer = setInterval(() => {
      setDifference(calculate())
    }, 1000)

    return () => clearInterval(timer)
  }, [target])

  return {
    days: Math.floor(
      difference / 86400000
    ),

    hours: Math.floor(
      (difference / 3600000) % 24
    ),

    minutes: Math.floor(
      (difference / 60000) % 60
    ),

    seconds: Math.floor(
      (difference / 1000) % 60
    ),
  }
}


// ======================================================
// MUSIC ICON
// ======================================================

function MusicIcon({ playing }) {
  if (playing) {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <rect
          x="6.5"
          y="5"
          width="3"
          height="14"
          rx="1.2"
        />

        <rect
          x="14.5"
          y="5"
          width="3"
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
          v10.4
          a3.1 3.1 0 1 0 2 2.9
          V9.2
          l6-1.5
          v5.7
          a3.1 3.1 0 1 0 2 2.9
          V4.4
          L9 7
          V5Z
        "
      />
    </svg>
  )
}


// ======================================================
// CALENDAR
// ======================================================

function Calendar({ config = CONFIG }) {
  const year = Number(config.year)
  const monthIndex =
    Number(config.monthNumber) - 1

  const daysInMonth =
    new Date(
      year,
      monthIndex + 1,
      0
    ).getDate()

  const firstWeekDay =
    new Date(
      year,
      monthIndex,
      1
    ).getDay()

  const days = Array.from(
    {
      length: daysInMonth,
    },
    (_, index) => index + 1
  )

  const emptyDays =
    Array.from(
      {
        length: firstWeekDay,
      },
      (_, index) => index
    )

  return (
    <div
      className="calendar"
      aria-label={`${config.month} ${config.year}`}
    >
      <div className="calendar-month">
        {config.month.toUpperCase()}
      </div>

      <div className="calendar-line" />

      <div className="weekdays">
        {[
          'ԿԻՐ',
          'ԵՐԿ',
          'ԵՐՔ',
          'ՉՈՐ',
          'ՀՆԳ',
          'ՈՒՐ',
          'ՇԲԹ',
        ].map((day) => (
          <span key={day}>
            {day}
          </span>
        ))}
      </div>

      <div className="calendar-grid">
        {emptyDays.map((item) => (
          <span
            key={`empty-${item}`}
            className="empty"
          />
        ))}

        {days.map((day) => (
          <span
            key={day}
            className={
              day === Number(config.day)
                ? 'selected-day'
                : ''
            }
          >
            {day}
          </span>
        ))}
      </div>
    </div>
  )
}


// ======================================================
// SCHEDULE ICONS
// ======================================================

function ScheduleIcon({ type }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  if (type === 'home') {
    return (
      <svg viewBox="0 0 48 48">
        <path
          {...common}
          d="
            M7 22
            24 8
            l17 14
            v18
            H29
            V29
            H19
            v11
            H7
            V22Z
          "
        />

        <path
          {...common}
          d="M17 18h14"
        />
      </svg>
    )
  }

  if (type === 'suit') {
    return (
      <svg viewBox="0 0 48 48">
        <circle
          {...common}
          cx="24"
          cy="12"
          r="6"
        />

        <path
          {...common}
          d="
            M13 40
            v-9
            c0-7 4.7-12 11-12
            s11 5 11 12
            v9

            M20 19
            l4 7
            4-7

            M24 26
            v14
          "
        />
      </svg>
    )
  }

  if (type === 'rings') {
    return (
      <svg viewBox="0 0 48 48">
        <circle
          {...common}
          cx="19"
          cy="27"
          r="10"
        />

        <circle
          {...common}
          cx="30"
          cy="27"
          r="10"
        />

        <path
          {...common}
          d="
            m25 12
            5-5
            5 5
            -5 5
            -5-5Z
          "
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 48 48">
      <path
        {...common}
        d="
          M10 23h28

          M13 23
          c1-8 6-12 11-12
          s10 4 11 12

          M7 23h34

          M16 31h16

          M20 37h8
        "
      />

      <circle
        {...common}
        cx="24"
        cy="8"
        r="1.5"
      />
    </svg>
  )
}


// ======================================================
// RSVP
// ======================================================

function RSVP({ photo = portraitPhoto, onSubmit }) {
  const [attending, setAttending] =
    useState('yes')

  const [sent, setSent] =
    useState(false)

  const submit = async (event) => {
    event.preventDefault()

    const values = new FormData(event.currentTarget)

    await onSubmit?.({
      guestName: String(values.get('fullName') || ''),
      guestCount: attending === 'no' ? 0 : Number(values.get('guests') || 1),
      status: attending === 'yes' ? 'attending' : 'declined',
      message: String(values.get('comment') || ''),
      guestSide: 'other',
    })

    setSent(true)
  }

  return (
    <section
      className="rsvp-section reveal"
      id="rsvp"
    >
      <div className="rsvp-photo-wrap">
        <img
          src={photo}
          alt="Զույգ"
          className="rsvp-photo"
        />
      </div>


      <div className="rsvp-panel">
        <p className="eyebrow">
          ՀԱՍՏԱՏԵՔ ՄԱՍՆԱԿՑՈՒԹՅՈՒՆԸ
        </p>

        <h2>
          Սիրով սպասում ենք Ձեզ
        </h2>

        <p className="rsvp-lead">
          Խնդրում ենք պատասխանել մինչև
          հունիսի 10-ը, որպեսզի կարողանանք
          ամեն ինչ պատրաստել Ձեր ներկայության
          համար։
        </p>


        <form
          onSubmit={submit}
          className="rsvp-form"
        >
          <div
            className="attendance-choice"
            role="group"
            aria-label="Մասնակցություն"
          >
            <button
              type="button"
              aria-pressed={
                attending === 'yes'
              }
              className={
                attending === 'yes'
                  ? 'selected'
                  : ''
              }
              onClick={() =>
                setAttending('yes')
              }
            >
              <span className="choice-circle" />

              Այո, սիրով կմասնակցեմ
            </button>


            <button
              type="button"
              aria-pressed={
                attending === 'no'
              }
              className={
                attending === 'no'
                  ? 'selected'
                  : ''
              }
              onClick={() =>
                setAttending('no')
              }
            >
              <span className="choice-circle" />

              Ցավոք, չեմ կարող մասնակցել
            </button>
          </div>


          <div className="form-row">
            <label>
              <span>
                Անուն Ազգանուն
              </span>

              <input
                required
                type="text"
                name="fullName"
                placeholder="Գրեք Ձեր անունը"
              />
            </label>


            <label>
              <span>
                Հյուրերի քանակ
              </span>

              <input
                type="number"
                name="guests"
                min="1"
                defaultValue="1"
                disabled={
                  attending === 'no'
                }
              />
            </label>
          </div>


          <label>
            <span>
              Մեկնաբանություն
            </span>

            <textarea
              name="comment"
              rows="4"
              placeholder="Ցանկության դեպքում թողեք հաղորդագրություն"
            />
          </label>


          <button
            className="submit-btn"
            type="submit"
          >
            Պատասխանել
          </button>


          {sent && (
            <div
              className="success"
              role="status"
            >
              Շնորհակալություն։
              Ձեր պատասխանը պահպանվեց ♡
            </div>
          )}
        </form>
      </div>
    </section>
  )
}


// ======================================================
// APP
// ======================================================

export default function App({
  forceOpen = false,
  config: suppliedConfig,
  schedule: suppliedSchedule,
  heroImage = heroCouple,
  ringsImage = ringsPhoto,
  portraitImage = portraitPhoto,
  envelopeImageSrc = envelopeImage,
  openingVideoSrc = envelopeVideo,
  musicUrl = loveStory,
  musicEnabled = true,
  eventMessage,
  dressCode,
  dressCodeColors,
  dressCodeVisible = true,
  onRsvpSubmit,
} = {}) {
  const config = useMemo(() => ({
    ...CONFIG,
    ...(suppliedConfig || {}),
    ceremony: {
      ...CONFIG.ceremony,
      ...(suppliedConfig?.ceremony || {}),
    },
    reception: {
      ...CONFIG.reception,
      ...(suppliedConfig?.reception || {}),
    },
  }), [suppliedConfig])

  const videoRef =
    useRef(null)

  const audioRef =
    useRef(null)

  const [stage, setStage] =
    useState(forceOpen ? 'invite' : 'gate')

  const [playing, setPlaying] =
    useState(false)

  const [
    videoReady,
    setVideoReady,
  ] = useState(false)


  const countdown =
    useCountdown(
      config.dateISO
    )


  const countdownItems =
    useMemo(
      () => [
        [
          String(
            countdown.days
          ).padStart(2, '0'),
          'ՕՐ',
        ],

        [
          String(
            countdown.hours
          ).padStart(2, '0'),
          'ԺԱՄ',
        ],

        [
          String(
            countdown.minutes
          ).padStart(2, '0'),
          'ՐՈՊԵ',
        ],

        [
          String(
            countdown.seconds
          ).padStart(2, '0'),
          'ՎՐԿ',
        ],
      ],

      [countdown]
    )


  // ====================================================
  // LOCK BODY WHILE ENVELOPE / VIDEO IS OPEN
  // ====================================================

  useEffect(() => {
    if (forceOpen) {
      setStage('invite')
    }
  }, [forceOpen])

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow

    if (stage !== 'invite') {
      document.body.style.overflow =
        'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow =
        previousOverflow
    }
  }, [stage])


  // ====================================================
  // REVEAL ANIMATIONS
  // ====================================================

  useEffect(() => {
    if (stage !== 'invite') {
      return
    }

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


    const elements =
      document.querySelectorAll(
        '.reveal'
      )

    elements.forEach(
      (element) => {
        observer.observe(element)
      }
    )


    return () =>
      observer.disconnect()
  }, [stage])


  // ====================================================
  // AUDIO FADE
  // ====================================================

  const fadeMusicTo = (
    targetVolume,
    duration = 1200
  ) => {
    const audio =
      audioRef.current

    if (!audio) {
      return
    }

    const startVolume =
      audio.volume

    const startTime =
      performance.now()


    const tick = (now) => {
      const progress =
        Math.min(
          1,
          (now - startTime) /
            duration
        )

      audio.volume =
        startVolume +
        (
          targetVolume -
          startVolume
        ) *
          progress

      if (progress < 1) {
        requestAnimationFrame(
          tick
        )
      }
    }

    requestAnimationFrame(tick)
  }


  // ====================================================
  // FINISH OPENING
  // ====================================================

  const finishOpening = () => {
    const video =
      videoRef.current

    if (
      video &&
      !video.paused
    ) {
      video.pause()
    }

    setStage('invite')

    requestAnimationFrame(() => {
      fadeMusicTo(
        0.5,
        1600
      )

      window.scrollTo({
        top: 0,
        behavior: 'auto',
      })
    })
  }


  // ====================================================
  // OPEN ENVELOPE
  // ====================================================

  const openInvitation =
    async () => {
      const video =
        videoRef.current

      const audio = audioRef.current

      if (!video) {
        return
      }


      setStage('video')


      // User clicked the envelope,
      // so audio can start legally here.
      if (musicEnabled && audio) {
        audio.volume = 0.12
        audio.loop = true

        try {
          await audio.play()
          setPlaying(true)
        } catch {
          setPlaying(false)
        }
      }


      try {
        video.currentTime = 0

        await video.play()
      } catch {
        finishOpening()
      }
    }


  // ====================================================
  // MUSIC ON / OFF
  // ====================================================

  const toggleMusic =
    async () => {
      const audio =
        audioRef.current

      if (!audio || !musicEnabled) {
        return
      }


      if (audio.paused) {
        try {
          await audio.play()

          audio.volume = 0.5

          setPlaying(true)
        } catch {
          setPlaying(false)
        }
      } else {
        audio.pause()

        setPlaying(false)
      }
    }


  // ====================================================
  // SCHEDULE
  // ====================================================

  const defaultScheduleItems = [
    {
      icon: 'home',
      time: '11:00',
      title: 'Հարսի տուն',
      place: 'Երևան',
      map:
        'https://maps.google.com',
    },

    {
      icon: 'suit',
      time: '12:00',
      title: 'Փեսայի տուն',
      place: 'Երևան',
      map:
        'https://maps.google.com',
    },

    {
      icon: 'rings',
      time:
        config.ceremony.time,

      title:
        config.ceremony.title,

      place:
        config.ceremony.place,

      map:
        config.ceremony.map,
    },

    {
      icon: 'dinner',
      time:
        config.reception.time,

      title:
        config.reception.title,

      place:
        config.reception.place,

      map:
        config.reception.map,
    },
  ]

  const scheduleItems = suppliedSchedule?.length
    ? suppliedSchedule
    : defaultScheduleItems


  return (
    <>
      {/* AUDIO */}

      <audio
        ref={audioRef}
        src={musicEnabled ? musicUrl : undefined}
        preload="auto"
        loop
      />


      {/* ================================================
          ENVELOPE
      ================================================= */}

      <div
        className={`opening-layer ${
          stage === 'gate'
            ? 'show'
            : ''
        }`}
        aria-hidden={
          stage !== 'gate'
        }
      >
        <div className="opening-grain" />

        <p className="opening-kicker">
          ՁԵԶ ՀԱՍԵԼ Է ՀՐԱՎԵՐ
        </p>


        <button
          type="button"
          className="envelope-button"
          onClick={openInvitation}
          aria-label="Բացել հրավերը"
        >
          <img
            src={envelopeImageSrc}
            alt="Amulet invitation envelope"
          />

          <span className="envelope-glow" />
        </button>


        <p className="opening-copy">
          Սեղմեք ծրարին՝ բացելու
          հրավերը
        </p>
      </div>


      {/* ================================================
          OPENING VIDEO
      ================================================= */}

      <div
        className={`video-layer ${
          stage === 'video'
            ? 'show'
            : ''
        }`}
      >
        <video
          ref={videoRef}
          src={openingVideoSrc}
          className={`opening-video ${
            videoReady
              ? 'ready'
              : ''
          }`}
          playsInline
          muted
          preload="auto"
          onCanPlay={() =>
            setVideoReady(true)
          }
          onEnded={
            finishOpening
          }
          onError={
            finishOpening
          }
        />


        {musicEnabled && <button
          type="button"
          className="skip-opening"
          onClick={
            finishOpening
          }
        >
          Բացել հիմա
        </button>}
      </div>


      {/* ================================================
          INVITATION
      ================================================= */}

      <main
        className={`invitation ${
          stage === 'invite'
            ? 'show'
            : ''
        }`}
      >
        {/* MUSIC BUTTON */}

        <button
          type="button"
          className={`music-button ${
            playing
              ? 'playing'
              : ''
          }`}
          onClick={
            toggleMusic
          }
          aria-pressed={
            playing
          }
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
              ? 'Երաժշտություն'
              : 'Միացնել երգը'}
          </span>
        </button>


        {/* ================================================
            HERO
        ================================================= */}

        <section className="hero-section">
          <div
            className="hero-date-column"
            aria-hidden="true"
          >
            <span>
              {config.day}
            </span>

            <span>
              {config.monthNumber}
            </span>

            <span>
              {config.year.slice(-2)}
            </span>
          </div>


          <div className="hero-image-panel">
            <img
              src={heroImage}
              alt="Հարսնացու և փեսա"
            />

            <div className="hero-image-shade" />
          </div>


          <div className="hero-copy">
            <p className="hero-kicker">
              ՄԵՐ ՀԱՐՍԱՆԻՔԸ
            </p>

            <h1>
              <span className="hero-bride">{config.bride}</span>

              <em>
                +
              </em>

              <span className="hero-groom">{config.groom}</span>
            </h1>

            <p className="hero-date-small">
              {config.day}
              {' / '}
              {config.monthNumber}
              {' / '}
              {config.year}
            </p>


            <a
              href="#details"
              className="scroll-cue"
              aria-label="Շարունակել ներքև"
            >
              <span />
              <span />
            </a>
          </div>


          <div
            className="signature-line"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 260 90"
              fill="none"
            >
              <path
                d="
                  M8 64
                  c35-36 72 6 105-13
                  25-14 35-44 58-31
                  15 8 4 26-9 26
                  -17 1-22-19-10-29
                  16-13 40 12 22 35
                  -12 16-35 13-51 5
                "
              />
            </svg>
          </div>
        </section>


        {/* ================================================
            COUNTDOWN
        ================================================= */}

        <section
          className="countdown-section reveal"
          id="details"
        >
          <p className="eyebrow">
            ՄԻՆՉԵՎ ՄԵՐ ՕՐԸ
          </p>


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

                  <span>
                    {label}
                  </span>
                </div>
              )
            )}
          </div>
        </section>


        {/* ================================================
            MESSAGE
        ================================================= */}

        <section className="message-section reveal">
          <p className="eyebrow">
            ՍԻՐԵԼԻ ԸՆԿԵՐՆԵՐ ԵՎ
            ՀԱՐԱԶԱՏՆԵՐ
          </p>


          <h2>
            Մեր կյանքի ամենակարևոր օրը
            ցանկանում ենք կիսել Ձեզ հետ
          </h2>


          <p>
            {eventMessage || 'Սիրով հրավիրում ենք Ձեզ ներկա գտնվելու մեր ամուսնության արարողությանը և միասին ստեղծելու մի օր, որը միշտ կմնա մեր հիշողություններում։ Ձեր ներկայությունը մեր տոնն ավելի ջերմ ու ամբողջական կդարձնի։'}
          </p>
        </section>


        {/* ================================================
            CALENDAR
        ================================================= */}

        <section className="calendar-section reveal">
          <div className="calendar-title-wrap">
            <p className="eyebrow">
              ՊԱՀՊԱՆԵՔ ՕՐԸ
            </p>

            <h2>
              {config.day}
              {' '}
              {config.month}
              {' '}
              {config.year}
            </h2>
          </div>

          <Calendar config={config} />
        </section>


        {/* ================================================
            SCHEDULE
        ================================================= */}

        <section className="schedule-section reveal">
          <div className="section-heading">
            <p className="eyebrow">
              ՄԵՐ ՕՐՎԱ ԺԱՄԱՆԱԿԱՑՈՒՅՑԸ
            </p>

            <h2>
              Մի օր, չորս կարևոր պահ
            </h2>
          </div>


          <div
            className="schedule-line"
            aria-hidden="true"
          />


          <div className="schedule-grid">
            {scheduleItems.map(
              (item) => (
                <article
                  key={`${item.time}-${item.title}`}
                >
                  <ScheduleIcon
                    type={item.icon}
                  />

                  <strong>
                    {item.time}
                  </strong>

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.place}
                  </p>

                  <a
                    href={item.map}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Քարտեզ
                  </a>
                </article>
              )
            )}
          </div>
        </section>


        {/* ================================================
            EDITORIAL IMAGE
        ================================================= */}

        <section className="editorial-photo-section reveal">
          <div className="editorial-copy">
            <p className="eyebrow">
              ՄԵՐ ՊԱՏՄՈՒԹՅԱՆ ՆՈՐ ԷՋԸ
            </p>

            <h2>
              Սկսվում է այստեղ
            </h2>
          </div>


          <div className="rings-image-frame">
            <img
              src={ringsImage}
              alt="Հարսանեկան մատանիներ"
            />
          </div>
        </section>


        {/* ================================================
            DRESS CODE
        ================================================= */}

        {dressCodeVisible && <section className="dresscode-section reveal">
          <div className="dresscode-inner">
            <p className="eyebrow">
              ՀԱԳՈՒՍՏԻ ԳՈՒՅՆԵՐ
            </p>

            <h2>
              Մոնոխրոմ և հանգիստ
              երանգներ
            </h2>

            <p className="dresscode-description">
              {dressCode || 'Ուրախ կլինենք, եթե ընտրեք այս գունապնակին մոտ երանգներ։'}
            </p>


            <div
              className="swatches"
              aria-label="Հագուստի գունապնակ"
            >
              {(dressCodeColors?.length ? dressCodeColors : [
                '#26382F',
                '#70806A',
                '#A99B88',
                '#C8A8A1',
                '#D9C7A7',
                '#F2ECE2',
              ]).map(
                (color) => (
                  <span
                    key={color}
                    style={{
                      backgroundColor:
                        color,
                    }}
                  />
                )
              )}
            </div>
          </div>
        </section>}


        {/* RSVP */}

        <RSVP photo={portraitImage} onSubmit={onRsvpSubmit} />


        {/* ================================================
            FOOTER
        ================================================= */}

        <footer>
          <span>
            {config.bride}
          </span>

          <i>
            ♡
          </i>

          <span>
            {config.groom}
          </span>

          <small>
            {config.day}.
            {config.monthNumber}.
            {config.year}
          </small>
        </footer>
      </main>
    </>
  )
}
