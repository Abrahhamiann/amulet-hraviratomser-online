import { wedding } from "@/data/wedding";

export function Footer() {
  return (
    <footer className="border-t border-border/70 px-5 py-10 text-center">
      <p className="text-[0.65rem] tracking-[0.32em] uppercase text-muted-foreground/80">
        {wedding.brand.label}
      </p>
    </footer>
  );
}