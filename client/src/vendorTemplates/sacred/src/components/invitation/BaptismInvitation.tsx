import { Hero } from "./Hero";
import { Introduction } from "./Introduction";
import { ChildPhoto } from "./ChildPhoto";
import { EventDetails } from "./EventDetails";
import { Timeline } from "./Timeline";
import { Countdown } from "./Countdown";
import { BlessingQuote } from "./BlessingQuote";
import { Family } from "./Family";
import { Gallery } from "./Gallery";
import { Location } from "./Location";
import { Rsvp } from "./Rsvp";
import { Footer } from "./Footer";
import type { InvitationData } from "@/data/invitation";

/** Amulet baptism invitation template — fully driven by `data`. */
export function BaptismInvitation({ data }: { data: InvitationData }) {
  return (
    <main className="relative overflow-x-hidden">
      <Hero data={data} />
      <Introduction data={data} />
      <ChildPhoto data={data} />
      <EventDetails data={data} />
      <Timeline data={data} />
      <Countdown data={data} />
      <BlessingQuote data={data} />
      <Family data={data} />
      <Gallery data={data} />
      <Location data={data} />
      <Rsvp data={data} />
      <Footer data={data} />
    </main>
  );
}