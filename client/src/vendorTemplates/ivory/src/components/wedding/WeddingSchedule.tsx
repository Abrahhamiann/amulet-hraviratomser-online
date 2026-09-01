// @ts-nocheck
import { Church, GlassWater, UtensilsCrossed, Music4, Sparkles } from "lucide-react";
import { wedding } from "@/data/wedding";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const icons = [Church, GlassWater, UtensilsCrossed, Music4, Sparkles];

export function WeddingSchedule() {
  return (
    <section className="px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="12 սեպտեմբերի, 2026" title="Օրվա ծրագիրը" />

        <ol className="mt-16 space-y-0">
          {wedding.schedule.map((item, i) => {
            const Icon = icons[i % icons.length] ?? Sparkles;
            return (
              <Reveal
                as="li"
                key={item.time}
                delay={i * 80}
                className="grid grid-cols-[auto_auto_1fr] items-center gap-5 border-t border-border/70 py-6 last:border-b sm:gap-8"
              >
                <span className="font-display text-2xl font-light tabular-nums text-gold sm:text-3xl">
                  {item.time}
                </span>
                <Icon className="h-4 w-4 shrink-0 text-gold/70" strokeWidth={1.2} aria-hidden />
                <span className="min-w-0 text-sm tracking-[0.14em] uppercase text-foreground sm:text-[0.95rem]">
                  {item.title}
                </span>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
