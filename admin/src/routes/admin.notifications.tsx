import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Calendar, CheckCheck, CreditCard, MessageSquare, ShoppingBag, Star, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/PageHeader";
import { cn } from "@/lib/utils";
import { useAdminI18n } from "@/lib/i18n";
import { useNotifications } from "@/hooks/useAdminData";

export const Route = createFileRoute("/admin/notifications")({ component: NotifPage });

const iconMap = {
  order: ShoppingBag,
  customer: UserPlus,
  payment: CreditCard,
  message: MessageSquare,
  review: Star,
  invitation: Calendar,
} as const;

function NotifPage() {
  const { t } = useAdminI18n();
  const { data: notifications, isLoading, error } = useNotifications();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => setItems(notifications), [notifications]);

  return (
    <div>
      <PageHeader
        title={t("notifications")}
        subtitle={error ? error.message : isLoading ? t("loading") : t("notifications")}
        actions={<Button onClick={() => setItems((current) => current.map((item) => ({ ...item, read: true })))} variant="outline" className="rounded-full border-border/60"><CheckCheck className="h-4 w-4 mr-2" />{t("markAllRead")}</Button>}
      />
      <Card className="rounded-2xl border-border/60 shadow-[var(--shadow-soft)] p-2">
        <ul className="divide-y">
          {items.map((notification: any) => {
            const Icon = iconMap[notification.type as keyof typeof iconMap] ?? MessageSquare;
            return (
              <li key={notification.id} className={cn("flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/40 transition", !notification.read && "bg-[color:var(--cream)]/40")}>
                <div className="h-11 w-11 rounded-xl bg-[color:var(--cream)] grid place-items-center text-[color:var(--gold)]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn("truncate", !notification.read && "font-semibold")}>{notification.title}</div>
                  <div className="text-sm text-muted-foreground truncate">{notification.desc}</div>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">{format(new Date(notification.time), "MMM d, HH:mm")}</div>
                {!notification.read && <div className="h-2 w-2 rounded-full bg-[color:var(--gold)]" />}
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
