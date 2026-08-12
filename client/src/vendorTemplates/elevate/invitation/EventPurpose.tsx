import { Compass, Trophy, Users, type LucideIcon } from "lucide-react";
import type { InvitationData } from "@/data/invitation";
import { Reveal, SectionHeading } from "./primitives";

const icons: Record<string, LucideIcon> = { trophy: Trophy, users: Users, compass: Compass };

export function EventPurpose({ data }: { data: InvitationData }) {
  const { purpose } = data;

  return (
    <section className="section-shell">
      <div aria-hidden className="grid-pattern pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading eyebrow={purpose.eyebrow} title={purpose.title} />

        <div className="mt-14 grid gap-8 sm:mt-20 md:grid-cols-3 md:gap-10">
          {purpose.items.map((item, i) => {
            const Icon = icons[item.icon] ?? Trophy;
            return (
              <Reveal key={item.title} delay={i * 0.12}>
                <article className="group relative h-full border border-border px-7 py-12 text-center transition-all duration-700 ease-[var(--ease-elegant)] hover:-translate-y-1 hover:border-primary/50">
                  <span
                    aria-hidden
                    className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    style={{ boxShadow: "var(--shadow-gold)" }}
                  />
                  <span className="relative mx-auto grid h-16 w-16 rotate-45 place-items-center border border-primary/40 transition-transform duration-700 group-hover:rotate-[135deg]">
                    <Icon className="h-6 w-6 -rotate-45 text-primary transition-transform duration-700 group-hover:-rotate-[135deg]" strokeWidth={1.2} />
                  </span>
                  <h3 className="display-title relative mt-8 text-2xl">{item.title}</h3>
                  <p className="relative mt-3 text-sm font-light leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
