// @ts-nocheck
import { motion } from "motion/react";
import { useInvitationData } from "../../data/invitation";
import { Rings, Sparkle } from "./Doodles";

const up = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.22, 0.61, 0.36, 1] as const, delay: 0.2 + i * 0.22 },
  }),
};

export function HeroSection() {
  const d = useInvitationData();
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-7 pb-16 pt-20 text-center">
      <Sparkle className="absolute left-6 top-24 h-4 w-4 text-accent" />
      <Sparkle className="absolute right-9 top-40 h-3 w-3 text-rose" />

      <motion.p custom={0} variants={up} initial="hidden" animate="show" className="script-hy max-w-[15rem] text-[0.95rem] leading-relaxed">
        {d.heroWhisper}
      </motion.p>

      <motion.div custom={1} variants={up} initial="hidden" animate="show" className="mt-7">
        <Rings className="h-11 w-16 text-ink/70" />
      </motion.div>

      <motion.h1
        custom={2}
        variants={up}
        initial="hidden"
        animate="show"
        className="mt-8 font-hy text-[3.4rem] font-light leading-[0.95] tracking-[0.02em] text-ink sm:text-[4rem]"
      >
        {d.brideUpper}
        <span className="my-1 block font-display text-[2.1rem] italic text-primary">&</span>
        {d.groomUpper}
      </motion.h1>

      <motion.div custom={3} variants={up} initial="hidden" animate="show" className="mt-9 flex flex-col items-center">
        <span className="caption">{d.eventType.split("").join(" ")}</span>
        <div className="rule-thin my-6 w-16" />
        <p className="font-display text-2xl tracking-[0.22em] text-ink">{d.dateShort}</p>
        <span className="caption mt-4">{d.saveTheDate}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 1 }}
        className="absolute bottom-8 flex flex-col items-center gap-2"
      >
        <span className="script text-sm">scroll</span>
        <motion.span
          animate={{ y: [0, 12, 0], opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="block h-10 w-px bg-ink/50"
        />
      </motion.div>
    </section>
  );
}
