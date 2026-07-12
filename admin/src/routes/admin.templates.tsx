import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Copy, Edit, Eye, LayoutGrid, List, MoreHorizontal, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminApi, currency } from "@/lib/api";
import { useAdminI18n } from "@/lib/i18n";
import { useTemplates } from "@/hooks/useAdminData";

export const Route = createFileRoute("/admin/templates")({ component: TemplatesPage });

const emptyForm = {
  title: "",
  slug: "",
  category: "wedding",
  price: "29000",
  description: "",
  mainImage: "",
  gallery: "",
  features: "",
  isFeatured: false,
};

function toForm(template?: any) {
  if (!template) return emptyForm;
  return {
    title: template.name || "",
    slug: template.slug || "",
    category: String(template.category || "wedding").toLowerCase(),
    price: String(template.price || 0),
    description: template.description || "",
    mainImage: template.cover || "",
    gallery: (template.gallery || []).join("\n"),
    features: (template.features || []).join("\n"),
    isFeatured: Boolean(template.featured),
  };
}

function TemplatesPage() {
  const { t } = useAdminI18n();
  const { data: templates, isLoading, error } = useTemplates();
  const queryClient = useQueryClient();
  const [view, setView] = useState<"cards" | "table">("cards");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const subtitle = error ? error.message : isLoading ? t("loading") : t("templates");

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (template: any) => {
    setEditing(template);
    setForm(toForm(template));
    setDialogOpen(true);
  };

  const payload = useMemo(() => ({
    title: form.title,
    slug: form.slug || undefined,
    category: form.category,
    price: Number(form.price || 0),
    description: form.description,
    mainImage: form.mainImage,
    gallery: form.gallery,
    features: form.features,
    isFeatured: form.isFeatured,
  }), [form]);

  const saveTemplate = async () => {
    setSaving(true);
    try {
      if (editing) await adminApi.updateTemplate(editing.id, payload);
      else await adminApi.createTemplate(payload);
      await queryClient.invalidateQueries({ queryKey: ["admin", "templates"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success(t("done"));
      setDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    } finally {
      setSaving(false);
    }
  };

  const deleteTemplate = async (template: any) => {
    if (!confirm(`${t("delete")}: ${template.name}?`)) return;
    try {
      await adminApi.deleteTemplate(template.id);
      await queryClient.invalidateQueries({ queryKey: ["admin", "templates"] });
      toast.success(t("done"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    }
  };

  const duplicateTemplate = async (template: any) => {
    try {
      const data = toForm(template);
      await adminApi.createTemplate({
        ...data,
        title: `${template.name} Copy`,
        slug: `${template.slug || template.name}-copy-${Date.now()}`,
        price: Number(data.price),
      });
      await queryClient.invalidateQueries({ queryKey: ["admin", "templates"] });
      toast.success(t("done"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    }
  };

  return (
    <div>
      <PageHeader
        title={t("templates")}
        subtitle={subtitle}
        actions={
          <>
            <Tabs value={view} onValueChange={(value) => setView(value as "cards" | "table")}>
              <TabsList className="bg-secondary/60">
                <TabsTrigger value="cards"><LayoutGrid className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="table"><List className="h-4 w-4" /></TabsTrigger>
              </TabsList>
            </Tabs>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreate} className="gold-gradient border-0 text-white rounded-full"><Plus className="h-4 w-4 mr-2" />{t("addTemplate")}</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">{editing ? t("editTemplate") : t("createTemplate")}</DialogTitle>
                </DialogHeader>
                <TemplateForm form={form} setForm={setForm} />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>{t("cancel")}</Button>
                  <Button disabled={saving || !form.title || !form.description} onClick={saveTemplate} className="gold-gradient border-0 text-white">
                    {t("save")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <Tabs value={view}>
        <TabsContent value="cards">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {templates.map((template: any) => (
              <Card key={template.id} className="group overflow-hidden rounded-2xl border-border/60 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-gold)] transition-all hover:-translate-y-1 pt-0">
                <div className="relative aspect-[4/5] bg-secondary overflow-hidden">
                  {template.cover ? <img src={template.cover} alt={template.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" /> : null}
                  {template.featured && (
                    <div className="absolute top-3 left-3 gold-gradient text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="h-3 w-3 fill-white" /> {t("featured")}
                    </div>
                  )}
                  <div className="absolute top-3 right-3"><StatusBadge status={template.status} /></div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-display text-lg truncate">{template.name}</h3>
                      <p className="text-xs text-muted-foreground">{template.category}</p>
                    </div>
                    <div className="font-display text-lg text-[color:var(--gold)]">{currency(template.price)}</div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
                    <div className="text-xs text-muted-foreground">{template.usage} uses</div>
                    <TemplateActions template={template} onEdit={openEdit} onDuplicate={duplicateTemplate} onDelete={deleteTemplate} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table">
          <Card className="rounded-2xl border-border/60 shadow-[var(--shadow-soft)] overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/20 hover:bg-secondary/20 border-border/60">
                    <TableHead>{t("templates")}</TableHead>
                    <TableHead>{t("category")}</TableHead>
                    <TableHead>{t("price")}</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template: any) => (
                    <TableRow key={template.id} className="border-border/60 hover:bg-secondary/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {template.cover ? <img src={template.cover} className="h-10 w-10 object-cover rounded-lg" alt={template.name} /> : <div className="h-10 w-10 rounded-lg bg-secondary" />}
                          <span className="font-medium">{template.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{template.category}</TableCell>
                      <TableCell>{currency(template.price)}</TableCell>
                      <TableCell>{template.usage}</TableCell>
                      <TableCell><StatusBadge status={template.status} /></TableCell>
                      <TableCell className="text-right">
                        <TemplateActions template={template} onEdit={openEdit} onDuplicate={duplicateTemplate} onDelete={deleteTemplate} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TemplateActions({ template, onEdit, onDuplicate, onDelete }: any) {
  const { t } = useAdminI18n();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />{t("preview")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(template)}><Edit className="h-4 w-4 mr-2" />{t("edit")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDuplicate(template)}><Copy className="h-4 w-4 mr-2" />{t("duplicate")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(template)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />{t("delete")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TemplateForm({ form, setForm }: any) {
  const { t } = useAdminI18n();
  const set = (key: string, value: any) => setForm((current: any) => ({ ...current, [key]: value }));
  return (
    <div className="grid gap-4 sm:grid-cols-2 py-2">
      <div className="space-y-2"><Label>{t("title")}</Label><Input value={form.title} onChange={(event) => set("title", event.target.value)} /></div>
      <div className="space-y-2"><Label>{t("slug")}</Label><Input value={form.slug} onChange={(event) => set("slug", event.target.value)} /></div>
      <div className="space-y-2"><Label>{t("category")}</Label><Input value={form.category} onChange={(event) => set("category", event.target.value)} /></div>
      <div className="space-y-2"><Label>{t("price")}</Label><Input type="number" value={form.price} onChange={(event) => set("price", event.target.value)} /></div>
      <div className="space-y-2 sm:col-span-2"><Label>{t("description")}</Label><Textarea value={form.description} onChange={(event) => set("description", event.target.value)} /></div>
      <div className="space-y-2 sm:col-span-2"><Label>{t("mainImage")}</Label><Input value={form.mainImage} onChange={(event) => set("mainImage", event.target.value)} /></div>
      <div className="space-y-2"><Label>{t("gallery")}</Label><Textarea value={form.gallery} onChange={(event) => set("gallery", event.target.value)} rows={4} /></div>
      <div className="space-y-2"><Label>{t("features")}</Label><Textarea value={form.features} onChange={(event) => set("features", event.target.value)} rows={4} /></div>
      <label className="flex items-center gap-3"><Switch checked={form.isFeatured} onCheckedChange={(checked) => set("isFeatured", checked)} /> {t("featured")}</label>
    </div>
  );
}
