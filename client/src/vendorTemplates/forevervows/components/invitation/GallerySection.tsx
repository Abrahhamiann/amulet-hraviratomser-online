import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useInvitationData } from "../../data/invitation";
import { Section } from "./Reveal";

export function GallerySection() {
  const d = useInvitationData();
  const [photoMain, photoSmall, photoTiny] = d.gallery.images;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const y2 = useTransform(scrollYProgress, [0, 1], [60, -30]);

  return (
    <Section className="py-24">
      <div ref={ref} className="relative pb-24">
        <motion.figure
          style={{ y: y1 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1 }}
          className="relative w-[72%]"
        >
          <img
            src={photoMain}
            alt="Նարե և Դավիթ"
            className="aspect-[3/4] w-full object-cover"
            loading="lazy"
          />
          <figcaption className="script mt-3 text-lg">{d.gallery.captions.main}</figcaption>
        </motion.figure>

        <motion.figure
          style={{ y: y2 }}
          initial={{ opacity: 0, rotate: 3 }}
          whileInView={{ opacity: 1, rotate: 2.5 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, delay: 0.15 }}
          className="absolute right-0 top-[38%] w-[46%] bg-paper p-2 shadow-[0_10px_30px_-18px_rgba(37,33,30,0.5)]"
        >
          <img
            src={photoSmall}
            alt="Զույգի լուսանկար"
            className="aspect-[4/5] w-full object-cover"
            loading="lazy"
          />
          <figcaption className="caption mt-2 block text-center">{d.gallery.captions.small}</figcaption>
        </motion.figure>

        <motion.figure
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-0 left-6 w-[34%] -rotate-3 bg-paper p-1.5 pb-5 shadow-[0_8px_24px_-16px_rgba(37,33,30,0.55)]"
        >
          <img src={photoTiny} alt="Պոլարոիդ լուսանկար" className="aspect-square w-full object-cover" loading="lazy" />
          <figcaption className="script mt-1 block text-center text-sm">{d.gallery.captions.tiny}</figcaption>
        </motion.figure>
      </div>
    </Section>
  );
}
