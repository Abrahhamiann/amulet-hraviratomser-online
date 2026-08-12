import { invitation } from "@/data/invitation";

import { Particles } from "./Atmosphere";
import { FloralIcon, WingsIcon } from "./icons";
import { GoldRule, Reveal, SectionTitle } from "./primitives";

export function FamilyMessage() {
  return (
    <section className="relative overflow-hidden px-6 py-20 sm:py-28">
      <Particles />
      <SectionTitle icon="floral" eyebrow="Family">
        {invitation.familyMessageTitle}
      </SectionTitle>

      <Reveal>
        <div className="relative mx-auto max-w-2xl px-4 text-center">
          <span
            className="mx-auto mb-6 block h-7 w-7 text-gold/70 sm:h-8 sm:w-8"
            aria-hidden
          >
            <WingsIcon />
          </span>
          <p className="font-body text-base leading-[2] text-muted-foreground sm:text-lg">
            {invitation.familyMessage}
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <GoldRule className="max-w-24" />
            <span className="h-4 w-4 shrink-0 text-gold/70">
              <FloralIcon />
            </span>
            <GoldRule className="max-w-24" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
