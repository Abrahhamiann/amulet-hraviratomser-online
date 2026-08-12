import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { GoldRule, Reveal, Section, SectionTitle, TwinRings } from "./decor";

type Answer = "accept" | "decline" | null;

const fieldClass =
  "peer w-full rounded-xl border border-gold/35 bg-card/70 px-4 py-3.5 font-sans text-sm text-foreground outline-none transition-all duration-500 ease-[var(--ease-silk)] placeholder:text-muted-foreground/70 focus:border-gold focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--gold)_18%,transparent)]";

export function Rsvp() {
  const [answer, setAnswer] = useState<Answer>(null);
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !answer) return;
    setSent(true);
  };

  return (
    <Section id="rsvp" className="relative overflow-hidden bg-cream">
      <SectionTitle eyebrow="RSVP" title="Will You Celebrate With Us?" script="kindly reply by September 1" />

      <Reveal delay={0.12} className="mt-12">
        <div className="card-soft mx-auto max-w-xl rounded-3xl px-5 py-9 sm:px-10 sm:py-12">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="thanks"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center py-6 text-center"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/60 text-gold"
                >
                  <Check className="h-6 w-6" strokeWidth={1.2} />
                </motion.span>
                <TwinRings className="mt-6 h-16 w-28" />
                <h3 className="mt-6 font-serif text-3xl font-light text-foreground">
                  {answer === "accept" ? "Thank you." : "We will miss you."}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
                  {answer === "accept"
                    ? "We can’t wait to celebrate with you!"
                    : "Thank you for letting us know — you’ll be with us in spirit."}
                </p>
                <GoldRule className="mt-7 w-36" />
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-7"
              >
                <div>
                  <label htmlFor="rsvp-name" className="eyebrow">
                    Full Name
                  </label>
                  <input
                    id="rsvp-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className={`${fieldClass} mt-3`}
                  />
                </div>

                <div>
                  <p className="eyebrow">Will you attend?</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {(
                      [
                        ["accept", "Joyfully Accept"],
                        ["decline", "Regretfully Decline"],
                      ] as const
                    ).map(([key, label]) => {
                      const active = answer === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setAnswer(key)}
                          aria-pressed={active}
                          className={`group relative overflow-hidden rounded-full border px-5 py-3.5 text-[0.68rem] uppercase tracking-[0.25em] transition-all duration-500 ease-[var(--ease-silk)] ${
                            active
                              ? "border-gold text-foreground"
                              : "border-gold/35 text-muted-foreground hover:border-gold/70"
                          }`}
                        >
                          <span
                            className={`absolute inset-0 bg-blush/40 transition-transform duration-500 ease-[var(--ease-silk)] ${
                              active ? "translate-y-0" : "translate-y-full group-hover:translate-y-0"
                            }`}
                          />
                          <span className="relative">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="eyebrow">Number of guests</p>
                  <div className="mt-3 flex items-center gap-5">
                    <button
                      type="button"
                      aria-label="Decrease guests"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors duration-400 hover:bg-blush/40"
                    >
                      <Minus className="h-4 w-4" strokeWidth={1.4} />
                    </button>
                    <motion.span
                      key={guests}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="min-w-[2.5rem] text-center font-serif text-3xl font-light tabular-nums text-foreground"
                    >
                      {guests}
                    </motion.span>
                    <button
                      type="button"
                      aria-label="Increase guests"
                      onClick={() => setGuests((g) => Math.min(10, g + 1))}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors duration-400 hover:bg-blush/40"
                    >
                      <Plus className="h-4 w-4" strokeWidth={1.4} />
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="rsvp-message" className="eyebrow">
                    A message for us (optional)
                  </label>
                  <textarea
                    id="rsvp-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write something sweet…"
                    className={`${fieldClass} mt-3 resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!name.trim() || !answer}
                  className="group relative w-full overflow-hidden rounded-full border border-gold/60 px-8 py-4 text-[0.7rem] uppercase tracking-[0.35em] text-foreground transition-opacity duration-500 disabled:opacity-45"
                >
                  <span className="absolute inset-0 translate-y-full bg-[var(--gradient-gold)] transition-transform duration-600 ease-[var(--ease-silk)] group-enabled:group-hover:translate-y-0" />
                  <span className="relative">Send Our Reply</span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </Section>
  );
}
