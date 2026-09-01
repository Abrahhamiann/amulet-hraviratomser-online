// @ts-nocheck
import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 0.61, 0.36, 1], delay: i * 0.12 },
  }),
};

export function Reveal({
  children,
  delay = 0,
  className,
  amount = 0.4,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      custom={delay}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function Section({
  children,
  className = "",
  id,
  dataEditorIgnore,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  dataEditorIgnore?: string;
}) {
  return (
    <section id={id} className={`px-7 ${className}`} data-editor-ignore={dataEditorIgnore}>
      {children}
    </section>
  );
}
