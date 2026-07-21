import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MessageCircleQuestion, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/PageHeader";
import { adminApi } from "@/lib/api";
import { useFaq } from "@/hooks/useAdminData";

export const Route = createFileRoute("/admin/faq")({ component: FaqPage });

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  active: boolean;
};

const createFaqItem = (): FaqItem => ({
  id: `faq-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  question: "",
  answer: "",
  active: true,
});

function FaqPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useFaq();
  const [items, setItems] = useState<FaqItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const nextItems = Array.isArray(data?.items) ? data.items : [];
    setItems(nextItems.length ? nextItems : [createFaqItem()]);
  }, [data]);

  const updateItem = (id: string, patch: Partial<FaqItem>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const addItem = () => {
    setItems((current) => [...current, createFaqItem()]);
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const saveItems = async () => {
    const cleanItems = items
      .map((item) => ({
        ...item,
        question: item.question.trim(),
        answer: item.answer.trim(),
      }))
      .filter((item) => item.question && item.answer);

    setSaving(true);
    try {
      const saved = await adminApi.updateFaq({ items: cleanItems });
      setItems(saved.items.length ? saved.items : [createFaqItem()]);
      await queryClient.invalidateQueries({ queryKey: ["admin", "faq"] });
      toast.success("FAQ saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="FAQ chatbot"
        subtitle={error ? error.message : isLoading ? "Loading..." : `${items.filter((item) => item.question && item.answer).length} questions`}
        actions={
          <>
            <Button variant="outline" className="rounded-full border-border/60" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add question
            </Button>
            <Button className="rounded-full border-0 text-white gold-gradient" onClick={saveItems} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </>
        }
      />

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
                    <div className="font-medium">Question {index + 1}</div>
                    <div className="text-xs text-muted-foreground">{item.active ? "Visible in chat" : "Hidden from chat"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={item.active} onCheckedChange={(active) => updateItem(item.id, { active })} />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full border-border/60 text-destructive"
                    onClick={() => removeItem(item.id)}
                    aria-label="Delete question"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">
                  Question
                  <Input
                    value={item.question}
                    onChange={(event) => updateItem(item.id, { question: event.target.value })}
                    placeholder="What is included in the price?"
                    className="h-11 bg-background"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Answer
                  <Textarea
                    value={item.answer}
                    onChange={(event) => updateItem(item.id, { answer: event.target.value })}
                    placeholder="Write the bot answer..."
                    className="min-h-[110px] resize-y bg-background"
                  />
                </label>
              </div>
            </Card>
          ))}
        </div>

        <Card className="h-max rounded-2xl border-border/60 p-4 shadow-[var(--shadow-soft)]">
          <div className="mb-3 font-display text-xl">Chat preview</div>
          <div className="rounded-2xl border border-border/60 bg-secondary/30 p-3">
            <div className="mb-3 flex items-start gap-2">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[color:var(--gold)] text-white">
                <MessageCircleQuestion className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-bl-md bg-background px-3 py-2 text-sm shadow-sm">
                FAQ chatbot
              </div>
            </div>
            <div className="grid gap-2">
              {items.filter((item) => item.active && item.question && item.answer).slice(0, 4).map((item) => (
                <div key={item.id} className="rounded-full border border-border/60 bg-background px-3 py-2 text-sm font-medium">
                  {item.question}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
