import { createFileRoute } from "@tanstack/react-router";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/admin/PageHeader";
import { useAdminI18n } from "@/lib/i18n";
import { useCategories } from "@/hooks/useAdminData";

export const Route = createFileRoute("/admin/categories")({ component: CategoriesPage });

function CategoriesPage() {
  const { t } = useAdminI18n();
  const { data: categories, isLoading, error } = useCategories();

  return (
    <div>
      <PageHeader
        title={t("categories")}
        subtitle={error ? error.message : isLoading ? t("loading") : t("readOnly")}
        actions={<Button disabled variant="outline" className="rounded-full border-border/60">{t("readOnly")}</Button>}
      />
      <Card className="rounded-2xl border-border/60 shadow-[var(--shadow-soft)] p-2">
        <ul className="divide-y">
          {categories.map((category: any, index: number) => (
            <li key={category.id} className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition rounded-xl">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
              <div className="h-11 w-11 rounded-xl bg-[color:var(--cream)] grid place-items-center text-[color:var(--gold)] font-display text-lg">
                {category.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{category.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  /{category.slug} · {category.templates} templates · {category.orders} orders
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Order {index + 1}</div>
              <Switch disabled defaultChecked={category.status === "active"} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
