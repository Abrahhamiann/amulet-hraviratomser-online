import { useEffect, useState } from "react";
import { Particles } from "./Particles";
import { CrossIcon, DoveIcon, OliveBranch } from "./Ornaments";
import type { InvitationData } from "@/data/invitation";

export function Hero({ data }: { data: InvitationData }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 120);
    return () => clearTimeout(t);
  }, []);

  const step = (i: number) =>
    ({
      opacity: entered ? 1 : 0,
      transform: entered ? "none" : "translateY(22px)",
      transition: `opacity 1.4s var(--ease-silk) ${i * 260}ms, transform 1.4s var(--ease-silk) ${i * 260}ms`,
    }) as React.CSSProperties;

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      {/* soft heavenly light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 12%, color-mix(in oklab, var(--gold) 16%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="animate-breathe pointer-events-none absolute -top-24 left-1/2 size-[520px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "var(--gradient-halo)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-18%] left-[-10%] size-[420px] rounded-full opacity-60 blur-3xl"
        style={{ background: "color-mix(in oklab, var(--champagne) 70%, transparent)" }}
      />
      <Particles count={22} />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center">
        <div style={step(0)} className="animate-float relative mb-10">
          <span
            aria-hidden
            className="animate-breathe absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
            style={{ background: "var(--gradient-halo)" }}
          />
          <CrossIcon className="relative h-24 w-12 text-gold sm:h-28 sm:w-14" />
        </div>

        <p
          style={step(1)}
          className="whitespace-pre-line text-sm leading-relaxed tracking-[0.16em] text-muted-foreground sm:text-base"
        >
          {data.hero.intro}
        </p>

        <h1
          style={step(2)}
          className="text-gold-gradient mt-6 text-[clamp(3.2rem,17vw,8.5rem)] leading-[0.95] font-light tracking-[0.02em]"
        >
          {data.child.name}
        </h1>

        <div style={step(3)} className="mt-8 flex items-center gap-4 text-gold/70">
          <OliveBranch className="h-6 w-20 sm:w-28" flip />
          <DoveIcon className="h-7 w-11" />
          <OliveBranch className="h-6 w-20 sm:w-28" />
        </div>

        <p
          style={step(4)}
          className="mt-8 font-display text-xl tracking-[0.28em] text-foreground/80 uppercase sm:text-2xl"
        >
          {data.hero.dateLabel}
        </p>
      </div>

      <div
        style={step(5)}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center"
      >
        <span className="text-[0.6rem] tracking-[0.4em] text-muted-foreground uppercase">
          Scroll
        </span>
        <span className="mx-auto mt-3 flex h-9 w-5 justify-center rounded-full border border-gold/40 pt-1.5">
          <span
            className="size-1 rounded-full bg-gold"
            style={{ animation: "amulet-scroll-dot 2.4s var(--ease-silk) infinite" }}
          />
        </span>
      </div>
    </section>
  );
}