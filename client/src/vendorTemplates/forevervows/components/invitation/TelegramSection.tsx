import { useInvitationData } from "../../data/invitation";
import { Reveal, Section } from "./Reveal";
import { Plane, Camera } from "./Doodles";

export function TelegramSection() {
  const d = useInvitationData();
  return (
    <Section className="py-24 text-center">
      <Reveal>
        <div className="flex justify-center text-ink/60">
          <Plane className="h-12 w-16 -rotate-6" />
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <h2 className="mx-auto mt-8 max-w-[17rem] font-hy text-[1.25rem] font-light leading-snug tracking-[0.06em] text-ink">
          {d.telegram.heading}
        </h2>
      </Reveal>

      <Reveal delay={0.25}>
        <p className="mx-auto mt-6 max-w-[19rem] font-hy text-[0.93rem] font-light leading-[1.85] text-ink/75">
          {d.telegram.text}
        </p>
      </Reveal>

      <Reveal delay={0.35}>
        <a
          href={d.telegram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-9 inline-flex items-center gap-3 border border-ink/45 px-7 py-3 font-hy-sans text-[0.68rem] uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-background"
        >
          {d.telegram.buttonLabel}
          <svg viewBox="0 0 24 12" className="h-2.5 w-6 transition-transform duration-500 group-hover:translate-x-1.5">
            <path d="M0 6h21M16 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </a>
        <div className="mt-10 flex justify-center text-accent">
          <Camera className="h-9 w-12" />
        </div>
      </Reveal>
    </Section>
  );
}
