// @ts-nocheck
import type { ElementType, ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "fade" | "scale";
  as?: ElementType;
};

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "fade",
  as: Tag = "div",
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      data-visible={visible}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      className={cn(variant === "scale" ? "reveal-scale" : "reveal", className)}
    >
      {children}
    </Tag>
  );
}
