// @ts-nocheck
import { invitation } from "@/data/invitation";

import { Reveal, SectionTitle } from "./primitives";
import { detailIcons } from "./icons";

export function BaptismDetails() {
  return (
    <section id="details" className="relative px-6 py-20 sm:py-28">
      <SectionTitle icon="cross" eyebrow="Amulet">
        Մկրտության Մանրամասները
      </SectionTitle>

      <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {invitation.details.map((item, i) => {
          const Icon = detailIcons[item.icon];
          return (
            <Reveal key={item.label} delay={i * 0.09}>
              <li className="glass-card group h-full rounded-2xl px-6 py-7 text-center transition-transform duration-500 hover:-translate-y-1">
                <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold/35 bg-ivory/70 text-gold transition-colors duration-500 group-hover:border-gold/70">
                  <span className="h-5 w-5">
                    <Icon />
                  </span>
                </span>
                <p className="font-body text-[0.62rem] tracking-[0.32em] text-muted-foreground uppercase">
                  {item.label}
                </p>
                <p className="font-title mt-2 text-lg leading-snug text-foreground sm:text-xl">
                  {item.value}
                </p>
              </li>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
