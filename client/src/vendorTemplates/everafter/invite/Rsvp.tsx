import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { GoldRule, Reveal, Section, SectionTitle, TwinRings } from "./decor";

type Answer = "accept" | "decline" | null;
type RsvpSubmit = (data: {
  guestName: string;
  status: "attending" | "declined";
  guestCount: number;
  message: string;
}) => Promise<unknown>;

const fieldClass =
  "peer w-full rounded-xl border border-gold/35 bg-card/70 px-4 py-3.5 font-sans text-sm text-foreground outline-none transition-all duration-500 ease-[var(--ease-silk)] placeholder:text-muted-foreground/70 focus:border-gold focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--gold)_18%,transparent)]";

type EditorRsvpSettings = { askGuestCount?: boolean; askMeal?: boolean };

export function Rsvp({ onSubmit, settings = {} }: { onSubmit?: RsvpSubmit; settings?: EditorRsvpSettings }) {
  const [answer, setAnswer] = useState<Answer>(null);
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [meal, setMeal] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !answer) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit?.({
        guestName: name.trim(),
        status: answer === "accept" ? "attending" : "declined",
        guestCount: settings.askGuestCount === false ? 1 : Number(guests),
        message: [message.trim(), meal.trim() ? `Սննդի նախընտրություն՝ ${meal.trim()}` : ""].filter(Boolean).join("\n")
      });
      setSent(true);
    } catch {
      setError("Չհաջողվեց ուղարկել պատասխանը։ Խնդրում ենք փորձել կրկին։");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section id="rsvp" className="relative overflow-hidden bg-cream">
      <SectionTitle eyebrow="Մասնակցության հաստատում" title="Կտոնե՞ք մեզ հետ" script="Խնդրում ենք պատասխանել մինչև սեպտեմբերի 1-ը" />

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
                  {answer === "accept" ? "Շնորհակալություն։" : "Մենք կկարոտենք Ձեզ։"}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
                  {answer === "accept"
                    ? "Անհամբեր սպասում ենք Ձեզ հետ տոնելուն։"
                    : "Շնորհակալություն տեղեկացնելու համար․ մտքով մեզ հետ կլինեք։"}
                </p>
                <GoldRule className="mt-7 w-36" />
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                noValidate
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-7"
              >
                <div>
                  <label htmlFor="rsvp-name" className="eyebrow">
                    Անուն ազգանուն
                  </label>
                  <input
                    id="rsvp-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ձեր անունը"
                    className={`${fieldClass} mt-3`}
                  />
                </div>

                <div>
                  <p className="eyebrow">Կմասնակցե՞ք</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {(
                      [
                        ["accept", "Այո, մեծ սիրով"],
                        ["decline", "Ցավոք, չեմ կարող"],
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

                {settings.askGuestCount !== false ? <div>
                  <label htmlFor="rsvp-guests" className="eyebrow">Հյուրերի քանակ</label>
                  <input
                    id="rsvp-guests"
                    type="number"
                    min={1}
                    step={1}
                    inputMode="numeric"
                    required
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className={`${fieldClass} mt-3 tabular-nums`}
                  />
                </div> : null}

                {settings.askMeal === true ? <div>
                  <label htmlFor="rsvp-meal" className="eyebrow">Սննդի նախընտրություն</label>
                  <input id="rsvp-meal" value={meal} onChange={(e) => setMeal(e.target.value)} className={`${fieldClass} mt-3`} />
                </div> : null}

                <div>
                  <label htmlFor="rsvp-message" className="eyebrow">
                    Հաղորդագրություն մեզ (ըստ ցանկության)
                  </label>
                  <textarea
                    id="rsvp-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Գրեք մի քանի ջերմ խոսք…"
                    className={`${fieldClass} mt-3 resize-none`}
                  />
                </div>

                {error ? <p role="alert" className="text-sm" style={{ color: "var(--destructive, #b42318)" }}>{error}</p> : null}

                <button
                  type="submit"
                  disabled={!name.trim() || !answer || submitting}
                  className="group relative w-full overflow-hidden rounded-full border border-gold/60 px-8 py-4 text-[0.7rem] uppercase tracking-[0.35em] text-foreground transition-opacity duration-500 disabled:opacity-45"
                >
                  <span className="absolute inset-0 translate-y-full bg-[var(--gradient-gold)] transition-transform duration-600 ease-[var(--ease-silk)] group-enabled:group-hover:translate-y-0" />
                  <span className="relative">{submitting ? "Ուղարկվում է…" : "Ուղարկել պատասխանը"}</span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </Section>
  );
}
