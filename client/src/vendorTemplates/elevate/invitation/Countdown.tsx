import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { InvitationData } from "@/data/invitation";
import { Reveal, SectionHeading } from "./primitives";

function diff(target: number) {
  const ms = Math.max(target - Date.now(), 0);
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
    done: ms === 0,
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="glass-panel relative flex flex-1 flex-col items-center gap-2 px-3 py-6 sm:px-6 sm:py-10">
      <span aria-hidden className="absolute left-1/2 top-0 h-px w-10 -translate-x-1/2 bg-primary/60" />
      <span className="relative block h-[1.15em] overflow-hidden font-display text-4xl leading-none tabular-nums sm:text-6xl md:text-7xl">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={padded}
            className="block"
            initial={{ y: "70%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-70%", opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {padded}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export function Countdown({ data }: { data: InvitationData }) {
  const target = new Date(data.countdown.targetDate).getTime();
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <section className="section-shell overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading eyebrow={data.countdown.eyebrow} title={data.countdown.title} />
        <Reveal delay={0.15}>
          {t.done ? (
            <p className="mt-14 text-center font-accent text-2xl italic text-primary">
              {data.countdown.finishedLabel}
            </p>
          ) : (
            <div className="mt-14 flex items-stretch gap-2 sm:mt-20 sm:gap-4">
              <Unit value={t.days} label="Օր" />
              <Unit value={t.hours} label="Ժամ" />
              <Unit value={t.minutes} label="Րոպե" />
              <Unit value={t.seconds} label="Վայրկյան" />
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
