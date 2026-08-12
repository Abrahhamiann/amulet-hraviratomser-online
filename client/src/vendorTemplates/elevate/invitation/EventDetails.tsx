import { CalendarDays, Clock, MapPin } from "lucide-react";
import type { InvitationData } from "@/data/invitation";
import { Reveal, SectionHeading } from "./primitives";

export function EventDetails({ data }: { data: InvitationData }) {
  const { details } = data;
  const cards = [
    { icon: CalendarDays, ...details.date },
    { icon: Clock, ...details.time },
    { icon: MapPin, ...details.venue },
  ];

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={details.eyebrow} title={details.title} />

        <div className="mt-14 grid gap-px overflow-hidden border border-border bg-border sm:mt-20 md:grid-cols-3">
          {cards.map((card, i) => (
            <Reveal key={card.label} delay={i * 0.12}>
              <article className="group relative flex h-full flex-col items-center gap-4 bg-background px-6 py-12 text-center transition-colors duration-500 hover:bg-card">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-700 ease-[var(--ease-elegant)] group-hover:scale-x-100"
                />
                <card.icon className="h-6 w-6 text-primary" strokeWidth={1.2} />
                <span className="eyebrow">{card.label}</span>
                <p className="display-title text-2xl sm:text-3xl">{card.value}</p>
                <p className="text-sm font-light text-muted-foreground">{card.note}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
