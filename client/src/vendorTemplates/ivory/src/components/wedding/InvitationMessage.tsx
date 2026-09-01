// @ts-nocheck
import { wedding } from "@/data/wedding";
import { Reveal } from "./Reveal";
import { Ornament } from "./Ornament";

export function InvitationMessage() {
  const { invitation } = wedding;
  return (
    <section className="px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Ornament />
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-10 font-display text-[clamp(1.6rem,4.6vw,2.6rem)] leading-[1.35] font-light text-foreground">
            <span className="italic text-gold">{invitation.title}</span>, {invitation.body}
          </p>
        </Reveal>
        <Reveal delay={240}>
          <p className="mx-auto mt-8 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
            {invitation.note}
          </p>
        </Reveal>
        <Reveal delay={320}>
          <Ornament className="mt-12" />
        </Reveal>
      </div>
    </section>
  );
}
