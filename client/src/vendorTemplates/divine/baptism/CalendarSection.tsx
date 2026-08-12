import { invitation } from "@/data/invitation";

import { CalendarGlyph, CrossIcon } from "./icons";
import { Reveal, SectionTitle } from "./primitives";

const WEEKDAYS = ["Երկ", "Երք", "Չրք", "Հնգ", "Ուր", "Շբթ", "Կիր"];

function buildMonth(iso: string) {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Monday-first
  const total = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array.from({ length: offset }, () => null);
  for (let i = 1; i <= total; i++) cells.push(i);
  while (cells.length % 7 !== 0) cells.push(null);
  return { cells, day };
}

function icsDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function addToCalendar() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Amulet//Baptism//HY",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@amulet`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(invitation.eventISO)}`,
    `DTEND:${icsDate(invitation.eventEndISO)}`,
    `SUMMARY:${invitation.calendarTitle}`,
    `LOCATION:${invitation.location.churchName}, ${invitation.location.churchAddress}`,
    `DESCRIPTION:${invitation.heroDescription}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "baptism.ics";
  a.click();
  URL.revokeObjectURL(url);
}

export function CalendarSection() {
  const { cells, day } = buildMonth(invitation.eventISO);

  return (
    <section className="relative px-6 py-20 sm:py-28">
      <SectionTitle icon="floral" eyebrow="Save the date">
        Օրը Նշեք Ձեր Օրացույցում
      </SectionTitle>

      <Reveal>
        <div className="glass-card mx-auto w-full max-w-md rounded-[2rem] p-6 sm:p-9">
          <div className="mb-6 flex items-center justify-center gap-3 text-gold">
            <span className="h-4 w-4">
              <CrossIcon />
            </span>
            <p className="font-title text-base tracking-[0.24em] text-foreground sm:text-lg">
              {invitation.calendarMonthLabel}
            </p>
            <span className="h-4 w-4">
              <CalendarGlyph />
            </span>
          </div>

          <div className="grid grid-cols-7 gap-y-2 text-center">
            {WEEKDAYS.map((w) => (
              <span
                key={w}
                className="font-body text-[0.55rem] tracking-[0.12em] text-muted-foreground uppercase"
              >
                {w}
              </span>
            ))}
            {cells.map((c, i) => {
              const isDay = c === day;
              return (
                <span
                  key={i}
                  className={
                    isDay
                      ? "relative mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft to-gold text-sm font-medium text-primary-foreground shadow-halo sm:h-10 sm:w-10"
                      : "font-body mx-auto flex h-9 w-9 items-center justify-center text-sm text-muted-foreground sm:h-10 sm:w-10"
                  }
                >
                  {c ?? ""}
                </span>
              );
            })}
          </div>

          <p className="font-title mt-7 text-center text-lg text-foreground sm:text-xl">
            {invitation.calendarDayLabel}
          </p>

          <button
            type="button"
            onClick={addToCalendar}
            className="font-body mt-6 w-full rounded-full border border-gold/50 bg-ivory/60 px-6 py-3.5 text-xs tracking-[0.24em] text-foreground uppercase transition-all duration-500 hover:border-gold hover:bg-cream hover:shadow-halo"
          >
            Ավելացնել Օրացույց
          </button>
        </div>
      </Reveal>
    </section>
  );
}
