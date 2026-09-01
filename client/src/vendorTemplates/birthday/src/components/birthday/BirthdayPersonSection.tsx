// @ts-nocheck
import type { InvitationConfig } from "@/config/invitation";
import { Reveal, RevealScale } from "./Reveal";

export function BirthdayPersonSection({ data }: { data: InvitationConfig }) {
  return (
    <section id="celebration" className="relative overflow-hidden px-5 py-24 sm:py-32">
      <div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--lavender)" }}
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--peach)" }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-20">
        <RevealScale className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div
            className="absolute -inset-3 -rotate-3 rounded-[2rem] opacity-70"
            style={{ background: "var(--gradient-festive)" }}
          />
          <div className="shadow-frame relative overflow-hidden rounded-[1.75rem] border border-gold/40 bg-card p-2">
            <img
              src={data.portrait.src}
              alt={data.portrait.alt}
              width={data.portrait.width}
              height={data.portrait.height}
              loading="lazy"
              className="h-full w-full rounded-[1.4rem] object-cover"
            />
          </div>
          <span className="float-slow absolute -right-5 -top-6 text-4xl">🎈</span>
          <span
            className="float-medium absolute -bottom-6 -left-5 text-3xl"
            style={{ animationDelay: "1.5s" }}
          >
            ✨
          </span>
          <div className="glass-card absolute -bottom-7 right-4 rounded-2xl px-5 py-3 text-center">
            <p className="font-display text-3xl leading-none text-primary">{data.age}</p>
            <p className="font-sans text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
              տարեկան
            </p>
          </div>
        </RevealScale>

        <div className="text-center lg:text-left">
          <Reveal>
            <p className="font-sans text-xs uppercase tracking-[0.45em] text-muted-foreground">
              Տարեդարձի հերոսուհին
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              {data.introHeadline}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 font-script text-2xl text-primary sm:text-3xl">
              &ldquo;Եվս մեկ գեղեցիկ տարի, ևս մեկ առիթ միասին տոնելու։&rdquo;
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
              {data.personalMessage}
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="mt-8 font-script text-3xl text-foreground">{data.fullName}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
