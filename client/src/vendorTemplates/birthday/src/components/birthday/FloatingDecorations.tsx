// @ts-nocheck
import { pickColor, seeded } from "./decor";

function Balloon({ color, size }: { color: string; size: number }) {
  return (
    <svg
      width={size}
      height={size * 1.45}
      viewBox="0 0 60 87"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <ellipse cx="30" cy="32" rx="24" ry="30" fill={color} opacity="0.85" />
      <ellipse cx="21" cy="22" rx="7" ry="10" fill="white" opacity="0.35" />
      <path d="M30 62 l-5 7 h10 z" fill={color} opacity="0.9" />
      <path
        d="M30 69 c6 8 -6 10 0 18"
        stroke="var(--gold)"
        strokeWidth="1.2"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

function Ribbon({ color }: { color: string }) {
  return (
    <svg width="70" height="26" viewBox="0 0 70 26" aria-hidden="true">
      <path
        d="M2 14 C14 2 24 24 36 12 S58 2 68 14"
        stroke={color}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}

function Sparkle({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 0 L14 9 L24 12 L14 15 L12 24 L10 15 L0 12 L10 9 Z"
        fill={color}
        opacity="0.9"
      />
    </svg>
  );
}

type Props = {
  /** Density preset. Mobile automatically renders fewer items. */
  variant?: "hero" | "ambient";
};

export function FloatingDecorations({ variant = "ambient" }: Props) {
  const rand = seeded(variant === "hero" ? 7 : 21);
  const balloonCount = variant === "hero" ? 9 : 5;
  const confettiCount = variant === "hero" ? 26 : 14;
  const starCount = variant === "hero" ? 22 : 12;

  const balloons = Array.from({ length: balloonCount }, (_, i) => ({
    id: i,
    left: 3 + rand() * 92,
    size: 26 + rand() * 34,
    delay: rand() * 14,
    duration: 20 + rand() * 16,
    drift: (rand() - 0.5) * 160,
    color: pickColor(i),
    hideOnMobile: i % 3 === 2,
  }));

  const confetti = Array.from({ length: confettiCount }, (_, i) => ({
    id: i,
    left: rand() * 100,
    w: 4 + rand() * 5,
    h: 8 + rand() * 10,
    delay: rand() * 12,
    duration: 9 + rand() * 10,
    drift: (rand() - 0.5) * 180,
    radius: rand() > 0.6 ? "50%" : "2px",
    color: pickColor(i + 2),
    hideOnMobile: i % 2 === 1,
  }));

  const stars = Array.from({ length: starCount }, (_, i) => ({
    id: i,
    left: rand() * 98,
    top: rand() * 96,
    size: 7 + rand() * 12,
    delay: rand() * 4,
    color: i % 3 === 0 ? "var(--gold)" : "var(--gold-soft)",
    hideOnMobile: i % 2 === 1,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={`s${s.id}`}
          className={`twinkle absolute ${s.hideOnMobile ? "hidden md:block" : ""}`}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            animationDelay: `${s.delay}s`,
            willChange: "transform, opacity",
          }}
        >
          <Sparkle size={s.size} color={s.color} />
        </span>
      ))}

      {confetti.map((c) => (
        <span
          key={`c${c.id}`}
          className={`absolute top-0 ${c.hideOnMobile ? "hidden md:block" : ""}`}
          style={{
            left: `${c.left}%`,
            width: c.w,
            height: c.h,
            borderRadius: c.radius,
            background: c.color,
            opacity: 0.85,
            animation: `fall ${c.duration}s linear ${c.delay}s infinite`,
            ["--drift" as string]: `${c.drift}px`,
            willChange: "transform, opacity",
          }}
        />
      ))}

      {balloons.map((b) => (
        <span
          key={`b${b.id}`}
          className={`absolute bottom-0 ${b.hideOnMobile ? "hidden md:block" : ""}`}
          style={{
            left: `${b.left}%`,
            animation: `rise ${b.duration}s linear ${b.delay}s infinite`,
            ["--drift" as string]: `${b.drift}px`,
            willChange: "transform, opacity",
          }}
        >
          <Balloon color={b.color} size={b.size} />
        </span>
      ))}

      <span className="sway absolute left-[6%] top-[22%] hidden lg:block">
        <Ribbon color="var(--coral)" />
      </span>
      <span
        className="sway absolute right-[8%] top-[38%] hidden lg:block"
        style={{ animationDelay: "3s" }}
      >
        <Ribbon color="var(--lavender)" />
      </span>
      <span
        className="sway absolute left-[14%] bottom-[18%] hidden lg:block"
        style={{ animationDelay: "6s" }}
      >
        <Ribbon color="var(--gold)" />
      </span>
    </div>
  );
}
