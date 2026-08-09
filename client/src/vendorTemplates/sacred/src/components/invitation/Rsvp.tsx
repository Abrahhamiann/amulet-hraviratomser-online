import { useState, type FormEvent } from "react";
import { Reveal } from "./Reveal";
import { GoldRule, SectionLabel } from "./Ornaments";
import { cn } from "@/lib/utils";
import type { InvitationData } from "@/data/invitation";

const inputClass =
  "w-full rounded-2xl border border-gold/30 bg-[color-mix(in_oklab,var(--ivory)_75%,transparent)] px-5 py-4 text-base text-foreground placeholder:text-muted-foreground/70 outline-none transition-all duration-500 focus:border-gold/70 focus:shadow-[var(--glow-gold)]";

export function Rsvp({ data }: { data: InvitationData }) {
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
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
            <form onSubmit={onSubmit} className="mt-12 space-y-5">
              <div>
                <label htmlFor="rsvp-name" className="mb-2 block text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase">
                  Full Name
                </label>
                <input id="rsvp-name" name="name" required placeholder="Your name" className={inputClass} />
              </div>

              <div>
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
              </div>

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
                      {value === "yes" ? "Joyfully yes" : "Sadly no"}
                    </button>
                  ))}
                </div>
              </fieldset>

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

              <button
                type="submit"
                className="min-h-13 w-full rounded-full py-4 text-[0.72rem] tracking-[0.34em] text-primary-foreground uppercase transition-all duration-500 hover:shadow-[var(--glow-gold)]"
                style={{ background: "var(--gradient-gold)" }}
              >
                Confirm Attendance
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