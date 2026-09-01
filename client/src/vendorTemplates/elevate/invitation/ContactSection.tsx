// @ts-nocheck
import { Mail, MessageCircle, Phone } from "lucide-react";
import type { InvitationData } from "@/data/invitation";
import { Reveal, SectionHeading } from "./primitives";

export function ContactSection({ data }: { data: InvitationData }) {
  const { contact } = data;
  const links = [
    { icon: Phone, label: "Զանգահարել", href: contact.phoneHref },
    { icon: Mail, label: "Էլ․ նամակ", href: `mailto:${contact.email}` },
    { icon: MessageCircle, label: "WhatsApp", href: contact.whatsapp },
  ];

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-2xl text-center">
        <SectionHeading eyebrow={contact.eyebrow} title={contact.title} />

        <Reveal delay={0.1}>
          <p className="mt-8 text-sm font-light text-muted-foreground">{contact.intro}</p>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="display-title mt-4 text-2xl sm:text-3xl">{contact.name}</p>
          <p className="mt-2 text-[0.68rem] uppercase tracking-[0.3em] text-primary">
            {contact.role}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            {contact.phone} · {contact.email}
          </p>
        </Reveal>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {links.map((link, i) => (
            <Reveal key={link.label} delay={0.2 + i * 0.08}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 border border-border px-6 py-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-muted-foreground transition-all duration-500 hover:border-primary/60 hover:text-primary"
              >
                <link.icon className="h-4 w-4" strokeWidth={1.4} />
                {link.label}
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
