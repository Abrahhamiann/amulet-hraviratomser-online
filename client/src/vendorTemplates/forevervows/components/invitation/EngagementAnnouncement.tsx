import { useInvitationData } from "../../data/invitation";
import { Reveal, Section } from "./Reveal";
import { Rings, Squiggle } from "./Doodles";

export function EngagementAnnouncement() {
  const d = useInvitationData();
  return (
    <Section className="py-24 text-center">
      <Reveal>
        <p className="script-hy text-[1.05rem]">{d.announcement.small}</p>
      </Reveal>

      <Reveal delay={0.2}>
        <h2 className="mt-6 font-hy text-[2rem] font-light leading-tight tracking-[0.08em] text-ink">
          {d.announcement.big}
        </h2>
      </Reveal>

      <Reveal delay={0.35}>
        <p className="mx-auto mt-9 max-w-[20rem] font-hy text-[0.98rem] font-light leading-[1.85] text-ink/80">
          {d.announcement.paragraphs[0]}
        </p>
      </Reveal>

      <Reveal delay={0.45}>
        <div className="my-9 flex flex-col items-center gap-4 text-ink/60">
          <Rings className="h-9 w-14" />
          <Squiggle className="h-3 w-24 text-accent" />
        </div>
      </Reveal>

      <Reveal delay={0.55}>
        <p className="mx-auto max-w-[19rem] font-hy text-[0.98rem] font-light leading-[1.85] text-ink/80">
          {d.announcement.paragraphs[1]}
        </p>
      </Reveal>
    </Section>
  );
}
