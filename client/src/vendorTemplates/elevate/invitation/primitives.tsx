import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Fade-up scroll reveal with an elegant easing curve. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "span" | "li" | "section";
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/** A thin gold rule that draws itself into place on scroll. */
export function GoldLine({
  className,
  vertical = false,
}: {
  className?: string;
  vertical?: boolean;
}) {
  return (
    <motion.span
      aria-hidden
      className={cn(
        "block bg-gradient-to-r from-transparent via-primary/70 to-transparent",
        vertical && "bg-gradient-to-b",
        className,
      )}
      initial={{ scaleX: vertical ? 1 : 0, scaleY: vertical ? 0 : 1, opacity: 0 }}
      whileInView={{ scaleX: 1, scaleY: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: vertical ? "top" : "center" }}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
      ) : null}
      <Reveal delay={0.08}>
        <h2 className="display-title text-balance text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem]">
          {title}
        </h2>
      </Reveal>
      <GoldLine className={cn("h-px w-24", align === "left" && "self-start")} />
    </div>
  );
}

/** Company mark: uploaded logo when present, elegant monogram otherwise. */
export function BrandMark({
  logoUrl,
  monogram,
  name,
  size = "md",
}: {
  logoUrl?: string;
  monogram: string;
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "lg" ? "h-24 w-24" : size === "sm" ? "h-12 w-12" : "h-16 w-16";
  return (
    <div className={cn("relative grid shrink-0 place-items-center", dim)}>
      <motion.span
        aria-hidden
        className="absolute inset-0 border border-primary/40"
        initial={{ opacity: 0, scale: 0.7, rotate: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: 45 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="relative h-2/3 w-2/3 object-contain"
          loading="lazy"
        />
      ) : (
        <span className="text-gold-gradient relative font-display text-2xl leading-none">
          {monogram}
        </span>
      )}
    </div>
  );
}

/** Counts up to a value once the element enters the viewport. */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const duration = 1600;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, reduced]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}
