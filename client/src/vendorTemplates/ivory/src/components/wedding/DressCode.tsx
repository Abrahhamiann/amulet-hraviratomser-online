import { wedding } from "@/data/wedding";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

type DressCodeData = typeof wedding.dressCode;

export function DressCode({ dressCode = wedding.dressCode }: { dressCode?: DressCodeData }) {
  return (
    <section className="px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <SectionHeading eyebrow="A gentle note on style" title="Dress Code" />

        <Reveal delay={120}>
          <p className="mx-auto mt-8 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
            {dressCode.text}
          </p>
        </Reveal>

        <Reveal delay={200}>
          <ul className="mt-12 flex flex-wrap items-start justify-center gap-x-6 gap-y-8 sm:gap-x-10">
            {dressCode.colors.map((color, index) => (
              <li key={color.name} className="flex w-16 flex-col items-center gap-3">
                <span
                  data-dress-color-index={index}
                  className="h-14 w-14 rounded-full ring-1 ring-border shadow-[var(--shadow-soft)] transition-transform duration-500 hover:scale-105"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-[0.65rem] tracking-[0.18em] uppercase text-muted-foreground">
                  {color.name}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
