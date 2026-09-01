// @ts-nocheck
import { Navigation } from "lucide-react";
import type { InvitationConfig } from "@/config/invitation";
import { Reveal, RevealScale } from "./Reveal";

export function LocationSection({ data }: { data: InvitationConfig }) {
  const mapsUrl = /^https?:\/\//i.test(data.mapsQuery)
    ? data.mapsQuery
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.mapsQuery)}`;

  return (
    <section className="relative px-5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <Reveal>
            <p className="font-sans text-xs uppercase tracking-[0.45em] text-muted-foreground">
              Where
            </p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">{data.venue}</h2>
            <p className="mt-4 font-sans text-lg text-muted-foreground">{data.address}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-muted-foreground lg:mx-0">
              A candlelit hall wrapped in gardens — easy to find, and impossible to forget.
              Parking is available just around the corner.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full border border-gold/60 bg-card px-7 py-3.5 font-sans text-sm font-medium uppercase tracking-[0.2em] text-foreground shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
            >
              <Navigation className="h-4 w-4 text-primary" aria-hidden="true" />
              Open in Maps
            </a>
          </Reveal>
        </div>

        <RevealScale className="relative">
          <div
            className="absolute -inset-2 rotate-2 rounded-[2rem] opacity-60"
            style={{ background: "var(--gradient-festive)" }}
          />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-gold/40 bg-card p-2 shadow-frame">
            <img
              src={data.venuePhoto.src}
              alt={data.venuePhoto.alt}
              width={data.venuePhoto.width}
              height={data.venuePhoto.height}
              loading="lazy"
              decoding="async"
              className="h-full w-full rounded-[1.4rem] object-cover"
            />
            <div className="glass-card absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
              <span className="min-w-0 truncate font-sans text-sm text-foreground">
                {data.venue} · {data.address}
              </span>
              <span className="shrink-0 text-lg" aria-hidden="true">
                📍
              </span>
            </div>
          </div>
        </RevealScale>
      </div>
    </section>
  );
}
