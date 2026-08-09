import { useState, type FormEvent } from "react";
import { z } from "zod";
import { wedding } from "@/data/wedding";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Ornament } from "./Ornament";

const schema = z.object({
  name: z.string().trim().min(2, "Խնդրում ենք նշել Ձեր անունը").max(80, "Անունը չափազանց երկար է"),
  attending: z.enum(["yes", "no"]),
  guests: z.number().int().min(1).max(wedding.rsvp.maxGuests),
  food: z.string().max(40),
  message: z.string().trim().max(500, "Հաղորդագրությունը չափազանց երկար է"),
});

const fieldClass =
  "mt-2 w-full min-h-11 border-0 border-b border-border bg-transparent px-0 py-2 text-[0.95rem] text-foreground outline-none transition-colors duration-500 placeholder:text-muted-foreground/60 focus:border-gold";

export function RSVPForm() {
  const { rsvp } = wedding;
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = schema.safeParse({
      name: String(data.get("name") ?? ""),
      attending,
      guests: Number(data.get("guests") ?? 1),
      food: String(data.get("food") ?? ""),
      message: String(data.get("message") ?? ""),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Խնդրում ենք ստուգել ձևը");
      return;
    }
    setError(null);
    setSent(true);
  }

  return (
    <section className="surface-warm px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-xl">
        <SectionHeading eyebrow={`Խնդրում ենք պատասխանել մինչև ${rsvp.deadline}`} title="Կտոնե՞ք մեզ հետ" />

        <Reveal delay={120} className="mt-14">
          {sent ? (
            <div className="animate-[scale-in_0.6s_var(--ease-calm)] border border-gold/40 bg-card/70 px-6 py-16 text-center shadow-[var(--shadow-soft)]">
              <Ornament />
              <p className="mt-8 font-display text-[clamp(1.5rem,4.5vw,2.1rem)] leading-snug font-light text-foreground">
                Thank you! We can&apos;t wait to celebrate with you.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Your response has been noted with love.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-10">
              <div>
                <label htmlFor="name" className="eyebrow">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  maxLength={80}
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className={fieldClass}
                />
              </div>

              <fieldset>
                <legend className="eyebrow">Will you attend?</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { value: "yes", label: "Yes, with pleasure" },
                    { value: "no", label: "Unfortunately, I cannot" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setAttending(option.value as "yes" | "no")}
                      aria-pressed={attending === option.value}
                      className={
                        "min-h-12 border px-4 text-[0.7rem] tracking-[0.2em] uppercase transition-colors duration-500 " +
                        (attending === option.value
                          ? "border-gold bg-gold/12 text-foreground"
                          : "border-border text-muted-foreground hover:border-gold/50")
                      }
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              {attending === "yes" ? (
                <div className="grid gap-10 sm:grid-cols-2">
                  <div>
                    <label htmlFor="guests" className="eyebrow">
                      Number of Guests
                    </label>
                    <select id="guests" name="guests" defaultValue="1" className={fieldClass}>
                      {Array.from({ length: rsvp.maxGuests }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="food" className="eyebrow">
                      Food Preference
                    </label>
                    <select id="food" name="food" defaultValue={rsvp.foodOptions[0]} className={fieldClass}>
                      {rsvp.foodOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : null}

              <div>
                <label htmlFor="message" className="eyebrow">
                  A message for the couple
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  maxLength={500}
                  placeholder="Optional"
                  className={fieldClass + " resize-none"}
                />
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <button
                type="submit"
                className="min-h-12 w-full border border-gold bg-gold/10 px-8 text-[0.7rem] tracking-[0.3em] uppercase text-foreground transition-colors duration-500 hover:bg-gold/20"
              >
                Confirm Attendance
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
