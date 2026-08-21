import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import type { WeddingConfig } from "@/data/wedding";
import { Petals } from "./decor";
import { Reveal, Section, SectionTitle } from "./primitives";

const fieldClass =
  "w-full min-h-12 border-0 border-b border-border bg-transparent px-1 py-3 text-base outline-none transition-colors duration-500 placeholder:text-muted-foreground/70 focus:border-primary";

const rsvpSchema = z.object({
  name: z.string().trim().min(2, "Խնդրում ենք նշել Ձեր անունը").max(80),
  attending: z.enum(["yes", "no"]),
  guests: z.coerce.number().int().min(1),
  meal: z.string().max(40),
  message: z.string().trim().max(500).optional(),
});

type RsvpSubmit = (data: {
  guestName: string;
  status: "attending" | "declined";
  guestCount: number;
  message: string;
}) => Promise<unknown>;

type EditorRsvpSettings = { askGuestCount?: boolean; askMeal?: boolean };

export function RSVPForm({ rsvp, onSubmit, settings = {} }: { rsvp: WeddingConfig["rsvp"]; onSubmit?: RsvpSubmit; settings?: EditorRsvpSettings }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = rsvpSchema.safeParse({ ...data, attending, guests: data.guests ?? 1, meal: data.meal ?? "" });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Խնդրում ենք ստուգել լրացված տվյալները");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit?.({
        guestName: parsed.data.name,
        status: parsed.data.attending === "yes" ? "attending" : "declined",
        guestCount: parsed.data.guests,
        message: [parsed.data.message || "", parsed.data.meal ? `Սննդի նախընտրություն՝ ${parsed.data.meal}` : ""].filter(Boolean).join("\n")
      });
      setSent(true);
    } catch {
      setError("Չհաջողվեց ուղարկել պատասխանը։ Խնդրում ենք փորձել կրկին։");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Section id="rsvp" tone="paper" className="overflow-hidden">
      <Petals count={6} gold />
      <SectionTitle eyebrow="Մասնակցության հաստատում" title={rsvp.title} script={rsvp.subtitle} />

      <div className="relative mx-auto mt-14 max-w-xl">
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="thanks"
              className="py-10 text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.svg
                viewBox="0 0 60 60"
                className="mx-auto h-16 w-16 text-gold"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <motion.circle
                  cx="30"
                  cy="30"
                  r="26"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, ease: "easeInOut" }}
                />
                <motion.path
                  d="M19 31l8 8 15-17"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.7, ease: "easeInOut" }}
                />
              </motion.svg>
              <p className="font-script mt-6 text-5xl text-gold-gradient">Շնորհակալություն։</p>
              <p className="mt-3 text-muted-foreground">Անհամբեր սպասում ենք Ձեզ հետ տոնելուն։</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              noValidate
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div>
                <label className="eyebrow text-[0.55rem]" htmlFor="rsvp-name">
                  Անուն ազգանուն
                </label>
                <input id="rsvp-name" name="name" maxLength={80} className={fieldClass} placeholder="Ձեր անունը" />
              </div>

              <fieldset>
                <legend className="eyebrow text-[0.55rem]">Կմասնակցե՞ք</legend>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setAttending("yes")}
                    className="btn-gold flex-1"
                    style={
                      attending === "yes"
                        ? { background: "var(--gold)", color: "var(--ivory)" }
                        : undefined
                    }
                    aria-pressed={attending === "yes"}
                  >
                    Այո, մեծ սիրով
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("no")}
                    className="btn-gold flex-1"
                    style={
                      attending === "no"
                        ? { background: "var(--gold)", color: "var(--ivory)" }
                        : undefined
                    }
                    aria-pressed={attending === "no"}
                  >
                    Ցավոք, չեմ կարող
                  </button>
                </div>
              </fieldset>

              {(settings.askGuestCount !== false || settings.askMeal === true) ? <div className="grid gap-8 sm:grid-cols-2">
                {settings.askGuestCount !== false ? <div>
                  <label className="eyebrow text-[0.55rem]" htmlFor="rsvp-guests">
                    Հյուրերի քանակ
                  </label>
                  <input
                    id="rsvp-guests"
                    name="guests"
                    type="number"
                    min={1}
                    step={1}
                    inputMode="numeric"
                    defaultValue={1}
                    required
                    className={fieldClass}
                  />
                </div> : null}
                {settings.askMeal === true ? <div>
                  <label className="eyebrow text-[0.55rem]" htmlFor="rsvp-meal">
                    Սննդի նախընտրություն
                  </label>
                  <select id="rsvp-meal" name="meal" className={fieldClass} defaultValue={rsvp.meals[0]}>
                    {rsvp.meals.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div> : null}
              </div> : null}

              <div>
                <label className="eyebrow text-[0.55rem]" htmlFor="rsvp-message">
                  Հաղորդագրություն (ըստ ցանկության)
                </label>
                <textarea
                  id="rsvp-message"
                  name="message"
                  rows={3}
                  maxLength={500}
                  className={`${fieldClass} resize-none`}
                  placeholder="Մի քանի խոսք զույգին"
                />
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <div className="text-center">
                <button type="submit" disabled={submitting} className="btn-gold w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-50">
                  {submitting ? "Ուղարկվում է…" : "Ուղարկել պատասխանը"}
                </button>
                <p className="mt-6 text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  {rsvp.deadline}
                </p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}

const wishSchema = z.object({
  name: z.string().trim().min(2, "Խնդրում ենք նշել Ձեր անունը").max(60),
  wish: z.string().trim().min(4, "Խնդրում ենք գրել կարճ բարեմաղթանք").max(400),
});

export function WishesSection({ wishes }: { wishes: WeddingConfig["wishes"] }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = wishSchema.safeParse(data);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Խնդրում ենք ստուգել լրացված տվյալները");
      return;
    }
    setError(null);
    setSent(true);
  }

  return (
    <Section id="wishes">
      <SectionTitle eyebrow="Հյուրերի գիրք" title={wishes.title} script={wishes.subtitle} />

      <div className="mx-auto mt-12 max-w-xl">
        {sent ? (
          <Reveal className="py-8 text-center">
            <p className="font-script text-4xl text-gold-gradient">Ի սրտե շնորհակալություն</p>
            <p className="mt-3 text-muted-foreground">Ձեր բարեմաղթանքն ավելացվեց մեր պատմությանը։</p>
          </Reveal>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            <div>
              <label className="eyebrow text-[0.55rem]" htmlFor="wish-name">
                Ձեր անունը
              </label>
              <input id="wish-name" name="name" maxLength={60} className={fieldClass} placeholder="Ձեր անունը" />
            </div>
            <div>
              <label className="eyebrow text-[0.55rem]" htmlFor="wish-text">
                Ձեր բարեմաղթանքը
              </label>
              <textarea
                id="wish-text"
                name="wish"
                rows={4}
                maxLength={400}
                className={`${fieldClass} resize-none`}
                placeholder="Մաղթում եմ ձեզ…"
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <div className="text-center">
              <button type="submit" className="btn-gold w-full sm:w-auto">
                Ուղարկել բարեմաղթանքը
              </button>
            </div>
          </form>
        )}
      </div>
    </Section>
  );
}
