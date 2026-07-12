import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Archive, Inbox, Reply, Search, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminApi } from "@/lib/api";
import { useAdminI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useMessages } from "@/hooks/useAdminData";

export const Route = createFileRoute("/admin/messages")({ component: MessagesPage });

function MessagesPage() {
  const { t } = useAdminI18n();
  const { data: messages, isLoading, error } = useMessages();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    if (!selected && messages.length) setSelected(messages[0]);
  }, [messages, selected]);

  const deleteMessage = async (message: any) => {
    if (!confirm(`${t("deleteMessage")}: ${message.name}?`)) return;
    try {
      await adminApi.deleteMessage(message.id);
      await queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      setSelected(null);
      toast.success(t("done"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    }
  };

  return (
    <div>
      <PageHeader
        title={t("messages")}
        subtitle={error ? error.message : isLoading ? t("loading") : `${messages.filter((message: any) => !message.read).length}`}
      />
      <Card className="rounded-2xl border-border/60 shadow-[var(--shadow-soft)] overflow-hidden grid grid-cols-1 lg:grid-cols-[380px_1fr] min-h-[70vh]">
        <div className="border-r border-border/60 flex flex-col">
          <div className="p-4 border-b border-border/60 bg-secondary/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-9 bg-background" />
            </div>
          </div>
          <div className="overflow-y-auto divide-y">
            {messages.map((message: any) => (
              <button
                key={message.id}
                onClick={() => setSelected(message)}
                className={cn(
                  "w-full text-left p-4 hover:bg-secondary/40 transition flex gap-3 items-start",
                  selected?.id === message.id && "bg-secondary/60",
                  !message.read && "border-l-2 border-l-[color:var(--gold)]",
                )}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-secondary text-xs">{message.name.split(" ").map((part: string) => part[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className={cn("truncate text-sm", !message.read && "font-semibold")}>{message.name}</div>
                    <div className="text-[10px] text-muted-foreground shrink-0">{format(new Date(message.date), "MMM d")}</div>
                  </div>
                  <div className="text-xs truncate mt-0.5">{message.subject}</div>
                  <div className="text-xs text-muted-foreground truncate mt-1">{message.message}</div>
                  <div className="mt-2"><StatusBadge status={message.priority} /></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          {selected ? (
            <>
              <div className="p-6 border-b border-border/60 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display text-2xl truncate">{selected.subject}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    From <span className="text-foreground font-medium">{selected.name}</span> · {selected.email} · {selected.phone}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.location.href = `mailto:${selected.email}?subject=Re: ${selected.subject}`}><Archive className="h-4 w-4 mr-2" />{t("sendReply")}</Button>
                  <Button variant="outline" size="sm" onClick={() => deleteMessage(selected)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />{t("delete")}</Button>
                </div>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="text-xs text-muted-foreground mb-4">{format(new Date(selected.date), "PPPp")}</div>
                <p className="leading-relaxed text-sm">{selected.message}</p>
              </div>
              <div className="p-4 border-t border-border/60 bg-secondary/30">
                <Textarea placeholder="Type your reply..." className="bg-background" rows={3} />
                <div className="flex justify-end mt-3">
                  <Button onClick={() => window.location.href = `mailto:${selected.email}?subject=Re: ${selected.subject}`} className="gold-gradient border-0 text-white rounded-full"><Reply className="h-4 w-4 mr-2" />{t("sendReply")}</Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 grid place-items-center text-muted-foreground">
              <div className="text-center">
                <Inbox className="h-10 w-10 mx-auto mb-2" />
                <div>Select a message to view</div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
