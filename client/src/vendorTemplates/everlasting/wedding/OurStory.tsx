import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { WeddingConfig } from "@/data/wedding";
import { Reveal, Section, SectionTitle } from "./primitives";

export function OurStory({ story }: { story: WeddingConfig["story"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });

  return (
    <Section id="story" tone="paper">
      <SectionTitle eyebrow="Մեր սկիզբը" title={story.title} script={story.intro} />

      <div ref={ref} className="relative mt-20 sm:mt-24">
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-[11px] w-px bg-border sm:left-1/2"
        />
        <motion.div
          aria-hidden="true"
          className="absolute top-0 left-[11px] w-px origin-top sm:left-1/2"
          style={{
            height: "100%",
            scaleY: reduced ? 1 : scrollYProgress,
            background: "linear-gradient(var(--gold), var(--rose))",
          }}
        />

        <ol className="space-y-16 sm:space-y-24">
          {story.milestones.map((m, i) => (
            <li key={m.year} className="relative pl-10 sm:pl-0">
              <span
                aria-hidden="true"
                className="absolute top-2 left-0 h-[22px] w-[22px] -translate-x-[5px] rounded-full border sm:left-1/2 sm:-translate-x-1/2"
                style={{
                  borderColor: "color-mix(in oklab, var(--gold) 60%, transparent)",
                  background: "var(--background)",
                }}
              />
              <span
                aria-hidden="true"
                className="absolute top-[13px] left-[6px] h-2 w-2 rounded-full sm:left-1/2 sm:-translate-x-1/2"
                style={{ background: "var(--gold)" }}
              />

              <div
                className={`grid items-center gap-8 sm:grid-cols-2 sm:gap-14 ${
                  i % 2 ? "sm:[&>*:first-child]:order-2" : ""
                }`}
              >
                <Reveal className={i % 2 ? "sm:pl-14" : "sm:pr-14 sm:text-right"}>
                  <p className="font-script text-4xl text-gold-gradient">{m.year}</p>
                  <h3 className="mt-2 text-2xl sm:text-3xl">{m.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {m.text}
                  </p>
                </Reveal>

                <Reveal delay={0.15} className={i % 2 ? "sm:pr-14" : "sm:pl-14"}>
                  <div className="arch overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
                    <motion.img
                      src={m.photo}
                      alt={`${m.title}, ${m.year}`}
                      loading="lazy"
                      width={900}
                      height={1100}
                      className="h-64 w-full object-cover sm:h-80"
                      initial={{ scale: 1.16 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </Reveal>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
