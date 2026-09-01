// @ts-nocheck
import { CalendarDays, Clock, MapPin } from "lucide-react";
import type { WeddingConfig } from "@/data/wedding";
import { Reveal, Section, SectionTitle, Botanical } from "./primitives";

function DetailRow({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <Icon className="mt-1 h-5 w-5 shrink-0 text-primary" strokeWidth={1} aria-hidden="true" />
      <div className="min-w-0">
        <p className="eyebrow text-[0.58rem]">{label}</p>
        <p className="mt-2 text-lg">{value}</p>
        {sub ? <p className="text-sm text-muted-foreground">{sub}</p> : null}
      </div>
    </div>
  );
}

export function CeremonyDetails({
  ceremony,
  dateLong,
}: {
  ceremony: WeddingConfig["ceremony"];
  dateLong: string;
}) {
  return (
    <Section id="ceremony" tone="paper">
      <SectionTitle eyebrow="Միացեք մեզ" title={ceremony.title} />
      <Reveal delay={0.15}>
        <div className="mx-auto mt-14 grid max-w-3xl gap-10 sm:grid-cols-3">
          <DetailRow icon={CalendarDays} label="Ամսաթիվ" value={dateLong} />
          <DetailRow icon={Clock} label="Ժամ" value={ceremony.time} />
          <DetailRow
            icon={MapPin}
            label="Վայր"
            value={ceremony.venue}
            sub={ceremony.city}
          />
        </div>
      </Reveal>
      <Reveal delay={0.25} className="mt-14 flex justify-center">
        <Botanical />
      </Reveal>
    </Section>
  );
}

export function ReceptionDetails({ reception }: { reception: WeddingConfig["reception"] }) {
  return (
    <Section id="reception">
      <SectionTitle eyebrow="Այնուհետև" title={reception.title} />
      <Reveal delay={0.15} className="mt-12 text-center">
        <p className="text-[clamp(2.2rem,8vw,4rem)] leading-none tracking-[0.08em]">
          {reception.time}
        </p>
        <p className="mt-6 text-xl">{reception.venue}</p>
        <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground">{reception.city}</p>
        <p className="mx-auto mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
          {reception.note}
        </p>
        <a
          className="btn-gold mt-10"
          href={reception.mapUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          Ինչպես հասնել
        </a>
      </Reveal>
    </Section>
  );
}
