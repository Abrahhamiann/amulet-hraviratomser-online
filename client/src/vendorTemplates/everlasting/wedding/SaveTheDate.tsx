// @ts-nocheck
import { motion } from "motion/react";
import type { WeddingConfig } from "@/data/wedding";
import { Petals } from "./decor";
import { Reveal, Section, Botanical } from "./primitives";

function icsHref(config: WeddingConfig) {
  const start = new Date(config.date.iso);
  const end = new Date(start.getTime() + 6 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:${config.couple.bride.name} & ${config.couple.groom.name} — Wedding`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `LOCATION:${config.ceremony.venue}, ${config.ceremony.city}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}

export function SaveTheDate({ config }: { config: WeddingConfig }) {
  return (
    <Section id="date" tone="paper" className="overflow-hidden">
      <Petals count={8} gold />
      <div className="relative text-center">
        <Reveal>
          <p className="eyebrow">Պահպանեք ամսաթիվը</p>
        </Reveal>

        <Reveal delay={0.1}>
          <motion.p
            className="mt-8 text-[clamp(2.4rem,11vw,6.5rem)] leading-none tracking-[0.06em] text-gold-gradient"
            initial={{ letterSpacing: "0.3em", opacity: 0 }}
            whileInView={{ letterSpacing: "0.06em", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          >
            {config.date.display}
          </motion.p>
        </Reveal>

        <Reveal delay={0.2} className="mt-8 flex justify-center">
          <Botanical />
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-4 text-sm tracking-[0.35em] uppercase text-muted-foreground">
            {config.date.long}
          </p>
          <a className="btn-gold mt-10" href={icsHref(config)} download="wedding.ics">
            Ավելացնել օրացույցում
          </a>
        </Reveal>
      </div>
    </Section>
  );
}
