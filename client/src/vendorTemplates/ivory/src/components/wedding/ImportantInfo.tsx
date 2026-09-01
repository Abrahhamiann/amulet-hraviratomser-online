// @ts-nocheck
import { Clock3, Shirt, Baby } from "lucide-react";
import { wedding } from "@/data/wedding";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const icons = [Clock3, Shirt, Baby];

export function ImportantInfo() {
  return (
    <section className="surface-warm px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="Կարևոր է իմանալ" title="Կարևոր տեղեկություններ" />

        <ul className="mt-14 grid gap-10 sm:grid-cols-3">
          {wedding.notes.map((note, i) => {
            const Icon = icons[i % icons.length] ?? Clock3;
            return (
              <Reveal as="li" key={note} delay={i * 90} className="text-center">
                <Icon
                  className="mx-auto h-5 w-5 text-gold"
                  strokeWidth={1.1}
                  aria-hidden="true"
                />
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{note}</p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
