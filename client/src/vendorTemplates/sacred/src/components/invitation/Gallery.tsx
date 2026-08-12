import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Reveal } from "./Reveal";
import { GoldRule, SectionLabel } from "./Ornaments";
import { cn } from "@/lib/utils";
import type { InvitationData } from "@/data/invitation";

export function Gallery({ data }: { data: InvitationData }) {
  const [active, setActive] = useState<number | null>(null);
  const images = data.gallery;

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <section data-gallery className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <SectionLabel>Moments</SectionLabel>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,6vw,3rem)] font-light text-foreground">
            Our family story
          </h2>
          <GoldRule className="mt-7" />
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {images.map((img, i) => (
            <Reveal
              key={img.src}
              variant="scale"
              delay={i * 110}
              className={cn(
                i === 0 && "col-span-2 row-span-2 lg:col-span-2 lg:row-span-2",
                i === 1 && "lg:col-span-2",
              )}
            >
              <button
                type="button"
                onClick={() => setActive(i)}
                className="group block h-full w-full overflow-hidden rounded-2xl border border-gold/25"
                style={{ boxShadow: "var(--shadow-soft)" }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full min-h-40 w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-silk)] group-hover:scale-[1.06]"
                />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          style={{ background: "color-mix(in oklab, var(--foreground) 55%, transparent)" }}
        >
          <button
            type="button"
            aria-label="Close image"
            onClick={() => setActive(null)}
            className="absolute right-5 top-5 grid size-11 place-items-center rounded-full border border-gold/50 text-ivory"
          >
            <X className="size-5" strokeWidth={1.2} />
          </button>
          <img
            src={images[active]?.src}
            alt={images[active]?.alt ?? ""}
            className="max-h-[85vh] w-auto max-w-full rounded-2xl border border-gold/30 object-contain"
          />
        </div>
      )}
    </section>
  );
}
