import { useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useInvitationData } from "../../data/invitation";
import { Reveal, Section } from "./Reveal";
import { Heart, Squiggle } from "./Doodles";

type RsvpPayload = {
  guestName: string;
  status: "attending" | "declined";
  guestCount?: number;
  message?: string;
};

export function RSVPSection({ onSubmit }: { onSubmit?: (payload: RsvpPayload) => Promise<unknown> }) {
  const d = useInvitationData();
  const nameRef = useRef<HTMLInputElement>(null);
  const firstAttendanceRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<string | null>(null);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; attendance?: string }>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const coming = attendance === d.rsvp.attendanceOptions[0];

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "Խնդրում ենք լրացնել Ձեր անունը։";
    if (!attendance) next.attendance = "Խնդրում ենք ընտրել տարբերակներից մեկը։";
    setErrors(next);
    if (Object.keys(next).length) {
      window.requestAnimationFrame(() => {
        if (next.name) nameRef.current?.focus();
        else firstAttendanceRef.current?.focus();
      });
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit?.({
        guestName: name.trim(),
        status: coming ? "attending" : "declined",
        guestCount: coming ? Math.max(1, Math.trunc(guests) || 1) : undefined,
        message: message.trim() || undefined,
      });
      setSent(true);
    } catch {
      setSubmitError("Պատասխանը չհաջողվեց ուղարկել։ Խնդրում ենք կրկին փորձել։");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Section className="py-24 text-center">
      <Reveal className="text-center">
        <h2 className="font-hy text-[1.9rem] font-light tracking-[0.1em] text-ink">{d.rsvp.heading}</h2>
        <p className="mx-auto mt-5 max-w-[18rem] font-hy text-[0.9rem] font-light leading-[1.8] text-ink/70">
          {d.rsvp.subheading}
        </p>
        <div className="mt-7 flex justify-center text-accent">
          <Squiggle className="h-3 w-20" />
        </div>
      </Reveal>

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="mt-16 flex flex-col items-center text-center"
          >
            <Heart className="h-8 w-8 text-primary" />
            <p className="mt-6 font-display text-[2rem] italic text-ink">{d.rsvp.thanksTitle}</p>
            <p className="mt-3 font-hy text-[0.92rem] font-light text-ink/70">{d.rsvp.thanksText}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto mt-14 max-w-xl space-y-10 rounded-sm border border-ink/15 bg-background/70 px-5 py-8 text-center sm:px-10"
            noValidate
          >
            <div>
              <label htmlFor="rsvp-name" className="caption block">
                {d.rsvp.nameLabel}
              </label>
              <input
                ref={nameRef}
                id="rsvp-name"
                type="text"
                autoComplete="name"
                enterKeyHint="next"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((current) => ({ ...current, name: undefined }));
                }}
                placeholder={d.rsvp.namePlaceholder}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "rsvp-name-error" : undefined}
                className="mt-3 min-h-12 w-full border-0 border-b border-ink/25 bg-transparent px-3 pb-2 font-hy text-[1.08rem] font-light text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-primary"
              />
              {errors.name && <p id="rsvp-name-error" role="alert" className="mt-2 font-hy text-sm text-destructive">{errors.name}</p>}
            </div>

            <fieldset aria-describedby={errors.attendance ? "rsvp-attendance-error" : undefined}>
              <legend className="caption">{d.rsvp.attendanceQuestion}</legend>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {d.rsvp.attendanceOptions.map((opt, index) => (
                  <label key={opt} className={`flex min-h-12 cursor-pointer items-center justify-center gap-3 border px-4 py-3 transition-colors ${attendance === opt ? "border-primary bg-primary/10" : "border-ink/25 hover:border-ink/50"}`}>
                    <input
                      ref={index === 0 ? firstAttendanceRef : undefined}
                      type="radio"
                      name="attendance"
                      value={opt}
                      checked={attendance === opt}
                      onChange={() => {
                        setAttendance(opt);
                        if (errors.attendance) setErrors((current) => ({ ...current, attendance: undefined }));
                      }}
                      className="h-4 w-4 shrink-0 accent-[var(--primary)]"
                    />
                    <span className="font-hy text-[1rem] font-light text-ink/85">{opt}</span>
                  </label>
                ))}
              </div>
              {errors.attendance && <p id="rsvp-attendance-error" role="alert" className="mt-2 font-hy text-sm text-destructive">{errors.attendance}</p>}
            </fieldset>

            <AnimatePresence initial={false}>
              {coming && d.rsvp.askGuestCount !== false && (
                <motion.fieldset
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.6 }}
                  className="overflow-hidden"
                >
                  <label htmlFor="rsvp-guests" className="caption block">{d.rsvp.guestsQuestion}</label>
                  <input
                    id="rsvp-guests"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={guests}
                    onChange={(event) => setGuests(Math.max(1, Number(event.target.value) || 1))}
                    className="mx-auto mt-4 min-h-12 w-28 border border-ink/25 bg-transparent px-3 font-display text-xl text-ink outline-none transition-colors focus:border-primary"
                  />
                </motion.fieldset>
              )}
            </AnimatePresence>

            <div>
              <label htmlFor="rsvp-message" className="caption block">
                {d.rsvp.messageQuestion}
              </label>
              <textarea
                id="rsvp-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-3 min-h-24 w-full resize-y border border-ink/25 bg-transparent p-3 font-hy text-[1rem] font-light text-ink outline-none transition-colors focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group inline-flex min-h-12 w-full items-center justify-center gap-3 border border-ink/45 px-4 py-3.5 font-hy-sans text-[0.82rem] uppercase tracking-[0.18em] text-ink transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-background disabled:cursor-wait disabled:opacity-50"
            >
              {submitting ? "Ուղարկվում է…" : d.rsvp.submitLabel}
              <svg viewBox="0 0 24 12" className="h-2.5 w-6 transition-transform duration-500 group-hover:translate-x-1.5">
                <path d="M0 6h21M16 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
            {submitError && <p role="alert" aria-live="polite" className="font-hy text-sm text-destructive">{submitError}</p>}
          </motion.form>
        )}
      </AnimatePresence>
    </Section>
  );
}
