// @ts-nocheck
import { useEffect, useState } from "react";
import { wedding } from "@/data/wedding";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

function parts(target: number, now: number) {
  const diff = Math.max(0, target - now);
  const s = Math.floor(diff / 1000);
  return [
    { label: "Days", value: Math.floor(s / 86400) },
    { label: "Hours", value: Math.floor((s % 86400) / 3600) },
    { label: "Minutes", value: Math.floor((s % 3600) / 60) },
    { label: "Seconds", value: s % 60 },
  ];
}

export function Countdown({ dateISO = wedding.date.iso }: { dateISO?: string }) {
  const target = new Date(dateISO).getTime();
  const [now, setNow] = useState(() => target);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const items = parts(target, now);

  return (
    <section className="surface-warm px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow={wedding.date.short} title="Until Our Special Day" />

        <Reveal delay={120}>
          <div className="mt-14 grid grid-cols-2 gap-y-10 sm:grid-cols-4" data-editor-ignore="countdown">
            {items.map((item, i) => (
              <div
                key={item.label}
                className={
                  "flex flex-col items-center " +
                  (i < items.length - 1 ? "sm:border-r sm:border-gold/25" : "")
                }
              >
                <span className="font-display text-[clamp(2.75rem,10vw,4.5rem)] leading-none font-light tabular-nums text-foreground">
                  {String(item.value).padStart(2, "0")}
                </span>
                <span className="eyebrow mt-4">{item.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
