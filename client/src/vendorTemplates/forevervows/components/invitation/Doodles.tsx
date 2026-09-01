// @ts-nocheck
import type { SVGProps } from "react";
import { motion } from "motion/react";

type P = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function Rings({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 64 44" className={className} {...p}>
      <g {...base}>
        <circle cx="24" cy="26" r="13" />
        <circle cx="41" cy="26" r="13" />
        <path d="M41 13l-3.4-5.2h6.8L41 13z" />
        <path d="M36 6.6h10" />
      </g>
    </svg>
  );
}

export function Glasses({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 56 52" className={className} {...p}>
      <g {...base}>
        <path d="M12 6l-6 13c-1.6 6 1.6 11 6.6 11S20 25 19 19L14 6z" />
        <path d="M44 6l6 13c1.6 6-1.6 11-6.6 11S36 25 37 19L42 6z" />
        <path d="M13 30v13M43 30v13M7 45h12M37 45h12" />
        <path d="M22 3c4 1.6 8 1.6 12 0" />
        <path d="M26 12l1.6-3.4M31 10l1-2.4" />
      </g>
    </svg>
  );
}

export function Dinner({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 60 48" className={className} {...p}>
      <g {...base}>
        <circle cx="24" cy="26" r="15" />
        <circle cx="24" cy="26" r="9.5" />
        <path d="M46 6v14c0 3 2 4 2 6l-1 18M52 6v14" />
        <path d="M8 6c-2 6 0 9 3 10" />
      </g>
    </svg>
  );
}

export function Dance({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 60 56" className={className} {...p}>
      <g {...base}>
        <circle cx="20" cy="10" r="5" />
        <path d="M20 15v14l-6 22M20 29l7 22M20 20l-9 6M20 20l12 3" />
        <circle cx="44" cy="14" r="4.5" />
        <path d="M44 18.5v12l-4 21M44 30.5l5 21M44 23l-8 0" />
        <path d="M52 6c2.6.6 3.6 2.6 2.6 5" />
      </g>
    </svg>
  );
}

export function Cake({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 58 52" className={className} {...p}>
      <g {...base}>
        <path d="M10 46h38V30c0-3-3-5-8-5H18c-5 0-8 2-8 5v16z" />
        <path d="M10 36c4 3 8 3 12 0s8-3 12 0 8 3 14 0" />
        <path d="M29 25v-7" />
        <path d="M29 18c-2-2.4-.6-4.6 0-5.6.8 1 2.2 3.2 0 5.6z" />
        <path d="M6 46h46" />
      </g>
    </svg>
  );
}

export function Heart({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 32 30" className={className} {...p}>
      <path
        {...base}
        d="M16 27S3 19.4 3 10.8C3 6 6.4 3 10.3 3c2.7 0 4.7 1.5 5.7 3.3C17 4.5 19 3 21.7 3 25.6 3 29 6 29 10.8 29 19.4 16 27 16 27z"
      />
    </svg>
  );
}

export function Sparkle({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...p}>
      <path {...base} d="M12 2c.8 6 3.2 8.4 9.2 10-6 1.6-8.4 4-9.2 10-.8-6-3.2-8.4-9.2-10C8.8 10.4 11.2 8 12 2z" />
    </svg>
  );
}

export function Flower({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 44 60" className={className} {...p}>
      <g {...base}>
        <path d="M22 58V22" />
        <path d="M22 22c-6-3-9-8-8-14 6 0 10 4 11 10" />
        <path d="M22 26c6-3 9-9 8-15-6.4.6-10.4 5-11 11" />
        <path d="M22 40c-5-1-8-4-9-9 5-.6 8.4 2 10 6.6" />
        <path d="M22 46c5-1 8-4 9-9-5-.6-8.4 2-10 6.6" />
      </g>
    </svg>
  );
}

export function Arrow({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 60 40" className={className} {...p}>
      <g {...base}>
        <path d="M4 6c14 22 34 28 52 24" />
        <path d="M48 24c3.6 3.6 6 5 8 6-2.6 1.4-5 3.4-7 6" />
      </g>
    </svg>
  );
}

export function Pin({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 48 60" className={className} {...p}>
      <g {...base}>
        <path d="M24 55c9-13 14-21 14-28A14 14 0 0 0 10 27c0 7 5 15 14 28z" />
        <circle cx="24" cy="26" r="5" />
      </g>
    </svg>
  );
}

export function Shoe({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 68 48" className={className} {...p}>
      <g {...base}>
        <path d="M8 10c2 12 8 18 18 20 8 1.6 14 4 18 12" />
        <path d="M8 10c-2 14 0 24 2 32h34c2-6-2-10-8-12" />
        <path d="M44 42l14-4-6-10" />
      </g>
    </svg>
  );
}

export function Gift({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 56 54" className={className} {...p}>
      <g {...base}>
        <path d="M8 22h40v26H8z" />
        <path d="M4 14h48v8H4zM28 14v34" />
        <path d="M28 14c-4-2-12-4-12-8s7-3 12 8zM28 14c4-2 12-4 12-8s-7-3-12 8z" />
      </g>
    </svg>
  );
}

export function Plane({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 60 46" className={className} {...p}>
      <g {...base}>
        <path d="M4 22L56 4 42 42l-13-11L4 22z" />
        <path d="M29 31l27-27M29 31l-2 11 8-8" />
      </g>
    </svg>
  );
}

export function Camera({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 60 46" className={className} {...p}>
      <g {...base}>
        <path d="M4 14h12l4-6h20l4 6h12v28H4z" />
        <circle cx="30" cy="27" r="9" />
      </g>
    </svg>
  );
}

export function Notes({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 44 46" className={className} {...p}>
      <g {...base}>
        <path d="M16 36V8l22-5v28" />
        <ellipse cx="11" cy="37" rx="6" ry="4.6" />
        <ellipse cx="33" cy="32" rx="6" ry="4.6" />
        <path d="M16 15l22-5" />
      </g>
    </svg>
  );
}

export function Squiggle({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 120 14" className={className} {...p}>
      <path {...base} d="M2 8c10-8 18 6 28 0s18 6 28 0 18 6 28 0 18 6 32 0" />
    </svg>
  );
}

/** Hand-drawn ink circle used to mark the calendar day. */
export function InkCircle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 60" className={className} aria-hidden>
      <motion.path
        d="M46 9C32 3 12 8 8 22c-4 13 8 28 26 29 15 .8 30-8 31-21C66 18 56 9 40 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.4, ease: "easeInOut", delay: 0.35 }}
      />
    </svg>
  );
}

export const timelineIcons = {
  glasses: Glasses,
  rings: Rings,
  dinner: Dinner,
  dance: Dance,
  cake: Cake,
};
