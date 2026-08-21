import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { z } from "zod";
import type { InvitationData } from "@/data/invitation";
import { Reveal, SectionHeading } from "./primitives";
import { cn } from "@/lib/utils";

const schema = z.object({
  fullName: z.string().trim().min(2, "Մուտքագրեք Ձեր անունը և ազգանունը").max(100),
  company: z.string().trim().max(120).optional(),
  position: z.string().trim().max(120).optional(),
  email: z.string().trim().email("Մուտքագրեք վավեր էլ․ հասցե").max(255),
  phone: z.string().trim().max(40).optional(),
  attending: z.enum(["yes", "no"]),
  guests: z.coerce.number().int().min(0),
  meal: z.string().trim().max(120).optional(),
  message: z.string().trim().max(600).optional(),
});

const fieldClass =
  "peer w-full border-b border-input bg-transparent px-0 py-3 text-base text-foreground outline-none transition-colors duration-500 placeholder:text-transparent focus:border-primary";
const labelClass =
  "pointer-events-none absolute left-0 top-3 origin-left text-sm text-muted-foreground transition-all duration-500 ease-[var(--ease-elegant)] peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-90";

function Field({
  id,
  label,
  type = "text",
  required,
  inputMode,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  inputMode?: "text" | "email" | "tel";
}) {
  return (
    <div className="relative pt-3">
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        placeholder={label}
        required={required}
        maxLength={255}
        className={fieldClass}
      />
      <label htmlFor={id} className={labelClass}>
        {label}
        {required ? " *" : ""}
      </label>
    </div>
  );
}

type RsvpSubmit = (data: {
  guestName: string;
  phone?: string;
  status: "attending" | "declined";
  guestCount: number;
  message: string;
}) => Promise<unknown>;

type EditorRsvpSettings = { askGuestCount?: boolean; askMeal?: boolean };

export function RSVPForm({ data, onSubmit, settings = {} }: { data: InvitationData; onSubmit?: RsvpSubmit; settings?: EditorRsvpSettings }) {
  const { rsvp } = data;
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [guests, setGuests] = useState("1");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    // FormData returns null for controls hidden by RSVP settings. Normalize
    // every text value before Zod validation so optional fields stay strings.
    const text = (name: string) => String(fd.get(name) ?? "");
    const parsed = schema.safeParse({
      fullName: text("fullName"),
      company: text("company"),
      position: text("position"),
      email: text("email"),
      phone: text("phone"),
      attending,
      guests: attending === "yes" ? guests : 0,
      meal: text("meal"),
      message: text("message"),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Խնդրում ենք ստուգել լրացված տվյալները");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const details = [
        parsed.data.company ? `Ընկերություն՝ ${parsed.data.company}` : "",
        parsed.data.position ? `Պաշտոն՝ ${parsed.data.position}` : "",
        parsed.data.email ? `Էլ․ հասցե՝ ${parsed.data.email}` : "",
        parsed.data.meal ? `Սննդի նախընտրություն՝ ${parsed.data.meal}` : "",
        parsed.data.message || ""
      ].filter(Boolean).join("\n");
      await onSubmit?.({
        guestName: parsed.data.fullName,
        phone: parsed.data.phone || "",
        status: parsed.data.attending === "yes" ? "attending" : "declined",
        guestCount: parsed.data.attending === "yes" ? Math.max(1, parsed.data.guests) : 1,
        message: details
      });
      setSent(true);
    } catch {
      setError("Չհաջողվեց ուղարկել պատասխանը։ Խնդրում ենք փորձել կրկին։");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="section-shell">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-2xl">
        <SectionHeading eyebrow={rsvp.eyebrow} title={rsvp.title} />
        <Reveal delay={0.1}>
          <p className="mt-6 text-center font-accent text-xl italic text-muted-foreground">
            {rsvp.subtitle}
          </p>
        </Reveal>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="glass-panel mt-12 flex flex-col items-center gap-5 px-6 py-14 text-center"
            >
              <span className="relative grid h-20 w-20 place-items-center">
                <motion.span
                  className="absolute inset-0 rounded-full border border-primary"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
                <span className="animate-pulse-ring absolute inset-0 rounded-full border border-primary/60" />
                <motion.span
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Check className="h-8 w-8 text-primary" strokeWidth={1.4} />
                </motion.span>
              </span>
              <h3 className="display-title text-2xl sm:text-3xl">{rsvp.successTitle}</h3>
              <p className="font-accent text-lg italic text-muted-foreground">{rsvp.successText}</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              noValidate
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -12 }}
              className="mt-12 flex flex-col gap-7"
            >
              <div className="grid gap-7 sm:grid-cols-2">
                <Field id="fullName" label="Անուն ազգանուն" required />
                <Field id="company" label="Ընկերություն" />
                <Field id="position" label="Պաշտոն" />
                <Field id="email" label="Էլ․ հասցե" type="email" inputMode="email" required />
              </div>
              <Field id="phone" label="Հեռախոսահամար" type="tel" inputMode="tel" />

              <fieldset className="mt-2">
                <legend className="eyebrow mb-4">Կմասնակցե՞ք</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      { key: "yes", label: "Այո, կմասնակցեմ" },
                      { key: "no", label: "Ցավոք, չեմ կարող մասնակցել" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setAttending(opt.key)}
                      aria-pressed={attending === opt.key}
                      className={cn(
                        "border px-5 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] transition-all duration-500 ease-[var(--ease-elegant)]",
                        attending === opt.key
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              {attending === "yes" && settings.askGuestCount !== false && (
                <div className="flex items-center justify-between border-b border-input pb-3">
                  <label htmlFor="guests" className="text-sm text-muted-foreground">
                    Հյուրերի քանակ
                  </label>
                  <input
                    id="guests"
                    name="guests"
                    type="number"
                    min={1}
                    step={1}
                    inputMode="numeric"
                    required
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="min-h-11 w-28 bg-transparent py-2 text-right text-base tabular-nums text-foreground outline-none focus:text-primary"
                  />
                </div>
              )}

              {attending === "yes" && settings.askMeal === true ? (
                <Field id="meal" label="Սննդի նախընտրություն" />
              ) : null}

              <div className="relative pt-3">
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  maxLength={600}
                  placeholder="Հաղորդագրություն (ըստ ցանկության)"
                  className={cn(fieldClass, "resize-none")}
                />
                <label htmlFor="message" className={labelClass}>
                  Հաղորդագրություն (ըստ ցանկության)
                </label>
              </div>

              {error ? (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {rsvp.deadline}
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="group relative isolate mt-2 inline-flex items-center justify-center overflow-hidden border border-primary bg-primary px-8 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-primary-foreground transition-opacity duration-300 hover:opacity-90"
              >
                <span className="relative z-10">{submitting ? "Ուղարկվում է…" : "Ուղարկել հաստատումը"}</span>
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
