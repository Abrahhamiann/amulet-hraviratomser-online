import { CalendarDays, Church, Clock } from "lucide-react";
import { Reveal } from "./Reveal";
import { GoldRule, SectionLabel } from "./Ornaments";
import type { InvitationData } from "@/data/invitation";

export function EventDetails({ data }: { data: InvitationData }) {
  const items = [
    { Icon: CalendarDays, label: data.event.dateLabel, note: "Date" },
    { Icon: Clock, label: data.event.timeLabel, note: "Time" },
    { Icon: Church, label: data.event.venue, note: data.event.city },
  ];

  return (
    <section className="relative px-6 py-24 sm:py-32">
      <div
        className="mx-auto max-w-3xl rounded-[2rem] border border-gold/25 px-6 py-14 text-center sm:px-12"
        style={{ background: "color-mix(in oklab, var(--cream) 55%, transparent)", boxShadow: "var(--shadow-soft)" }}
      >
        <Reveal>
          <SectionLabel>Ceremony</SectionLabel>
          <h2 className="mt-4 font-display text-[clamp(2rem,7vw,3.25rem)] font-light tracking-wide text-foreground">
            {data.event.title}
          </h2>
          <GoldRule className="mt-7" />
        </Reveal>

        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {items.map(({ Icon, label, note }, i) => (
            <Reveal key={note} delay={150 * i} className="flex flex-col items-center gap-3">
              <span className="grid size-12 place-items-center rounded-full border border-gold/40 text-gold">
                <Icon className="size-5" strokeWidth={1.2} />
              </span>
              <span className="font-display text-xl text-foreground">{label}</span>
              <span className="text-[0.68rem] tracking-[0.3em] text-muted-foreground uppercase">
                {note}
              </span>
            </Reveal>
          ))}
        </div>

        <Reveal delay={480}>
          <a
            href={data.event.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-12 inline-flex min-h-12 items-center justify-center rounded-full border border-gold/60 px-9 text-[0.72rem] tracking-[0.32em] text-foreground/80 uppercase transition-all duration-500 hover:bg-gold/12 hover:text-foreground hover:shadow-[var(--glow-gold)]"
          >
            View Location
          </a>
        </Reveal>
      </div>
    </section>
  );
}