import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Edit, MoreHorizontal, Plus, Star, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminApi } from "@/lib/api";
import { useAdminI18n } from "@/lib/i18n";
import { useReviews } from "@/hooks/useAdminData";

export const Route = createFileRoute("/admin/reviews")({ component: ReviewsPage });

function ReviewsPage() {
  const { t } = useAdminI18n();
  const { data: reviews, isLoading, error } = useReviews();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [form, setForm] = useState({ customer: "", rating: "5", target: "Amulet", text: "" });
  const [saving, setSaving] = useState(false);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });

  const resetForm = () => {
    setEditingReview(null);
    setForm({ customer: "", rating: "5", target: "Amulet", text: "" });
  };

  const startCreate = () => {
    resetForm();
    setOpen(true);
  };

  const startEdit = (review: any) => {
    setEditingReview(review);
    setForm({
      customer: review.customer || "",
      rating: String(review.rating || 5),
      target: review.target || "Amulet",
      text: review.text || "",
    });
    setOpen(true);
  };

  const saveReview = async () => {
    setSaving(true);
    try {
      const payload = { ...form, rating: Number(form.rating) };
      if (editingReview) {
        await adminApi.updateReview(editingReview.id, payload);
      } else {
        await adminApi.createReview({ ...payload, status: "approved" });
      }
      await refresh();
      toast.success(t("done"));
      setOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    } finally {
      setSaving(false);
    }
  };

  const updateReview = async (review: any, data: any) => {
    try {
      await adminApi.updateReview(review.id, data);
      await refresh();
      toast.success(t("done"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    }
  };

  const deleteReview = async (review: any) => {
    if (!confirm(`${t("delete")}: ${review.customer}?`)) return;
    try {
      await adminApi.deleteReview(review.id);
      await refresh();
      toast.success(t("done"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    }
  };

  return (
    <div>
      <PageHeader
        title={t("reviews")}
        subtitle={error ? error.message : isLoading ? t("loading") : t("reviews")}
        actions={
          <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) resetForm(); }}>
            <DialogTrigger asChild>
              <Button onClick={startCreate} className="gold-gradient border-0 text-white rounded-full"><Plus className="h-4 w-4 mr-2" />{t("addReview")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display text-2xl">{editingReview ? t("edit") : t("addReview")}</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="space-y-2"><Label>{t("name")}</Label><Input value={form.customer} onChange={(event) => setForm({ ...form, customer: event.target.value })} /></div>
                <div className="space-y-2"><Label>{t("rating")}</Label><Input type="number" min="1" max="5" value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })} /></div>
                <div className="space-y-2"><Label>{t("target")}</Label><Input value={form.target} onChange={(event) => setForm({ ...form, target: event.target.value })} /></div>
                <div className="space-y-2"><Label>{t("description")}</Label><Textarea value={form.text} onChange={(event) => setForm({ ...form, text: event.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>{t("cancel")}</Button>
                <Button disabled={saving || !form.customer || !form.text} onClick={saveReview} className="gold-gradient border-0 text-white">{t("save")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      {reviews.length === 0 ? (
        <Card className="rounded-2xl border-border/60 shadow-[var(--shadow-soft)] p-10 text-center">
          <Star className="h-10 w-10 mx-auto text-[color:var(--gold)]" />
          <h3 className="font-display text-2xl mt-4">{t("noReviews")}</h3>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review: any) => (
            <Card key={review.id} className="p-5 rounded-2xl border-border/60 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-gold)] transition">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="gold-gradient text-white text-xs">{review.customer.split(" ").map((part: string) => part[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{review.customer}</div>
                    <div className="text-xs text-muted-foreground">{format(new Date(review.date), "MMM d, yyyy")}</div>
                  </div>
                </div>
                <StatusBadge status={review.status} />
              </div>
              <div className="flex items-center gap-0.5 mt-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className={`h-4 w-4 ${index < review.rating ? "fill-[color:var(--gold)] text-[color:var(--gold)]" : "text-muted"}`} />
                ))}
              </div>
              <p className="text-sm mt-3 leading-relaxed">{review.text}</p>
              <div className="text-xs text-muted-foreground mt-3">{t("on")} {review.target}</div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/60">
                <Button onClick={() => updateReview(review, { status: "approved" })} variant="outline" size="sm" className="text-[color:var(--success)]"><Check className="h-3 w-3 mr-1" />{t("approve")}</Button>
                <Button onClick={() => updateReview(review, { status: "rejected" })} variant="outline" size="sm" className="text-destructive"><X className="h-3 w-3 mr-1" />{t("reject")}</Button>
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => updateReview(review, { status: "featured" })}><Star className="h-4 w-4 mr-2" />{t("featured")}</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => startEdit(review)}><Edit className="h-4 w-4 mr-2" />{t("edit")}</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => deleteReview(review)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />{t("delete")}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
