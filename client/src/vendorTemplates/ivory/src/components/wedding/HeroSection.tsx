import { wedding } from "@/data/wedding";
import { Sprig } from "./Ornament";

type HeroInitials = {
  groom: string;
  bride: string;
};

type HeroNames = {
  groom: string;
  bride: string;
};

export function HeroSection({ initials, names }: { initials?: HeroInitials; names?: HeroNames } = {}) {
  const { couple, date, hero } = wedding;
  const groomInitial = initials?.groom ?? couple.groom.initial;
  const brideInitial = initials?.bride ?? couple.bride.initial;
  const groomName = names?.groom ?? couple.groom.name;
  const brideName = names?.bride ?? couple.bride.name;

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-end overflow-hidden px-5 pb-16 text-center sm:pb-20">
      <img
        src={hero.image}
        alt="Զույգը ձեռք ձեռքի տված քայլում է արևոտ պարտեզում"
        width={1600}
        height={1920}
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[50%_28%]"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{ backgroundImage: "var(--gradient-veil)" }}
        aria-hidden="true"
      />

      <Sprig className="pointer-events-none absolute -left-6 top-10 -z-10 hidden h-64 opacity-50 float-slow sm:block" />
      <Sprig className="pointer-events-none absolute -right-6 top-24 -z-10 hidden h-64 -scale-x-100 opacity-50 float-slow sm:block" />

      <div className="animate-[fade-in_1.4s_var(--ease-calm)_both] mx-auto w-full max-w-3xl">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-gold/45 font-display text-lg tracking-[0.15em] text-gold">
          {groomInitial}&nbsp;&amp;&nbsp;{brideInitial}
        </div>

        <p className="eyebrow">{hero.eyebrow}</p>

        <h1 className="mt-6 font-display text-[clamp(3rem,15vw,7.5rem)] leading-[0.95] font-light tracking-[-0.02em] text-foreground">
          <span className="block">{groomName}</span>
          <span className="my-1 block text-gold italic text-[0.5em]">&amp;</span>
          <span className="block">{brideName}</span>
        </h1>

        <div className="mx-auto mt-8 flex max-w-xs items-center justify-center gap-4">
          <span className="h-px flex-1 bg-gold/40" />
          <p className="text-xs tracking-[0.3em] uppercase text-ink-soft whitespace-nowrap">
            {date.long}
          </p>
          <span className="h-px flex-1 bg-gold/40" />
        </div>
      </div>

      <div className="mt-14 flex flex-col items-center gap-3">
        <span className="eyebrow text-[0.6rem]">Ոլորել</span>
        <span className="relative block h-12 w-px overflow-hidden bg-gold/25">
          <span className="absolute inset-x-0 top-0 block h-4 bg-gold animate-[scroll-hint_2.6s_var(--ease-calm)_infinite]" />
        </span>
      </div>
    </section>
  );
}
