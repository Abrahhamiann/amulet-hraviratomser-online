// @ts-nocheck
import { Reveal } from "./Reveal";
import { GoldRule, SectionLabel } from "./Ornaments";
import type { InvitationData } from "@/data/invitation";

export function Timeline({ data }: { data: InvitationData }) {
  return (
    <section className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <Reveal className="text-center">
          <SectionLabel>The Day</SectionLabel>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,6vw,3rem)] font-light text-foreground">
            Order of the celebration
          </h2>
          <GoldRule className="mt-7" />
        </Reveal>

        <ol className="relative mt-16 space-y-12 pl-10 sm:pl-16">
          <span
            aria-hidden
            className="absolute left-[7px] top-2 bottom-2 w-px sm:left-[23px]"
            style={{
              background:
                "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--gold) 60%, transparent), transparent)",
            }}
          />
          {data.timeline.map((item, i) => (
            <Reveal as="li" key={item.time} delay={i * 180} className="relative">
              <span
                aria-hidden
                className="absolute -left-10 top-2 grid size-4 place-items-center rounded-full border border-gold/70 bg-background sm:-left-16"
              >
                <span className="size-1.5 rounded-full bg-gold" />
              </span>
              <p className="font-display text-2xl tracking-[0.12em] text-gold">{item.time}</p>
              <p className="mt-1 font-display text-xl text-foreground">{item.title}</p>
              <p className="mt-1 text-sm tracking-wide text-muted-foreground">{item.note}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
