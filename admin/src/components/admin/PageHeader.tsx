import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function PageHeader({
  title, subtitle, actions,
}: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 mb-6">
      <div className="min-w-0">
        <h2 className="font-display text-2xl md:text-3xl tracking-tight truncate">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function EmptyState({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/70 py-16 text-center bg-secondary/30">
      <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-[color:var(--cream)] grid place-items-center text-[color:var(--gold)]">✦</div>
      <div className="font-medium">{title}</div>
      {desc && <div className="text-sm text-muted-foreground mt-1">{desc}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ToolbarButton({ children, ...rest }: React.ComponentProps<typeof Button>) {
  return <Button variant="outline" className="rounded-full border-border/60" {...rest}>{children}</Button>;
}
