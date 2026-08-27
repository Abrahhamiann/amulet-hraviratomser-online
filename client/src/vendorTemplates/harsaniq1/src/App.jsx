import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import hero from './assets/nkar1.jpg'
import couple from './assets/couple.jpg'
import rings from './assets/weddingnkar.jpg'
import song from './assets/song.mp3'

const burgundy = '#7f0504'


// ======================================
// COUNTDOWN
// ======================================

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


// ======================================
// LOVE BANDS
// ======================================

function LoveBands() {
  const rows = [
    {
      size: 70,
      duration: 14,
      distance: 8,
    },

    {
      size: 56,
      duration: 17,
      distance: 11,
    },

    {
      size: 46,
      duration: 15,
      distance: 9,
    },

    {
      size: 37,
      duration: 19,
      distance: 13,
    },

    {
      size: 30,
      duration: 16,
      distance: 10,
    },

    {
      size: 25,
      duration: 20,
      distance: 14,
    },
  ]

  return (
    <section
      className="love-bands"
      aria-hidden="true"
    >
      {rows.map((row, index) => (
        <div
          key={index}
          className={`love-row ${
            index % 2 === 0
              ? 'move-right'
              : 'move-left'
          }`}
          style={{
            fontSize: `clamp(
              ${Math.max(
                18,
                row.size * 0.45
              )}px,
              ${row.size / 17}vw,
              ${row.size}px
            )`,

            '--duration':
              `${row.duration}s`,

            '--distance':
              `${row.distance}%`,
          }}
        >
          <div className="love-row-inner">
            {'I Love You  '.repeat(32)}
          </div>
        </div>
      ))}

      <img
        src={couple}
        alt="Couple"
        className="love-photo"
      />
    </section>
  )
}


// ======================================
// ROADMAP
// ======================================

function Roadmap() {
  const stageRef = useRef(null)

  useEffect(() => {
    const stage = stageRef.current

    if (!stage) return

    const paths = Array.from(
      stage.querySelectorAll('.draw')
    )

    const stops = Array.from(
      stage.querySelectorAll('.road-stop')
    )

    const lengths = paths.map((path) => {
      const length = path.getTotalLength()

      path.style.strokeDasharray =
        `${length}`

      path.style.strokeDashoffset =
        `${length}`

      return length
    })


    const clamp = (
      value,
      min,
      max
    ) => {
      return Math.min(
        Math.max(value, min),
        max
      )
    }


    let animationFrame = null


    function updateRoadmap() {
      animationFrame = null

      const rect =
        stage.getBoundingClientRect()

      const viewportHeight =
        window.innerHeight


      const animationStart =
        viewportHeight * 0.88

      const animationEnd =
        -rect.height * 0.62


      const progress = clamp(
        (
          animationStart -
          rect.top
        ) /
        (
          animationStart -
          animationEnd
        ),
        0,
        1
      )


      const ranges = [
        [0, 0.48],
        [0.36, 0.82],
        [0.70, 1],
      ]


      paths.forEach(
        (path, index) => {
          const [start, end] =
            ranges[index]

          const pathProgress =
            clamp(
              (
                progress -
                start
              ) /
              (
                end -
                start
              ),
              0,
              1
            )

          path.style.strokeDashoffset =
            `${
              lengths[index] *
              (1 - pathProgress)
            }`
        }
      )


      const stopPositions = [
        0.16,
        0.38,
        0.61,
        0.81,
      ]


      stops.forEach(
        (stop, index) => {
          if (
            progress >=
            stopPositions[index]
          ) {
            stop.classList.add(
              'is-visible'
            )
          } else {
            stop.classList.remove(
              'is-visible'
            )
          }
        }
      )
    }


    function requestUpdate() {
      if (
        animationFrame !== null
      ) {
        return
      }

      animationFrame =
        requestAnimationFrame(
          updateRoadmap
        )
    }


    window.addEventListener(
      'scroll',
      requestUpdate,
      {
        passive: true,
      }
    )

    window.addEventListener(
      'resize',
      requestUpdate
    )


    updateRoadmap()


    return () => {
      window.removeEventListener(
        'scroll',
        requestUpdate
      )

      window.removeEventListener(
        'resize',
        requestUpdate
      )

      if (
        animationFrame !== null
      ) {
        cancelAnimationFrame(
          animationFrame
        )
      }
    }
  }, [])


  return (
    <section className="roadmap-wrap">

      {/* CALENDAR */}

      <div className="calendar-card">

        <div className="calendar-head">
          <span>
            Հինգշաբթի
          </span>

          <span>
            Ուրբաթ
          </span>

          <span>
            Շաբաթ
          </span>
        </div>


        <div className="calendar-days">

          <span>
            16
          </span>

          <span className="chosen">
            17
          </span>

          <span>
            18
          </span>

        </div>


        <svg
          className="calendar-heart"
          viewBox="0 0 300 230"
          fill="none"
          aria-hidden="true"
        >

          <path
            d="
              M58 58
              C39 10 100 4 142 59
              C180 8 243 20 229 74
              C216 124 165 153 143 169
              C120 150 75 112 58 58
            "
            stroke={burgundy}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />


          <path
            d="
              M143 168
              C190 200 228 210 273 226
            "
            stroke={burgundy}
            strokeWidth="5"
            strokeLinecap="round"
          />

        </svg>

      </div>


      {/* ROAD */}

      <div
        className="road-stage"
        ref={stageRef}
      >

        <svg
          className="road-svg"
          viewBox="0 0 620 1320"
          fill="none"
          aria-hidden="true"
        >

          {/* ROAD 1 */}

          <path
            className="draw draw-1"
            d="
              M210 10
              C270 90 333 151 396 225
              C455 295 478 367 447 430
              C419 487 342 500 265 508
              C181 518 101 541 54 576
              C113 583 148 600 170 629
              C143 644 115 666 80 697
              C151 692 220 714 285 750
              C348 784 410 803 485 805
              C526 806 565 799 603 787
            "
          />


          {/* ROAD 2 */}

          <path
            className="draw draw-2"
            d="
              M603 842
              C551 867 496 886 437 891
              C368 897 308 885 250 865
              C205 849 165 836 124 828
              C168 850 199 870 224 893
              C198 907 176 927 156 950
              C220 950 277 966 331 996
              C391 1029 442 1072 486 1122
              C518 1158 551 1186 602 1210
            "
          />


          {/* ROAD 3 */}

          <path
            className="draw draw-3"
            d="
              M602 1210
              C549 1236 493 1255 435 1261
              C390 1266 346 1257 307 1237
              C286 1225 271 1206 262 1185
              C253 1160 265 1145 283 1150
              C307 1158 305 1184 287 1197
              C270 1209 252 1196 245 1182
              C238 1165 244 1145 258 1132
            "
          />

        </svg>


        {/* STOP 1 */}

        <div className="road-stop stop-1">

          <div className="road-dot">
            1
          </div>

          <div className="road-label">

            <strong>
              Փեսայի տուն
            </strong>

            <span className="road-time">
              10:00
            </span>

          </div>

        </div>


        {/* STOP 2 */}

        <div className="road-stop stop-2">

          <div className="road-label">

            <strong>
              Հարսնացուի տուն
            </strong>

            <span className="road-time">
              12:00
            </span>

          </div>

          <div className="road-dot">
            2
          </div>

        </div>


        {/* STOP 3 */}

        <div className="road-stop stop-3">

          <div className="road-dot">
            3
          </div>

          <div className="road-label">

            <strong>
              Ս. Գայանե եկեղեցի
            </strong>

            <span className="road-time">
              14:00
            </span>

          </div>

        </div>


        {/* STOP 4 */}

        <div className="road-stop stop-4">

          <div className="road-label">

            <strong>
              Էլինար Ռեստորանային
              Համալիր
            </strong>

            <span className="road-time">
              17:00
            </span>

          </div>

          <div className="road-dot">
            4
          </div>

        </div>

      </div>

    </section>
  )
}


// ======================================
// RSVP
// ======================================

function RSVP() {
  const [sent, setSent] =
    useState(false)

  const [side, setSide] =
    useState('')

  const [
    attending,
    setAttending,
  ] = useState('')


  function handleSubmit(event) {
    event.preventDefault()

    setSent(true)
  }


  return (
    <section className="rsvp-section reveal">

      <div className="wedding-photo-wrap">

        <img
          src={rings}
          alt="Wedding couple"
          className="rings-photo"
        />

      </div>


      <div className="rsvp-intro">

        <p>
          Խնդրում ենք նախապես
          տեղեկացնել մեզ
          <br />

          Ձեր մասնակցության մասին
          մինչև
          <br />

          մայիսի 15-ը։
          <br />

          Սիրով սպասում ենք։
        </p>

      </div>


      <form
        className="rsvp-card"
        onSubmit={handleSubmit}
      >

        <h3>
          Հյուրերի պատասխան
        </h3>


        <input
          required
          type="text"
          placeholder="Անուն Ազգանուն"
        />


        <div className="choice-grid">

          <button
            type="button"
            className={
              side === 'bride'
                ? 'active'
                : ''
            }
            onClick={() =>
              setSide('bride')
            }
          >
            Հարսի կողմից
          </button>


          <button
            type="button"
            className={
              side === 'groom'
                ? 'active'
                : ''
            }
            onClick={() =>
              setSide('groom')
            }
          >
            Փեսայի կողմից
          </button>


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
            Այո
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
            Ոչ
          </button>

        </div>


        <textarea
          placeholder="Մեկնաբանություն"
          rows="3"
        />


        <button
          type="submit"
          className="submit"
        >
          Ուղարկել
        </button>


        {sent && (
          <div className="thanks">
            Շնորհակալություն 🤍
          </div>
        )}

      </form>

    </section>
  )
}


// ======================================
// APP
// ======================================

export default function App() {

  // =====================================
  // MUSIC
  // =====================================

  const audioRef = useRef(null)

  const userControlledMusic =
    useRef(false)

  const [isPlaying, setIsPlaying] =
    useState(false)


  // =====================================
  // COUNTDOWN
  // =====================================

  const time =
    useCountdown(
      '2027-07-17T17:00:00+04:00'
    )


  const countdown =
    useMemo(
      () => [
        [
          time.days,
          'Օր',
        ],

        [
          String(
            time.hours
          ).padStart(
            2,
            '0'
          ),

          'Ժամ',
        ],

        [
          String(
            time.minutes
          ).padStart(
            2,
            '0'
          ),

          'Րոպե',
        ],

        [
          String(
            time.seconds
          ).padStart(
            2,
            '0'
          ),

          'Վրկ.',
        ],
      ],

      [time]
    )


  // =====================================
  // MUSIC AUTOPLAY
  // =====================================

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) return


    audio.volume = 0.55

    audio.loop = true


    const handlePlay = () => {
      setIsPlaying(true)
    }


    const handlePause = () => {
      setIsPlaying(false)
    }


    audio.addEventListener(
      'play',
      handlePlay
    )

    audio.addEventListener(
      'pause',
      handlePause
    )


    /*
      Առաջին հերթին փորձում ենք
      անմիջապես autoplay անել։
    */

    const startAutomatically =
      async () => {

        try {
          await audio.play()

          setIsPlaying(true)
        } catch (error) {
          /*
            Chrome / Safari կարող են
            block անել sound autoplay-ը։
            Այդ դեպքում առաջին interaction-ից
            հետո կփորձենք միացնել։
          */

          setIsPlaying(false)
        }

      }


    startAutomatically()


    /*
      Եթե browser-ը autoplay-ը block արեց,
      առաջին interaction-ի ժամանակ երգը
      կմիանա։

      Music button-ի click-ը այստեղ
      բաց ենք թողնում, որովհետև դրա
      toggle logic-ը առանձին է։
    */

    const unlockAudio =
      async (event) => {

        if (
          userControlledMusic.current
        ) {
          return
        }


        const target =
          event.target


        if (
          target instanceof Element &&
          target.closest(
            '.heart-float'
          )
        ) {
          return
        }


        if (audio.paused) {
          try {
            await audio.play()

            setIsPlaying(true)
          } catch (error) {
            return
          }
        }


        document.removeEventListener(
          'pointerdown',
          unlockAudio
        )

        document.removeEventListener(
          'keydown',
          unlockAudio
        )
      }


    document.addEventListener(
      'pointerdown',
      unlockAudio,
      {
        passive: true,
      }
    )


    document.addEventListener(
      'keydown',
      unlockAudio
    )


    return () => {
      audio.removeEventListener(
        'play',
        handlePlay
      )

      audio.removeEventListener(
        'pause',
        handlePause
      )


      document.removeEventListener(
        'pointerdown',
        unlockAudio
      )

      document.removeEventListener(
        'keydown',
        unlockAudio
      )
    }

  }, [])


  // =====================================
  // MUSIC BUTTON
  // =====================================

  const toggleMusic =
    async () => {

      const audio =
        audioRef.current

      if (!audio) return


      /*
        Այս պահից user-ն է որոշում՝
        երաժշտությունը միացված լինի,
        թե անջատված։
      */

      userControlledMusic.current =
        true


      if (audio.paused) {

        try {
          await audio.play()

          setIsPlaying(true)
        } catch (error) {
          console.error(
            'Music could not start:',
            error
          )
        }

      } else {

        audio.pause()

        setIsPlaying(false)

      }
    }


  // =====================================
  // REVEAL
  // =====================================

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
        }
      )


    const elements =
      document.querySelectorAll(
        '.reveal'
      )


    elements.forEach(
      (element) => {
        observer.observe(
          element
        )
      }
    )


    return () => {
      observer.disconnect()
    }

  }, [])


  return (
    <main>

      {/* ==================================
          MUSIC
      ================================== */}

      <audio
        ref={audioRef}
        src={song}
        autoPlay
        loop
        preload="auto"
      />


      {/* ==================================
          MUSIC BUTTON
      ================================== */}

      <button
        type="button"
        className={`heart-float ${
          isPlaying
            ? 'music-playing'
            : 'music-paused'
        }`}
        onClick={toggleMusic}
        aria-label={
          isPlaying
            ? 'Անջատել երաժշտությունը'
            : 'Միացնել երաժշտությունը'
        }
        title={
          isPlaying
            ? 'Անջատել երաժշտությունը'
            : 'Միացնել երաժշտությունը'
        }
      >

        <span>
          ♡
        </span>

      </button>


      {/* ==================================
          HERO
      ================================== */}

      <section className="hero">

        <img
          src={hero}
          alt="Bride and groom"
        />


        <div className="hero-names">

          <span>
            Կարեն
          </span>

          <i>
            &
          </i>

          <span>
            Լիկա
          </span>

        </div>


        <div className="hero-date">
          17/07/2027
        </div>

      </section>


      {/* ==================================
          INTRO
      ================================== */}

      <section className="intro reveal">

        <div className="intro-stack">

          <h2>
            Սիրելինե՛ր
          </h2>

          <p>
            Դուք հրավիրված եք
            մեր հարսանիքին
          </p>

          <p>
            Օր, որը կլինի կյանքի
          </p>

          <p>
            նոր էջի սկիզբը
          </p>

        </div>

      </section>


      {/* LOVE */}

      <LoveBands />


      {/* ==================================
          COUNTDOWN
      ================================== */}

      <section className="countdown reveal">

        {countdown.map(
          (
            [value, label],
            index
          ) => (

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


              {index < 3 && (
                <em />
              )}

            </div>

          )
        )}

      </section>


      {/* ROADMAP */}

      <Roadmap />


      {/* RSVP */}

      <RSVP />

    </main>
  )
}