import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function StatCard({
  label, value, delta, icon, tone = "gold",
}: {
  label: string;
  value: string | number;
  delta?: number;
  icon: ReactNode;
  tone?: "gold" | "success" | "warning" | "destructive";
}) {
  const positive = (delta ?? 0) >= 0;
  const toneMap = {
    gold: "text-[color:var(--gold)] bg-[color:var(--cream)]",
    success: "text-[color:var(--success)] bg-[color:var(--success)]/10",
    warning: "text-[color:var(--warning)] bg-[color:var(--warning)]/15",
    destructive: "text-destructive bg-destructive/10",
  } as const;

  return (
    <Card className="p-5 rounded-2xl border-border/60 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-gold)] transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
          <div className="mt-2 font-display text-3xl leading-none tracking-tight">{value}</div>
          {delta !== undefined && (
            <div className={cn("mt-3 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
              positive ? "text-[color:var(--success)] bg-[color:var(--success)]/10" : "text-destructive bg-destructive/10")}>
              {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(delta)}%
              <span className="text-muted-foreground font-normal ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", toneMap[tone])}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
