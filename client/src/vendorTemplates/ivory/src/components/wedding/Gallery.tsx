// @ts-nocheck
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { wedding } from "@/data/wedding";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const spans = [
  "sm:col-span-2 sm:row-span-2",
  "sm:col-span-1",
  "sm:col-span-1",
  "sm:col-span-1",
  "sm:col-span-1",
];

type GalleryImage = { src: string; alt: string };

export function Gallery({ images = wedding.gallery }: { images?: GalleryImage[] }) {
  const [active, setActive] = useState<number | null>(null);
  const activeImage = active === null ? null : images[active];

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section data-gallery className="surface-warm px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="Պահեր" title="Պատկերասրահ" />

        <div className="mt-14 grid auto-rows-[42vw] grid-cols-1 gap-3 sm:auto-rows-[15rem] sm:grid-cols-3">
          {images.map((image, i) => (
            <Reveal
              key={image.alt}
              delay={i * 70}
              className={`${spans[i % spans.length]} min-h-0`}
            >
              <button
                type="button"
                onClick={() => setActive(i)}
                className="group h-full w-full overflow-hidden border border-border/60 bg-card"
                aria-label={`Բացել նկարը՝ ${image.alt}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-calm)] group-hover:scale-105"
                />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {activeImage ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.alt}
          onClick={() => setActive(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 animate-[fade-in_0.4s_var(--ease-calm)]"
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Փակել"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-ivory"
          >
            <X className="h-5 w-5" strokeWidth={1.2} />
          </button>
          <img
            src={activeImage.src}
            alt={activeImage.alt}
            className="max-h-[86svh] w-auto max-w-full object-contain shadow-[var(--shadow-lift)]"
          />
        </div>
      ) : null}
    </section>
  );
}
