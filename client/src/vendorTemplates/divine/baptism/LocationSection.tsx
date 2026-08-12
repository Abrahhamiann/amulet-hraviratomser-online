import { invitation } from "@/data/invitation";

import { ChurchIcon, HallIcon, PinIcon } from "./icons";
import { Reveal, SectionTitle } from "./primitives";

export function LocationSection() {
  const { churchName, churchAddress, venueName, venueAddress, mapUrl, image } =
    invitation.location;

  return (
    <section className="relative px-6 py-20 sm:py-28">
      <SectionTitle icon="cross" eyebrow="Location">
        Վայր
      </SectionTitle>

      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2 lg:items-stretch">
        <Reveal className="h-full">
          <div className="glass-card flex h-full flex-col justify-center gap-7 rounded-[1.75rem] px-7 py-9">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4">
              <span className="mt-1 h-6 w-6 shrink-0 text-gold">
                <ChurchIcon />
              </span>
              <div className="min-w-0">
                <p className="font-body text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
                  Եկեղեցի
                </p>
                <p className="font-title mt-1 text-lg text-foreground sm:text-xl">{churchName}</p>
                <p className="font-body mt-1 text-sm text-muted-foreground">{churchAddress}</p>
              </div>
            </div>

            <span className="block h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4">
              <span className="mt-1 h-6 w-6 shrink-0 text-gold">
                <HallIcon />
              </span>
              <div className="min-w-0">
                <p className="font-body text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
                  Խնջույքի Վայրը
                </p>
                <p className="font-title mt-1 text-lg text-foreground sm:text-xl">{venueName}</p>
                <p className="font-body mt-1 text-sm text-muted-foreground">{venueAddress}</p>
              </div>
            </div>

            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="font-body inline-flex items-center justify-center gap-3 rounded-full border border-gold/50 bg-ivory/60 px-6 py-3.5 text-xs tracking-[0.24em] text-foreground uppercase transition-all duration-500 hover:border-gold hover:bg-cream hover:shadow-halo"
            >
              <span className="h-4 w-4 text-gold">
                <PinIcon />
              </span>
              Բացել Քարտեզում
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="h-full">
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="group relative block h-64 overflow-hidden rounded-[1.75rem] border border-gold/25 shadow-soft sm:h-full sm:min-h-[20rem]"
          >
            <img
              src={image}
              alt={`${churchName} — ${churchAddress}`}
              loading="lazy"
              width={1400}
              height={900}
              className="h-full w-full object-cover opacity-90 transition-transform duration-[1400ms] group-hover:scale-[1.06]"
            />
            <span
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ivory/70 via-ivory/10 to-transparent"
              aria-hidden
            />
            <span className="glass-card absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-5 py-2.5">
              <span className="font-body text-[0.6rem] tracking-[0.28em] text-foreground uppercase">
                {churchName}
              </span>
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
