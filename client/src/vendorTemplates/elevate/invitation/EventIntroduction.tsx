import type { InvitationData } from "@/data/invitation";
import { GoldLine, Reveal } from "./primitives";

export function EventIntroduction({ data }: { data: InvitationData }) {
  const { intro, hero } = data;

  return (
    <section id="invitation" className="section-shell overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-primary/50 to-transparent" />
        <div className="absolute left-6 top-1/2 hidden h-40 w-40 -translate-y-1/2 rotate-45 border border-primary/10 lg:block" />
        <div className="absolute right-6 top-1/2 hidden h-40 w-40 -translate-y-1/2 rotate-45 border border-primary/10 lg:block" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <span className="eyebrow">{intro.eyebrow}</span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="display-title mt-6 text-4xl sm:text-5xl md:text-6xl">{intro.title}</h2>
        </Reveal>
        <GoldLine className="mx-auto mt-8 h-px w-32" />
        <Reveal delay={0.18}>
          <p className="mt-8 text-pretty text-lg font-light leading-relaxed text-muted-foreground sm:text-xl">
            {intro.paragraph}
          </p>
        </Reveal>
        <Reveal delay={0.26}>
          <p className="font-accent mt-10 text-xl italic text-primary sm:text-2xl">
            {hero.invitationNote}
          </p>
        </Reveal>
        <Reveal delay={0.34}>
          <p className="mt-8 text-[0.7rem] uppercase tracking-[0.4em] text-muted-foreground">
            {intro.signature}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
