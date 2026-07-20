import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type CSSProperties } from "react";
import { Copy, Edit, Eye, LayoutGrid, List, MoreHorizontal, Plus, Star, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminApi, currency } from "@/lib/api";
import { useAdminI18n } from "@/lib/i18n";
import { useTemplates } from "@/hooks/useAdminData";
import midnightVowsDefault from "../../../client/src/assets/occasion/midnight-vows-default.jpg";
import baptismBabyChurch from "../../../client/src/assets/baptism/baptism-baby-church.png";
import baptismEnvelope from "../../../client/src/assets/baptism/baptism-envelope.png";
import baptismFamily from "../../../client/src/assets/baptism/baptism-family.png";
import engagementBouquet from "../../../client/src/assets/morph/engagement-bouquet-red.jpg";
import engagementChandelier from "../../../client/src/assets/morph/engagement-chandelier.jpg";
import engagementHand from "../../../client/src/assets/morph/engagement-hand.jpg";
import engagementRing from "../../../client/src/assets/morph/engagement-ring.jpg";
import engagementRoses from "../../../client/src/assets/morph/engagement-roses.jpg";
import engagementSmile from "../../../client/src/assets/morph/engagement-smile.jpg";
import weddingSunset from "../../../client/src/assets/morph/wedding-sunset.jpg";

export const Route = createFileRoute("/admin/templates")({ component: TemplatesPage });

const defaultImagePosition = {
  x: 50,
  y: 50,
  zoom: 1,
};

const staticDesignOptions = [
  { key: "midnight-vows", label: "Midnight vows fullscreen" },
  { key: "baptism-blessing", label: "Baptism blessing envelope" },
  { key: "engagement-serenade", label: "Engagement serenade fullscreen" },
];

const templateAssetPreviews: Record<string, string> = {
  "asset:occasion/midnight-vows-default.jpg": midnightVowsDefault,
  "asset:baptism/baptism-angel.png": baptismBabyChurch,
  "asset:baptism/baptism-baby-church.png": baptismBabyChurch,
  "asset:baptism/baptism-candle.png": baptismEnvelope,
  "asset:baptism/baptism-church-icon.png": baptismBabyChurch,
  "asset:baptism/baptism-cross.png": baptismEnvelope,
  "asset:baptism/baptism-dove.png": baptismFamily,
  "asset:baptism/baptism-envelope.png": baptismEnvelope,
  "asset:baptism/baptism-family.png": baptismFamily,
  "asset:morph/engagement-bouquet-red.jpg": engagementBouquet,
  "asset:morph/engagement-chandelier.jpg": engagementChandelier,
  "asset:morph/engagement-hand.jpg": engagementHand,
  "asset:morph/engagement-ring.jpg": engagementRing,
  "asset:morph/engagement-roses.jpg": engagementRoses,
  "asset:morph/engagement-smile.jpg": engagementSmile,
  "asset:morph/wedding-sunset.jpg": weddingSunset,
};

const defaultDesignGalleries: Record<string, string[]> = {
  "midnight-vows": [
    "asset:occasion/midnight-vows-default.jpg",
  ],
  "baptism-blessing": [
    "asset:baptism/baptism-envelope.png",
    "asset:baptism/baptism-baby-church.png",
    "asset:baptism/baptism-family.png",
    "asset:baptism/baptism-cross.png",
    "asset:baptism/baptism-candle.png",
    "asset:baptism/baptism-church-icon.png",
    "asset:baptism/baptism-angel.png",
    "asset:baptism/baptism-dove.png",
  ],
  "engagement-serenade": [
    "asset:morph/wedding-sunset.jpg",
    "asset:morph/engagement-smile.jpg",
    "asset:morph/engagement-hand.jpg",
    "asset:morph/engagement-ring.jpg",
    "asset:morph/engagement-roses.jpg",
    "asset:morph/engagement-bouquet-red.jpg",
    "asset:morph/engagement-chandelier.jpg",
  ],
};

const emptyForm = {
  title: "",
  slug: "",
  category: "wedding",
  price: "29000",
  designKey: "midnight-vows",
  description: "",
  mainImage: "asset:occasion/midnight-vows-default.jpg",
  gallery: "asset:occasion/midnight-vows-default.jpg",
  features: "",
  isFeatured: false,
  isActive: true,
  galleryConfigured: false,
  imagePosition: defaultImagePosition,
};

const clampNumber = (value: unknown, min: number, max: number, fallback: number) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
};

function normalizeImagePosition(position?: any) {
  return {
    x: clampNumber(position?.x, 0, 100, defaultImagePosition.x),
    y: clampNumber(position?.y, 0, 100, defaultImagePosition.y),
    zoom: clampNumber(position?.zoom, 1, 2, defaultImagePosition.zoom),
  };
}

function getImageStyle(position?: any): CSSProperties {
  const normalized = normalizeImagePosition(position);
  const objectPosition = `${normalized.x}% ${normalized.y}%`;
  return {
    objectPosition,
    transform: `scale(${normalized.zoom})`,
    transformOrigin: objectPosition,
  };
}

const galleryFromText = (value: string) => String(value || "")
  .split("\n")
  .map((image) => image.trim())
  .filter(Boolean);

const isKnownDesignKey = (designKey?: string) => staticDesignOptions.some((option) => option.key === designKey);

const getDefaultGalleryForDesign = (designKey?: string) => defaultDesignGalleries[designKey || "midnight-vows"] || defaultDesignGalleries["midnight-vows"];

const sameImageList = (first: string[], second: string[]) => (
  first.length === second.length && first.every((image, index) => image === second[index])
);

const getPreviewImage = (image?: string) => templateAssetPreviews[image || ""] || image || "";

const readImageFile = (file: File) => new Promise<string>((resolve) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result || ""));
  reader.readAsDataURL(file);
});

function getClientBaseUrl() {
  const configured = (import.meta as any).env?.VITE_CLIENT_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (typeof window !== "undefined") return `${window.location.protocol}//${window.location.hostname}:5173`;
  return "http://localhost:5173";
}

function toForm(template?: any) {
  if (!template) return emptyForm;
  const designKey = isKnownDesignKey(template.designKey) ? template.designKey : "midnight-vows";
  const savedGallery = template.gallery || [];
  const defaultGallery = getDefaultGalleryForDesign(designKey);
  const gallery = savedGallery.length || template.galleryConfigured
    ? savedGallery
    : defaultGallery;
  return {
    title: template.name || "",
    slug: template.slug || "",
    category: String(template.category || "wedding").toLowerCase(),
    price: String(template.price || 0),
    designKey,
    description: template.description || "",
    mainImage: template.cover || "",
    gallery: gallery.join("\n"),
    features: (template.features || []).join("\n"),
    isFeatured: Boolean(template.featured),
    isActive: template.active !== false,
    galleryConfigured: Boolean(template.galleryConfigured),
    imagePosition: normalizeImagePosition(template.imagePosition),
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
  const visibleTemplates = useMemo(
    () => (templates || []).filter((template: any) => isKnownDesignKey(template.designKey)),
    [templates]
  );

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
    designKey: isKnownDesignKey(form.designKey) ? form.designKey : "midnight-vows",
    description: form.description,
    mainImage: form.mainImage,
    gallery: form.gallery,
    galleryConfigured: true,
    features: form.features,
    isFeatured: form.isFeatured,
    isActive: form.isActive !== false,
    imagePosition: normalizeImagePosition(form.imagePosition),
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
        designKey: data.designKey,
        isActive: data.isActive,
        galleryConfigured: true,
        imagePosition: normalizeImagePosition(data.imagePosition),
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
              <DialogContent className="max-h-[calc(100dvh-32px)] max-w-4xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">{editing ? t("editTemplate") : t("createTemplate")}</DialogTitle>
                </DialogHeader>
                <TemplateForm form={form} setForm={setForm} />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>{t("cancel")}</Button>
                  <Button disabled={saving || !form.title || !form.description || !form.mainImage} onClick={saveTemplate} className="gold-gradient border-0 text-white">
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
            {visibleTemplates.map((template: any) => (
              <Card key={template.id} className="group overflow-hidden rounded-2xl border-border/60 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-gold)] transition-all hover:-translate-y-1 pt-0">
                <div className="relative aspect-[4/5] bg-secondary overflow-hidden">
                  {template.cover ? <img src={getPreviewImage(template.cover)} alt={template.name} className="h-full w-full object-cover transition duration-500" style={getImageStyle(template.imagePosition)} /> : null}
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
                      <p className="text-xs text-muted-foreground">{template.category} · {template.designKey}</p>
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
                    <TableHead>Design</TableHead>
                    <TableHead>{t("price")}</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleTemplates.map((template: any) => (
                    <TableRow key={template.id} className="border-border/60 hover:bg-secondary/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {template.cover ? <img src={getPreviewImage(template.cover)} className="h-10 w-10 object-cover rounded-lg" style={getImageStyle(template.imagePosition)} alt={template.name} /> : <div className="h-10 w-10 rounded-lg bg-secondary" />}
                          <span className="font-medium">{template.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{template.category}</TableCell>
                      <TableCell>{template.designKey}</TableCell>
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
  const openPreview = () => {
    window.open(`${getClientBaseUrl()}/templates/${template.id}/live`, "_blank", "noopener,noreferrer");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={openPreview}><Eye className="h-4 w-4 mr-2" />{t("preview")}</DropdownMenuItem>
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
  const imagePosition = normalizeImagePosition(form.imagePosition);
  const galleryImages = galleryFromText(form.gallery);
  const setImagePosition = (key: "x" | "y" | "zoom", value: number) => {
    set("imagePosition", { ...imagePosition, [key]: value });
  };
  const setGalleryImages = (images: string[]) => {
    setForm((current: any) => ({
      ...current,
      gallery: images.filter(Boolean).join("\n"),
      galleryConfigured: true,
    }));
  };
  const updateDesignKey = (designKey: string) => {
    setForm((current: any) => {
      const currentGallery = galleryFromText(current.gallery);
      const currentDefaults = getDefaultGalleryForDesign(current.designKey);
      const currentDefaultGallery = [current.mainImage, ...currentDefaults].filter(Boolean);
      const nextDefaults = getDefaultGalleryForDesign(designKey);
      const nextDefaultGallery = nextDefaults;
      const shouldUseNextDefaults = currentGallery.length === 0 ||
        sameImageList(currentGallery, currentDefaults) ||
        sameImageList(currentGallery, currentDefaultGallery);

      return {
        ...current,
        designKey,
        mainImage: shouldUseNextDefaults ? (nextDefaultGallery[0] || current.mainImage) : current.mainImage,
        imagePosition: shouldUseNextDefaults ? defaultImagePosition : current.imagePosition,
        gallery: shouldUseNextDefaults ? nextDefaultGallery.join("\n") : current.gallery,
        galleryConfigured: shouldUseNextDefaults ? false : current.galleryConfigured,
      };
    });
  };
  const chooseImage = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((current: any) => ({
        ...current,
        mainImage: String(reader.result || ""),
        imagePosition: defaultImagePosition,
      }));
    };
    reader.readAsDataURL(file);
  };
  const addGalleryImages = async (files?: FileList | null) => {
    const selectedFiles = Array.from(files || []);
    if (!selectedFiles.length) return;

    const nextImages = await Promise.all(selectedFiles.map(readImageFile));
    setGalleryImages([...galleryImages, ...nextImages]);
  };
  const replaceGalleryImage = async (index: number, file?: File) => {
    if (!file) return;

    const nextImage = await readImageFile(file);
    setGalleryImages(galleryImages.map((image, imageIndex) => (imageIndex === index ? nextImage : image)));
  };
  const removeGalleryImage = (index: number) => {
    const nextImages = galleryImages.filter((_, imageIndex) => imageIndex !== index);
    setGalleryImages(nextImages);
  };
  const makeGalleryImageCover = (image: string) => {
    setForm((current: any) => ({
      ...current,
      mainImage: image,
      imagePosition: defaultImagePosition,
    }));
  };
  return (
    <div className="grid gap-4 sm:grid-cols-2 py-2">
      <div className="space-y-2"><Label>{t("title")}</Label><Input value={form.title} onChange={(event) => set("title", event.target.value)} /></div>
      <div className="space-y-2"><Label>{t("slug")}</Label><Input value={form.slug} onChange={(event) => set("slug", event.target.value)} /></div>
      <div className="space-y-2"><Label>{t("category")}</Label><Input value={form.category} onChange={(event) => set("category", event.target.value)} /></div>
      <div className="space-y-2"><Label>{t("price")}</Label><Input type="number" value={form.price} onChange={(event) => set("price", event.target.value)} /></div>
      <div className="space-y-2 sm:col-span-2">
        <Label>Invitation design</Label>
        <select
          value={form.designKey}
          onChange={(event) => updateDesignKey(event.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {staticDesignOptions.map((option) => (
            <option key={option.key} value={option.key}>{option.label}</option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">This links the database card to the static template files in client/src/occasionTemplates.</p>
      </div>
      <div className="space-y-2 sm:col-span-2"><Label>{t("description")}</Label><Textarea value={form.description} onChange={(event) => set("description", event.target.value)} /></div>
      <div className="space-y-2 sm:col-span-2">
        <Label>{t("mainImage")}</Label>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Input value={form.mainImage} onChange={(event) => set("mainImage", event.target.value)} placeholder="https://... կամ ընտրիր նկար" />
          <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border/70 bg-background px-4 text-sm font-medium shadow-sm transition hover:border-[color:var(--gold)]">
            <Upload className="h-4 w-4" />
            Upload
            <input className="sr-only" type="file" accept="image/*" onChange={(event) => chooseImage(event.target.files?.[0])} />
          </label>
        </div>
        <p className="text-xs text-muted-foreground">{t("mainImage")} link կամ համակարգչից ընտրված նկար՝ մեկը պարտադիր է։</p>
        {form.mainImage ? (
          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,260px)_1fr]">
            <TemplateCardPreview form={form} />
            <div className="space-y-4 rounded-2xl border border-border/60 bg-secondary/20 p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Move left / right</span>
                  <span className="text-muted-foreground">{Math.round(imagePosition.x)}%</span>
                </div>
                <Slider value={[imagePosition.x]} min={0} max={100} step={1} onValueChange={([value]) => setImagePosition("x", value)} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Move up / down</span>
                  <span className="text-muted-foreground">{Math.round(imagePosition.y)}%</span>
                </div>
                <Slider value={[imagePosition.y]} min={0} max={100} step={1} onValueChange={([value]) => setImagePosition("y", value)} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Zoom</span>
                  <span className="text-muted-foreground">{imagePosition.zoom.toFixed(2)}x</span>
                </div>
                <Slider value={[imagePosition.zoom]} min={1} max={2} step={0.01} onValueChange={([value]) => setImagePosition("zoom", value)} />
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="space-y-3 sm:col-span-2">
        <Label>{t("gallery")}</Label>
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {galleryImages.map((image, index) => (
              <div key={`${image.slice(0, 32)}-${index}`} className="group relative overflow-hidden rounded-xl border border-border/70 bg-secondary/30 p-1">
                <img src={getPreviewImage(image)} alt={`Gallery ${index + 1}`} className="aspect-square w-full rounded-lg object-cover" />
                <div className="absolute inset-x-1 bottom-1 flex items-center justify-center gap-1 rounded-b-lg bg-black/45 p-1 opacity-0 backdrop-blur-sm transition group-hover:opacity-100 group-focus-within:opacity-100">
                  <Button type="button" size="sm" variant="secondary" className="h-9 flex-1 rounded-lg px-2 text-[11px]" onClick={() => makeGalleryImageCover(image)}>
                    Cover
                  </Button>
                  <label className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/20 bg-white/90 text-foreground shadow-sm transition hover:bg-white" aria-label={`Replace gallery image ${index + 1}`}>
                    <Upload className="h-4 w-4" />
                    <input className="sr-only" type="file" accept="image/*" onChange={(event) => replaceGalleryImage(index, event.target.files?.[0])} />
                  </label>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute -right-1 -top-1 h-9 w-9 rounded-full bg-white text-destructive shadow-md hover:bg-destructive hover:text-white"
                  onClick={() => removeGalleryImage(index)}
                  aria-label={`Remove gallery image ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/80 bg-secondary/20 p-4 text-sm text-muted-foreground">
            No gallery images yet.
          </div>
        )}
        <label className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[color:var(--gold)]/50 bg-secondary/20 px-4 text-sm font-medium transition hover:bg-secondary/40">
          <Upload className="h-5 w-5" />
          Ավելացնել նկարներ
          <input className="sr-only" type="file" accept="image/*" multiple onChange={(event) => addGalleryImages(event.target.files)} />
        </label>
        <Textarea value={form.gallery} onChange={(event) => set("gallery", event.target.value)} rows={3} className="text-xs" />
        <p className="text-xs text-muted-foreground">Կարող եք նկարները ավելացնել համակարգչից, ջնջել, փոխարինել կամ ընտրել որպես card-ի գլխավոր նկար։</p>
      </div>
      <div className="space-y-2"><Label>{t("features")}</Label><Textarea value={form.features} onChange={(event) => set("features", event.target.value)} rows={4} /></div>
      <label className="flex items-center gap-3"><Switch checked={form.isFeatured} onCheckedChange={(checked) => set("isFeatured", checked)} /> {t("featured")}</label>
      <label className="flex items-center gap-3"><Switch checked={form.isActive} onCheckedChange={(checked) => set("isActive", checked)} /> Active on website</label>
    </div>
  );
}

function TemplateCardPreview({ form }: any) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <img src={getPreviewImage(form.mainImage)} alt="" className="h-full w-full object-cover" style={getImageStyle(form.imagePosition)} />
        {form.isFeatured ? (
          <div className="absolute left-3 top-3 gold-gradient rounded-full px-2 py-1 text-[10px] font-medium text-white">
            Featured
          </div>
        ) : null}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg">{form.title || "Template title"}</h3>
            <p className="text-xs text-muted-foreground">{form.category || "category"} · {form.designKey}</p>
          </div>
          <div className="font-display text-lg text-[color:var(--gold)]">{currency(Number(form.price || 0))}</div>
        </div>
        <div className="mt-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">0 uses</div>
      </div>
    </div>
  );
}
