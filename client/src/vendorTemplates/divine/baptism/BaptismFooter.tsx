import { invitation } from "@/data/invitation";

import { Particles } from "./Atmosphere";
import { CrossIcon, FloralIcon } from "./icons";
import { GoldRule, Reveal } from "./primitives";

export function BaptismFooter() {
  return (
    <footer className="relative overflow-hidden bg-heaven px-6 py-20 text-center sm:py-28">
      <Particles />
      <Reveal>
        <span className="mx-auto mb-7 block h-8 w-8 text-gold sm:h-10 sm:w-10">
          <CrossIcon strokeWidth={0.9} />
        </span>
        <p className="font-title text-xl text-foreground sm:text-2xl">Սիրով սպասում ենք Ձեզ</p>
        <p className="font-display text-gold-gradient mt-5 text-4xl font-extralight sm:text-5xl">
          {invitation.babyName}
        </p>
        <p className="font-body mt-3 text-[0.62rem] tracking-[0.34em] text-muted-foreground uppercase">
          Մկրտություն · {invitation.dateLabel}
        </p>

        <div className="mx-auto mt-9 flex max-w-xs items-center gap-4">
          <GoldRule />
          <span className="h-4 w-4 shrink-0 text-gold/70">
            <FloralIcon />
          </span>
          <GoldRule />
        </div>

        <p className="font-body mx-auto mt-8 max-w-sm text-sm leading-relaxed text-muted-foreground italic">
          {invitation.footerLine}
        </p>
        <p className="font-body mt-10 text-[0.58rem] tracking-[0.3em] text-muted-foreground/70 uppercase">
          {invitation.brand}
        </p>
      </Reveal>
    </footer>
  );
}
