// @ts-nocheck
import { motion } from "motion/react";
import { useInvitationData } from "../../data/invitation";
import { Reveal, Section } from "./Reveal";
import { Arrow } from "./Doodles";

export function DressCodeSection() {
  const d = useInvitationData();
  return (
    <Section className="py-24 text-center">
      <Reveal>
        <h2 className="font-display text-[2.1rem] tracking-[0.28em] text-ink">{d.dressCode.heading}</h2>
      </Reveal>

      <Reveal delay={0.15}>
        <p className="mx-auto mt-6 max-w-[19rem] font-hy text-[0.93rem] font-light leading-[1.8] text-ink/75">
          {d.dressCode.subtitle}
        </p>
      </Reveal>

      <div className="relative mx-auto mt-14 flex max-w-[19rem] flex-wrap items-center justify-center gap-x-5 gap-y-6">
        {d.dressCode.swatches.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, scale: 0.86 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: i * 0.09, ease: [0.22, 0.61, 0.36, 1] }}
            className="flex flex-col items-center gap-2"
            style={{ marginTop: i % 2 === 1 ? "1.25rem" : 0 }}
          >
            <span
              data-dress-color-index={i}
              className="block h-14 w-14 border border-ink/10"
              style={{
                backgroundColor: s.color,
                borderRadius: ["48% 52% 55% 45% / 52% 45% 55% 48%", "52% 48% 44% 56% / 47% 55% 45% 53%"][i % 2],
              }}
            />
            <span className="font-hy-sans text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">
              {s.name}
            </span>
          </motion.div>
        ))}
      </div>

      <Reveal delay={0.3}>
        <div className="mt-10 flex items-center justify-center gap-2">
          <Arrow className="h-7 w-12 -scale-y-100 rotate-[190deg] text-ink/45" />
          <span className="script-hy text-[1.05rem]">{d.dressCode.note}</span>
        </div>
      </Reveal>
    </Section>
  );
}
