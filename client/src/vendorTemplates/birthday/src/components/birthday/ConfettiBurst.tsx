import { pickColor, seeded } from "./decor";

/** One-shot confetti burst. Remount (change `fireKey`) to replay. */
export function ConfettiBurst({ pieces = 60, seed = 3 }: { pieces?: number; seed?: number }) {
  const rand = seeded(seed);
  const items = Array.from({ length: pieces }, (_, i) => {
    const angle = rand() * Math.PI * 2;
    const dist = 90 + rand() * 320;
    return {
      id: i,
      bx: Math.cos(angle) * dist,
      by: Math.sin(angle) * dist - 60,
      w: 5 + rand() * 6,
      h: 9 + rand() * 12,
      delay: rand() * 0.25,
      duration: 1.1 + rand() * 1.1,
      color: pickColor(i),
      radius: rand() > 0.65 ? "50%" : "2px",
    };
  });

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-0 w-0"
      aria-hidden="true"
    >
      {items.map((p) => (
        <span
          key={p.id}
          className="absolute"
          style={{
            width: p.w,
            height: p.h,
            background: p.color,
            borderRadius: p.radius,
            animation: `burst ${p.duration}s cubic-bezier(0.16,1,0.3,1) ${p.delay}s forwards`,
            ["--bx" as string]: `${p.bx}px`,
            ["--by" as string]: `${p.by}px`,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}
