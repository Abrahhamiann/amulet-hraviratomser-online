// @ts-nocheck
import { CalendarHeart, Clock, MapPin, Sparkles } from "lucide-react";
import type { InvitationConfig } from "@/config/invitation";
import { Reveal } from "./Reveal";

export function EventDetails({ data }: { data: InvitationConfig }) {
  const items = [
    { icon: CalendarHeart, label: "Date", lines: [data.dateLabel], tint: "var(--blush)" },
    { icon: Clock, label: "Time", lines: [data.timeLabel, "Arrive a little early"], tint: "var(--gold-soft)" },
    { icon: MapPin, label: "Location", lines: [data.venue, data.address], tint: "var(--sky)" },
    { icon: Sparkles, label: "Dress Code", lines: [data.dressCode], tint: "var(--lavender)" },
  ];

  return (
    <section className="relative px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="font-sans text-xs uppercase tracking-[0.45em] text-muted-foreground">
            The details
          </p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl">Everything You Need to Know</h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.1}>
              <article
                className="group relative h-full overflow-hidden rounded-[1.6rem] border border-border/70 bg-card p-7 text-center shadow-soft transition-transform duration-500 hover:-translate-y-2 sm:text-left"
                style={{
                  borderTopLeftRadius: i % 2 === 0 ? "3rem" : undefined,
                  borderBottomRightRadius: i % 2 === 1 ? "3rem" : undefined,
                }}
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-50 blur-2xl transition-opacity duration-500 group-hover:opacity-90"
                  style={{ background: item.tint }}
                />
                <div
                  className="relative mx-auto grid h-12 w-12 shrink-0 place-items-center rounded-2xl sm:mx-0"
                  style={{ background: `color-mix(in oklab, ${item.tint} 55%, white)` }}
                >
                  <item.icon className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
                </div>
                <h3 className="relative mt-5 font-sans text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground">
                  {item.label}
                </h3>
                {item.lines.map((line, li) => (
                  <p
                    key={line}
                    className={
                      li === 0
                        ? "relative mt-2 font-display text-xl leading-snug text-foreground"
                        : "relative mt-1 font-sans text-sm text-muted-foreground"
                    }
                  >
                    {line}
                  </p>
                ))}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
