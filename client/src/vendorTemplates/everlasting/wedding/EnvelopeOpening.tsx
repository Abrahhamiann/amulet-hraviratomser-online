// @ts-nocheck
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CoupleMonogram } from "./decor";

/** Cinematic envelope intro shown before the invitation. */
export function EnvelopeOpening({
  open,
  onOpen,
  initials,
  label,
  note,
}: {
  open: boolean;
  onOpen: () => void;
  initials: { left: string; right: string };
  label: string;
  note: string;
}) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {!open && (
        <motion.div
          key="envelope"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-6 paper"
          style={{ background: "var(--ivory)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)", scale: 1.04 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="relative w-full max-w-md text-center"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative mx-auto aspect-[3/2] w-full border border-border"
              style={{
                background: "linear-gradient(160deg, var(--card), var(--secondary))",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1/2 origin-top border-b border-border"
                style={{
                  background: "linear-gradient(180deg, var(--card), var(--muted))",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                }}
              />
              <div className="absolute inset-x-0 top-[58%] bottom-0 grid place-items-center pb-3">
                <div className="grid place-items-center gap-3">
                  <CoupleMonogram left={initials.left} right={initials.right} size={78} />
                </div>
              </div>
              <div
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 h-12 w-12 -translate-y-1/2 -translate-x-1/2 rounded-full border"
                style={{
                  background: "radial-gradient(circle at 35% 30%, var(--gold-soft), var(--gold))",
                  borderColor: "color-mix(in oklab, var(--gold) 60%, transparent)",
                  boxShadow: "var(--shadow-soft)",
                }}
              />
            </div>

            <p className="eyebrow mt-10">{note}</p>
            <button type="button" onClick={onOpen} className="btn-gold mt-6">
              {label}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
