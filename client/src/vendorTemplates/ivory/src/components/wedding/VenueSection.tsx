import { MapPin, Clock } from "lucide-react";
import { Reveal } from "./Reveal";

type Venue = {
  label: string;
  name: string;
  time: string;
  address: string;
  image: string;
  mapUrl: string;
};

export function VenueSection({ venue, reverse = false }: { venue: Venue; reverse?: boolean }) {
  return (
    <section className="px-5 py-14 sm:py-20">
      <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className={reverse ? "lg:order-2" : ""}>
          <div className="border border-border/70 bg-card p-2 shadow-[var(--shadow-soft)]">
            <img
              src={venue.image}
              alt={venue.name}
              loading="lazy"
              width={1408}
              height={1008}
              className="h-[clamp(15rem,44vw,24rem)] w-full object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={120} className={reverse ? "lg:order-1 lg:text-right" : ""}>
          <p className="eyebrow">{venue.label}</p>
          <h3 className="mt-4 font-display text-[clamp(1.9rem,5vw,2.75rem)] leading-tight font-light text-foreground">
            {venue.name}
          </h3>

          <div
            className={
              "mt-6 space-y-3 text-sm text-muted-foreground " +
              (reverse ? "lg:flex lg:flex-col lg:items-end" : "")
            }
          >
            <p className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.2} aria-hidden />
              <span>{venue.time}</span>
            </p>
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.2} aria-hidden />
              <span className="min-w-0">{venue.address}</span>
            </p>
          </div>

          <a
            href={venue.mapUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-8 inline-flex min-h-11 items-center justify-center border border-gold/60 px-8 text-[0.7rem] tracking-[0.28em] uppercase text-foreground transition-colors duration-500 hover:bg-gold/12"
          >
            Բացել քարտեզում
          </a>
        </Reveal>
      </div>
    </section>
  );
}
