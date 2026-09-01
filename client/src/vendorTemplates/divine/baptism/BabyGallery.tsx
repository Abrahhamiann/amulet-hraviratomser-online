// @ts-nocheck
import { invitation } from "@/data/invitation";

import { Reveal, SectionTitle } from "./primitives";

export function BabyGallery() {
  return (
    <section className="relative px-6 py-20 sm:py-28">
      <SectionTitle icon="floral" eyebrow="Gallery">
        {invitation.galleryTitle}
      </SectionTitle>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-7">
        {invitation.gallery.map((photo, i) => (
          <Reveal key={photo.src} delay={i * 0.12}>
            <figure
              className={`group relative overflow-hidden arch border border-gold/25 bg-cream/40 p-1.5 shadow-soft ${
                i === 1 ? "sm:-translate-y-6" : ""
              }`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                width={900}
                height={1200}
                className="arch h-[22rem] w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.05] sm:h-[24rem]"
              />
              <span
                className="arch pointer-events-none absolute inset-1.5 bg-gradient-to-t from-ivory/45 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                aria-hidden
              />
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
