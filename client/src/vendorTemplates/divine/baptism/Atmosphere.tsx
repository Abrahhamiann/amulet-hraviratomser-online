// @ts-nocheck
/** Gentle floating light particles + drifting rays. Deterministic (SSR-safe). */
const PARTICLES = [
  { l: 6, t: 18, s: 3, d: 0, dur: 15 },
  { l: 15, t: 62, s: 2, d: 2.5, dur: 18 },
  { l: 27, t: 30, s: 4, d: 1.2, dur: 13 },
  { l: 38, t: 78, s: 2, d: 3.4, dur: 20 },
  { l: 47, t: 12, s: 3, d: 0.8, dur: 16 },
  { l: 56, t: 55, s: 2, d: 4.2, dur: 19 },
  { l: 65, t: 26, s: 4, d: 1.8, dur: 14 },
  { l: 74, t: 70, s: 2, d: 3, dur: 21 },
  { l: 83, t: 38, s: 3, d: 2.2, dur: 17 },
  { l: 92, t: 66, s: 2, d: 0.4, dur: 15 },
  { l: 34, t: 46, s: 2, d: 5, dur: 22 },
  { l: 60, t: 86, s: 3, d: 1.5, dur: 18 },
];

export function Particles({ dense = false }: { dense?: boolean }) {
  const list = dense ? PARTICLES : PARTICLES.slice(0, 8);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {list.map((p, i) => (
        <span
          key={i}
          className="animate-float-slow absolute rounded-full bg-gold/50 blur-[1px]"
          style={{
            left: `${p.l}%`,
            top: `${p.t}%`,
            width: p.s,
            height: p.s,
            animationDelay: `${p.d}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

export function LightRays() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="animate-ray absolute -top-1/3 left-1/2 h-[130%] w-[70%] -translate-x-1/2 bg-[conic-gradient(from_200deg_at_50%_0%,transparent_0deg,color-mix(in_oklab,var(--gold-soft)_45%,transparent)_18deg,transparent_38deg,color-mix(in_oklab,var(--sky)_60%,transparent)_58deg,transparent_80deg)] blur-2xl" />
    </div>
  );
}
