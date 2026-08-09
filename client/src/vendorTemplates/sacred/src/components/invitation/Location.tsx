import { MapPin } from "lucide-react";
import { Reveal } from "./Reveal";
import { GoldRule, SectionLabel } from "./Ornaments";
import type { InvitationData } from "@/data/invitation";

export function Location({ data }: { data: InvitationData }) {
  const c = data.celebration;
  return (
    <section className="relative px-6 py-24 sm:py-32">
      <div
        className="mx-auto max-w-2xl rounded-[2rem] border border-gold/25 px-6 py-14 text-center sm:px-12"
        style={{ background: "color-mix(in oklab, var(--ivory) 65%, transparent)", boxShadow: "var(--shadow-soft)" }}
      >
        <Reveal>
          <span className="mx-auto grid size-12 place-items-center rounded-full border border-gold/40 text-gold">
            <MapPin className="size-5" strokeWidth={1.2} />
          </span>
          <SectionLabel>
            <span className="mt-6 block">{c.label}</span>
          </SectionLabel>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,6.5vw,3rem)] font-light text-foreground">
            {c.venue}
          </h2>
          <p className="mt-3 text-sm tracking-[0.24em] text-muted-foreground uppercase">
            {c.city} · {c.timeLabel}
          </p>
          <GoldRule className="mt-8" />
        </Reveal>

        <Reveal delay={200} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={c.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-gold/60 px-8 text-[0.72rem] tracking-[0.32em] text-foreground/80 uppercase transition-all duration-500 hover:bg-gold/12 hover:shadow-[var(--glow-gold)] sm:w-auto"
          >
            Open Map
          </a>
          <a
            href={c.directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full px-8 text-[0.72rem] tracking-[0.32em] text-primary-foreground uppercase transition-all duration-500 hover:shadow-[var(--glow-gold)] sm:w-auto"
            style={{ background: "var(--gradient-gold)" }}
          >
            Get Directions
          </a>
        </Reveal>
      </div>
    </section>
  );
}