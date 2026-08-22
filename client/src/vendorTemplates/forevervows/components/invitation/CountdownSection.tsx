import { useEffect, useState } from "react";
import { useInvitationData } from "../../data/invitation";
import { Reveal, Section } from "./Reveal";
import { Sparkle } from "./Doodles";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor(ms / 3600000) % 24,
    minutes: Math.floor(ms / 60000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  };
}

export function CountdownSection() {
  const d = useInvitationData();
  const target = new Date(d.date).getTime();
  const [t, setT] = useState(() => diff(target));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const cells = [
    [t.days, d.countdown.labels.days],
    [t.hours, d.countdown.labels.hours],
    [t.minutes, d.countdown.labels.minutes],
    [t.seconds, d.countdown.labels.seconds],
  ] as const;

  return (
    <Section className="relative py-28 text-center" dataEditorIgnore="countdown">
      <Sparkle className="absolute left-8 top-16 h-3.5 w-3.5 text-accent" />
      <Reveal>
        <h2 className="font-hy-sans text-[0.66rem] uppercase leading-relaxed tracking-[0.3em] text-ink/70">
          {d.countdown.heading}
        </h2>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-12 flex items-start justify-center gap-5">
          {cells.map(([value, label], i) => (
            <div key={label} className="flex items-start gap-5">
              <div className="flex min-w-[3rem] flex-col items-center">
                <span className="font-display text-[2.6rem] leading-none text-ink tabular-nums">
                  {mounted ? String(value).padStart(2, "0") : "--"}
                </span>
                <span className="mt-3 font-hy-sans text-[0.5rem] uppercase tracking-[0.18em] text-muted-foreground">
                  {label}
                </span>
              </div>
              {i < cells.length - 1 && <span className="mt-2 font-display text-2xl text-accent">·</span>}
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <p className="script mt-14 text-xl">see you soon</p>
        <p className="script-hy mt-1 text-[0.95rem]">{d.countdown.note}</p>
      </Reveal>
    </Section>
  );
}
