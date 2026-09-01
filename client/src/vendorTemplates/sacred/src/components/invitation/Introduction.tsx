// @ts-nocheck
import { Reveal } from "./Reveal";
import { CrossIcon, GoldRule, OliveBranch } from "./Ornaments";
import type { InvitationData } from "@/data/invitation";

export function Introduction({ data }: { data: InvitationData }) {
  return (
    <section className="relative px-6 py-24 sm:py-32">
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <CrossIcon className="mx-auto h-12 w-6 text-gold/70" />
        </Reveal>
        <Reveal delay={120}>
          <h2 className="mt-8 font-display text-[clamp(1.9rem,6vw,3.25rem)] leading-[1.2] font-light text-foreground">
            {data.intro.message}
          </h2>
        </Reveal>
        <Reveal delay={240}>
          <GoldRule className="my-9" />
        </Reveal>
        <Reveal delay={320}>
          <p className="mx-auto max-w-xl text-sm leading-8 tracking-wide text-muted-foreground sm:text-base">
            {data.intro.subMessage}
          </p>
        </Reveal>

        <OliveBranch
          className="pointer-events-none absolute -left-6 top-1/3 hidden h-10 w-32 text-gold/35 lg:block"
          flip
        />
        <OliveBranch className="pointer-events-none absolute -right-6 top-1/2 hidden h-10 w-32 text-gold/35 lg:block" />
      </div>
    </section>
  );
}
