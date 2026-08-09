import { createFileRoute } from "@tanstack/react-router";
import { Calendar, CreditCard, MessageSquare, ShoppingBag, Star, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/PageHeader";
import { cn } from "@/lib/utils";
import { formatAdminDate, useAdminI18n } from "@/lib/i18n";
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
  const { lang, t } = useAdminI18n();
  const { data: notifications, isLoading, error } = useNotifications();
  const notificationCopy = (item: any) => {
    if (item.type === "order") return { title: t("newOrder"), desc: t("orderedInvitation").replace("{customer}", item.customer || "—").replace("{invitation}", item.invitation || "—") };
    if (item.type === "message") return { title: t("contactMessage"), desc: `${item.customer || "—"}: ${item.message || ""}` };
    if (item.type === "review") return { title: t("reviews"), desc: `${item.customer || "—"} · ${"★".repeat(item.rating || 5)}: ${item.message || ""}` };
    return { title: item.published ? t("invitationPublished") : t("invitationDraft"), desc: item.invitation || "—" };
  };

  return (
    <div>
      <PageHeader
        title={t("notifications")}
        subtitle={error ? error.message : isLoading ? t("loading") : t("notifications")}
      />
      <Card className="rounded-2xl border-border/60 shadow-[var(--shadow-soft)] p-2">
        <ul className="divide-y">
          {notifications.map((notification: any) => {
            const Icon = iconMap[notification.type as keyof typeof iconMap] ?? MessageSquare;
            const copy = notificationCopy(notification);
            return (
              <li key={notification.id} className={cn("flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/40 transition", !notification.read && "bg-[color:var(--cream)]/40")}>
                <div className="h-11 w-11 rounded-xl bg-[color:var(--cream)] grid place-items-center text-[color:var(--gold)]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn("truncate", !notification.read && "font-semibold")}>{copy.title}</div>
                  <div className="text-sm text-muted-foreground truncate">{copy.desc}</div>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">{formatAdminDate(notification.time, lang, { dateStyle: "medium", timeStyle: "short" })}</div>
                {!notification.read && <div className="h-2 w-2 rounded-full bg-[color:var(--gold)]" />}
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
