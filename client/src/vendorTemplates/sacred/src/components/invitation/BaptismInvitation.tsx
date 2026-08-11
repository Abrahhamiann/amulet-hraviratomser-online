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
type SectionVisibility = {
  heroVisible?: boolean;
  receptionVisible?: boolean;
  questionsVisible?: boolean;
  finalMessageVisible?: boolean;
};

export function BaptismInvitation({ data, visibility = {} }: { data: InvitationData; visibility?: SectionVisibility }) {
  return (
    <main className="relative overflow-x-hidden">
      <div className="sacred-hero" hidden={visibility.heroVisible === false}><Hero data={data} /></div>
      <div className="sacred-message" hidden={visibility.heroVisible === false}><Introduction data={data} /></div>
      <ChildPhoto data={data} />
      <div className="sacred-schedule" hidden={visibility.receptionVisible === false}>
        <EventDetails data={data} />
        <Timeline data={data} />
        <Countdown data={data} />
      </div>
      <BlessingQuote data={data} />
      <Family data={data} />
      <Gallery data={data} />
      <div className="sacred-schedule" hidden={visibility.receptionVisible === false}><Location data={data} /></div>
      <div className="sacred-rsvp" hidden={visibility.questionsVisible === false}><Rsvp data={data} /></div>
      <div className="sacred-closing" hidden={visibility.finalMessageVisible === false}><Footer data={data} /></div>
    </main>
  );
}
