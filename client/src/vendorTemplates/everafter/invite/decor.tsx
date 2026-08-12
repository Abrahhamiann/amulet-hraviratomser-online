import { motion, useReducedMotion, type Variants } from "motion/react";
import { useMemo, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------- Reveal --------------------------------- */

export function Reveal({
  children,
  delay = 0,
  y = 28,
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
      initial={reduced ? { opacity: 0 } : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
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
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export function Stagger({
  children,
  className,
  amount = 0.25,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------- Ornaments -------------------------------- */

export function GoldRule({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 260 20"
      className={cn("h-5 w-52 text-gold sm:w-64", className)}
      fill="none"
      initial={{ opacity: 0, scaleX: 0.4 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      <path d="M4 10h96" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M160 10h96" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <path
        d="M112 10c6-8 12-8 18 0 6 8 12 8 18 0-6-8-12-8-18 0-6 8-12 8-18 0Z"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      <circle cx="130" cy="10" r="1.6" fill="currentColor" />
    </motion.svg>
  );
}

export function FloralSprig({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 200"
      className={cn("text-gold-soft", className)}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M60 195C60 140 46 96 22 60"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} opacity={0.9 - i * 0.1}>
          <ellipse
            cx={52 - i * 6}
            cy={165 - i * 28}
            rx="17"
            ry="7"
            transform={`rotate(${-28 - i * 6} ${52 - i * 6} ${165 - i * 28})`}
            stroke="currentColor"
            strokeWidth="1"
          />
          <ellipse
            cx={74 - i * 6}
            cy={152 - i * 28}
            rx="15"
            ry="6.5"
            transform={`rotate(${22 + i * 5} ${74 - i * 6} ${152 - i * 28})`}
            stroke="currentColor"
            strokeWidth="1"
          />
        </g>
      ))}
      <circle cx="22" cy="56" r="6" stroke="currentColor" strokeWidth="1" />
      <circle cx="22" cy="56" r="2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

/** Two intertwined engagement rings, gently rotating. */
export function TwinRings({ className, spin = true }: { className?: string; spin?: boolean }) {
  const reduced = useReducedMotion();
  const animate = spin && !reduced;
  return (
    <div className={cn("relative", className)}>
      <motion.svg
        viewBox="0 0 220 140"
        className="h-full w-full text-gold"
        fill="none"
        animate={animate ? { rotateY: [0, 360] } : {}}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: "preserve-3d" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ringGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.9 0.05 92)" />
            <stop offset="45%" stopColor="oklch(0.74 0.1 78)" />
            <stop offset="100%" stopColor="oklch(0.88 0.05 88)" />
          </linearGradient>
        </defs>
        <ellipse cx="88" cy="82" rx="44" ry="46" stroke="url(#ringGold)" strokeWidth="3.5" />
        <ellipse cx="132" cy="82" rx="44" ry="46" stroke="url(#ringGold)" strokeWidth="3.5" />
        <path
          d="M132 36l-7 12h14l-7-12Z"
          fill="url(#ringGold)"
          opacity="0.95"
        />
        <path d="M125 48h14l-7 10-7-10Z" fill="oklch(0.97 0.02 90)" opacity="0.9" />
      </motion.svg>
      {!reduced && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ boxShadow: "var(--shadow-glow)" }}
          animate={{ opacity: [0.35, 0.75, 0.35] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

/* -------------------------------- Particles -------------------------------- */

export function GoldParticles({ count = 18 }: { count?: number }) {
  const reduced = useReducedMotion();
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 97) % 100,
        size: 2 + ((i * 13) % 4),
        delay: (i * 1.7) % 14,
        duration: 16 + ((i * 5) % 12),
        dx: ((i % 5) - 2) * 26,
      })),
    [count],
  );
  if (reduced) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {seeds.map((s, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full bg-gold"
          style={{
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            opacity: 0,
            filter: "blur(0.3px)",
            boxShadow: "0 0 8px color-mix(in oklab, var(--gold) 70%, transparent)",
            animation: `drift-up ${s.duration}s linear ${s.delay}s infinite`,
            ["--dx" as string]: `${s.dx}px`,
          }}
        />
      ))}
    </div>
  );
}

export function Petals({ count = 12 }: { count?: number }) {
  const reduced = useReducedMotion();
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 83) % 100,
        size: 9 + ((i * 7) % 9),
        delay: (i * 2.3) % 18,
        duration: 20 + ((i * 7) % 14),
        dx: ((i % 4) - 2) * 70,
      })),
    [count],
  );
  if (reduced) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {seeds.map((s, i) => (
        <span
          key={i}
          className="absolute top-0 bg-blush"
          style={{
            left: `${s.left}%`,
            width: s.size,
            height: s.size * 0.72,
            opacity: 0,
            borderRadius: "60% 20% 60% 20%",
            animation: `petal-fall ${s.duration}s linear ${s.delay}s infinite`,
            ["--dx" as string]: `${s.dx}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------- Transitions ------------------------------- */

export function CurveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className="relative -mt-px w-full overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 1440 90"
        className="block h-12 w-full text-cream sm:h-20"
        preserveAspectRatio="none"
        style={flip ? { transform: "rotate(180deg)" } : undefined}
      >
        <path d="M0 90V32c240 48 480 48 720 12S1200 0 1440 34v56H0Z" fill="currentColor" />
      </svg>
    </div>
  );
}

export function OrnamentDivider({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 sm:py-14">
      <GoldRule />
      {label ? <p className="eyebrow">{label}</p> : null}
      <FloralSprig className="h-14 w-9 opacity-70" />
    </div>
  );
}

/* --------------------------------- Section --------------------------------- */

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("relative px-5 py-20 sm:px-8 sm:py-28", className)}>
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  script,
}: {
  eyebrow?: string;
  title: string;
  script?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      {eyebrow ? (
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
      ) : null}
      <Reveal delay={0.08}>
        <h2 className="mt-4 font-serif text-3xl font-light tracking-wide text-foreground sm:text-5xl">
          {title}
        </h2>
      </Reveal>
      {script ? (
        <Reveal delay={0.16}>
          <p className="mt-2 font-script text-2xl text-rose sm:text-3xl">{script}</p>
        </Reveal>
      ) : null}
      <Reveal delay={0.22} className="mt-6">
        <GoldRule />
      </Reveal>
    </div>
  );
}
