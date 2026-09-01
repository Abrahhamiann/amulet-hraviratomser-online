// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { invitation } from "@/config/invitation";
import { BirthdayIntro } from "@/components/birthday/BirthdayIntro";
import { BirthdayMessage } from "@/components/birthday/BirthdayMessage";
import { BirthdayPersonSection } from "@/components/birthday/BirthdayPersonSection";
import { Countdown } from "@/components/birthday/Countdown";
import { EventDetails } from "@/components/birthday/EventDetails";
import { FinalCelebration } from "@/components/birthday/FinalCelebration";
import { Gallery } from "@/components/birthday/Gallery";
import { HeroSection } from "@/components/birthday/HeroSection";
import { LocationSection } from "@/components/birthday/LocationSection";
import { MusicControl } from "@/components/birthday/MusicControl";
import { PartyTimeline } from "@/components/birthday/PartyTimeline";
import { RSVPSection, type RsvpData } from "@/components/birthday/RSVPSection";

const title = `${invitation.birthdayPersonName}'s ${invitation.age}th Birthday — You're Invited`;
const description = `Join ${invitation.fullName} on ${invitation.dateLabel} at ${invitation.timeLabel}, ${invitation.venue}. RSVP to the celebration.`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [revealed, setRevealed] = useState(false);
  const onIntroDone = useCallback(() => setRevealed(true), []);

  const handleRsvp = useCallback((data: RsvpData) => {
    // Amulet platform hook: replace with an API call to persist the RSVP.
    console.info("RSVP submitted", data);
  }, []);

  return (
    <main className="relative w-full overflow-x-hidden">
      <BirthdayIntro onDone={onIntroDone} />
      <HeroSection data={invitation} start={revealed} />
      <BirthdayPersonSection data={invitation} />
      <Countdown dateISO={invitation.eventDateISO} />
      <EventDetails data={invitation} />
      <PartyTimeline schedule={invitation.schedule} />
      <Gallery photos={invitation.photos} />
      <BirthdayMessage data={invitation} />
      <LocationSection data={invitation} />
      <RSVPSection onSubmit={handleRsvp} />
      <FinalCelebration data={invitation} />
      <MusicControl src={invitation.musicSrc} />
    </main>
  );
}
