// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";

import { wedding } from "@/data/wedding";
import { HeroSection } from "@/components/wedding/HeroSection";
import { InvitationMessage } from "@/components/wedding/InvitationMessage";
import { CoupleSection } from "@/components/wedding/CoupleSection";
import { StoryTimeline } from "@/components/wedding/StoryTimeline";
import { Countdown } from "@/components/wedding/Countdown";
import { WeddingSchedule } from "@/components/wedding/WeddingSchedule";
import { VenueSection } from "@/components/wedding/VenueSection";
import { Gallery } from "@/components/wedding/Gallery";
import { DressCode } from "@/components/wedding/DressCode";
import { ImportantInfo } from "@/components/wedding/ImportantInfo";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { ContactSection } from "@/components/wedding/ContactSection";
import { ClosingSection } from "@/components/wedding/ClosingSection";
import { Footer } from "@/components/wedding/Footer";
import { FloatingActions } from "@/components/wedding/FloatingActions";

const title = "Aram & Ani — September 12, 2026";
const description =
  "With great joy we invite you to celebrate our wedding on September 12, 2026 — ceremony at Saint Gayane Church, reception at Dvin Music Hall. Please RSVP.";

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
  const [ceremony, reception] = wedding.venues;

  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <InvitationMessage />
      <CoupleSection />
      <StoryTimeline />
      <Countdown />
      <WeddingSchedule />
      {ceremony ? <VenueSection venue={ceremony} /> : null}
      {reception ? <VenueSection venue={reception} reverse /> : null}
      <Gallery />
      <DressCode />
      <ImportantInfo />
      <RSVPForm />
      <ContactSection />
      <ClosingSection />
      <Footer />
      <FloatingActions />
    </main>
  );
}
