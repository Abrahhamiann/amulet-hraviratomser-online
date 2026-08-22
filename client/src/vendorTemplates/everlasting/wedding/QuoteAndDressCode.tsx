import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { WeddingConfig } from "@/data/wedding";
import { Petals } from "./decor";
import { Reveal, Section } from "./primitives";

export function RomanticQuote({ quote }: { quote: WeddingConfig["quote"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-6%", "6%"]);

  return (
    <div ref={ref} className="relative overflow-hidden">
      <Section tone="paper" className="relative">
        <Petals count={10} />
        <Petals count={6} gold />
        <motion.blockquote className="relative mx-auto max-w-3xl text-center" style={{ y }}>
          <Reveal>
            <p className="font-script text-[clamp(2rem,7vw,4.2rem)] leading-[1.15] text-gold-gradient">
              “{quote.text}”
            </p>
          </Reveal>
        </motion.blockquote>
      </Section>
    </div>
  );
}

export function DressCode({ dressCode }: { dressCode: WeddingConfig["dressCode"] }) {
  return (
    <Section id="dresscode">
      <div className="text-center">
        <Reveal>
          <p className="eyebrow">{dressCode.title}</p>
          <h2 className="mt-6 text-3xl sm:text-4xl">{dressCode.value}</h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">{dressCode.note}</p>
        </Reveal>

        <Reveal delay={0.15}>
          <ul className="mt-12 flex flex-wrap items-start justify-center gap-6 sm:gap-10">
            {dressCode.swatches.map((s, i) => (
              <li key={s.name} className="w-20">
                <motion.span
                  data-dress-color-index={i}
                  className="mx-auto block h-14 w-14 rounded-full border"
                  style={{
                    background: s.color,
                    borderColor: "color-mix(in oklab, var(--gold) 45%, transparent)",
                  }}
                  initial={{ scale: 0.7, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                />
                <span className="mt-3 block text-[0.65rem] tracking-[0.22em] uppercase text-muted-foreground">
                  {s.name}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
