// @ts-nocheck
import { motion, useReducedMotion } from "motion/react";

import { invitation } from "@/data/invitation";

import { LightRays, Particles } from "./Atmosphere";
import { CrossIcon, DoveIcon, FloralIcon } from "./icons";

export function BaptismHero() {
  const reduced = useReducedMotion();
  const ease = [0.22, 0.61, 0.36, 1] as const;
  const rise = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.2, delay, ease },
  });

  return (
    <header className="bg-heaven relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">
      <LightRays />
      <Particles dense />
      <div className="bg-veil pointer-events-none absolute inset-0" aria-hidden />

      {/* halo behind the name */}
      <motion.div
        aria-hidden
        className="animate-halo pointer-events-none absolute h-[26rem] w-[26rem] rounded-full bg-gold-soft/25 blur-3xl sm:h-[34rem] sm:w-[34rem]"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.4, ease }}
      />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center">
        <motion.div
          className="mb-6 flex items-center gap-3 text-gold"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.2, ease }}
        >
          <span className="h-4 w-4 opacity-70">
            <FloralIcon />
          </span>
          <span className="h-9 w-9 sm:h-11 sm:w-11">
            <CrossIcon strokeWidth={0.9} />
          </span>
          <span className="h-4 w-4 -scale-x-100 opacity-70">
            <FloralIcon />
          </span>
        </motion.div>

        <motion.p
          {...rise(0.55)}
          className="font-body text-[0.68rem] tracking-[0.4em] text-muted-foreground uppercase sm:text-xs"
        >
          {invitation.mainTitle}
        </motion.p>

        <motion.div
          className="my-5 h-px w-24 origin-center bg-gradient-to-r from-transparent via-gold to-transparent sm:w-32"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.6, delay: 0.8, ease }}
        />

        <motion.h1
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 30, letterSpacing: "0.3em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.06em" }}
          transition={{ duration: 1.8, delay: 0.95, ease }}
          className="font-display text-gold-gradient text-6xl leading-none font-extralight sm:text-7xl md:text-8xl"
        >
          {invitation.babyName}
        </motion.h1>

        <motion.div
          className="mt-6 mb-7 flex items-center gap-3 text-gold/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.5 }}
        >
          <span className="block h-px w-10 bg-gold/60 sm:w-16" />
          <span className="h-5 w-5">
            <DoveIcon />
          </span>
          <span className="block h-px w-10 bg-gold/60 sm:w-16" />
        </motion.div>

        <motion.p
          {...rise(1.7)}
          className="font-body max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base"
        >
          {invitation.heroDescription}
        </motion.p>

        <motion.p
          {...rise(1.95)}
          className="font-title mt-7 text-lg tracking-[0.2em] text-foreground sm:text-xl"
        >
          {invitation.dateLabel}
        </motion.p>

        <motion.p
          {...rise(2.2)}
          className="font-body mt-6 max-w-sm text-xs leading-relaxed text-muted-foreground/90 italic sm:text-sm"
        >
          {invitation.heroSubtitle}
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 2.6 }}
      >
        <span className="font-body text-[0.6rem] tracking-[0.35em] text-muted-foreground uppercase">
          {invitation.scrollHint}
        </span>
        <motion.span
          className="block h-10 w-px bg-gradient-to-b from-gold to-transparent"
          animate={reduced ? { opacity: 1 } : { opacity: [0.3, 1, 0.3], scaleY: [0.7, 1, 0.7] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </header>
  );
}
