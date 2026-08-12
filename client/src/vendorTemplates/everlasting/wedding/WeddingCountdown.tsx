import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Reveal, Section } from "./primitives";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center px-3 sm:px-8">
      <div className="relative h-[clamp(2.6rem,10vw,5rem)] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            className="block text-[clamp(2.4rem,9vw,4.6rem)] leading-none font-serif tabular-nums"
            initial={{ y: "60%", opacity: 0, filter: "blur(4px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-60%", opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="eyebrow mt-4 text-[0.55rem] sm:text-[0.62rem]">{label}</span>
    </div>
  );
}

export function WeddingCountdown({ iso }: { iso: string }) {
  const target = new Date(iso).getTime();
  const [time, setTime] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <Section id="countdown">
      <Reveal className="text-center">
        <p className="eyebrow">Until We Say</p>
        <p className="font-script mt-3 text-5xl text-gold-gradient sm:text-6xl">“I Do”</p>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mx-auto mt-14 flex max-w-3xl items-start justify-center divide-x divide-border">
          <Unit value={time.days} label="Days" />
          <Unit value={time.hours} label="Hours" />
          <Unit value={time.minutes} label="Minutes" />
          <Unit value={time.seconds} label="Seconds" />
        </div>
        <div className="hairline mx-auto mt-12 h-px w-full max-w-3xl" />
      </Reveal>
    </Section>
  );
}
