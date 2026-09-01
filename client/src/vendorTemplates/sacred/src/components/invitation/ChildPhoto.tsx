// @ts-nocheck
import { Particles } from "./Particles";
import { Reveal } from "./Reveal";
import type { InvitationData } from "@/data/invitation";

export function ChildPhoto({ data }: { data: InvitationData }) {
  return (
    <section className="relative px-6 py-20 sm:py-28">
      <div className="relative mx-auto max-w-md">
        <Particles count={10} className="-inset-8" />
        <Reveal variant="scale">
          <div
            className="arch-frame animate-float relative overflow-hidden border border-gold/40 p-2"
            style={{ boxShadow: "var(--shadow-frame)", background: "var(--cream)" }}
          >
            <img
              src={data.child.portrait.src}
              alt={data.child.portrait.alt}
              width={912}
              height={1312}
              loading="lazy"
              className="arch-frame h-auto w-full object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={260}>
          <p className="mt-8 text-center font-display text-2xl tracking-wide text-foreground/80 italic">
            {data.child.caption}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
