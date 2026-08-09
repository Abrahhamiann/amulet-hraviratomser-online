import { wedding } from "@/data/wedding";
import { Reveal } from "./Reveal";

function Portrait({
  image,
  name,
  role,
  text,
  align,
  delay,
}: {
  image: string;
  name: string;
  role: string;
  text: string;
  align: "left" | "right";
  delay: number;
}) {
  return (
    <Reveal delay={delay} className={align === "right" ? "sm:mt-24" : ""}>
      <figure className="group">
        <div className="overflow-hidden border border-border/70 bg-card p-2 shadow-[var(--shadow-soft)]">
          <img
            src={image}
            alt={`${role} ${name}`}
            loading="lazy"
            width={1008}
            height={1312}
            className="h-[clamp(20rem,58vw,34rem)] w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-calm)] group-hover:scale-[1.03]"
          />
        </div>
        <figcaption className="mt-6 text-center">
          <p className="eyebrow">{role}</p>
          <h3 className="mt-3 font-display text-4xl font-light text-foreground">{name}</h3>
          <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {text}
          </p>
        </figcaption>
      </figure>
    </Reveal>
  );
}

export function CoupleSection() {
  const { couple, coupleSection } = wedding;
  return (
    <section className="surface-warm px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-14 sm:grid-cols-2 sm:gap-12">
          <Portrait
            image={couple.bride.image}
            name={couple.bride.name}
            role="Հարսը"
            text={coupleSection.brideText}
            align="left"
            delay={0}
          />
          <Portrait
            image={couple.groom.image}
            name={couple.groom.name}
            role="Փեսան"
            text={coupleSection.groomText}
            align="right"
            delay={140}
          />
        </div>
      </div>
    </section>
  );
}
