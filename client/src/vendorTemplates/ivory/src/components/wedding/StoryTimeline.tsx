import { wedding } from "@/data/wedding";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function StoryTimeline() {
  return (
    <section className="px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="Ինչպես սկսվեց" title="Մեր պատմությունը" />

        <ol className="relative mt-16 space-y-14 pl-8 sm:pl-0">
          <span
            className="absolute left-[3px] top-2 bottom-2 w-px bg-linear-to-b from-transparent via-gold/45 to-transparent sm:left-1/2"
            aria-hidden="true"
          />
          {wedding.story.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={i * 90}
              className="relative sm:grid sm:grid-cols-2 sm:gap-14"
            >
              <span
                className="absolute -left-8 top-2 h-[7px] w-[7px] rotate-45 border border-gold bg-background sm:left-1/2 sm:-translate-x-1/2"
                aria-hidden="true"
              />
              <div
                className={
                  i % 2 === 0
                    ? "sm:col-start-1 sm:text-right"
                    : "sm:col-start-2 sm:row-start-1 sm:text-left"
                }
              >
                <p className="eyebrow">{item.year}</p>
                <h3 className="mt-3 font-display text-2xl font-light text-foreground sm:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
