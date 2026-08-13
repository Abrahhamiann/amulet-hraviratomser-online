import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { WeddingConfig } from "@/data/wedding";
import { Reveal, Section, SectionTitle } from "./primitives";

const spans = [
  "sm:col-span-7 sm:row-span-2 h-72 sm:h-[34rem]",
  "sm:col-span-5 h-56 sm:h-[16rem]",
  "sm:col-span-5 h-64 sm:h-[16.5rem]",
  "sm:col-span-4 h-56 sm:h-[20rem]",
  "sm:col-span-4 h-72 sm:h-[24rem] sm:-mt-10",
  "sm:col-span-4 h-56 sm:h-[20rem]",
];

export function WeddingGallery({ gallery }: { gallery: WeddingConfig["gallery"] }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Section id="gallery">
      <SectionTitle eyebrow="Պատկերասրահ" title={gallery.title} script="Մեր սիրելի պահերից մի քանիսը" />

      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-12 sm:gap-6">
        {gallery.images.map((img, i) => (
          <Reveal key={img.src} delay={(i % 3) * 0.08} className={spans[i % spans.length] ?? ""}>
            <button
              type="button"
              onClick={() => setActive(i)}
              className="group block h-full w-full overflow-hidden"
              style={{ boxShadow: "var(--shadow-soft)" }}
              aria-label={`Բացել նկարը՝ ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
              />
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "color-mix(in oklab, var(--ink) 82%, transparent)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Փակել"
              className="absolute top-5 right-5 grid h-12 w-12 place-items-center rounded-full border border-border/40 text-background"
            >
              <X className="h-5 w-5" strokeWidth={1} />
            </button>
            <motion.img
              key={active}
              src={gallery.images[active]!.src}
              alt={gallery.images[active]!.alt}
              className="max-h-[85svh] max-w-full object-contain"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
