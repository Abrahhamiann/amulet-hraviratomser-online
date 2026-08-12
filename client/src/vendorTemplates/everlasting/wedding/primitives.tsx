import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/** Shared cinematic reveal wrapper used across every wedding section. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

/** Section shell: consistent premium rhythm + optional decorative wash. */
export function Section({
  id,
  children,
  className = "",
  tone = "plain",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "plain" | "paper";
}) {
  return (
    <section
      id={id}
      className={`relative w-full px-5 py-24 sm:px-8 sm:py-28 lg:py-36 ${
        tone === "paper" ? "paper" : ""
      } ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  script,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  script?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow ? <p className="eyebrow mb-5">{eyebrow}</p> : null}
      <h2 className="text-4xl leading-[1.1] tracking-[0.02em] sm:text-5xl lg:text-6xl">{title}</h2>
      {script ? (
        <p className="font-script mt-4 text-2xl text-gold-gradient sm:text-3xl">{script}</p>
      ) : null}
      <div className={`hairline mt-7 h-px w-40 ${align === "center" ? "mx-auto" : ""}`} />
    </Reveal>
  );
}

/** Fine botanical divider replacing plain horizontal rules. */
export function Botanical({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 40"
      aria-hidden="true"
      className={`h-10 w-56 text-gold ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
    >
      <path d="M10 20h80" strokeLinecap="round" opacity=".7" />
      <path d="M150 20h80" strokeLinecap="round" opacity=".7" />
      <path d="M120 8c9 6 9 18 0 24-9-6-9-18 0-24Z" />
      <path d="M120 8v24" opacity=".5" />
      <path d="M100 20c5-6 12-6 16 0-4 6-11 6-16 0Z" opacity=".8" />
      <path d="M140 20c-5-6-12-6-16 0 4 6 11 6 16 0Z" opacity=".8" />
      <circle cx="95" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="145" cy="20" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
