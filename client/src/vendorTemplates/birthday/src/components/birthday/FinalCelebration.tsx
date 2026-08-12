import type { InvitationConfig } from "@/config/invitation";
import { FloatingDecorations } from "./FloatingDecorations";
import { Reveal, RevealScale } from "./Reveal";

export function FinalCelebration({ data, closingMessage }: { data: InvitationConfig; closingMessage?: string }) {
  return (
    <section className="relative overflow-hidden px-5 py-28 text-center sm:py-36">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 60%, color-mix(in oklab, var(--peach) 55%, transparent), transparent 72%), linear-gradient(180deg, var(--cream), var(--ivory))",
        }}
      />
      <FloatingDecorations variant="hero" />

      <div className="relative mx-auto max-w-4xl">
        <RevealScale>
          <h2 className="text-festive-gradient font-display text-[2.6rem] leading-[0.95] sm:text-7xl lg:text-8xl">
            ԵԿԵ՛Ք ՏՈՆԵՆՔ
          </h2>
        </RevealScale>
        <Reveal delay={0.15}>
          <p className="mt-8 text-3xl tracking-[0.35em] sm:text-4xl" aria-hidden="true">
            🎂 ✨ 🎈 🥂 🎉
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mt-10 font-display text-2xl sm:text-3xl">{closingMessage || "Կհանդիպենք տոնակատարությանը"}</p>
          <span className="gold-rule mx-auto mt-7 block w-24" />
          <p className="mt-7 font-sans text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Սիրով՝
          </p>
          <p className="mt-2 font-script text-5xl text-primary sm:text-6xl">
            {data.birthdayPersonName}
          </p>
        </Reveal>
        <Reveal delay={0.35}>
          <p className="mt-16 font-sans text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground">
            Թվային հրավեր՝ Amulet-ից
          </p>
        </Reveal>
      </div>
    </section>
  );
}
