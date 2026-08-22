import { useInvitationData } from "../../data/invitation";
import { Reveal, Section } from "./Reveal";
import { Pin } from "./Doodles";

export function LocationSection() {
  const d = useInvitationData();
  return (
    <Section className="py-24 text-center">
      <Reveal>
        <h2 className="caption">{d.location.heading}</h2>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-8 flex justify-center text-ink/60">
          <Pin className="h-14 w-11" />
        </div>
      </Reveal>

      <Reveal delay={0.25}>
        <p className="mt-7 font-display text-[2.3rem] italic leading-tight text-ink">{d.location.name}</p>
        <p className="mt-5 font-hy text-[0.95rem] font-light text-ink/70">{d.location.city}</p>
        <p className="font-hy text-[0.95rem] font-light text-ink/70">{d.location.address}</p>
      </Reveal>

      <Reveal delay={0.35}>
        <a
          href={d.location.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-10 inline-flex items-center gap-3 border border-ink/45 px-7 py-3 font-hy-sans text-[0.68rem] uppercase tracking-[0.22em] text-ink transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-background"
        >
          {d.location.buttonLabel}
          <svg viewBox="0 0 24 12" className="h-2.5 w-6 transition-transform duration-500 group-hover:translate-x-1.5">
            <path d="M0 6h21M16 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </a>
      </Reveal>
    </Section>
  );
}
