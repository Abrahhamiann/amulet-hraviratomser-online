import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Pencil, Plus, Search, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminApi } from "@/lib/api";
import { formatAdminDate, useAdminI18n } from "@/lib/i18n";
import { useReviews } from "@/hooks/useAdminData";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/reviews")({ component: ReviewsPage });

type ReviewStatus = "pending" | "approved" | "rejected" | "featured";
type ReviewSource = "user" | "static" | "admin";
type Review = {
  _id: string;
  customer: string;
  text: string;
  target?: string;
  language?: string;
  rating: number;
  status: ReviewStatus;
  source: ReviewSource;
  createdAt: string;
  userId?: { name?: string; email?: string } | null;
  orderId?: { orderNumber?: string; paymentStatus?: string } | null;
};

const emptyForm = {
  customer: "",
  text: "",
  target: "Amulet",
  language: "hy",
  rating: 5,
  status: "approved" as ReviewStatus,
  source: "admin" as ReviewSource,
};

const copy = {
  en: {
    subtitle: "Manage customer, curated, and admin reviews shown on the website.",
    add: "Add review", edit: "Edit review", all: "All", published: "Published", pending: "Pending", hidden: "Hidden",
    static: "Static", user: "Verified customer", admin: "Admin", publish: "Publish", hide: "Hide", featured: "Featured",
    customer: "Customer name", text: "Review text", target: "Invitation / target", language: "Language", source: "Source",
    confirm: "Delete this review permanently?", search: "Search reviews...", formHelp: "Published reviews appear in the website reviews section.",
  },
  hy: {
    subtitle: "Կառավարեք կայքում ցուցադրվող իրական, ստատիկ և ադմինի ավելացրած կարծիքները։",
    add: "Ավելացնել կարծիք", edit: "Խմբագրել կարծիքը", all: "Բոլորը", published: "Հրապարակված", pending: "Սպասող", hidden: "Թաքցված",
    static: "Ստատիկ", user: "Գնումը հաստատված user", admin: "Ադմին", publish: "Հրապարակել", hide: "Թաքցնել", featured: "Առանձնացված",
    customer: "Հաճախորդի անուն", text: "Կարծիքի տեքստ", target: "Հրավեր / նպատակ", language: "Լեզու", source: "Աղբյուր",
    confirm: "Ընդմիշտ ջնջե՞լ այս կարծիքը։", search: "Փնտրել կարծիքներում...", formHelp: "Հրապարակված կարծիքները երևում են կայքի կարծիքների բաժնում։",
  },
  ru: {
    subtitle: "Управляйте реальными, статическими и добавленными администратором отзывами на сайте.",
    add: "Добавить отзыв", edit: "Редактировать отзыв", all: "Все", published: "Опубликованные", pending: "Ожидающие", hidden: "Скрытые",
    static: "Статический", user: "Проверенный покупатель", admin: "Администратор", publish: "Опубликовать", hide: "Скрыть", featured: "Избранный",
    customer: "Имя клиента", text: "Текст отзыва", target: "Приглашение / цель", language: "Язык", source: "Источник",
    confirm: "Удалить этот отзыв навсегда?", search: "Поиск отзывов...", formHelp: "Опубликованные отзывы отображаются в разделе отзывов на сайте.",
  },
} as const;

function ReviewsPage() {
  const { lang, t } = useAdminI18n();
  const labels = copy[lang];
  const { data, isLoading, error } = useReviews();
  const reviews = data as Review[];
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");

  const filtered = useMemo(() => reviews.filter((review) => {
    const matchesStatus = filter === "all"
      || (filter === "published" && ["approved", "featured"].includes(review.status))
      || review.status === filter;
    const term = query.trim().toLowerCase();
    const matchesQuery = !term || [review.customer, review.text, review.target, review.userId?.email]
      .some((value) => String(value || "").toLowerCase().includes(term));
    return matchesStatus && matchesQuery;
  }), [filter, query, reviews]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
  const reset = () => { setEditingId(""); setForm(emptyForm); };
  const edit = (review: Review) => {
    setEditingId(review._id);
    setForm({
      customer: review.customer,
      text: review.text,
      target: review.target || "Amulet",
      language: review.language || "hy",
      rating: review.rating || 5,
      status: review.status,
      source: review.source,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingId) await adminApi.updateReview(editingId, form);
      else await adminApi.createReview(form);
      await invalidate();
      reset();
      toast.success(t("done"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    } finally {
      setSaving(false);
    }
  };

  const setStatus = async (review: Review, status: ReviewStatus) => {
    setBusyId(review._id);
    try {
      await adminApi.updateReview(review._id, { ...review, status });
      await invalidate();
      toast.success(t("done"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    } finally {
      setBusyId("");
    }
  };

  const remove = async (review: Review) => {
    if (!window.confirm(labels.confirm)) return;
    setBusyId(review._id);
    try {
      await adminApi.deleteReview(review._id);
      await invalidate();
      if (editingId === review._id) reset();
      toast.success(t("done"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    } finally {
      setBusyId("");
    }
  };

  const statusLabel = (status: ReviewStatus) => status === "approved" ? labels.published : status === "featured" ? labels.featured : status === "pending" ? labels.pending : labels.hidden;
  const sourceLabel = (source: ReviewSource) => source === "static" ? labels.static : source === "user" ? labels.user : labels.admin;

  return (
    <div>
      <PageHeader title={t("reviews")} subtitle={error ? error.message : labels.subtitle} />
      <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Card className="h-max rounded-2xl border-border/60 p-5 shadow-[var(--shadow-soft)] xl:sticky xl:top-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[color:var(--cream)] text-[color:var(--gold)]"><Star className="h-5 w-5" /></div>
            <div><h2 className="font-display text-xl">{editingId ? labels.edit : labels.add}</h2><p className="text-xs text-muted-foreground">{labels.formHelp}</p></div>
          </div>
          <form className="grid gap-4" onSubmit={save}>
            <label className="grid gap-2"><Label htmlFor="review-customer">{labels.customer}</Label><Input id="review-customer" value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} minLength={2} maxLength={120} required /></label>
            <label className="grid gap-2"><Label htmlFor="review-text">{labels.text}</Label><Textarea id="review-text" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} minLength={8} maxLength={1200} rows={6} required /></label>
            <label className="grid gap-2"><Label htmlFor="review-target">{labels.target}</Label><Input id="review-target" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-2"><Label htmlFor="review-language">{labels.language}</Label><select id="review-language" className="h-10 rounded-md border border-input bg-background px-3" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}><option value="hy">Հայերեն</option><option value="en">English</option><option value="ru">Русский</option><option value="all">All</option></select></label>
              <label className="grid gap-2"><Label htmlFor="review-rating">{t("rating")}</Label><select id="review-rating" className="h-10 rounded-md border border-input bg-background px-3" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>{[5,4,3,2,1].map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}</select></label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-2"><Label htmlFor="review-source">{labels.source}</Label><select id="review-source" className="h-10 rounded-md border border-input bg-background px-3" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as ReviewSource })} disabled={form.source === "user"}><option value="admin">{labels.admin}</option><option value="static">{labels.static}</option>{form.source === "user" && <option value="user">{labels.user}</option>}</select></label>
              <label className="grid gap-2"><Label htmlFor="review-status">{t("status")}</Label><select id="review-status" className="h-10 rounded-md border border-input bg-background px-3" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ReviewStatus })}><option value="approved">{labels.published}</option><option value="featured">{labels.featured}</option><option value="pending">{labels.pending}</option><option value="rejected">{labels.hidden}</option></select></label>
            </div>
            <div className="flex gap-2"><Button type="submit" disabled={saving} className="flex-1 border-0 text-white gold-gradient"><Check className="mr-2 h-4 w-4" />{saving ? t("saving") : t("save")}</Button>{editingId && <Button type="button" variant="outline" onClick={reset}><X className="mr-2 h-4 w-4" />{t("cancel")}</Button>}</div>
          </form>
        </Card>

        <div className="min-w-0">
          <Card className="mb-4 rounded-2xl border-border/60 p-3 shadow-[var(--shadow-soft)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">{[["all", labels.all], ["published", labels.published], ["pending", labels.pending], ["rejected", labels.hidden]].map(([value, label]) => <Button key={value} type="button" size="sm" variant={filter === value ? "default" : "outline"} onClick={() => setFilter(value)}>{label}</Button>)}</div>
              <label className="relative block min-w-[240px]"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={labels.search} className="pl-9" /></label>
            </div>
          </Card>
          <div className="grid gap-3">
            {isLoading && <Card className="rounded-2xl p-6 text-sm text-muted-foreground">{t("loading")}</Card>}
            {!isLoading && !filtered.length && <Card className="rounded-2xl p-8 text-center text-muted-foreground"><Plus className="mx-auto mb-3 h-6 w-6" />{t("noReviews")}</Card>}
            {filtered.map((review) => (
              <Card key={review._id} className="rounded-2xl border-border/60 p-5 shadow-[var(--shadow-soft)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><strong className="text-base">{review.customer}</strong><span className="rounded-full bg-secondary px-2 py-1 text-[10px] text-muted-foreground">{sourceLabel(review.source)}</span><span className={`rounded-full px-2 py-1 text-[10px] ${["approved","featured"].includes(review.status) ? "bg-emerald-100 text-emerald-700" : review.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>{statusLabel(review.status)}</span></div>
                    <div className="mt-2 flex items-center gap-1 text-[color:var(--gold)]" aria-label={`${review.rating} / 5`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} className="h-3.5 w-3.5" fill={index < review.rating ? "currentColor" : "none"} />)}</div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground/90">{review.text}</p>
                    <div className="mt-3 text-xs text-muted-foreground">{review.target || "Amulet"} · {review.language?.toUpperCase()} · {formatAdminDate(review.createdAt, lang)}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["approved","featured"].includes(review.status) ? <Button variant="outline" size="sm" disabled={busyId === review._id} onClick={() => setStatus(review, "rejected")}><X className="mr-1.5 h-4 w-4" />{labels.hide}</Button> : <Button variant="outline" size="sm" disabled={busyId === review._id} onClick={() => setStatus(review, "approved")}><Check className="mr-1.5 h-4 w-4" />{labels.publish}</Button>}
                    <Button variant="outline" size="icon" className="rounded-full" disabled={busyId === review._id} onClick={() => edit(review)} aria-label={labels.edit}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" className="rounded-full text-destructive" disabled={busyId === review._id} onClick={() => remove(review)} aria-label={t("delete")}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
