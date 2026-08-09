import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { ConfettiBurst } from "./ConfettiBurst";

/** Elegant gift-box reveal: box appears, shakes, ribbon opens, light + confetti, done. */
export function BirthdayIntro({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<"box" | "open" | "gone">("box");

  useEffect(() => {
    if (reduce) {
      setStage("gone");
      onDone();
      return;
    }
    const t1 = setTimeout(() => setStage("open"), 1150);
    const t2 = setTimeout(() => {
      setStage("gone");
      onDone();
    }, 2350);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduce, onDone]);

  return (
    <AnimatePresence>
      {stage !== "gone" && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center overflow-hidden bg-hero-glow"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="pointer-events-none absolute h-[46vmin] w-[46vmin] rounded-full"
            style={{ background: "var(--gradient-gold)", filter: "blur(70px)" }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={stage === "open" ? { opacity: 0.65, scale: 1.6 } : { opacity: 0.16, scale: 0.7 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />

          <div className="relative">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{ animation: stage === "box" ? "shake-box 1.1s ease-in-out 0.35s" : undefined }}
            >
              <svg width="150" height="150" viewBox="0 0 120 120" aria-hidden="true">
                <motion.g
                  animate={
                    stage === "open"
                      ? { y: -46, rotate: -14, opacity: 0 }
                      : { y: 0, rotate: 0, opacity: 1 }
                  }
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  style={{ originX: "60px", originY: "40px" }}
                >
                  <rect x="16" y="34" width="88" height="16" rx="5" fill="var(--blush)" />
                  <rect x="54" y="34" width="12" height="16" fill="var(--gold)" />
                  <path
                    d="M60 34 C46 34 40 20 50 18 C58 17 60 28 60 34 C60 28 62 17 70 18 C80 20 74 34 60 34 Z"
                    fill="var(--gold)"
                  />
                </motion.g>
                <rect x="22" y="50" width="76" height="52" rx="6" fill="var(--peach)" />
                <rect x="54" y="50" width="12" height="52" fill="var(--gold)" />
              </svg>
            </motion.div>

            {stage === "open" && <ConfettiBurst pieces={54} seed={11} />}
          </div>

          <motion.p
            className="absolute bottom-[16%] font-script text-2xl text-foreground/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Ձեզ համար մի փոքրիկ անակնկալ…
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
