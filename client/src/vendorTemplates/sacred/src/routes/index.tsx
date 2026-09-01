// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { BaptismInvitation } from "@/components/invitation/BaptismInvitation";
import { invitation } from "@/data/invitation";

const title = `Baptism of ${invitation.child.name} · ${invitation.event.dateLabel}`;
const description = `With love and faith, we invite you to the Baptism of ${invitation.child.name} on ${invitation.event.dateLabel} at ${invitation.event.venue}, ${invitation.event.city}.`;

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
  return <BaptismInvitation data={invitation} />;
}
