import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { WeddingConfig } from "@/data/wedding";
import { Petals } from "./decor";
import { Botanical } from "./primitives";

export function WeddingHero({ config, started }: { config: WeddingConfig; started: boolean }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const t = (d: number) => ({
    duration: 1.6,
    delay: reduced ? 0 : d,
    ease: [0.22, 1, 0.36, 1] as const,
  });
  const anim = started ? "show" : "hidden";

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 text-center"
    >
      <motion.img
        src={config.hero.background}
        alt="Ivory and blush roses in warm light"
        width={1600}
        height={1200}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ y: imgY }}
        initial={{ scale: 1.14, filter: "blur(18px)", opacity: 0 }}
        animate={started ? { scale: 1, filter: "blur(0px)", opacity: 1 } : {}}
        transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "var(--gradient-veil)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "color-mix(in oklab, var(--ivory) 32%, transparent)" }}
      />
      <Petals count={12} />
      <Petals count={10} gold />

      <motion.div className="relative z-10 mx-auto max-w-2xl" style={{ opacity: fade }}>
        <motion.p
          className="eyebrow"
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          initial="hidden"
          animate={anim}
          transition={t(0.4)}
        >
          {config.hero.kicker}
        </motion.p>

        <motion.h1
          className="font-script mt-6 text-[clamp(3.4rem,15vw,8.5rem)] leading-[0.95] text-gold-gradient"
          variants={{
            hidden: { opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" },
            show: { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" },
          }}
          initial="hidden"
          animate={anim}
          transition={{ duration: 2.4, delay: reduced ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {config.couple.bride.name} &amp; {config.couple.groom.name}
        </motion.h1>

        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 1 } : {}}
          transition={t(1.5)}
        >
          <Botanical />
        </motion.div>

        <motion.p
          className="mt-6 text-sm tracking-[0.42em] uppercase"
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
          initial="hidden"
          animate={anim}
          transition={t(1.7)}
        >
          {config.hero.dateLabel}
        </motion.p>

        <motion.p
          className="mx-auto mt-8 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
          initial="hidden"
          animate={anim}
          transition={t(2)}
        >
          {config.hero.invitation}
        </motion.p>
      </motion.div>

      <motion.a
        href="#story"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={started ? { opacity: 1 } : {}}
        transition={t(2.4)}
        style={{ opacity: fade }}
      >
        <span className="eyebrow block text-[0.6rem]">{config.hero.scrollLabel}</span>
        <motion.span
          aria-hidden="true"
          className="mx-auto mt-3 block h-12 w-px"
          style={{ background: "linear-gradient(var(--gold), transparent)" }}
          animate={reduced ? {} : { scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.a>
    </section>
  );
}
