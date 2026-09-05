// @ts-nocheck
import { motion } from "motion/react";
import type { InvitationConfig } from "@/config/invitation";
import { FloatingDecorations } from "./FloatingDecorations";

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroSection({ data, start }: { data: InvitationConfig; start: boolean }) {
  const line = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: start ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.9, delay, ease },
  });

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-hero-glow px-5 py-24 text-center"
    >
      <FloatingDecorations variant="hero" />

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <motion.p
          {...line(0.1)}
          className="font-sans text-[0.7rem] uppercase tracking-[0.5em] text-muted-foreground sm:text-xs"
        >
          Դուք հրավիրված եք
        </motion.p>

        <motion.p {...line(0.28)} className="mt-4 font-script text-3xl text-primary sm:text-4xl">
          միասին տոնելու
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.86, filter: "blur(8px)" }}
          animate={
            start
              ? { opacity: 1, scale: 1, filter: "blur(0px)" }
              : { opacity: 0, scale: 0.86, filter: "blur(8px)" }
          }
          transition={{ duration: 1.15, delay: 0.45, ease }}
          className="birthday-person-name text-gold-gradient mt-3 w-full overflow-visible px-[0.12em] py-[0.16em] font-display text-[3.5rem] leading-[1.18] tracking-tight [overflow-wrap:anywhere] sm:text-[6rem] lg:text-[8rem]"
        >
          {data.birthdayPersonName.toUpperCase()}
        </motion.h1>

        <motion.div {...line(0.75)} className="mt-4 flex items-center justify-center gap-4">
          <span className="gold-rule w-12 sm:w-20" />
          <span className="font-display text-lg tracking-[0.3em] text-foreground sm:text-2xl">
            {data.age}
            -ԱՄՅԱԿ
          </span>
          <span className="gold-rule w-12 sm:w-20" />
        </motion.div>

        <motion.div {...line(0.95)} className="mt-8 space-y-1">
          <p className="font-sans text-base text-foreground/80 sm:text-lg">{data.dateLabel}</p>
          <p className="font-display text-2xl text-primary sm:text-3xl">{data.timeLabel}</p>
          <p className="font-sans text-sm uppercase tracking-[0.35em] text-muted-foreground">
            {data.venue}
          </p>
        </motion.div>

        <motion.div {...line(1.2)} className="mt-12">
          <a
            href="#celebration"
            className="group relative inline-flex min-h-12 items-center gap-3 rounded-full px-8 py-3.5 font-sans text-sm font-medium uppercase tracking-[0.2em] text-accent-foreground shadow-glow transition-transform duration-300 hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            style={{ backgroundImage: "var(--gradient-gold)", backgroundSize: "200% 100%" }}
          >
            Տեսնել հրավերը
            <span className="transition-transform duration-300 group-hover:translate-y-1">↓</span>
          </a>
        </motion.div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{
          background: "linear-gradient(180deg, transparent, var(--cream))",
        }}
      />
    </section>
  );
}
