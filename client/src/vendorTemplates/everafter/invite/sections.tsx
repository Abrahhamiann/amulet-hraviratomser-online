// @ts-nocheck
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { CalendarDays, Clock, MapPin, Navigation } from "lucide-react";
import portraitAnna from "@/assets/portrait-anna.jpg";
import portraitDavid from "@/assets/portrait-david.jpg";
import mapImg from "@/assets/map-placeholder.jpg";
import { dressPalette, invite, timeline } from "./data";
import {
  FloralSprig,
  GoldParticles,
  GoldRule,
  OrnamentDivider,
  Reveal,
  Section,
  SectionTitle,
  Stagger,
  TwinRings,
  staggerChild,
} from "./decor";

/* ---------------------------------- Story ---------------------------------- */

export function Story() {
  return (
    <Section id="story">
      <SectionTitle eyebrow="Սկիզբը" title="Մեր պատմությունը" />
      <Reveal delay={0.1} className="mt-10 text-center">
        <p className="mx-auto max-w-2xl font-serif text-2xl font-light italic leading-relaxed text-foreground sm:text-3xl">
          &ldquo;Սիրո յուրաքանչյուր պատմություն գեղեցիկ է, բայց մերն ամենասիրելին է։&rdquo;
        </p>
      </Reveal>
      <Stagger className="mt-8 space-y-5 text-center">
        <motion.p
          variants={staggerChild}
          className="mx-auto max-w-2xl text-[0.98rem] leading-8 text-muted-foreground"
        >
          Ամեն ինչ սկսվեց անձրևոտ երևանյան երեկոյից, մեկ ընդհանուր անձրևանոցից և մի զրույցից,
          որը չէր ուզում ավարտվել։ Վեց տարի, անհամար ճանապարհորդություններ և հազարավոր փոքրիկ
          առավոտներ անց մենք ամեն օր կրկին ընտրում ենք միմյանց։
        </motion.p>
        <motion.p
          variants={staggerChild}
          className="mx-auto max-w-2xl text-[0.98rem] leading-8 text-muted-foreground"
        >
          Այս աշնանը մենք նոր գլուխ ենք սկսում և շատ կցանկանանք, որ մեր կողքին լինեք,
          երբ միմյանց հավերժություն խոստանանք։
        </motion.p>
        <motion.div variants={staggerChild} className="flex justify-center pt-2">
          <FloralSprig className="h-16 w-10 opacity-70" />
        </motion.div>
      </Stagger>
    </Section>
  );
}

/* ---------------------------------- Couple --------------------------------- */

function PortraitCard({
  src,
  name,
  role,
  delay,
}: {
  src: string;
  name: string;
  role: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="group flex flex-col items-center">
      <div className="relative">
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[19rem] w-[13rem] overflow-hidden rounded-[50%/40%] border border-gold/50 p-1.5 sm:h-[24rem] sm:w-[17rem]"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <img
            src={src}
            alt={`Portrait of ${name}`}
            loading="lazy"
            width={912}
            height={1200}
            className="h-full w-full rounded-[50%/40%] object-cover transition-transform duration-[1200ms] ease-[var(--ease-silk)] group-hover:scale-105"
          />
        </motion.div>
        <span className="pointer-events-none absolute -inset-2 rounded-[50%/40%] border border-gold/25" />
      </div>
      <h3 className="mt-6 font-script text-4xl text-foreground sm:text-5xl">{name}</h3>
      <p className="eyebrow mt-2">{role}</p>
    </Reveal>
  );
}

export function Couple() {
  return (
    <Section className="panel-veil">
      <SectionTitle eyebrow="Մենք երկուսով" title="Աննա և Դավիթ" script="շուտով նշանադրվելու ենք" />
      <div className="mt-14 flex flex-col items-center gap-12 sm:mt-16 sm:flex-row sm:justify-center sm:gap-10 lg:gap-20">
        <PortraitCard src={portraitAnna} name="Աննա" role="Ապագա հարսնացուն" delay={0} />
        <Reveal delay={0.15} className="flex flex-col items-center">
          <span className="font-script text-5xl text-gold-shine sm:text-6xl">և</span>
        </Reveal>
        <PortraitCard src={portraitDavid} name="Դավիթ" role="Ապագա փեսացուն" delay={0.2} />
      </div>
    </Section>
  );
}

/* ------------------------------ Announcement ------------------------------- */

export function Announcement() {
  const reduced = useReducedMotion();
  return (
    <Section className="relative overflow-hidden bg-cream">
      <GoldParticles count={22} />
      <div className="relative flex flex-col items-center text-center">
        <Reveal>
          <p className="eyebrow">Եվ այսպես սկսվում է</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-5 font-serif text-[clamp(2.6rem,11vw,6rem)] font-light uppercase leading-none tracking-[0.12em] text-foreground">
            Մենք ասացինք
          </h2>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="font-script text-[clamp(4rem,18vw,10rem)] leading-[1.1] text-gold-shine">
            Այո՛
          </p>
        </Reveal>
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4"
        >
          <TwinRings className="mx-auto h-24 w-40 sm:h-32 sm:w-52" />
        </motion.div>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-lg font-serif text-lg font-light italic text-muted-foreground">
            Մեկ հարց, մեկ պատասխան և այն ամենի սկիզբը, ինչի մասին երազել ենք։
          </p>
        </Reveal>
        {!reduced && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            animate={{ opacity: [0.25, 0.55, 0.25] }}
            transition={{ duration: 6, repeat: Infinity }}
            style={{ background: "var(--gradient-blush)" }}
          />
        )}
      </div>
    </Section>
  );
}

/* --------------------------------- Countdown -------------------------------- */

function useCountdown(target: string) {
  const [left, setLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return left;
}

function CountUnit({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="card-soft relative flex min-w-[4.5rem] flex-1 flex-col items-center rounded-2xl px-3 py-5 sm:min-w-[7rem] sm:px-6 sm:py-8">
      <span className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="relative h-[3rem] overflow-hidden sm:h-[4.6rem]">
        <motion.span
          key={padded}
          initial={{ y: "60%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="block font-serif text-4xl font-light tabular-nums text-foreground sm:text-6xl"
        >
          {padded}
        </motion.span>
      </div>
      <span className="eyebrow mt-2 text-[0.58rem] sm:text-[0.65rem]">{label}</span>
    </div>
  );
}

export function Countdown({ dateISO = invite.dateISO }: { dateISO?: string }) {
  const t = useCountdown(dateISO);
  return (
    <Section>
      <SectionTitle eyebrow="Պահպանեք ամսաթիվը" title="Մինչև մեր նշանադրությունը" />
      <Reveal delay={0.15}>
        <div className="mx-auto mt-12 flex max-w-3xl gap-2.5 sm:gap-5" data-editor-ignore="countdown">
          <CountUnit value={t.days} label="Օր" />
          <CountUnit value={t.hours} label="Ժամ" />
          <CountUnit value={t.minutes} label="Րոպե" />
          <CountUnit value={t.seconds} label="Վայրկյան" />
        </div>
      </Reveal>
    </Section>
  );
}

/* ------------------------------- Event Details ------------------------------ */

const details = [
  { icon: CalendarDays, label: "Ամսաթիվ", value: invite.dateLabel, note: "Կիրակի" },
  { icon: Clock, label: "Ժամ", value: invite.timeLabel, note: "Ժամանումը՝ 17:45-ից" },
  { icon: MapPin, label: "Վայր", value: invite.venue, note: "Երևան, Հայաստան" },
];

export function Details() {
  return (
    <Section className="panel-veil">
      <SectionTitle eyebrow="Տոնակատարություն" title="Միջոցառման մանրամասներ" />
      <Stagger className="mt-14 grid gap-6 sm:grid-cols-3">
        {details.map(({ icon: Icon, label, value, note }) => (
          <motion.div
            key={label}
            variants={staggerChild}
            className="card-soft group flex flex-col items-center rounded-3xl px-6 py-10 text-center transition-transform duration-500 ease-[var(--ease-silk)] hover:-translate-y-1.5"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/45 text-gold transition-colors duration-500 group-hover:bg-blush/40">
              <Icon className="h-5 w-5" strokeWidth={1.2} />
            </span>
            <p className="eyebrow mt-5">{label}</p>
            <p className="mt-3 font-serif text-2xl font-light text-foreground">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{note}</p>
          </motion.div>
        ))}
      </Stagger>
    </Section>
  );
}

/* --------------------------------- Location -------------------------------- */

export function Location() {
  return (
    <Section>
      <SectionTitle eyebrow="Ինչպես գտնել մեզ" title="Տոնակատարության վայրը" />
      <Reveal delay={0.1} className="mt-12">
        <div className="card-soft overflow-hidden rounded-3xl">
          <img
            src={mapImg}
            alt={`Illustrated map showing ${invite.venue} in Yerevan`}
            loading="lazy"
            width={1400}
            height={900}
            className="h-52 w-full object-cover sm:h-80"
          />
          <div className="flex flex-col items-center gap-5 px-6 py-9 text-center">
            <h3 className="font-serif text-3xl font-light text-foreground">{invite.venue}</h3>
            <p className="text-sm text-muted-foreground">{invite.address}</p>
            <GoldRule className="w-40" />
            <a
              href={invite.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative isolate inline-flex items-center gap-2 overflow-hidden rounded-full border border-gold bg-[var(--gradient-gold)] px-8 py-3 text-xs uppercase tracking-[0.3em] text-primary-foreground transition-opacity duration-300 hover:opacity-90"
            >
              <Navigation className="relative h-3.5 w-3.5" strokeWidth={1.4} />
              <span className="relative">Բացել քարտեզում</span>
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* --------------------------------- Timeline -------------------------------- */

export function Timeline() {
  return (
    <Section className="panel-veil">
      <SectionTitle eyebrow="Երեկոն" title="Նշանադրության ծրագիր" />
      <div className="relative mx-auto mt-14 max-w-2xl pl-10 sm:pl-0">
        <motion.span
          aria-hidden="true"
          className="absolute left-[0.42rem] top-2 w-px origin-top bg-gradient-to-b from-gold/10 via-gold/60 to-gold/10 sm:left-1/2"
          style={{ bottom: "0.5rem" }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <ul className="space-y-10">
          {timeline.map((item, i) => (
            <Reveal key={item.time} delay={i * 0.08}>
              <li
                className={`relative sm:w-1/2 ${
                  i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:ml-auto sm:pl-12"
                }`}
              >
                <motion.span
                  aria-hidden="true"
                  className={`absolute top-2 h-3 w-3 rounded-full border border-gold bg-background ${
                    i % 2 === 0
                      ? "-left-[2.15rem] sm:left-auto sm:-right-[0.4rem]"
                      : "-left-[2.15rem] sm:-left-[0.4rem]"
                  }`}
                  whileInView={{ boxShadow: "0 0 0 6px color-mix(in oklab, var(--gold) 18%, transparent)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
                <p className="font-sans text-sm tracking-[0.3em] text-gold">{item.time}</p>
                <h3 className="mt-1.5 font-serif text-2xl font-light text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ----------------------------------- Quote ---------------------------------- */

export function Quote() {
  return (
    <Section className="relative overflow-hidden bg-cream">
      <GoldParticles count={14} />
      <div className="relative flex flex-col items-center text-center">
        <span className="font-serif text-7xl leading-none text-gold/50">&ldquo;</span>
        <Reveal>
          <p className="mx-auto mt-2 max-w-3xl font-script text-3xl leading-[1.5] text-foreground sm:text-5xl">
            Ինչից էլ կազմված լինեն մեր հոգիները, նրա և իմ հոգին նույնն են։
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="eyebrow mt-8">Էմիլի Բրոնտե</p>
        </Reveal>
        <Reveal delay={0.2} className="mt-8">
          <TwinRings spin={false} className="h-16 w-28 opacity-70" />
        </Reveal>
      </div>
    </Section>
  );
}

/* -------------------------------- Dress Code -------------------------------- */

export function DressCode({
  palette = dressPalette,
  note = "Մեղմ չեզոք երանգներ, մետաքս և մի փոքր ոսկեգույն․ հագնվեք այնպես, կարծես երեկոն լուսանկար է, որը հավերժ կպահեիք։",
}: {
  palette?: Array<{ name: string; value: string }>;
  note?: string;
} = {}) {
  return (
    <Section>
      <SectionTitle eyebrow="Մի փոքր խնդրանք" title="Դրես կոդ" script="Էլեգանտ / Կոկտեյլային" />
      <Stagger className="mt-12 flex flex-wrap items-start justify-center gap-6 sm:gap-10">
        {palette.map((c, index) => (
          <motion.div key={c.name} variants={staggerChild} className="flex flex-col items-center">
            <motion.span
              data-dress-color-index={index}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.4 }}
              className="block h-14 w-14 rounded-full border border-gold/40 sm:h-16 sm:w-16"
              style={{ background: c.value, boxShadow: "var(--shadow-soft)" }}
            />
            <span className="eyebrow mt-3 text-[0.55rem]">{c.name}</span>
          </motion.div>
        ))}
      </Stagger>
      <Reveal delay={0.2}>
        <p className="mx-auto mt-10 max-w-md text-center text-sm leading-7 text-muted-foreground">
          {note}
        </p>
      </Reveal>
    </Section>
  );
}

/* ---------------------------------- Footer ---------------------------------- */

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-cream px-6 pb-12 pt-4 text-center">
      <GoldParticles count={12} />
      <div className="relative mx-auto max-w-2xl">
        <OrnamentDivider />
        <h2 className="font-script text-5xl text-foreground sm:text-7xl">
          {invite.bride} &amp; {invite.groom}
        </h2>
        <p className="mt-6 font-serif text-lg font-light italic text-muted-foreground">
          &ldquo;Շնորհակալություն մեր պատմության մի մասը լինելու համար։&rdquo;
        </p>
        <p className="mt-6 text-xs uppercase tracking-[0.35em] text-foreground">
          {invite.dateLabel}
        </p>
        <div className="mt-12 flex flex-col items-center gap-2">
          <GoldRule className="w-32" />
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">
            Ստեղծված է <span className="text-gold">Amulet</span>-ով
          </p>
        </div>
      </div>
    </footer>
  );
}
