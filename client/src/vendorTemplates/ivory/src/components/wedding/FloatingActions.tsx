import { CalendarPlus, MapPin } from "lucide-react";
import { wedding } from "@/data/wedding";

function buildIcs() {
  const start = new Date(wedding.date.iso);
  const end = new Date(start.getTime() + 8 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const venue = wedding.venues[0];
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:${wedding.couple.groom.name} և ${wedding.couple.bride.name} — Հարսանիք`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `LOCATION:${venue?.name ?? ""}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function FloatingActions() {
  const venue = wedding.venues[0];

  function addToCalendar() {
    const blob = new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wedding.ics";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-3 sm:bottom-8 sm:right-8">
      <button
        type="button"
        onClick={addToCalendar}
        aria-label="Ավելացնել հարսանիքը օրացույցում"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/45 bg-card/85 text-gold backdrop-blur-sm shadow-[var(--shadow-soft)] transition-colors duration-500 hover:bg-gold/12"
      >
        <CalendarPlus className="h-4 w-4" strokeWidth={1.2} />
      </button>
      <a
        href={venue?.mapUrl ?? "#"}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Բացել արարողության վայրը քարտեզում"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/45 bg-card/85 text-gold backdrop-blur-sm shadow-[var(--shadow-soft)] transition-colors duration-500 hover:bg-gold/12"
      >
        <MapPin className="h-4 w-4" strokeWidth={1.2} />
      </a>
    </div>
  );
}
