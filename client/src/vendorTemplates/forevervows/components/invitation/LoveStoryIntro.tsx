import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useInvitationData } from "../../data/invitation";
import { Reveal, Section } from "./Reveal";
import { Heart, Sparkle, Flower, Arrow } from "./Doodles";

export function LoveStoryIntro() {
  const d = useInvitationData();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const floatY = useTransform(scrollYProgress, [0, 1], [30, -40]);
  const floatY2 = useTransform(scrollYProgress, [0, 1], [50, -70]);

  return (
    <Section className="relative py-28">
      <div ref={ref} className="relative">
        <motion.div style={{ y: floatY }} className="pointer-events-none absolute -right-2 top-4 text-rose">
          <Flower className="h-16 w-12" />
        </motion.div>
        <motion.div style={{ y: floatY2 }} className="pointer-events-none absolute -left-1 top-44 text-accent">
          <Heart className="h-6 w-6" />
        </motion.div>
        <Sparkle className="pointer-events-none absolute right-10 bottom-16 h-4 w-4 text-accent" />

        <Reveal>
          <h2 className="font-display text-[2.9rem] italic leading-none text-ink">{d.love.heading}</h2>
        </Reveal>

        <ul className="mt-14 space-y-11">
          {d.love.phrases.map((p, i) => (
            <Reveal key={p} delay={i * 0.3} className={i === 1 ? "pl-10" : i === 2 ? "pl-4" : ""}>
              <li className="max-w-[19rem] font-hy text-[1.35rem] font-light leading-snug text-ink/90">
                <span className="caption mr-3 align-middle">0{i + 1}</span>
                {p}
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.4} className="mt-16">
          <div className="flex justify-center text-ink/45">
            <Arrow className="h-8 w-14 -rotate-6" />
          </div>
          <p className="mt-8 text-center font-hy text-[1.1rem] font-light italic leading-relaxed text-primary">
            {d.love.outro}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
