// @ts-nocheck
import type { InvitationData } from "@/data/invitation";
import { Reveal, SectionHeading } from "./primitives";

export function SpeakersSection({ data }: { data: InvitationData }) {
  const { speakers } = data;

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={speakers.eyebrow} title={speakers.title} />

        <div className="-mx-5 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mt-20 md:mx-0 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:px-0 lg:grid-cols-4">
          {speakers.items.map((person, i) => (
            <Reveal key={person.name} delay={i * 0.1} className="w-[78vw] shrink-0 snap-center sm:w-[60vw] md:w-auto">
              <article className="group h-full">
                <div className="relative overflow-hidden">
                  <img
                    src={person.photo}
                    alt={`${person.name}, ${person.role}`}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover grayscale transition-all duration-[900ms] ease-[var(--ease-elegant)] group-hover:scale-[1.04] group-hover:grayscale-0"
                  />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent opacity-80" />
                  <span aria-hidden className="absolute inset-3 border border-primary/0 transition-colors duration-700 group-hover:border-primary/40" />
                </div>
                <div className="pt-5">
                  <h3 className="display-title text-xl">{person.name}</h3>
                  <p className="mt-1 text-[0.68rem] uppercase tracking-[0.28em] text-primary">
                    {person.role}
                  </p>
                  <p className="mt-2 text-sm font-light text-muted-foreground">{person.company}</p>
                  <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">
                    {person.bio}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
