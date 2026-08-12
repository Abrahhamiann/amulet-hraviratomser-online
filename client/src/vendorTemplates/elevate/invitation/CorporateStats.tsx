import type { InvitationData } from "@/data/invitation";
import { CountUp, Reveal, SectionHeading } from "./primitives";

export function CorporateStats({ data }: { data: InvitationData }) {
  const { stats } = data;

  return (
    <section className="section-shell overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading eyebrow={stats.eyebrow} title={stats.title} />

        <dl className="mt-14 grid grid-cols-2 gap-y-12 sm:mt-20 lg:grid-cols-4">
          {stats.items.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.1}>
              <div className="relative px-4 text-center">
                <span
                  aria-hidden
                  className="absolute right-0 top-1/2 hidden h-14 w-px -translate-y-1/2 bg-border lg:block"
                />
                <dt className="sr-only">{item.label}</dt>
                <dd>
                  <span className="text-gold-gradient block font-display text-5xl leading-none sm:text-6xl md:text-7xl">
                    <CountUp value={item.value} suffix={item.suffix} />
                  </span>
                  <span className="mt-4 block text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">
                    {item.label}
                  </span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
