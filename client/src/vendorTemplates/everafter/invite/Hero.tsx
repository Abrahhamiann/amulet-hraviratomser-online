// @ts-nocheck
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import heroFloral from "@/assets/hero-floral.jpg";
import { invite } from "./data";
import { FloralSprig, GoldParticles, Petals, TwinRings } from "./decor";

const letters = (word: string) => Array.from(word);

function ScriptName({ text, delay }: { text: string; delay: number }) {
  const reduced = useReducedMotion();
  return (
    <span className="inline-block whitespace-nowrap">
      {letters(text).map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          className="inline-block"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 34, rotate: -6, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, rotate: 0, filter: "blur(0px)" }}
          transition={{
            duration: 1.1,
            delay: delay + i * 0.07,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={ref} className="relative min-h-[100svh] overflow-hidden">
      <motion.img
        src={heroFloral}
        alt="Blush roses and gold leaf watercolour border"
        width={1920}
        height={1280}
        className="absolute inset-0 h-[115%] w-full object-cover"
        style={reduced ? {} : { y: bgY }}
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-0 bg-[var(--gradient-blush)] opacity-40" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />

      <Petals count={10} />
      <GoldParticles count={16} />

      <FloralSprig className="absolute -left-4 top-10 h-40 w-24 opacity-50 sm:h-56 sm:w-32" />
      <FloralSprig flip className="absolute -right-4 bottom-24 h-40 w-24 opacity-50 sm:h-56 sm:w-32" />

      <motion.div
        style={reduced ? {} : { y: contentY, opacity: fade }}
        className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center"
      >
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          We&rsquo;re Getting Engaged
        </motion.p>

        <h1 className="mt-6 font-script text-[clamp(3rem,13vw,7.5rem)] leading-[1.05] text-foreground">
          <ScriptName text={invite.bride} delay={0.55} />
          <motion.span
            className="mx-3 inline-block text-gold-shine sm:mx-5"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 1.05 }}
          >
            &
          </motion.span>
          <ScriptName text={invite.groom} delay={1.25} />
        </h1>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 1.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <TwinRings className="mx-auto h-20 w-32 sm:h-28 sm:w-44" />
        </motion.div>

        <motion.p
          className="mt-6 max-w-md font-serif text-lg font-light italic text-muted-foreground sm:text-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2 }}
        >
          &ldquo;Միասին լինելը աշխարհի ամենագեղեցիկ վայրն է։&rdquo;
        </motion.p>

        <motion.p
          className="mt-6 font-sans text-sm tracking-[0.35em] uppercase text-foreground"
          initial={{ opacity: 0, letterSpacing: "0.8em" }}
          animate={{ opacity: 1, letterSpacing: "0.35em" }}
          transition={{ duration: 1.4, delay: 2.2 }}
        >
          {invite.dateLabel}
        </motion.p>
      </motion.div>

      <motion.a
        href="#story"
        className="absolute inset-x-0 bottom-7 mx-auto flex w-fit flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.6 }}
        aria-label="Ոլորեք՝ հրավերը բացահայտելու համար"
      >
        <span className="eyebrow text-[0.6rem]">Ոլորեք՝ բացահայտելու համար</span>
        <motion.span
          className="block h-10 w-px bg-gradient-to-b from-transparent via-gold to-transparent"
          animate={reduced ? {} : { scaleY: [0.4, 1, 0.4], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.a>
    </div>
  );
}
