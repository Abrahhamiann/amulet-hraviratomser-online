import { useState, type FormEvent } from "react";
import { Reveal } from "./Reveal";
import { GoldRule, SectionLabel } from "./Ornaments";
import { cn } from "@/lib/utils";
import type { InvitationData } from "@/data/invitation";

const inputClass =
  "w-full rounded-2xl border border-gold/30 bg-[color-mix(in_oklab,var(--ivory)_75%,transparent)] px-5 py-4 text-base text-foreground placeholder:text-muted-foreground/70 outline-none transition-all duration-500 focus:border-gold/70 focus:shadow-[var(--glow-gold)]";

type RsvpSubmit = (data: {
  guestName: string;
  phone?: string;
  status: "attending" | "declined";
  guestCount: number;
  message: string;
}) => Promise<unknown>;

export function Rsvp({ data, onSubmit }: { data: InvitationData; onSubmit?: RsvpSubmit }) {
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const meal = String(form.get("meal") || "").trim();
    const message = String(form.get("message") || "").trim();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit?.({
        guestName: String(form.get("name") || "").trim(),
        status: attending === "yes" ? "attending" : "declined",
        guestCount: Number(form.get("guests") || 1),
        message: [message, meal ? `Food preference: ${meal}` : ""].filter(Boolean).join("\n")
      });
      setSent(true);
    } catch {
      setError("Չհաջողվեց ուղարկել պատասխանը։ Խնդրում ենք փորձել կրկին։");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="relative px-6 py-24 sm:py-32">
      <div
        className="mx-auto max-w-xl rounded-[2rem] border border-gold/25 px-6 py-14 sm:px-10"
        style={{ background: "color-mix(in oklab, var(--cream) 50%, transparent)", boxShadow: "var(--shadow-soft)" }}
      >
        <Reveal className="text-center">
          <SectionLabel>RSVP</SectionLabel>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,6.5vw,2.9rem)] font-light text-foreground">
            {data.rsvp.heading}
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{data.rsvp.description}</p>
          <GoldRule className="mt-8" />
        </Reveal>

        {sent ? (
          <Reveal className="mt-12 text-center">
            <p className="font-display text-2xl text-foreground italic">
              Thank you — your answer has been received.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              We are so grateful you took the time to reply.
            </p>
          </Reveal>
        ) : (
          <Reveal delay={160}>
            <form onSubmit={submit} className="mt-12 space-y-5">
              <div>
                <label htmlFor="rsvp-name" className="mb-2 block text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase">
                  Full Name
                </label>
                <input id="rsvp-name" name="name" required placeholder={data.rsvp.guestPlaceholder || "Your name"} className={inputClass} />
              </div>

              {data.rsvp.askGuestCount !== false ? <div>
                <label htmlFor="rsvp-guests" className="mb-2 block text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase">
                  Number of Guests
                </label>
                <input
                  id="rsvp-guests"
                  name="guests"
                  type="number"
                  min={1}
                  max={10}
                  defaultValue={1}
                  className={inputClass}
                />
              </div> : null}

              <fieldset>
                <legend className="mb-2 block text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase">
                  Attendance
                </legend>
                <div className="grid grid-cols-2 gap-3">
                  {(["yes", "no"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAttending(value)}
                      aria-pressed={attending === value}
                      className={cn(
                        "min-h-12 rounded-2xl border text-[0.72rem] tracking-[0.28em] uppercase transition-all duration-500",
                        attending === value
                          ? "border-gold/70 bg-gold/15 text-foreground shadow-[var(--glow-gold)]"
                          : "border-gold/25 text-muted-foreground hover:border-gold/50",
                      )}
                    >
                      {value === "yes" ? (data.rsvp.attendingLabel || "Joyfully yes") : (data.rsvp.notAttendingLabel || "Sadly no")}
                    </button>
                  ))}
                </div>
              </fieldset>

              {data.rsvp.askMeal === true ? <div>
                <label htmlFor="rsvp-meal" className="mb-2 block text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase">
                  Food Preference
                </label>
                <select id="rsvp-meal" name="meal" className={inputClass} defaultValue="">
                  <option value="" disabled>Choose an option</option>
                  <option>Standard</option>
                  <option>Vegetarian</option>
                </select>
              </div> : null}

              <div>
                <label htmlFor="rsvp-message" className="mb-2 block text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase">
                  Message (optional)
                </label>
                <textarea
                  id="rsvp-message"
                  name="message"
                  rows={4}
                  placeholder="A few warm words for the family…"
                  className={cn(inputClass, "resize-none")}
                />
              </div>

              {error ? <p role="alert" className="text-sm" style={{ color: "var(--destructive, #b42318)" }}>{error}</p> : null}

              <button
                type="submit"
                disabled={submitting}
                className="min-h-13 w-full rounded-full py-4 text-[0.72rem] tracking-[0.34em] text-primary-foreground uppercase transition-all duration-500 hover:shadow-[var(--glow-gold)]"
                style={{ background: "var(--gradient-gold)" }}
              >
                {submitting ? "Ուղարկվում է…" : (data.rsvp.submitLabel || "Confirm Attendance")}
              </button>

              <p className="pt-2 text-center text-[0.68rem] tracking-[0.2em] text-muted-foreground">
                {data.rsvp.deadline}
              </p>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}
