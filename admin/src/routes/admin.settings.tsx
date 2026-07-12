import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Bell, CreditCard, FileText, Globe, Mail, Save, Shield, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/PageHeader";
import { useSettings } from "@/hooks/useAdminData";
import { adminApi } from "@/lib/api";
import { useAdminI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

const sections = [
  { value: "general", label: "General", icon: Globe },
  { value: "brand", label: "Brand", icon: Upload },
  { value: "email", label: "Email", icon: Mail },
  { value: "payments", label: "Payments", icon: CreditCard },
  { value: "seo", label: "SEO", icon: FileText },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "legal", label: "Legal", icon: Shield },
];

function SettingsPage() {
  const { t } = useAdminI18n();
  const { data: settings, isLoading, error } = useSettings();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    brand: "Amulet",
    tagline: "Elegant digital invitations",
    description: "Design and send exquisite digital invitations for weddings, engagements, baptisms, birthdays, and corporate events.",
    supportEmail: "",
    supportPhone: "+374 55 710 208",
    instagram: "",
    facebook: "",
    maintenanceMode: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm((current) => ({ ...current, ...settings }));
    }
  }, [settings]);

  const set = (key: string, value: any) => setForm((current) => ({ ...current, [key]: value }));

  const saveSettings = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettings(form);
      await queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast.success(t("done"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={t("settings")}
        subtitle={error ? error.message : isLoading ? t("loading") : t("settings")}
        actions={<Button disabled={saving} onClick={saveSettings} className="gold-gradient border-0 text-white rounded-full"><Save className="h-4 w-4 mr-2" />{t("saveChanges")}</Button>}
      />
      <Tabs defaultValue="general" orientation="vertical" className="flex flex-col lg:flex-row gap-6">
        <TabsList className="lg:flex-col lg:h-auto lg:w-56 bg-secondary/40 p-2 rounded-2xl gap-1">
          {sections.map((section) => (
            <TabsTrigger key={section.value} value={section.value} className="w-full justify-start data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <section.icon className="h-4 w-4 mr-2" />{section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 min-w-0">
          <TabsContent value="general">
            <Card className="p-6 rounded-2xl border-border/60 shadow-[var(--shadow-soft)] space-y-6">
              <div>
                <h3 className="font-display text-xl">Website information</h3>
                <p className="text-xs text-muted-foreground mt-1">{t("settings")}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Site name</Label><Input value={form.brand} onChange={(event) => set("brand", event.target.value)} /></div>
                <div className="space-y-2"><Label>Tagline</Label><Input value={form.tagline} onChange={(event) => set("tagline", event.target.value)} /></div>
                <div className="space-y-2 md:col-span-2"><Label>{t("description")}</Label><Textarea value={form.description} onChange={(event) => set("description", event.target.value)} /></div>
                <div className="space-y-2"><Label>Support email</Label><Input value={form.supportEmail} onChange={(event) => set("supportEmail", event.target.value)} /></div>
                <div className="space-y-2"><Label>Support phone</Label><Input value={form.supportPhone} onChange={(event) => set("supportPhone", event.target.value)} /></div>
              </div>
              {settings?.totals && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {Object.entries(settings.totals).map(([key, value]) => (
                    <div key={key} className="rounded-xl bg-secondary/50 p-3">
                      <div className="text-xs text-muted-foreground capitalize">{key}</div>
                      <div className="font-display text-2xl">{String(value)}</div>
                    </div>
                  ))}
                </div>
              )}
              <Separator />
              <div>
                <h3 className="font-display text-xl">Social links</h3>
                <div className="grid gap-4 md:grid-cols-2 mt-4">
                  <div className="space-y-2"><Label>Instagram</Label><Input value={form.instagram} onChange={(event) => set("instagram", event.target.value)} /></div>
                  <div className="space-y-2"><Label>Facebook</Label><Input value={form.facebook} onChange={(event) => set("facebook", event.target.value)} /></div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Maintenance mode</div>
                  <p className="text-xs text-muted-foreground">{t("readOnly")}</p>
                </div>
                <Switch checked={form.maintenanceMode} onCheckedChange={(checked) => set("maintenanceMode", checked)} />
              </div>
            </Card>
          </TabsContent>

          {["brand", "email", "payments", "seo", "notifications", "legal"].map((value) => (
            <TabsContent key={value} value={value}>
              <Card className="p-6 rounded-2xl border-border/60 shadow-[var(--shadow-soft)]">
                <h3 className="font-display text-xl capitalize">{value} settings</h3>
                <p className="text-sm text-muted-foreground mt-2">{t("readOnly")}</p>
              </Card>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
