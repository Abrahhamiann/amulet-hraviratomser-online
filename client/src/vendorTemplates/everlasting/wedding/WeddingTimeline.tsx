import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { WeddingConfig } from "@/data/wedding";
import { Reveal, Section, SectionTitle } from "./primitives";

export function WeddingTimeline({ timeline }: { timeline: WeddingConfig["timeline"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 65%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Section id="schedule" tone="paper">
      <SectionTitle eyebrow="Wedding Day" title="The Schedule" />

      <div ref={ref} className="relative mx-auto mt-16 max-w-xl">
        <div aria-hidden="true" className="absolute top-0 bottom-0 left-[7px] w-px bg-border" />
        <motion.div
          aria-hidden="true"
          className="absolute top-0 left-[7px] h-full w-px origin-top"
          style={{
            scaleY: reduced ? 1 : scaleY,
            background: "linear-gradient(var(--gold), var(--sage))",
          }}
        />

        <ol className="space-y-12">
          {timeline.map((item, i) => (
            <li key={item.time} className="relative pl-12">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="absolute top-1 left-0 h-4 w-4 -translate-x-[1px] text-gold"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path d="M12 3c4 4 4 10 0 14-4-4-4-10 0-14Z" />
                <path d="M12 6v14" opacity=".5" />
              </svg>
              <Reveal delay={i * 0.06}>
                <p className="text-sm tracking-[0.3em] text-primary">{item.time}</p>
                <p className="mt-2 font-serif text-2xl">{item.title}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
