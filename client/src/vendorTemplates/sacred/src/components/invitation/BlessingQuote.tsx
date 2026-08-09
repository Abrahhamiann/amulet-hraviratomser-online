import { Reveal } from "./Reveal";
import { CrossIcon, GoldRule } from "./Ornaments";
import type { InvitationData } from "@/data/invitation";

export function BlessingQuote({ data }: { data: InvitationData }) {
  return (
    <section className="relative overflow-hidden px-6 py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 50%, color-mix(in oklab, var(--gold) 13%, transparent), transparent 72%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <CrossIcon className="mx-auto h-10 w-5 text-gold/70" />
        </Reveal>
        <Reveal delay={140}>
          <blockquote className="mt-8 font-display text-[clamp(2rem,7.5vw,3.6rem)] leading-[1.25] font-light text-foreground italic">
            “{data.quote.text}”
          </blockquote>
        </Reveal>
        <Reveal delay={300}>
          <GoldRule className="mt-10" />
          <p className="mt-6 text-[0.7rem] tracking-[0.4em] text-muted-foreground uppercase">
            {data.quote.source}
          </p>
        </Reveal>
      </div>
    </section>
  );
}