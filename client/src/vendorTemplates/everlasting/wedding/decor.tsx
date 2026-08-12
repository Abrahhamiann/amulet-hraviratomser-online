import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";

/** Slow floating petals + gold dust. Purely decorative, pointer-events none. */
export function Petals({ count = 14, gold = false }: { count?: number; gold?: boolean }) {
  const reduced = useReducedMotion();
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 97) % 100,
        size: 6 + ((i * 13) % 12),
        delay: (i * 1.7) % 18,
        duration: 22 + ((i * 5) % 16),
        drift: ((i % 5) - 2) * 40,
        opacity: 0.25 + ((i * 7) % 30) / 100,
      })),
    [count],
  );

  if (reduced) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 block"
          style={{
            left: `${p.left}%`,
            width: gold ? 3 : p.size,
            height: gold ? 3 : p.size * 0.72,
            borderRadius: gold ? "999px" : "60% 20% 60% 20%",
            background: gold
              ? "color-mix(in oklab, var(--gold) 85%, white)"
              : "color-mix(in oklab, var(--blush) 85%, white)",
            opacity: p.opacity,
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

/** Elegant A & D monogram with line-drawing reveal. */
export function CoupleMonogram({
  left,
  right,
  size = 132,
  className = "",
}: {
  left: string;
  right: string;
  size?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    show: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: { pathLength: { duration: 2.2, delay: i * 0.25, ease: "easeInOut" as const }, opacity: { duration: 0.4, delay: i * 0.25 } },
    }),
  };

  return (
    <motion.svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={`text-gold ${className}`}
      role="img"
      aria-label={`Monogram ${left} and ${right}`}
      initial={reduced ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true }}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.7"
    >
      <motion.circle cx="60" cy="60" r="52" variants={draw} custom={0} />
      <motion.circle cx="60" cy="60" r="46" variants={draw} custom={0.6} opacity="0.5" />
      <motion.path d="M60 8c-6 8-6 14 0 20 6-6 6-12 0-20Z" variants={draw} custom={1.2} />
      <motion.path d="M60 112c-6-8-6-14 0-20 6 6 6 12 0 20Z" variants={draw} custom={1.4} />
      <motion.path d="M14 60c8-6 14-6 20 0-6 6-12 6-20 0Z" variants={draw} custom={1.6} />
      <motion.path d="M106 60c-8-6-14-6-20 0 6 6 12 6 20 0Z" variants={draw} custom={1.8} />
      <motion.text
        x="60"
        y="70"
        textAnchor="middle"
        stroke="none"
        fill="currentColor"
        style={{ fontFamily: "'Great Vibes', cursive", fontSize: 30 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.8 }}
      >
        {left} &amp; {right}
      </motion.text>
    </motion.svg>
  );
}
