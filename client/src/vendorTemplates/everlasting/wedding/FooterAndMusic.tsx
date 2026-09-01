// @ts-nocheck
import { motion, useReducedMotion } from "motion/react";
import { Music, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { WeddingConfig } from "@/data/wedding";
import { CoupleMonogram, Petals } from "./decor";
import { Reveal } from "./primitives";

export function MusicToggle({ music }: { music: WeddingConfig["music"] }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => () => ref.current?.pause(), []);

  if (!music.enabled) return null;

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.volume = 0.35;
      void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  return (
    <>
      <audio ref={ref} src={music.src} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Դադարեցնել երաժշտությունը" : `Միացնել՝ ${music.label}`}
        className="fixed right-4 bottom-4 z-40 grid h-12 w-12 place-items-center rounded-full border backdrop-blur-sm sm:right-6 sm:bottom-6"
        style={{
          borderColor: "color-mix(in oklab, var(--gold) 55%, transparent)",
          background: "color-mix(in oklab, var(--ivory) 82%, transparent)",
        }}
      >
        <motion.span
          animate={playing && !reduced ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 9, repeat: playing ? Infinity : 0, ease: "linear" }}
          className="grid place-items-center text-primary"
        >
          {playing ? <Pause className="h-4 w-4" strokeWidth={1.2} /> : <Music className="h-4 w-4" strokeWidth={1.2} />}
        </motion.span>
      </button>
    </>
  );
}

export function WeddingFooter({ config }: { config: WeddingConfig }) {
  return (
    <footer className="relative overflow-hidden px-5 py-28 text-center paper sm:py-36">
      <Petals count={10} gold />
      <div className="relative mx-auto max-w-2xl">
        <Reveal className="flex justify-center">
          <CoupleMonogram
            left={config.couple.initials.left}
            right={config.couple.initials.right}
            size={110}
          />
        </Reveal>
        <Reveal delay={0.12}>
          <p className="font-script mt-10 text-[clamp(3rem,12vw,6rem)] leading-none text-gold-gradient">
            {config.couple.bride.name} &amp; {config.couple.groom.name}
          </p>
          <p className="mt-6 text-sm tracking-[0.4em] uppercase text-muted-foreground">
            {config.date.long}
          </p>
          <p className="mx-auto mt-8 max-w-md text-base leading-relaxed">
            {config.footer.message}
          </p>
        </Reveal>
        <div className="hairline mx-auto mt-16 h-px w-40" />
        <p className="mt-8 text-[0.6rem] tracking-[0.35em] uppercase text-muted-foreground">
          {config.footer.brand}
        </p>
      </div>
    </footer>
  );
}
