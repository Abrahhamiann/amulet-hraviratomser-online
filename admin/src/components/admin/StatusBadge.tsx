import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAdminI18n } from "@/lib/i18n";

const map: Record<string, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-muted text-muted-foreground" },
  pending: { label: "Pending", cls: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]" },
  in_progress: { label: "In progress", cls: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
  ready: { label: "Ready", cls: "bg-[color:var(--gold)]/15 text-[color:var(--gold)]" },
  published: { label: "Published", cls: "bg-[color:var(--success)]/15 text-[color:var(--success)]" },
  expired: { label: "Expired", cls: "bg-muted text-muted-foreground" },
  cancelled: { label: "Cancelled", cls: "bg-destructive/10 text-destructive" },
  new: { label: "New", cls: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
  confirmed: { label: "Confirmed", cls: "bg-[color:var(--gold)]/15 text-[color:var(--gold)]" },
  completed: { label: "Completed", cls: "bg-[color:var(--success)]/15 text-[color:var(--success)]" },
  paid: { label: "Paid", cls: "bg-[color:var(--success)]/15 text-[color:var(--success)]" },
  failed: { label: "Failed", cls: "bg-destructive/10 text-destructive" },
  refunded: { label: "Refunded", cls: "bg-muted text-muted-foreground" },
  active: { label: "Active", cls: "bg-[color:var(--success)]/15 text-[color:var(--success)]" },
  inactive: { label: "Inactive", cls: "bg-muted text-muted-foreground" },
  blocked: { label: "Blocked", cls: "bg-destructive/10 text-destructive" },
  approved: { label: "Approved", cls: "bg-[color:var(--success)]/15 text-[color:var(--success)]" },
  rejected: { label: "Rejected", cls: "bg-destructive/10 text-destructive" },
  featured: { label: "Featured", cls: "bg-[color:var(--gold)]/15 text-[color:var(--gold)]" },
  unread: { label: "Unread", cls: "bg-[color:var(--gold)]/15 text-[color:var(--gold)]" },
  read: { label: "Read", cls: "bg-muted text-muted-foreground" },
  low: { label: "Low", cls: "bg-muted text-muted-foreground" },
  normal: { label: "Normal", cls: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
  high: { label: "High", cls: "bg-destructive/10 text-destructive" },
};

export function StatusBadge({ status, children }: { status: string; children?: ReactNode }) {
  const { lang } = useAdminI18n();
  const m = map[status] ?? { label: status, cls: "bg-muted text-muted-foreground" };
  const labels: Record<string, Record<string, string>> = {
    hy: {
      draft: "Սևագիր",
      pending: "Սպասում է",
      in_progress: "Ընթացքի մեջ",
      ready: "Պատրաստ",
      published: "Հրապարակված",
      expired: "Ժամկետանց",
      cancelled: "Չեղարկված",
      new: "Նոր",
      confirmed: "Հաստատված",
      completed: "Ավարտված",
      paid: "Վճարված",
      failed: "Չհաջողված",
      refunded: "Վերադարձված",
      active: "Ակտիվ",
      inactive: "Ոչ ակտիվ",
      blocked: "Արգելափակված",
      approved: "Հաստատված",
      rejected: "Մերժված",
      featured: "Առաջարկվող",
      unread: "Չկարդացված",
      read: "Կարդացված",
      low: "Ցածր",
      normal: "Նորմալ",
      high: "Բարձր",
    },
    ru: {
      draft: "Черновик",
      pending: "Ожидает",
      in_progress: "В работе",
      ready: "Готово",
      published: "Опубликовано",
      expired: "Истекло",
      cancelled: "Отменено",
      new: "Новый",
      confirmed: "Подтверждено",
      completed: "Завершено",
      paid: "Оплачено",
      failed: "Ошибка",
      refunded: "Возврат",
      active: "Активный",
      inactive: "Неактивный",
      blocked: "Заблокирован",
      approved: "Одобрен",
      rejected: "Отклонен",
      featured: "Рекомендуемый",
      unread: "Непрочитано",
      read: "Прочитано",
      low: "Низкий",
      normal: "Обычный",
      high: "Высокий",
    },
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap", m.cls)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children ?? labels[lang]?.[status] ?? m.label}
    </span>
  );
}
