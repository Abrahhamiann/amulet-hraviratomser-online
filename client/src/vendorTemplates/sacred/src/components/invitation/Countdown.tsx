import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";
import { GoldRule } from "./Ornaments";
import type { InvitationData } from "@/data/invitation";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor(ms / 3600000) % 24,
    minutes: Math.floor(ms / 60000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  };
}

export function Countdown({ data }: { data: InvitationData }) {
  const target = new Date(data.event.isoDate).getTime();
  const [time, setTime] = useState(() => diff(target));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div
        aria-hidden
        className="animate-breathe pointer-events-none absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "var(--gradient-halo)" }}
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="font-display text-[clamp(1.9rem,6vw,3rem)] font-light text-foreground">
            {data.countdown.title}
          </h2>
          <GoldRule className="mt-7" />
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6" data-editor-ignore="countdown">
          {units.map((u, i) => (
            <Reveal key={u.label} delay={i * 120}>
              <div
                className="rounded-2xl border border-gold/25 px-3 py-7 transition-shadow duration-700 hover:shadow-[var(--glow-gold)]"
                style={{ background: "color-mix(in oklab, var(--ivory) 70%, transparent)" }}
              >
                <p
                  className="text-gold-gradient font-display text-[clamp(2.4rem,9vw,3.6rem)] leading-none font-light tabular-nums"
                  suppressHydrationWarning
                >
                  {mounted ? String(u.value).padStart(2, "0") : "--"}
                </p>
                <p className="mt-3 text-[0.62rem] tracking-[0.34em] text-muted-foreground uppercase">
                  {u.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={520}>
          <p className="mt-10 text-sm tracking-[0.18em] text-muted-foreground">
            {data.countdown.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
