import type { InvitationData } from "../../data/invitation";
import { InvitationDataProvider, useInvitationData } from "../../data/invitation";
import { CalendarSection } from "./CalendarSection";
import { CountdownSection } from "./CountdownSection";
import { DetailsSection } from "./DetailsSection";
import { DressCodeSection } from "./DressCodeSection";
import { EngagementAnnouncement } from "./EngagementAnnouncement";
import { GallerySection } from "./GallerySection";
import { HeroSection } from "./HeroSection";
import { LocationSection } from "./LocationSection";
import { LoveStoryIntro } from "./LoveStoryIntro";
import { RSVPSection } from "./RSVPSection";
import { Reveal, Section } from "./Reveal";
import { TelegramSection } from "./TelegramSection";
import { TimelineSection } from "./TimelineSection";
import { Heart, Squiggle } from "./Doodles";

type RsvpPayload = {
  guestName: string;
  status: "attending" | "declined";
  guestCount?: number;
  message?: string;
};

function ClosingSection() {
  const d = useInvitationData();
  return (
    <Section className="forever-vows-closing pb-28 pt-20 text-center">
      <Reveal>
        <div className="flex justify-center text-primary"><Heart className="h-7 w-7" /></div>
        <h2 className="mt-8 font-hy text-[1.6rem] font-light tracking-[0.14em] text-ink">{d.closing.big}</h2>
        <p className="mt-6 font-display text-[2.4rem] italic leading-none text-ink">{d.closing.names}</p>
        <p className="script mt-5 text-lg">{d.closing.note}</p>
        <div className="mt-10 flex justify-center text-accent"><Squiggle className="h-3 w-24" /></div>
      </Reveal>
    </Section>
  );
}

export function ForeverVowsInvitation({
  data,
  onRsvpSubmit,
}: {
  data: InvitationData;
  onRsvpSubmit?: (payload: RsvpPayload) => Promise<unknown>;
}) {
  return (
    <InvitationDataProvider data={data}>
      <main className="forever-vows-template relative w-full overflow-x-clip bg-background text-foreground">
        <div className="forever-vows-hero"><HeroSection /><LoveStoryIntro /><EngagementAnnouncement /></div>
        <div className="forever-vows-schedule"><CalendarSection /><TimelineSection /><LocationSection /></div>
        <GallerySection />
        <DetailsSection />
        <div className="forever-vows-dress"><DressCodeSection /></div>
        <CountdownSection />
        <TelegramSection />
        <div className="forever-vows-rsvp"><RSVPSection onSubmit={onRsvpSubmit} /></div>
        <ClosingSection />
      </main>
    </InvitationDataProvider>
  );
}
