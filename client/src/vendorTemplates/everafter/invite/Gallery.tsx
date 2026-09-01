// @ts-nocheck
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import { Reveal, Section, SectionTitle } from "./decor";

const photos = [
  { src: g1, alt: "Couple holding hands in a golden-hour garden", span: "sm:col-span-2 sm:row-span-2" },
  { src: g2, alt: "Gold engagement ring resting on rose petals", span: "" },
  { src: g4, alt: "Blush and cream rose bouquet with gold ribbon", span: "" },
  { src: g3, alt: "Couple laughing at a candlelit celebration table", span: "sm:col-span-2" },
  { src: g5, alt: "Couple embracing beneath warm string lights", span: "" },
  { src: g6, alt: "Close-up of the engagement ring on her hand", span: "" },
];

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Section className="panel-veil">
      <SectionTitle eyebrow="Ճանապարհին պահված" title="Մեր պահերը" />
      <div className="mt-14 grid auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] sm:grid-cols-4 sm:gap-5">
        {photos.map((p, i) => (
          <Reveal key={p.src} delay={(i % 3) * 0.08} className={p.span}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative h-full w-full overflow-hidden rounded-2xl border border-gold/30 p-1"
              style={{ boxShadow: "var(--shadow-soft)" }}
              aria-label={`Open photo: ${p.alt}`}
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="h-full w-full rounded-xl object-cover transition-transform duration-[1200ms] ease-[var(--ease-silk)] group-hover:scale-110"
              />
              <span className="pointer-events-none absolute inset-1 rounded-xl bg-blush/0 transition-colors duration-500 group-hover:bg-blush/20" />
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(0.38_0.028_45_/_0.55)] p-5 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.img
              key={open}
              src={photos[open]!.src}
              alt={photos[open]!.alt}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[82svh] w-auto max-w-full rounded-2xl border border-gold/40 object-contain"
            />
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Փակել նկարը"
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-background/80 text-foreground"
            >
              <X className="h-4 w-4" strokeWidth={1.4} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
