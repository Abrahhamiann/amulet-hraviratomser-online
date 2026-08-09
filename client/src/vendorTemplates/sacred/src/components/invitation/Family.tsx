import { Reveal } from "./Reveal";
import { DoveIcon, GoldRule, SectionLabel } from "./Ornaments";
import type { InvitationData } from "@/data/invitation";

export function Family({ data }: { data: InvitationData }) {
  const cards = [
    { label: data.family.parentsLabel, names: data.family.parents },
    { label: data.family.godparentsLabel, names: data.family.godparents },
  ];

  return (
    <section className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <SectionLabel>With gratitude</SectionLabel>
          <GoldRule className="mt-6" />
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {cards.map((card, i) => (
            <Reveal key={card.label} delay={i * 180}>
              <div
                className="rounded-[1.75rem] border border-gold/25 px-6 py-12"
                style={{ background: "color-mix(in oklab, var(--cream) 45%, transparent)" }}
              >
                <DoveIcon className="mx-auto h-6 w-10 text-gold/70" />
                <p className="mt-5 text-[0.65rem] tracking-[0.36em] text-muted-foreground uppercase">
                  {card.label}
                </p>
                <p className="mt-4 font-display text-[clamp(1.6rem,5vw,2.25rem)] font-light text-foreground">
                  {card.names}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}