// @ts-nocheck
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { GalleryPhoto } from "@/config/invitation";
import { Reveal } from "./Reveal";

export function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const active = open === null ? null : photos[open];

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section data-gallery className="relative px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="font-sans text-xs uppercase tracking-[0.45em] text-muted-foreground">
            Պատկերասրահ
          </p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl">Գեղեցիկ հիշողություններ</h2>
        </Reveal>

        <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {photos.map((photo, i) => (
            <Reveal key={photo.src} delay={(i % 3) * 0.08} className="break-inside-avoid">
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group relative block w-full overflow-hidden rounded-[1.5rem] border-0 bg-transparent p-0 leading-[0] shadow-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                style={{
                  borderTopRightRadius: i % 3 === 1 ? "3.5rem" : undefined,
                  borderBottomLeftRadius: i % 3 === 2 ? "3.5rem" : undefined,
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full object-cover align-middle transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                />
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 45%, color-mix(in oklab, var(--ink) 55%, transparent))",
                  }}
                />
                <span className="pointer-events-none absolute bottom-4 left-5 translate-y-3 font-script text-2xl text-primary-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  դիտել
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center p-4"
            style={{ background: "color-mix(in oklab, var(--ink) 82%, transparent)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={active.alt}
          >
            <motion.img
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              className="max-h-[85vh] w-auto max-w-full rounded-3xl object-contain shadow-glow"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Փակել նկարը"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-gold/50 text-primary-foreground"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
