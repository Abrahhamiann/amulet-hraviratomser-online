import { Reveal } from "./Reveal";
import { Ornament } from "./Ornament";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  className,
  ornament = true,
}: {
  eyebrow?: string;
  title: string;
  className?: string;
  ornament?: boolean;
}) {
  return (
    <Reveal className={cn("text-center", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-4 font-display text-[clamp(2rem,6vw,3.25rem)] leading-[1.1] font-light tracking-tight text-foreground">
        {title}
      </h2>
      {ornament ? <Ornament className="mt-6" /> : null}
    </Reveal>
  );
}