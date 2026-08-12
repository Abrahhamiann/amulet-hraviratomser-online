import { motion } from "motion/react";
import type { WeddingConfig } from "@/data/wedding";
import { CoupleMonogram } from "./decor";
import { Reveal, Section } from "./primitives";

function Portrait({
  person,
  delay,
}: {
  person: { name: string; role: string; photo: string; note: string };
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="text-center">
      <div
        className="arch relative mx-auto w-full max-w-[22rem]"
        style={{ boxShadow: "var(--shadow-lift)" }}
      >
        <motion.img
          src={person.photo}
          alt={`${person.name}, ${person.role.toLowerCase()}`}
          loading="lazy"
          width={900}
          height={1200}
          className="h-[26rem] w-full object-cover sm:h-[32rem]"
          initial={{ scale: 1.18 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <p className="font-script mt-8 text-5xl text-gold-gradient sm:text-6xl">{person.name}</p>
      <p className="eyebrow mt-3">{person.role}</p>
      <p className="mt-3 text-sm text-muted-foreground">{person.note}</p>
    </Reveal>
  );
}

export function CoupleSection({ couple }: { couple: WeddingConfig["couple"] }) {
  return (
    <Section id="couple">
      <div className="flex justify-center">
        <CoupleMonogram left={couple.initials.left} right={couple.initials.right} size={150} />
      </div>

      <div className="mt-14 grid gap-16 sm:mt-16 sm:grid-cols-2 sm:gap-10 lg:gap-20">
        <Portrait person={couple.bride} delay={0} />
        <Portrait person={couple.groom} delay={0.18} />
      </div>
    </Section>
  );
}
