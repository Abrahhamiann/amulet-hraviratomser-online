import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { CrossIcon, DoveIcon, FloralIcon } from "./icons";

/** Soft fade-up reveal used across every section. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Thin gold rule that draws itself in. */
export function GoldRule({ className = "" }: { className?: string }) {
  return (
    <motion.span
      className={`block h-px w-full origin-center bg-gradient-to-r from-transparent via-gold to-transparent ${className}`}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
    />
  );
}

export function SectionTitle({
  children,
  icon = "cross",
  eyebrow,
}: {
  children: ReactNode;
  icon?: "cross" | "dove" | "floral";
  eyebrow?: string;
}) {
  const Icon = icon === "dove" ? DoveIcon : icon === "floral" ? FloralIcon : CrossIcon;
  return (
    <Reveal className="mx-auto mb-10 flex max-w-2xl flex-col items-center text-center sm:mb-14">
      <span className="mb-4 block h-6 w-6 text-gold sm:h-7 sm:w-7">
        <Icon />
      </span>
      {eyebrow ? (
        <span className="font-body text-[0.65rem] tracking-[0.42em] text-muted-foreground uppercase">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-title mt-2 text-2xl leading-tight font-medium text-foreground sm:text-3xl md:text-[2.4rem]">
        {children}
      </h2>
      <span className="mt-5 flex w-40 items-center gap-2 sm:w-56">
        <GoldRule />
      </span>
    </Reveal>
  );
}

/** Decorative divider between sections — dove / cross ornament on a gold rule. */
export function Divider({ symbol = "dove" }: { symbol?: "dove" | "cross" | "floral" }) {
  const Icon = symbol === "cross" ? CrossIcon : symbol === "floral" ? FloralIcon : DoveIcon;
  return (
    <div className="mx-auto flex w-full max-w-md items-center gap-4 px-6 py-10 sm:py-16">
      <GoldRule />
      <span className="h-5 w-5 shrink-0 text-gold/80 animate-shimmer-line">
        <Icon />
      </span>
      <GoldRule />
    </div>
  );
}

/** Curved cloud-like transition between colored bands. */
export function CurveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`pointer-events-none -mt-px w-full ${flip ? "rotate-180" : ""}`} aria-hidden>
      <svg viewBox="0 0 1440 80" className="block h-10 w-full sm:h-16" preserveAspectRatio="none">
        <path
          d="M0 40C240 90 480 0 720 20s480 90 720 30v40H0Z"
          fill="currentColor"
          className="text-cream/70"
        />
      </svg>
    </div>
  );
}
