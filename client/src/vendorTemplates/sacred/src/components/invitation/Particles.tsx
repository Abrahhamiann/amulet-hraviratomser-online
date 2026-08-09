import { useMemo } from "react";
import { cn } from "@/lib/utils";

type ParticlesProps = { count?: number; className?: string };

/** Delicate floating golden particles. Deterministic so SSR and client match. */
export function Particles({ count = 18, className }: ParticlesProps) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const r = seed / 233280;
        const r2 = ((i * 4177 + 12345) % 65536) / 65536;
        return {
          left: `${(r * 100).toFixed(2)}%`,
          top: `${(r2 * 100).toFixed(2)}%`,
          size: 2 + r2 * 3,
          duration: 12 + r * 14,
          delay: -(r2 * 18),
          dx: `${(r - 0.5) * 60}px`,
        };
      }),
    [count],
  );

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-gold/70"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            filter: "blur(0.4px)",
            boxShadow: "0 0 8px color-mix(in oklab, var(--gold) 60%, transparent)",
            animation: `amulet-drift ${d.duration}s linear ${d.delay}s infinite`,
            ["--dx" as string]: d.dx,
          }}
        />
      ))}
    </div>
  );
}