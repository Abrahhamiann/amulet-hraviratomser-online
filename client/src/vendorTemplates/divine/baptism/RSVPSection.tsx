import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";

import { DoveIcon } from "./icons";
import { Reveal, SectionTitle } from "./primitives";

const fieldClass =
  "font-body w-full rounded-xl border border-border bg-ivory/70 px-4 py-3 text-sm text-foreground outline-none transition-all duration-400 placeholder:text-muted-foreground/70 focus:border-gold focus:bg-card focus:shadow-halo";

const labelClass =
  "font-body mb-2 block text-[0.6rem] tracking-[0.28em] text-muted-foreground uppercase";

export function RSVPSection() {
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="rsvp" className="relative px-6 py-20 sm:py-28">
      <SectionTitle icon="dove" eyebrow="RSVP">
        Խնդրում ենք հաստատել Ձեր ներկայությունը
      </SectionTitle>

      <Reveal>
        <div className="glass-card mx-auto w-full max-w-xl rounded-[2rem] p-6 sm:p-10">
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
                className="py-10 text-center"
              >
                <span className="mx-auto mb-5 block h-10 w-10 text-gold">
                  <DoveIcon />
                </span>
                <p className="font-title text-xl text-foreground sm:text-2xl">
                  Շնորհակալություն։ Սիրով սպասում ենք Ձեզ։
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6 }}
                className="space-y-5"
              >
                <div>
                  <label className={labelClass} htmlFor="rsvp-name">
                    Անուն, Ազգանուն
                  </label>
                  <input id="rsvp-name" name="name" required className={fieldClass} />
                </div>

                <div>
                  <span className={labelClass}>Կմասնակցե՞ք</span>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {(
                      [
                        ["yes", "Այո, կմասնակցեմ"],
                        ["no", "Չեմ կարող մասնակցել"],
                      ] as const
                    ).map(([value, text]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setAttending(value)}
                        aria-pressed={attending === value}
                        className={`font-body rounded-xl border px-4 py-3 text-xs tracking-[0.16em] uppercase transition-all duration-500 ${
                          attending === value
                            ? "border-gold bg-cream text-foreground shadow-halo"
                            : "border-border bg-ivory/60 text-muted-foreground hover:border-gold/60"
                        }`}
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="rsvp-guests">
                      Հյուրերի քանակ
                    </label>
                    <input
                      id="rsvp-guests"
                      name="guests"
                      type="number"
                      min={1}
                      defaultValue={1}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="rsvp-phone">
                      Հեռախոսահամար
                    </label>
                    <input id="rsvp-phone" name="phone" type="tel" className={fieldClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor="rsvp-note">
                    Մաղթանք / Մեկնաբանություն
                  </label>
                  <textarea id="rsvp-note" name="note" rows={3} className={`${fieldClass} resize-none`} />
                </div>

                <button
                  type="submit"
                  disabled={attending === null}
                  className="font-body w-full rounded-full border border-gold/60 bg-gradient-to-r from-gold-soft/70 to-gold/60 px-6 py-4 text-xs tracking-[0.28em] text-foreground uppercase transition-all duration-500 hover:shadow-halo disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Ուղարկել
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}
