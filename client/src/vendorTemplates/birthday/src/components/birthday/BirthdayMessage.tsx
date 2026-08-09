import type { InvitationConfig } from "@/config/invitation";
import { Reveal, RevealScale } from "./Reveal";

export function BirthdayMessage({ data }: { data: InvitationConfig }) {
  return (
    <section className="relative overflow-hidden px-5 py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, color-mix(in oklab, var(--blush) 45%, transparent), transparent 72%)",
        }}
      />
      <span className="float-slow pointer-events-none absolute left-[8%] top-[18%] text-4xl opacity-80">
        🎈
      </span>
      <span
        className="float-medium pointer-events-none absolute right-[10%] top-[26%] text-3xl opacity-80"
        style={{ animationDelay: "2s" }}
      >
        ✨
      </span>
      <span
        className="float-slow pointer-events-none absolute bottom-[14%] left-[16%] text-3xl opacity-70"
        style={{ animationDelay: "3.5s" }}
      >
        🎂
      </span>

      <RevealScale className="relative mx-auto max-w-3xl text-center">
        <p className="font-sans text-xs uppercase tracking-[0.45em] text-muted-foreground">
          Սրտանց
        </p>
        <h2 className="mt-5 font-display text-4xl sm:text-5xl">Իմ տարեդարձի ցանկությունը</h2>
        <span className="gold-rule mx-auto mt-7 block w-24" />
        <blockquote className="mt-9 font-script text-3xl leading-snug text-primary sm:text-5xl">
          &ldquo;{data.wish}&rdquo;
        </blockquote>
      </RevealScale>

      <Reveal delay={0.2} className="relative mt-10 text-center">
        <p className="font-sans text-sm uppercase tracking-[0.35em] text-muted-foreground">
          {data.birthdayPersonName}
        </p>
      </Reveal>
    </section>
  );
}
