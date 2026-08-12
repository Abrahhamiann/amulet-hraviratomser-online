import { MapPin, Navigation } from "lucide-react";
import type { InvitationData } from "@/data/invitation";
import { Reveal, SectionHeading } from "./primitives";

export function VenueSection({ data }: { data: InvitationData }) {
  const { venue } = data;

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={venue.eyebrow} title={venue.title} />

        <div className="mt-14 grid items-stretch gap-px border border-border bg-border sm:mt-20 lg:grid-cols-[1fr_1.2fr]">
          <Reveal className="bg-background">
            <div className="flex h-full flex-col justify-center gap-5 px-7 py-12 md:px-12">
              <MapPin className="h-6 w-6 text-primary" strokeWidth={1.2} />
              <h3 className="display-title text-3xl sm:text-4xl">{venue.name}</h3>
              <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
                {venue.address}
              </p>
              <p className="text-sm font-light leading-relaxed text-muted-foreground">
                {venue.directions}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={venue.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative inline-flex items-center gap-2 overflow-hidden border border-primary/60 px-6 py-3.5 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-primary transition-colors duration-500 hover:text-primary-foreground"
                >
                  <span className="absolute inset-0 origin-left scale-x-0 bg-primary transition-transform duration-700 ease-[var(--ease-elegant)] group-hover:scale-x-100" />
                  <Navigation className="relative z-10 h-4 w-4" strokeWidth={1.4} />
                  <span className="relative z-10">{venue.cta}</span>
                </a>
                <a
                  href={venue.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center border border-border px-6 py-3.5 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground transition-colors duration-500 hover:border-primary/60 hover:text-foreground"
                >
                  Open in Maps
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="bg-background">
            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative block h-full min-h-[280px] overflow-hidden"
            >
              <img
                src={venue.mapImage}
                alt={`Map showing ${venue.name}`}
                width={1600}
                height={1024}
                loading="lazy"
                className="h-full w-full object-cover opacity-55 transition-all duration-[1100ms] ease-[var(--ease-elegant)] group-hover:scale-[1.05] group-hover:opacity-75"
              />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <span aria-hidden className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center">
                <span className="animate-pulse-ring absolute inset-0 rounded-full border border-primary" />
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
