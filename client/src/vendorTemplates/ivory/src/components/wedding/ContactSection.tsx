import { Phone, MessageCircle, Send } from "lucide-react";
import { wedding } from "@/data/wedding";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

function Person({ role, name, phone, delay }: { role: string; name: string; phone: string; delay: number }) {
  const digits = phone.replace(/\D/g, "");
  return (
    <Reveal delay={delay} className="text-center">
      <p className="eyebrow">{role}</p>
      <h3 className="mt-3 font-display text-3xl font-light text-foreground">{name}</h3>
      <a
        href={`tel:+${digits}`}
        className="mt-3 inline-block text-sm tracking-[0.1em] text-muted-foreground transition-colors hover:text-gold"
      >
        {phone}
      </a>
      <div className="mt-5 flex items-center justify-center gap-3">
        {[
          { href: `tel:+${digits}`, Icon: Phone, label: `Զանգահարել՝ ${name}` },
          { href: `https://wa.me/${digits}`, Icon: MessageCircle, label: `WhatsApp-ով գրել՝ ${name}` },
          { href: `https://t.me/+${digits}`, Icon: Send, label: `Telegram-ով գրել՝ ${name}` },
        ].map(({ href, Icon, label }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer noopener"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/45 text-gold transition-colors duration-500 hover:bg-gold/12"
          >
            <Icon className="h-4 w-4" strokeWidth={1.2} />
          </a>
        ))}
      </div>
    </Reveal>
  );
}

export function ContactSection() {
  const { couple } = wedding;
  return (
    <section className="px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="We are here for you" title="Questions?" />
        <Reveal delay={100}>
          <p className="mx-auto mt-8 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
            For any questions regarding the celebration, please contact us.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-14 sm:grid-cols-2">
          <Person role="Bride" name={couple.bride.name} phone={couple.bride.phone} delay={0} />
          <Person role="Groom" name={couple.groom.name} phone={couple.groom.phone} delay={120} />
        </div>
      </div>
    </section>
  );
}
