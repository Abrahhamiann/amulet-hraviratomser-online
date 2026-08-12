import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { invitation } from "@/data/invitation";

import { Particles } from "./Atmosphere";
import { Reveal, SectionTitle } from "./primitives";

const UNITS = [
  { key: "days", label: "Օր" },
  { key: "hours", label: "Ժամ" },
  { key: "minutes", label: "Րոպե" },
  { key: "seconds", label: "Վայրկյան" },
] as const;

type Left = Record<(typeof UNITS)[number]["key"], number>;

function remaining(target: number): Left {
  const diff = Math.max(0, target - Date.now());
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export function CountdownSection() {
  const [left, setLeft] = useState<Left | null>(null);

  useEffect(() => {
    const target = new Date(invitation.eventISO).getTime();
    setLeft(remaining(target));
    const id = setInterval(() => setLeft(remaining(target)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden px-6 py-20 sm:py-28">
      <Particles />
      <SectionTitle icon="dove" eyebrow="Countdown">
        Մնացել է
      </SectionTitle>

      <Reveal>
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {UNITS.map((u, i) => {
            const value = left ? left[u.key] : null;
            const text = value === null ? "—" : String(value).padStart(2, "0");
            return (
              <div
                key={u.key}
                className="glass-card relative flex flex-col items-center rounded-[1.75rem] px-3 py-7 sm:py-9"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span
                  className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
                  aria-hidden
                />
                <div className="relative h-12 overflow-hidden sm:h-16">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={text}
                      initial={{ y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -18, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
                      className="font-display block text-4xl font-extralight tabular-nums text-foreground sm:text-6xl"
                    >
                      {text}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="font-body mt-3 text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
                  {u.label}
                </span>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
