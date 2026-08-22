import { motion } from "motion/react";
import { useInvitationData } from "../../data/invitation";
import { Reveal, Section } from "./Reveal";
import { timelineIcons } from "./Doodles";

export function TimelineSection() {
  const d = useInvitationData();

  return (
    <Section className="forever-vows-roadmap py-24 text-center">
      <Reveal>
        <h2 className="font-hy-sans text-[0.82rem] uppercase leading-relaxed tracking-[0.26em] text-ink/70">
          {d.timelineHeading}
        </h2>
      </Reveal>

      <div className="relative mx-auto mt-16 max-w-2xl">
        <span className="pointer-events-none absolute bottom-8 left-1/2 top-8 w-px -translate-x-1/2 bg-ink/20" aria-hidden="true" />
        <ol className="relative space-y-14" aria-label={d.timelineHeading}>
          {d.timeline.map((item, i) => {
            const Icon = timelineIcons[item.icon];
            return (
              <motion.li
                key={`${item.time}-${item.title}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.65, delay: Math.min(i * 0.06, 0.24) }}
                className="relative mx-auto flex max-w-[34rem] flex-col items-center rounded-sm bg-background px-5 py-2 text-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className="h-9 w-11 shrink-0 text-ink/70" />
                  <time className="font-display text-[1.85rem] tracking-[0.06em] text-primary">{item.time}</time>
                </div>
                <h3 className="mt-3 font-hy text-[1.28rem] font-normal leading-snug text-ink">{item.title}</h3>
                <p className="mt-2 max-w-[30rem] font-hy text-[1rem] font-light leading-relaxed text-ink/70">{item.text}</p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
