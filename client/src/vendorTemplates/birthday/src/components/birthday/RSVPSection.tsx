import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { ConfettiBurst } from "./ConfettiBurst";
import { Reveal } from "./Reveal";

export type RsvpData = {
  guestName: string;
  guestCount: number;
  status: "attending" | "declined";
  message: string;
};

type EditorRsvpSettings = {
  title?: string;
  description?: string;
  guestPlaceholder?: string;
  attendingLabel?: string;
  notAttendingLabel?: string;
  submitLabel?: string;
  askGuestCount?: boolean;
};

const fieldClass =
  "mt-2 min-h-12 w-full rounded-2xl border border-input bg-card px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-gold";

export function RSVPSection({ onSubmit, settings = {}, question = '' }: { onSubmit?: (data: RsvpData) => unknown | Promise<unknown>; settings?: EditorRsvpSettings; question?: string }) {
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data: RsvpData = {
      guestName: String(form.get("fullName") ?? "").trim(),
      guestCount: Number(form.get("guests") ?? 1),
      status: attending === "yes" ? "attending" : "declined",
      message: String(form.get("message") ?? ""),
    };
    if (!data.guestName) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit?.(data);
      setSent(true);
    } catch {
      setError("Չհաջողվեց ուղարկել պատասխանը։ Խնդրում ենք փորձել կրկին։");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="relative overflow-hidden px-5 py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 30%, color-mix(in oklab, var(--lavender) 40%, transparent), transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-2xl">
        <Reveal className="text-center">
          <p className="font-sans text-xs uppercase tracking-[0.45em] text-muted-foreground">
            RSVP
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            {settings.title || "Will You Join the Celebration?"}
          </h2>
          <p className="mt-5 font-sans text-base text-muted-foreground">
            {question || settings.description || "Please let me know if you’ll be celebrating with us."}
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="glass-card relative mt-12 overflow-hidden rounded-[2rem] p-6 sm:p-10">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="done"
                  className="relative py-10 text-center"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ConfettiBurst pieces={70} seed={29} />
                  <div className="relative text-5xl" aria-hidden="true">
                    🎂
                  </div>
                  <h3 className="relative mt-6 font-display text-3xl">Thank you!</h3>
                  <p className="relative mt-3 font-sans text-base text-muted-foreground">
                    Your response has been received. 🎂✨
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="relative mt-8 font-sans text-xs uppercase tracking-[0.3em] text-primary underline-offset-4 hover:underline"
                  >
                    Send another response
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label
                      htmlFor="fullName"
                      className="font-sans text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground"
                    >
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      required
                      autoComplete="name"
                      placeholder={settings.guestPlaceholder || "Your name"}
                      className={fieldClass}
                    />
                  </div>

                  {settings.askGuestCount !== false ? <div>
                    <label
                      htmlFor="guests"
                      className="font-sans text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground"
                    >
                      Number of Guests
                    </label>
                    <input
                      id="guests"
                      name="guests"
                      type="number"
                      min={1}
                      step={1}
                      defaultValue={1}
                      inputMode="numeric"
                      required
                      className={fieldClass}
                    />
                  </div> : null}

                  <fieldset>
                    <legend className="font-sans text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
                      Will you attend?
                    </legend>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {(
                        [
                          { value: "yes", label: settings.attendingLabel || "✓ Yes, I'll be there" },
                          { value: "no", label: settings.notAttendingLabel || "✕ Unfortunately, I can't come" },
                        ] as const
                      ).map((opt) => {
                        const on = attending === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setAttending(opt.value)}
                            className={`min-h-12 rounded-2xl border px-4 py-3 font-sans text-sm transition-all duration-300 ${
                              on
                                ? "border-gold text-accent-foreground shadow-glow"
                                : "border-input bg-card text-muted-foreground hover:border-gold/60"
                            }`}
                            style={
                              on
                                ? {
                                    backgroundImage: "var(--gradient-gold)",
                                    backgroundSize: "200% 100%",
                                  }
                                : undefined
                            }
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div>
                    <label
                      htmlFor="message"
                      className="font-sans text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground"
                    >
                      Leave a birthday message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Optional — write something sweet"
                      className={`${fieldClass} resize-none`}
                    />
                  </div>

                  {error ? <p role="alert" className="font-sans text-sm" style={{ color: "var(--destructive, #b42318)" }}>{error}</p> : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="min-h-13 w-full rounded-full px-8 py-4 font-sans text-sm font-medium uppercase tracking-[0.25em] text-accent-foreground shadow-glow transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99]"
                    style={{
                      backgroundImage: "var(--gradient-gold)",
                      backgroundSize: "200% 100%",
                    }}
                  >
                    {submitting ? "Ուղարկվում է…" : (settings.submitLabel || "Send RSVP 🎉")}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
