// @ts-nocheck
import { Particles } from "./Particles";
import { Reveal } from "./Reveal";
import { CrossIcon, OliveBranch } from "./Ornaments";
import type { InvitationData } from "@/data/invitation";

export function Footer({ data }: { data: InvitationData }) {
  return (
    <footer className="relative overflow-hidden px-6 pb-14 pt-28 text-center sm:pt-36">
      <div
        aria-hidden
        className="animate-breathe pointer-events-none absolute bottom-0 left-1/2 size-[520px] -translate-x-1/2 translate-y-1/3 rounded-full blur-3xl"
        style={{ background: "var(--gradient-halo)" }}
      />
      <Particles count={14} />

      <div className="relative mx-auto max-w-xl">
        <Reveal>
          <div className="animate-float relative mx-auto w-fit">
            <span
              aria-hidden
              className="animate-breathe absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
              style={{ background: "var(--gradient-halo)" }}
            />
            <CrossIcon className="relative h-16 w-8 text-gold" />
          </div>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-10 font-display text-2xl text-foreground/80 italic">
            {data.closing.signature}
          </p>
          <p className="text-gold-gradient mt-2 font-display text-[clamp(2rem,8vw,3.2rem)] font-light">
            {data.closing.familyName}
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-8 flex items-center justify-center gap-4 text-gold/60">
            <OliveBranch className="h-6 w-24" flip />
            <OliveBranch className="h-6 w-24" />
          </div>
          <p className="mx-auto mt-8 max-w-sm text-sm leading-7 tracking-wide text-muted-foreground">
            {data.closing.message}
          </p>
        </Reveal>

        <Reveal delay={420}>
          <p className="mt-20 text-[0.6rem] tracking-[0.42em] text-muted-foreground/70 uppercase">
            Created with Amulet
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
