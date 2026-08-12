import { invitation } from "@/data/invitation";

import { Particles } from "./Atmosphere";
import { CrossIcon, DoveIcon } from "./icons";
import { GoldRule, Reveal } from "./primitives";

export function BlessingQuote() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div className="bg-veil pointer-events-none absolute inset-0" aria-hidden />
      <Particles dense />
      <div
        className="animate-halo pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky/40 blur-3xl sm:h-96 sm:w-96"
        aria-hidden
      />

      <Reveal>
        <blockquote className="relative mx-auto max-w-2xl text-center">
          <span className="mx-auto mb-7 block h-8 w-8 text-gold sm:h-10 sm:w-10">
            <CrossIcon strokeWidth={0.9} />
          </span>
          <p className="font-display text-xl leading-[1.75] font-light text-foreground sm:text-2xl md:text-[1.9rem]">
            {invitation.blessing}
          </p>
          <div className="mt-9 flex items-center justify-center gap-4">
            <GoldRule className="max-w-20" />
            <span className="h-5 w-5 shrink-0 text-gold/80">
              <DoveIcon />
            </span>
            <GoldRule className="max-w-20" />
          </div>
        </blockquote>
      </Reveal>
    </section>
  );
}
