import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import type { InvitationData } from "@/data/invitation";
import { BrandMark } from "./primitives";

export function CorporateHero({ data }: { data: InvitationData }) {
  const { brand, hero } = data;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center md:px-10"
    >
      <motion.div className="absolute inset-0" style={{ y: reduced ? 0 : bgY }}>
        <img
          src={hero.backgroundImage}
          alt=""
          aria-hidden
          width={1920}
          height={1280}
          className="h-[118%] w-full object-cover object-top opacity-[0.22]"
        />
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
        <div className="grid-pattern absolute inset-0 opacity-60" />
      </motion.div>

      {/* Slow geometric accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float-slow absolute -left-24 top-1/4 h-64 w-64 rotate-45 border border-primary/15" />
        <div className="animate-float-slow absolute -right-16 bottom-16 h-80 w-80 rounded-full border border-primary/10 [animation-delay:-6s]" />
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
      </div>

      <motion.div className="relative w-full max-w-4xl" style={{ opacity: reduced ? 1 : fade }}>
        <motion.div
          className="flex flex-col items-center gap-5"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease }}
        >
          <BrandMark
            logoUrl={brand.logoUrl}
            monogram={brand.monogram}
            name={brand.companyName}
            size="lg"
          />
          <span className="text-sm font-bold uppercase tracking-[0.55em] text-ivory sm:text-base">
            {brand.companyName}
          </span>
          <span className="font-accent text-base italic text-muted-foreground">
            {brand.tagline}
          </span>
        </motion.div>

        <motion.div
          className="mx-auto mt-8 h-px w-40 origin-center bg-gradient-to-r from-transparent via-primary to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.5, ease }}
        />

        <div className="mt-8 overflow-hidden pb-3">
          <motion.h1
            className="display-title text-balance text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem]"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.3, delay: 0.65, ease }}
          >
            {hero.title}
          </motion.h1>
        </div>

        <motion.p
          className="mx-auto mt-6 max-w-xl text-pretty text-sm font-light leading-relaxed tracking-[0.14em] text-muted-foreground uppercase sm:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1, ease }}
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-3 text-sm tracking-[0.25em] uppercase sm:flex-row sm:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 1.2 }}
        >
          <span>{hero.dateLabel}</span>
          <span aria-hidden className="hidden h-4 w-px bg-primary/50 sm:block" />
          <span>{hero.locationLabel}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.45, ease }}
          className="mt-12"
        >
          <a
            href="#invitation"
            className="group relative isolate inline-flex items-center gap-3 overflow-hidden border border-primary bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground transition-opacity duration-300 hover:opacity-90"
          >
            <span className="relative z-10">{hero.cta}</span>
            <ChevronDown className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-y-0.5" />
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 h-16 w-px -translate-x-1/2 bg-gradient-to-b from-primary/60 to-transparent"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.4, delay: 1.7 }}
        style={{ transformOrigin: "top" }}
      />
    </section>
  );
}
