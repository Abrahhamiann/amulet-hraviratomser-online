import type { InvitationData } from "@/data/invitation";
import { Reveal, SectionHeading } from "./primitives";

export function DressCode({ data }: { data: InvitationData }) {
  const { dressCode } = data;

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeading eyebrow={dressCode.eyebrow} title={dressCode.title} />

        <Reveal delay={0.12}>
          <p className="font-accent mt-12 text-3xl italic text-primary sm:text-4xl">
            {dressCode.code}
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="mx-auto mt-5 max-w-md text-sm font-light leading-relaxed text-muted-foreground">
            {dressCode.note}
          </p>
        </Reveal>

        <ul className="mt-12 flex flex-wrap items-start justify-center gap-6 sm:gap-10">
          {dressCode.palette.map((swatch, i) => (
            <Reveal key={swatch.name} delay={0.2 + i * 0.07} as="li">
              <div className="group flex flex-col items-center gap-3">
                <span
                  className="h-14 w-14 rounded-full border border-border transition-transform duration-500 ease-[var(--ease-elegant)] group-hover:scale-110 sm:h-16 sm:w-16"
                  style={{ backgroundColor: swatch.color }}
                  aria-hidden
                />
                <span className="text-[0.6rem] uppercase tracking-[0.28em] text-muted-foreground">
                  {swatch.name}
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
