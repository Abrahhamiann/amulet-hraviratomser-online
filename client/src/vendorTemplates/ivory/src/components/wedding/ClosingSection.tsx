// @ts-nocheck
import { wedding } from "@/data/wedding";
import { Reveal } from "./Reveal";
import { Ornament } from "./Ornament";

export function ClosingSection({ dateShort }: { dateShort?: string } = {}) {
  const { closing, couple, date, hero } = wedding;
  return (
    <section className="relative isolate overflow-hidden px-5 py-28 text-center sm:py-40">
      <img
        src={hero.image}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[50%_35%] opacity-25"
      />
      <div className="absolute inset-0 -z-10 bg-ivory/70" aria-hidden="true" />

      <div className="mx-auto max-w-2xl">
        <Reveal>
          <Ornament />
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-10 font-display text-[clamp(1.5rem,4.4vw,2.4rem)] leading-[1.4] font-light italic text-foreground">
            {closing.text}
          </p>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-12 font-display text-[clamp(2rem,8vw,3.5rem)] leading-none font-light text-foreground">
            {couple.groom.name} <span className="text-gold italic">&amp;</span> {couple.bride.name}
          </p>
          <p className="mt-6 text-xs tracking-[0.34em] uppercase text-muted-foreground">
            {dateShort ?? date.short}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
