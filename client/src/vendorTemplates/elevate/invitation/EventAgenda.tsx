// @ts-nocheck
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { InvitationData } from "@/data/invitation";
import { Reveal, SectionHeading } from "./primitives";

export function EventAgenda({ data }: { data: InvitationData }) {
  const { agenda } = data;
  const trackRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 75%", "end 60%"],
  });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow={agenda.eyebrow} title={agenda.title} />

        <ol ref={trackRef} className="relative mt-14 sm:mt-20">
          <span
            aria-hidden
            className="absolute left-[7px] top-2 h-full w-px bg-border sm:left-[135px]"
          />
          <motion.span
            aria-hidden
            className="absolute left-[7px] top-2 w-px bg-primary sm:left-[135px]"
            style={{ height }}
          />

          {agenda.items.map((item, i) => (
            <li key={item.time} className="pb-10 last:pb-0">
              <Reveal delay={i * 0.06} className="flex items-start gap-5 sm:gap-8">
                <span className="hidden shrink-0 pt-0.5 text-right font-display text-xl text-primary sm:block sm:w-[104px]">
                  {item.time}
                </span>
                <span
                  aria-hidden
                  className="mt-1.5 grid h-[15px] w-[15px] shrink-0 place-items-center rounded-full border border-primary bg-background"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="mb-1 block font-display text-lg text-primary sm:hidden">
                    {item.time}
                  </span>
                  <h3 className="text-base font-semibold tracking-wide text-foreground sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm font-light text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

      </div>
    </section>
  );
}
