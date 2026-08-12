/** Delicate line-style sacred iconography (no cartoon shapes). */
type P = { className?: string; strokeWidth?: number };

const base = (className?: string) => `h-full w-full ${className ?? ""}`;

export function CrossIcon({ className, strokeWidth = 1 }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} aria-hidden>
      <path
        d="M12 2.5v19M5.5 8.5h13"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx="12" cy="8.5" r="1" fill="currentColor" opacity=".5" />
    </svg>
  );
}

export function DoveIcon({ className, strokeWidth = 1 }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} aria-hidden>
      <path
        d="M3 13c3.2.6 5.6-.6 7.3-3.1C12 7.4 14 6 16.6 6c2.2 0 3.9 1.4 4.4 3.4-1 .3-1.7.2-2.4-.2.3 4.6-2.7 8.3-7.2 8.9-3 .4-5.6-.6-7.4-2.6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M11 18.1 9.6 21.5M14 17.6l1.2 3.4"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity=".6"
      />
      <circle cx="17.6" cy="8.4" r=".5" fill="currentColor" />
    </svg>
  );
}

export function ChurchIcon({ className, strokeWidth = 1 }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} aria-hidden>
      <path
        d="M12 1.5v3.5M10.5 3h3M12 5.5 6.5 10v11h11V10L12 5.5Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M10 21v-4a2 2 0 1 1 4 0v4M3 21V13l3.5-2.6M21 21v-8l-3.5-2.6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CandleIcon({ className, strokeWidth = 1 }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} aria-hidden>
      <path
        d="M12 2.5c1.7 1.8 2.5 3 2.5 4.1a2.5 2.5 0 0 1-5 0c0-1.1.8-2.3 2.5-4.1Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <rect
        x="8.5"
        y="10"
        width="7"
        height="11.5"
        rx="1.6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path d="M12 9v1" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function WingsIcon({ className, strokeWidth = 1 }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} aria-hidden>
      <path
        d="M12 7v10M11 8.5C9 6 6 4.8 2.8 5.4c.6 5.4 3.6 9 8.2 9.8M13 8.5c2-2.5 5-3.7 8.2-3.1-.6 5.4-3.6 9-8.2 9.8"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DropIcon({ className, strokeWidth = 1 }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} aria-hidden>
      <path
        d="M12 3.2c3.4 4 5.2 6.8 5.2 9.2a5.2 5.2 0 0 1-10.4 0c0-2.4 1.8-5.2 5.2-9.2Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M9.6 13.4c.1 1.5 1 2.5 2.3 2.8"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity=".6"
      />
    </svg>
  );
}

export function BibleIcon({ className, strokeWidth = 1 }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} aria-hidden>
      <path
        d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v16H5.5A1.5 1.5 0 0 0 4 20.5v-16Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M4 20.5A1.5 1.5 0 0 1 5.5 19H19v2H5.5A1.5 1.5 0 0 1 4 20.5ZM11.5 7v6M9 9.5h5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FloralIcon({ className, strokeWidth = 1 }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} aria-hidden>
      <path
        d="M12 21c0-5 0-8 0-12M12 12c-3.2 0-5-1.6-5-4.4 3 0 5 1.5 5 4.4Zm0 0c3.2 0 5-1.6 5-4.4-3 0-5 1.5-5 4.4Zm0 5c-2.4 0-3.8-1.2-3.8-3.3 2.3 0 3.8 1.1 3.8 3.3Zm0 0c2.4 0 3.8-1.2 3.8-3.3-2.3 0-3.8 1.1-3.8 3.3Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RaysIcon({ className, strokeWidth = 1 }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} aria-hidden>
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth={strokeWidth} />
      <path
        d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity=".7"
      />
    </svg>
  );
}

export function ClockIcon({ className, strokeWidth = 1 }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={strokeWidth} />
      <path
        d="M12 7v5.2l3.2 2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CalendarGlyph({ className, strokeWidth = 1 }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} aria-hidden>
      <rect
        x="3.5"
        y="5"
        width="17"
        height="16"
        rx="2.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path
        d="M3.5 10h17M8 3v4M16 3v4"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PinIcon({ className, strokeWidth = 1 }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} aria-hidden>
      <path
        d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}

export function HallIcon({ className, strokeWidth = 1 }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} aria-hidden>
      <path
        d="M3 21h18M5 21V9l7-5 7 5v12"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M9.5 21v-5a2.5 2.5 0 0 1 5 0v5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GuestsIcon({ className, strokeWidth = 1 }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} aria-hidden>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth={strokeWidth} />
      <path
        d="M3.5 20c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5M16 5.5a3 3 0 0 1 0 5.6M17.5 15.4c1.6.7 2.7 2.3 3 4.6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GlassIcon({ className, strokeWidth = 1 }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} aria-hidden>
      <path
        d="M7 3h10l-1 6a4 4 0 0 1-8 0L7 3ZM12 13v6M8.5 21h7"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MusicIcon({ className, strokeWidth = 1 }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} aria-hidden>
      <path
        d="M9 18V6.5l10-2V16"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="18" r="2.5" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="16.5" cy="16" r="2.5" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}

export function PauseIcon({ className, strokeWidth = 1 }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} aria-hidden>
      <path
        d="M9.5 5v14M14.5 5v14"
        stroke="currentColor"
        strokeWidth={strokeWidth * 1.4}
        strokeLinecap="round"
      />
    </svg>
  );
}

export const detailIcons = {
  calendar: CalendarGlyph,
  clock: ClockIcon,
  church: ChurchIcon,
  pin: PinIcon,
  hall: HallIcon,
  dove: DoveIcon,
} as const;

export const timelineIcons = {
  guests: GuestsIcon,
  cross: CrossIcon,
  blessing: WingsIcon,
  reception: CandleIcon,
  feast: GlassIcon,
} as const;
