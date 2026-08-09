import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarClock, Pencil, Plus, Save, TicketPercent, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { adminApi } from "@/lib/api";
import { useAdminI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/promocodes")({ component: PromoCodesPage });

const emptyForm = {
  code: "",
  description: "",
  giftLabel: "",
  discountType: "percent",
  value: "",
  maxUses: "0",
  expiresAt: "",
  isActive: true,
};

type PromoCode = {
  _id: string;
  code: string;
  description?: string;
  giftLabel?: string;
  discountType: "percent" | "fixed";
  value: number;
  maxUses: number;
  usageCount: number;
  isActive: boolean;
  expiresAt?: string | null;
};

function PromoCodesPage() {
  const { t } = useAdminI18n();
  const [items, setItems] = useState<PromoCode[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () =>
    adminApi
      .promocodes()
      .then(setItems)
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    void load();
  }, []);

  const update = (key: string, value: string | boolean) =>
    setForm((current) => ({ ...current, [key]: value }));
  const reset = () => {
    setForm(emptyForm);
    setEditingId("");
  };

  const edit = (item: PromoCode) => {
    setEditingId(item._id);
    setForm({
      code: item.code || "",
      description: item.description || "",
      giftLabel: item.giftLabel || "",
      discountType: item.discountType || "percent",
      value: String(item.value || ""),
      maxUses: String(item.maxUses || 0),
      expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().slice(0, 10) : "",
      isActive: item.isActive !== false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingId) await adminApi.updatePromoCode(editingId, form);
      else await adminApi.createPromoCode(form);
      toast.success(t("done"));
      reset();
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("failed"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm(t("deleteConfirm"))) return;
    try {
      await adminApi.deletePromoCode(id);
      setItems((current) => current.filter((item) => item._id !== id));
      toast.success(t("done"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("failed"));
    }
  };

  return (
    <div>
      <PageHeader title={t("promocodes")} subtitle={t("promoSubtitle")} />
      <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Card className="h-max rounded-2xl border-border/60 p-5 shadow-[var(--shadow-soft)]">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[color:var(--cream)] text-[color:var(--gold)]">
              <TicketPercent className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl">{editingId ? t("editPromo") : t("addPromo")}</h2>
              <p className="text-xs text-muted-foreground">{t("promoFormHelp")}</p>
            </div>
          </div>
          <form className="grid gap-4" onSubmit={save}>
            <label className="grid gap-2">
              <Label htmlFor="promo-code">{t("promoCode")}</Label>
              <Input
                id="promo-code"
                value={form.code}
                onChange={(event) => update("code", event.target.value.toUpperCase())}
                required
                maxLength={32}
              />
            </label>
            <label className="grid gap-2">
              <Label htmlFor="promo-description">{t("description")}</Label>
              <Input
                id="promo-description"
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
              />
            </label>
            <label className="grid gap-2">
              <Label htmlFor="promo-gift">{t("giftLabel")}</Label>
              <Input
                id="promo-gift"
                value={form.giftLabel}
                onChange={(event) => update("giftLabel", event.target.value)}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-2 text-sm">
                <Label htmlFor="promo-type">{t("discountType")}</Label>
                <select
                  id="promo-type"
                  className="h-10 rounded-md border border-input bg-background px-3"
                  value={form.discountType}
                  onChange={(event) => update("discountType", event.target.value)}
                >
                  <option value="percent">{t("percent")}</option>
                  <option value="fixed">{t("fixedAmount")}</option>
                </select>
              </label>
              <label className="grid gap-2">
                <Label htmlFor="promo-value">{t("discount")}</Label>
                <Input
                  id="promo-value"
                  type="number"
                  min="1"
                  max={form.discountType === "percent" ? 90 : undefined}
                  value={form.value}
                  onChange={(event) => update("value", event.target.value)}
                  required
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-2">
                <Label htmlFor="promo-uses">{t("maxUses")}</Label>
                <Input
                  id="promo-uses"
                  type="number"
                  min="0"
                  value={form.maxUses}
                  onChange={(event) => update("maxUses", event.target.value)}
                />
              </label>
              <label className="grid gap-2">
                <Label htmlFor="promo-expiry">{t("expiresAt")}</Label>
                <Input
                  id="promo-expiry"
                  type="date"
                  value={form.expiresAt}
                  onChange={(event) => update("expiresAt", event.target.value)}
                />
              </label>
            </div>
            <label className="flex min-h-11 items-center justify-between rounded-xl border border-border/60 px-3 text-sm">
              <span>{t("active")}</span>
              <Switch
                checked={form.isActive}
                onCheckedChange={(value) => update("isActive", value)}
              />
            </label>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 gold-gradient border-0 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? t("saving") : t("save")}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={reset}>
                  {t("cancel")}
                </Button>
              )}
            </div>
          </form>
        </Card>

        <div className="grid gap-3">
          {loading && (
            <Card className="rounded-2xl p-6 text-sm text-muted-foreground">{t("loading")}</Card>
          )}
          {!loading && items.length === 0 && (
            <Card className="rounded-2xl p-8 text-center text-muted-foreground">
              <Plus className="mx-auto mb-3 h-6 w-6" />
              {t("noPromoCodes")}
            </Card>
          )}
          {items.map((item) => (
            <Card
              key={item._id}
              className="rounded-2xl border-border/60 p-5 shadow-[var(--shadow-soft)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="font-mono text-lg tracking-wider">{item.code}</strong>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] ${item.isActive ? "bg-emerald-100 text-emerald-700" : "bg-secondary text-muted-foreground"}`}
                    >
                      {item.isActive ? t("active") : t("inactive")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.giftLabel || item.description || "—"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => edit(item)}
                    aria-label={t("editPromo")}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full text-destructive"
                    onClick={() => remove(item._id)}
                    aria-label={t("delete")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-xl bg-secondary/50 p-3">
                  <span className="block text-xs text-muted-foreground">{t("discount")}</span>
                  <strong>
                    {item.discountType === "percent"
                      ? `${item.value}%`
                      : `${Number(item.value).toLocaleString()} AMD`}
                  </strong>
                </div>
                <div className="rounded-xl bg-secondary/50 p-3">
                  <span className="block text-xs text-muted-foreground">{t("usage")}</span>
                  <strong>
                    {item.usageCount} / {item.maxUses || "∞"}
                  </strong>
                </div>
                <div className="rounded-xl bg-secondary/50 p-3">
                  <span className="block text-xs text-muted-foreground">
                    <CalendarClock className="mr-1 inline h-3 w-3" />
                    {t("expiresAt")}
                  </span>
                  <strong>
                    {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : "—"}
                  </strong>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
