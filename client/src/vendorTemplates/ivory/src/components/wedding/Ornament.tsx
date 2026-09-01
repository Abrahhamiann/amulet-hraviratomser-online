// @ts-nocheck
import { cn } from "@/lib/utils";

/** Thin botanical divider used between sections. */
export function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-4 text-gold", className)}>
      <span className="h-px w-16 bg-linear-to-r from-transparent to-current opacity-60 sm:w-24" />
      <svg
        width="34"
        height="18"
        viewBox="0 0 34 18"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M17 2c3.6 3 5.4 5 5.4 7s-1.8 4-5.4 7c-3.6-3-5.4-5-5.4-7S13.4 5 17 2Z"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <path d="M17 9h9M17 9H8" stroke="currentColor" strokeWidth="0.6" opacity="0.7" />
        <circle cx="17" cy="9" r="1.1" fill="currentColor" />
      </svg>
      <span className="h-px w-16 bg-linear-to-l from-transparent to-current opacity-60 sm:w-24" />
    </div>
  );
}

export function Sprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 200"
      fill="none"
      aria-hidden="true"
      className={cn("text-gold-soft", className)}
    >
      <path d="M60 4C60 60 60 140 60 196" stroke="currentColor" strokeWidth="0.9" />
      {Array.from({ length: 8 }).map((_, i) => {
        const y = 24 + i * 21;
        return (
          <g key={i} opacity={0.85}>
            <path
              d={`M60 ${y} C40 ${y - 12} 22 ${y - 4} 14 ${y + 8} C34 ${y + 14} 50 ${y + 8} 60 ${y}Z`}
              stroke="currentColor"
              strokeWidth="0.8"
            />
            <path
              d={`M60 ${y + 10} C80 ${y - 2} 98 ${y + 6} 106 ${y + 18} C86 ${y + 24} 70 ${y + 18} 60 ${y + 10}Z`}
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </g>
        );
      })}
    </svg>
  );
}
