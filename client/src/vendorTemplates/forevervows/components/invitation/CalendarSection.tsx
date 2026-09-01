// @ts-nocheck
import { useInvitationData } from "../../data/invitation";
import { Reveal, Section } from "./Reveal";
import { InkCircle } from "./Doodles";

const WEEKDAYS = ["Երկ", "Երք", "Չրք", "Հնգ", "Ուր", "Շբթ", "Կիր"];

function buildMonth(year: number, month: number) {
  const first = new Date(Date.UTC(year, month, 1));
  const offset = (first.getUTCDay() + 6) % 7; // Monday-first
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (number | null)[] = Array(offset).fill(null);
  for (let i = 1; i <= days; i++) cells.push(i);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function CalendarSection() {
  const d = useInvitationData();
  const event = new Date(d.date);
  const cells = buildMonth(event.getFullYear(), event.getMonth());
  const highlighted = event.getDate();

  return (
    <Section className="py-24 text-center" dataEditorIgnore="calendar">
      <Reveal>
        <h2 className="caption text-ink/70">{d.monthLabel}</h2>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mx-auto mt-9 max-w-[19rem]">
          <div className="grid grid-cols-7 gap-y-1">
            {WEEKDAYS.map((w) => (
              <span key={w} className="font-hy-sans text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
                {w}
              </span>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-7 gap-y-3">
            {cells.map((c, i) => (
              <span key={i} className="relative flex h-9 items-center justify-center font-display text-[1.05rem] text-ink/75">
                {c ?? ""}
                {c === highlighted && (
                  <>
                    <span className="relative z-10 font-display text-[1.35rem] text-ink">{""}</span>
                    <InkCircle className="pointer-events-none absolute -inset-x-3 -inset-y-2 h-[3.2rem] w-[3.6rem] text-primary" />
                  </>
                )}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="rule-thin mx-auto my-10 w-14" />
        <p className="caption">{d.weekday}</p>
        <p className="mt-3 font-display text-[1.9rem] italic text-ink">{d.dayLong}</p>
        <p className="script-hy mt-5 text-[1rem]">{d.calendarNote}</p>
      </Reveal>
    </Section>
  );
}
