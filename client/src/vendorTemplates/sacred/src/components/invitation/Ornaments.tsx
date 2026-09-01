// @ts-nocheck
import { cn } from "@/lib/utils";

type IconProps = { className?: string };

export function CrossIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 48" fill="none" aria-hidden className={className}>
      <path
        d="M12 2v44M3 14h18"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DoveIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 40" fill="none" aria-hidden className={className}>
      <path
        d="M4 26c9 3 17 1 23-5 5-5 9-10 16-11-1 4-3 7-6 9 5 0 9-1 13-4-1 7-6 13-13 16-7 3-15 3-22 0"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <path d="M27 21c-3 6-8 11-15 14" stroke="currentColor" strokeWidth="0.7" />
      <circle cx="47" cy="12" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function OliveBranch({ className, flip }: IconProps & { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      aria-hidden
      className={cn(className, flip && "-scale-x-100")}
    >
      <path d="M4 32C30 30 70 22 116 8" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      {[18, 36, 54, 72, 90].map((x, i) => (
        <g key={x}>
          <ellipse
            cx={x}
            cy={30 - i * 3.6}
            rx="7"
            ry="2.6"
            transform={`rotate(-28 ${x} ${30 - i * 3.6})`}
            stroke="currentColor"
            strokeWidth="0.7"
          />
          <ellipse
            cx={x + 6}
            cy={34 - i * 3.6}
            rx="6"
            ry="2.3"
            transform={`rotate(22 ${x + 6} ${34 - i * 3.6})`}
            stroke="currentColor"
            strokeWidth="0.7"
          />
        </g>
      ))}
    </svg>
  );
}

export function GoldRule({ className }: IconProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3 text-gold", className)}>
      <span className="rule-gold w-16 sm:w-24" />
      <svg viewBox="0 0 12 12" className="size-2.5" aria-hidden>
        <path d="M6 0l1.6 4.4L12 6l-4.4 1.6L6 12l-1.6-4.4L0 6l4.4-1.6z" fill="currentColor" />
      </svg>
      <span className="rule-gold w-16 sm:w-24" />
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.68rem] uppercase tracking-[0.42em] text-muted-foreground">
      {children}
    </p>
  );
}
