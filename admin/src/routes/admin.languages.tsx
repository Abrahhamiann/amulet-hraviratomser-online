import { createFileRoute } from "@tanstack/react-router";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useAdminI18n } from "@/lib/i18n";
import { useLanguages } from "@/hooks/useAdminData";

export const Route = createFileRoute("/admin/languages")({ component: LanguagesPage });

function LanguagesPage() {
  const { t } = useAdminI18n();
  const { data: languages, isLoading, error } = useLanguages();

  return (
    <div>
      <PageHeader
        title={t("languages")}
        subtitle={error ? error.message : isLoading ? t("loading") : t("readOnly")}
        actions={<Button disabled variant="outline" className="rounded-full border-border/60">{t("readOnly")}</Button>}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {languages.map((language: any) => (
          <Card key={language.code} className="p-5 rounded-2xl border-border/60 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-[color:var(--cream)] grid place-items-center text-[color:var(--gold)] font-semibold uppercase">
                {language.code}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-xl">{language.name}</div>
                <div className="text-xs text-muted-foreground">{language.nativeName}</div>
              </div>
              {language.code === "hy" && <StatusBadge status="featured">Default</StatusBadge>}
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">Usage by orders</span>
                <span className="font-medium">{language.orders}</span>
              </div>
              <Progress value={language.orders > 0 ? 100 : 0} className="h-2" />
            </div>
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/60">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Switch disabled defaultChecked={language.status === "active"} /> <StatusBadge status={language.status} />
              </div>
              <div className="flex gap-1">
                <Button disabled variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                <Button disabled variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
