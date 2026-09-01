// @ts-nocheck
import type { ScheduleItem } from "@/config/invitation";
import { Reveal } from "./Reveal";

export function PartyTimeline({ schedule }: { schedule: ScheduleItem[] }) {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 0%, color-mix(in oklab, var(--peach) 45%, transparent), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className="font-sans text-xs uppercase tracking-[0.45em] text-muted-foreground">
            Երեկոյի ծրագիրը
          </p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl">Տոնական ծրագիր</h2>
          <span className="gold-rule mx-auto mt-6 block w-28" />
        </Reveal>

        <ol className="relative mt-14 space-y-8 md:space-y-0">
          <span
            className="absolute left-[13px] top-2 bottom-2 w-px md:left-1/2 md:-translate-x-1/2"
            style={{
              background:
                "linear-gradient(180deg, transparent, color-mix(in oklab, var(--gold) 70%, transparent), transparent)",
            }}
            aria-hidden="true"
          />
          {schedule.map((item, i) => {
            const right = i % 2 === 1;
            return (
              <li
                key={item.time}
                className={`relative grid grid-cols-[28px_minmax(0,1fr)] items-start gap-4 md:grid-cols-2 md:gap-10 md:py-6 ${
                  right ? "" : ""
                }`}
              >
                <span
                  className="mt-3 grid h-3.5 w-3.5 place-items-center justify-self-center rounded-full md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
                  style={{
                    background: "var(--gold)",
                    boxShadow: "0 0 0 5px color-mix(in oklab, var(--gold) 22%, transparent)",
                  }}
                  aria-hidden="true"
                />
                <Reveal
                  delay={i * 0.08}
                  className={
                    right
                      ? "md:col-start-2 md:pl-10 md:text-left"
                      : "md:col-start-1 md:pr-10 md:text-right"
                  }
                >
                  <div className="glass-card rounded-2xl px-6 py-5">
                    <p className="font-display text-2xl text-primary">{item.time}</p>
                    <h3 className="mt-1 font-sans text-lg font-medium tracking-wide text-foreground">
                      {item.title}
                    </h3>
                    {item.note && (
                      <p className="mt-1 font-sans text-sm text-muted-foreground">{item.note}</p>
                    )}
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
