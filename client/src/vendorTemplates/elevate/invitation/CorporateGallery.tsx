// @ts-nocheck
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { InvitationData } from "@/data/invitation";
import { Reveal, SectionHeading } from "./primitives";

const spans = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-2",
  "",
  "",
  "md:col-span-2",
  "md:col-span-2",
];

export function CorporateGallery({ data }: { data: InvitationData }) {
  const { gallery } = data;
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={gallery.eyebrow} title={gallery.title} />

        <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-3 sm:mt-20 sm:auto-rows-[220px] md:grid-cols-4 md:gap-4">
          {gallery.images.map((img, i) => (
            <Reveal
              key={img.src}
              delay={(i % 3) * 0.08}
              className={`${spans[i] ?? ""} ${i === 0 ? "col-span-2" : ""}`}
            >
              <button
                type="button"
                onClick={() => setActive(i)}
                className="group relative h-full w-full overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-elegant)] group-hover:scale-[1.07]"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-background/45 transition-opacity duration-700 group-hover:bg-background/15"
                />
                <span aria-hidden className="absolute inset-2 border border-primary/0 transition-colors duration-700 group-hover:border-primary/40" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && gallery.images[active] && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-background/95 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={gallery.images[active]!.alt}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Փակել նկարը"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              key={active}
              src={gallery.images[active]!.src}
              alt={gallery.images[active]!.alt}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[85vh] w-auto max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
