import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, MessageCircleQuestion, Plus, Save, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/PageHeader";
import { adminApi } from "@/lib/api";
import { useAdminI18n } from "@/lib/i18n";
import { useFaq } from "@/hooks/useAdminData";

export const Route = createFileRoute("/admin/faq")({ component: FaqPage });

type FaqItem = {
  id: string;
  translations: Record<FaqLanguage, { question: string; answer: string }>;
  active: boolean;
};

const faqLanguages = ["hy", "en", "ru"] as const;
type FaqLanguage = (typeof faqLanguages)[number];
const faqLanguageLabels: Record<FaqLanguage, string> = {
  hy: "Հայերեն", en: "English", ru: "Русский",
};
const emptyTranslations = () => Object.fromEntries(
  faqLanguages.map((language) => [language, { question: "", answer: "" }]),
) as FaqItem["translations"];

const createFaqItem = (): FaqItem => ({
  id: `faq-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  translations: emptyTranslations(),
  active: true,
});

function FaqPage() {
  const { t } = useAdminI18n();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useFaq();
  const [items, setItems] = useState<FaqItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [contentLanguage, setContentLanguage] = useState<FaqLanguage>("hy");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    const nextItems = Array.isArray(data?.items) ? data.items.map((item: FaqItem) => ({
      ...item,
      translations: { ...emptyTranslations(), ...(item.translations || {}) },
    })) : [];
    setItems(nextItems.length ? nextItems : [createFaqItem()]);
  }, [data]);

  const updateItem = (id: string, patch: Partial<FaqItem>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const updateTranslation = (id: string, language: FaqLanguage, patch: Partial<{ question: string; answer: string }>) => {
    setItems((current) => current.map((item) => item.id === id ? {
      ...item,
      translations: {
        ...item.translations,
        [language]: { ...item.translations[language], ...patch },
      },
    } : item));
  };

  const addItem = () => {
    setItems((current) => [...current, createFaqItem()]);
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    setDeleteTargetId(null);
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    setItems((current) => {
      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const saveItems = async () => {
    for (const item of items) {
      for (const language of faqLanguages) {
        const question = item.translations[language].question.trim();
        const answer = item.translations[language].answer.trim();
        if (Boolean(question) !== Boolean(answer)) {
          setContentLanguage(language);
          toast.error(t("faqIncompleteTranslation"));
          return;
        }
      }
    }

    const cleanItems = items
      .map((item) => ({
        ...item,
        translations: Object.fromEntries(faqLanguages.map((language) => [language, {
          question: item.translations[language].question.trim(),
          answer: item.translations[language].answer.trim(),
        }])) as FaqItem["translations"],
      }))
      .filter((item) => Object.values(item.translations).some((translation) => translation.question && translation.answer));

    setSaving(true);
    try {
      const saved = await adminApi.updateFaq({ items: cleanItems });
      setItems(saved.items.length ? saved.items : [createFaqItem()]);
      await queryClient.invalidateQueries({ queryKey: ["admin", "faq"] });
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
        title="FAQ"
        subtitle={error ? error.message : isLoading ? t("loading") : t("questionsCount").replace("{count}", String(items.length))}
        actions={
          <>
            <Button variant="outline" className="rounded-full border-border/60" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              {t("addQuestion")}
            </Button>
            <Button className="rounded-full border-0 text-white gold-gradient" onClick={saveItems} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? t("saving") : t("save")}
            </Button>
          </>
        }
      />

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="FAQ content language">
        {faqLanguages.map((language) => (
          <Button
            key={language}
            type="button"
            role="tab"
            aria-selected={contentLanguage === language}
            variant={contentLanguage === language ? "default" : "outline"}
            className={contentLanguage === language ? "shrink-0 rounded-full text-white gold-gradient" : "shrink-0 rounded-full border-border/60"}
            onClick={() => setContentLanguage(language)}
          >
            {faqLanguageLabels[language]}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-3">
          {items.map((item, index) => (
            <Card key={item.id} className="rounded-2xl border-border/60 p-4 shadow-[var(--shadow-soft)]">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--cream)] text-[color:var(--gold)]">
                    <MessageCircleQuestion className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{t("questionNumber").replace("{number}", String(index + 1))}</div>
                    <div className="text-xs text-muted-foreground">{item.active ? t("visibleOnWebsite") : t("hiddenOnWebsite")}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full border-border/60"
                    disabled={index === 0}
                    onClick={() => moveItem(index, -1)}
                    aria-label={t("moveUp")}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full border-border/60"
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(index, 1)}
                    aria-label={t("moveDown")}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Switch checked={item.active} onCheckedChange={(active) => updateItem(item.id, { active })} />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full border-border/60 text-destructive"
                    onClick={() => setDeleteTargetId(item.id)}
                    aria-label={t("deleteQuestion")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">
                  {t("question")}
                  <Input
                    value={item.translations[contentLanguage].question}
                    onChange={(event) => updateTranslation(item.id, contentLanguage, { question: event.target.value })}
                    placeholder={t("questionPlaceholder")}
                    className="h-11 bg-background"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  {t("answer")}
                  <Textarea
                    value={item.translations[contentLanguage].answer}
                    onChange={(event) => updateTranslation(item.id, contentLanguage, { answer: event.target.value })}
                    placeholder={t("answerPlaceholder")}
                    className="min-h-[110px] resize-y bg-background"
                  />
                </label>
              </div>
            </Card>
          ))}
        </div>

        <Card className="h-max rounded-2xl border-border/60 p-4 shadow-[var(--shadow-soft)]">
          <div className="mb-3 font-display text-xl">{t("chatPreview")}</div>
          <div className="rounded-2xl border border-border/60 bg-secondary/30 p-3">
            <div className="mb-3 flex items-start gap-2">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[color:var(--gold)] text-white">
                <MessageCircleQuestion className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-bl-md bg-background px-3 py-2 text-sm shadow-sm">
                FAQ
              </div>
            </div>
            <div className="grid gap-2">
              {items.filter((item) => item.active && item.translations[contentLanguage].question && item.translations[contentLanguage].answer).slice(0, 4).map((item) => (
                <div key={item.id} className="rounded-full border border-border/60 bg-background px-3 py-2 text-sm font-medium">
                  {item.translations[contentLanguage].question}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <AlertDialog open={Boolean(deleteTargetId)} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent className="max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">{t("deleteFaqTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteFaqDescription")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTargetId && removeItem(deleteTargetId)}
            >
              <Trash2 className="h-4 w-4" />
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
