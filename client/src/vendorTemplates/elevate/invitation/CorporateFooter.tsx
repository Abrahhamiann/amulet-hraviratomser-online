// @ts-nocheck
import type { InvitationData } from "@/data/invitation";
import { BrandMark, GoldLine, Reveal } from "./primitives";

export function CorporateFooter({ data }: { data: InvitationData }) {
  const { finale, brand } = data;

  return (
    <footer className="relative overflow-hidden px-5 py-24 text-center md:px-10 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="grid-pattern absolute inset-0 opacity-40" />
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary/30 via-transparent to-primary/30" />
        <div className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center">
        <Reveal>
          <h2 className="display-title text-balance text-3xl sm:text-5xl md:text-6xl">
            {finale.title}
          </h2>
        </Reveal>
        <GoldLine className="mt-8 h-px w-32" />
        <Reveal delay={0.1}>
          <p className="mt-8 text-sm uppercase tracking-[0.4em] text-primary sm:text-base">
            {finale.date}
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="font-accent mt-8 max-w-lg text-pretty text-xl italic text-muted-foreground sm:text-2xl">
            “{finale.quote}”
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-14 flex flex-col items-center gap-4">
            <BrandMark
              logoUrl={brand.logoUrl}
              monogram={brand.monogram}
              name={brand.companyName}
            />
            <span className="text-xs font-bold uppercase tracking-[0.5em] text-ivory">
              {brand.companyName}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.32}>
          <p className="mt-14 text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/70">
            {finale.branding}
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
