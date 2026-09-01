// @ts-nocheck
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

import { invitation } from "@/data/invitation";

import { timelineIcons } from "./icons";
import { Reveal, SectionTitle } from "./primitives";

export function BaptismTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  const scaleY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 60,
    damping: 24,
  });

  return (
    <section className="relative px-6 py-20 sm:py-28">
      <SectionTitle icon="dove" eyebrow="Program">
        Օրվա Ծրագիրը
      </SectionTitle>

      <div ref={ref} className="relative mx-auto max-w-2xl pl-12 sm:pl-0">
        {/* rail */}
        <div
          className="absolute top-2 bottom-2 left-[1.15rem] w-px bg-border/70 sm:left-1/2 sm:-translate-x-1/2"
          aria-hidden
        />
        <motion.div
          className="absolute top-2 bottom-2 left-[1.15rem] w-px origin-top bg-gradient-to-b from-gold via-gold/70 to-transparent sm:left-1/2 sm:-translate-x-1/2"
          style={{ scaleY }}
          aria-hidden
        />

        <ol className="space-y-8 sm:space-y-12">
          {invitation.timeline.map((item, i) => {
            const Icon = timelineIcons[item.icon];
            const right = i % 2 === 1;
            return (
              <li key={item.time} className="relative sm:grid sm:grid-cols-2 sm:items-center">
                {/* node */}
                <span
                  className="absolute top-6 -left-[2.45rem] flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-background text-gold sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2"
                  aria-hidden
                >
                  <span className="h-4 w-4">
                    <Icon />
                  </span>
                </span>

                <Reveal
                  delay={i * 0.06}
                  className={
                    right
                      ? "sm:col-start-2 sm:pl-12 sm:text-left"
                      : "sm:col-start-1 sm:pr-12 sm:text-right"
                  }
                >
                  <div className="glass-card rounded-2xl px-6 py-5">
                    <p className="font-latin text-gold-gradient text-xl tracking-[0.14em] sm:text-2xl">
                      {item.time}
                    </p>
                    <p className="font-title mt-1.5 text-base leading-snug text-foreground sm:text-lg">
                      {item.title}
                    </p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
