import { useInvitationData } from "../../data/invitation";
import { Reveal, Section } from "./Reveal";
import { Shoe, Gift, Notes, Squiggle } from "./Doodles";

export function DetailsSection() {
  const d = useInvitationData();
  return (
    <Section className="py-24">
      <Reveal>
        <h2 className="caption text-center">{d.details.heading}</h2>
        <div className="mt-6 flex justify-center text-accent">
          <Squiggle className="h-3 w-24" />
        </div>
      </Reveal>

      <Reveal delay={0.15} className="relative mt-16">
        <p className="script-hy text-[1.05rem]">{d.details.first.lead}</p>
        <ul className="mt-4 space-y-2">
          {d.details.first.items.map((item, i) => (
            <li
              key={item}
              className={
                i === 0
                  ? "font-hy text-[2rem] font-light leading-none tracking-[0.14em] text-ink"
                  : `font-hy text-[1.05rem] font-light text-ink/80 ${i === 2 ? "pl-8" : i === 3 ? "pl-3" : ""}`
              }
            >
              {item}
            </li>
          ))}
        </ul>
        <Shoe className="absolute -right-1 top-6 h-14 w-20 text-ink/55" />
      </Reveal>

      <Reveal delay={0.2} className="relative mt-24 text-right">
        <p className="script-hy text-[1.05rem]">{d.details.second.lead}</p>
        <p className="ml-auto mt-4 max-w-[17rem] font-hy text-[0.95rem] font-light leading-[1.8] text-ink/80">
          {d.details.second.text}
        </p>
        <Gift className="absolute -left-1 top-2 h-14 w-14 text-ink/55" />
      </Reveal>

      <Reveal delay={0.2} className="relative mt-24 text-center">
        <p className="script-hy text-[1.05rem]">{d.details.third.lead}</p>
        <p className="mx-auto mt-5 max-w-[15rem] font-display text-[2.5rem] italic leading-[1.05] text-ink">
          {d.details.third.text}
        </p>
        <Notes className="absolute -right-2 -top-2 h-11 w-10 rotate-6 text-accent" />
      </Reveal>
    </Section>
  );
}
