import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function diff(target: number): Parts {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

function Unit({ value, label }: { value: number | null; label: string }) {
  const text = value === null ? "--" : String(value).padStart(2, "0");
  return (
    <div className="glass-card relative flex min-w-0 flex-col items-center justify-center rounded-2xl px-2 py-5 sm:rounded-3xl sm:px-6 sm:py-8">
      <span
        className="pointer-events-none absolute inset-x-4 top-0 h-px"
        style={{ background: "var(--gradient-gold)" }}
      />
      <div className="relative h-[1.05em] w-full overflow-hidden text-center font-display text-[2.1rem] leading-none tabular-nums sm:text-6xl">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={text}
            className="block"
            initial={{ y: "60%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-60%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-3 font-sans text-[0.55rem] uppercase tracking-[0.25em] text-muted-foreground sm:text-[0.7rem] sm:tracking-[0.35em]">
        {label}
      </span>
    </div>
  );
}

export function Countdown({ dateISO }: { dateISO: string }) {
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const target = new Date(dateISO).getTime();
    setParts(diff(target));
    const id = setInterval(() => setParts(diff(target)), 1000);
    return () => clearInterval(id);
  }, [dateISO]);

  return (
    <section className="relative overflow-hidden px-5 py-24 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, color-mix(in oklab, var(--sky) 35%, transparent), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="font-sans text-xs uppercase tracking-[0.45em] text-muted-foreground">
            Պահպանեք ամսաթիվը
          </p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl">Մինչև տոնակատարությունը</h2>
          <span className="gold-rule mx-auto mt-6 block w-32" />
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 grid grid-cols-4 gap-2 sm:gap-5">
            <Unit value={parts?.days ?? null} label="Օր" />
            <Unit value={parts?.hours ?? null} label="Ժամ" />
            <Unit value={parts?.minutes ?? null} label="Րոպե" />
            <Unit value={parts?.seconds ?? null} label="Վայրկյան" />
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="mt-8 font-script text-2xl text-primary">
            մինչև մոմերը վառվեն 🕯️
          </p>
        </Reveal>
      </div>
    </section>
  );
}
