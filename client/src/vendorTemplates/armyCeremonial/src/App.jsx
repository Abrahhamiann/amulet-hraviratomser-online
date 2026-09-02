import {
  useEffect,
  useRef,
  useState
} from 'react'

import {
  CalendarDays,
  ChevronDown,
  MapPin,
  Pause,
  Play,
  ShieldCheck
} from 'lucide-react'

import emblem from './assets/army-emblem.png'
import song from './assets/invitation-song.mp3'
import soldierPhoto from './assets/soldier-photo.jpg'


const INVITATION = {
  name: 'Նարեկ',
  title: 'Բանակ ճանապարհելու հրավեր',
  date: '25.05.2026',
  time: '17:00',
  venue: 'NRENI ՌԵՍՏՈՐԱՆ',
  address:
    'ք. Վերին Դվին, Նորակերտ թաղամաս 2-րդ փողոց, 2/24',
  mapUrl: 'https://maps.google.com',
  rsvpDeadline: '1.06.2026',
}


/* ==============================
   SCROLL REVEAL
============================== */

function Reveal({
  children,
  className = '',
  delay = 0,
  direction = 'up'
}) {
  const ref = useRef(null)
  const [visible, setVisible] =
    useState(false)

  useEffect(() => {
    const element = ref.current

    if (!element) return

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true)

            observer.unobserve(
              entry.target
            )
          }
        },
        {
          threshold: 0.12,
          rootMargin:
            '0px 0px -70px 0px'
        }
      )

    observer.observe(element)

    return () =>
      observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`
        reveal
        reveal-${direction}
        ${visible ? 'is-visible' : ''}
        ${className}
      `}
      style={{
        '--reveal-delay':
          `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}


/* ==============================
   MUSIC
============================== */

function MusicButton({
  audioRef,
  playing,
  setPlaying
}) {

  const toggle = async () => {

    if (!audioRef.current)
      return

    if (playing) {

      audioRef.current.pause()

      setPlaying(false)

      return
    }

    try {

      await audioRef.current.play()

      setPlaying(true)

    } catch {

      setPlaying(false)

    }
  }


  return (

    <button
      className={`
        music-button
        ${playing
          ? 'is-playing'
          : ''}
      `}
      onClick={toggle}
      aria-label={
        playing
          ? 'Դադարեցնել երգը'
          : 'Միացնել երգը'
      }
    >

      <span
        className="music-ripple"
      />

      <span
        className="music-ripple ripple-two"
      />

      {playing
        ? (
          <Pause
            size={24}
            fill="currentColor"
          />
        )
        : (
          <Play
            size={24}
            fill="currentColor"
          />
        )}

    </button>
  )
}


/* ==============================
   APP
============================== */

function App() {

  const audioRef =
    useRef(null)

  const [playing, setPlaying] =
    useState(false)

  const [
    attending,
    setAttending
  ] =
    useState('yes')

  const [guests, setGuests] =
    useState(1)

  const [form, setForm] =
    useState({
      name: '',
      note: ''
    })

  const [sent, setSent] =
    useState(false)


  useEffect(() => {

    const audio =
      audioRef.current

    const stop = () =>
      setPlaying(false)

    audio?.addEventListener(
      'ended',
      stop
    )

    return () =>
      audio?.removeEventListener(
        'ended',
        stop
      )

  }, [])


  const submit = (e) => {

    e.preventDefault()

    setSent(true)
  }


  return (

    <main className="page-shell">

      <audio
        ref={audioRef}
        src={song}
        preload="metadata"
      />


      {/* =================================
          HERO
      ================================= */}

      <section className="hero section">

        <div
          className="hero-grid"
          aria-hidden="true"
        />


        <div
          className="hero-light hero-light-one"
        />

        <div
          className="hero-light hero-light-two"
        />


        <div
          className="tricolor-line"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </div>


        <div className="eyebrow hero-fade hero-delay-1">
          ՀՐԱՎԵՐ
        </div>


        <div className="hero-emblem-wrap hero-fade hero-delay-2">

          <div
            className="emblem-glow"
          />

          <div
            className="emblem-ring emblem-ring-one"
          />

          <div
            className="emblem-ring emblem-ring-two"
          />

          <img
            className="hero-emblem"
            src={emblem}
            alt="Բանակային խորհրդանշան"
          />

        </div>


        <div className="hero-copy">

          <p className="hero-kicker hero-fade hero-delay-3">
            Մի կարևոր օրվա առիթով
          </p>

          <h1 className="hero-fade hero-delay-4">
            {INVITATION.name}
          </h1>

          <p className="hero-title hero-fade hero-delay-5">
            {INVITATION.title}
          </p>

        </div>


        <div className="music-zone hero-fade hero-delay-6">

          <MusicButton
            audioRef={audioRef}
            playing={playing}
            setPlaying={setPlaying}
          />

          <span>
            {playing
              ? 'Երգը հնչում է'
              : 'Միացնել երգը'}
          </span>

        </div>


        <a
          className="scroll-cue"
          href="#invite"
          aria-label="Շարունակել ներքև"
        >

          <ChevronDown
            size={24}
          />

        </a>

      </section>



      {/* =================================
          INTRO
      ================================= */}

      <section
        className="section intro-section"
        id="invite"
      >

        <div
          className="intro-floating-light intro-light-one"
        />

        <div
          className="intro-floating-light intro-light-two"
        />


        <div className="section-inner narrow">


          {/* PHOTO */}

          <Reveal
            direction="scale"
            delay={100}
          >

            <div className="soldier-photo-wrapper">

              <div
                className="photo-back-square"
              />

              <div className="photo-gold-frame">

                <img
                  src={soldierPhoto}
                  alt={`${INVITATION.name} բանակ ճանապարհելու հրավեր`}
                  className="soldier-photo"
                />

                <div
                  className="photo-overlay"
                />

                <div
                  className="photo-shine"
                />

              </div>


              <div
                className="
                  photo-corner
                  photo-corner-top
                "
              />

              <div
                className="
                  photo-corner
                  photo-corner-bottom
                "
              />

            </div>

          </Reveal>



          <Reveal
            direction="scale"
            delay={200}
          >

            <div className="small-emblem">

              <img
                src={emblem}
                alt=""
              />

            </div>

          </Reveal>



          <Reveal
            direction="up"
            delay={280}
          >

            <p className="script-title">
              Սիրելի՛ հարազատներ և ընկերներ,
            </p>

          </Reveal>



          <Reveal
            direction="up"
            delay={380}
          >

            <p className="body-copy">

              Սիրով հրավիրում ենք Ձեզ
              ներկա գտնվելու{' '}
              {INVITATION.name}-ի
              զինվորական ծառայության
              ճանապարհման առիթով
              կազմակերպվող մեր ընտանեկան
              երեկոյին։

            </p>

          </Reveal>



          <Reveal
            direction="up"
            delay={480}
          >

            <p className="body-copy muted-copy">

              Թող այս օրը դառնա ուժի,
              հպարտության,
              բարեմաղթանքի ու ջերմ
              հիշողությունների մի
              գեղեցիկ սկիզբ։

              Ձեր ներկայությունը մեզ
              համար իսկապես կարևոր է։

            </p>

          </Reveal>

        </div>

      </section>



      {/* =================================
          DETAILS
      ================================= */}

      <section className="section details-section">

        <div className="details-orb details-orb-one" />

        <div className="details-orb details-orb-two" />


        <div className="section-inner">


          <Reveal
            direction="up"
          >

            <div className="section-heading">

              <span className="section-icon">

                <ShieldCheck
                  size={22}
                />

              </span>

              <p>
                Հանդիպման մանրամասներ
              </p>

              <h2>
                {INVITATION.date}
              </h2>

            </div>

          </Reveal>


          <div className="detail-cards">


            <Reveal
              direction="left"
              delay={160}
            >

              <article className="detail-card">

                <CalendarDays
                  size={28}
                />

                <span>
                  Ժամը
                </span>

                <strong>
                  {INVITATION.time}
                </strong>

              </article>

            </Reveal>



            <Reveal
              direction="right"
              delay={280}
            >

              <article className="detail-card venue-card">

                <MapPin
                  size={28}
                />

                <span>
                  Վայրը
                </span>

                <strong>
                  {INVITATION.venue}
                </strong>

                <p>
                  {INVITATION.address}
                </p>

                <a
                  href={INVITATION.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ինչպես հասնել
                </a>

              </article>

            </Reveal>

          </div>

        </div>

      </section>



      {/* =================================
          QUOTE
      ================================= */}

      <section className="section quote-section">

        <div className="quote-glow" />


        <div className="section-inner narrow">


          <Reveal
            direction="scale"
          >

            <div className="quote-mark">
              “
            </div>

          </Reveal>


          <Reveal
            direction="up"
            delay={200}
          >

            <blockquote>

              Թող հայրենիքի ճանապարհը
              լինի պատվաբեր,
              ծառայությունը՝ խաղաղ,
              իսկ վերադարձը՝ հաղթական
              ու սպասված։

            </blockquote>

          </Reveal>


          <Reveal
            direction="scale"
            delay={420}
          >

            <div className="gold-divider">
              <span />
            </div>

          </Reveal>

        </div>

      </section>



      {/* =================================
          RSVP
      ================================= */}

      <section className="section rsvp-section">

        <div className="rsvp-decoration rsvp-decoration-one" />

        <div className="rsvp-decoration rsvp-decoration-two" />


        <div className="section-inner form-wrap">


          <Reveal
            direction="up"
          >

            <div className="section-heading light-heading">

              <p>
                Խնդրում ենք հաստատել
              </p>

              <h2>
                Ձեր ներկայությունը
              </h2>

              <span>
                Պատասխանեք մինչև{' '}
                {INVITATION.rsvpDeadline}
              </span>

            </div>

          </Reveal>



          <form
            className="rsvp-form"
            onSubmit={submit}
          >


            <Reveal
              direction="up"
              delay={120}
            >

              <label>

                Անուն Ազգանուն

                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name:
                        e.target.value
                    })
                  }
                  placeholder="Գրեք Ձեր անունը"
                />

              </label>

            </Reveal>



            <Reveal
              direction="up"
              delay={220}
            >

              <div className="radio-group">

                <label className="radio-row">

                  <input
                    type="radio"
                    name="attending"
                    checked={
                      attending ===
                      'yes'
                    }
                    onChange={() =>
                      setAttending(
                        'yes'
                      )
                    }
                  />

                  <span>
                    Սիրով,
                    կմասնակցեմ
                  </span>

                </label>


                <label className="radio-row">

                  <input
                    type="radio"
                    name="attending"
                    checked={
                      attending ===
                      'no'
                    }
                    onChange={() =>
                      setAttending(
                        'no'
                      )
                    }
                  />

                  <span>
                    Ցավոք,
                    չեմ կարող ներկա լինել
                  </span>

                </label>

              </div>

            </Reveal>



            {attending === 'yes' && (

              <div className="guest-picker guest-appear">

                <span>
                  Հյուրերի թիվ
                </span>

                <div className="counter">

                  <button
                    type="button"
                    onClick={() =>
                      setGuests(
                        Math.max(
                          1,
                          guests - 1
                        )
                      )
                    }
                  >
                    −
                  </button>

                  <strong>
                    {guests}
                  </strong>

                  <button
                    type="button"
                    onClick={() =>
                      setGuests(
                        Math.min(
                          10,
                          guests + 1
                        )
                      )
                    }
                  >
                    +
                  </button>

                </div>

              </div>

            )}



            <Reveal
              direction="up"
              delay={340}
            >

              <label>

                Մեկնաբանություն{' '}

                <small>
                  (պարտադիր չէ)
                </small>

                <textarea
                  rows="3"
                  value={form.note}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      note:
                        e.target.value
                    })
                  }
                  placeholder="Ցանկության դեպքում գրեք հաղորդագրություն"
                />

              </label>

            </Reveal>



            <Reveal
              direction="scale"
              delay={440}
            >

              <button
                className="submit-button"
                type="submit"
              >
                Ուղարկել պատասխանը
              </button>

            </Reveal>


            {sent && (

              <p className="success-message success-enter">

                Շնորհակալություն։
                Ձեր պատասխանը հաստատված է:

              </p>

            )}

          </form>

        </div>

      </section>



      {/* =================================
          FOOTER
      ================================= */}

      <footer className="footer">


        <Reveal
          direction="scale"
        >

          <img
            src={emblem}
            alt=""
          />

        </Reveal>


        <Reveal
          direction="up"
          delay={150}
        >

          <p>
            Սիրով սպասում ենք Ձեզ
          </p>

        </Reveal>


        <Reveal
          direction="up"
          delay={260}
        >

          <span>
            AMULET · Online Invitation
          </span>

        </Reveal>

      </footer>

    </main>
  )
}

export default App