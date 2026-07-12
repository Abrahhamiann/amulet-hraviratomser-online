import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Inbox, Search, Send, Trash2 } from "lucide-react";
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
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selected && messages.length) setSelected(messages[0]);
  }, [messages, selected]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ block: "end" });
  }, [selected?.id, selected?.replies?.length]);

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

  const sendReply = async () => {
    if (!selected || !reply.trim()) return;
    const outgoing = {
      subject: `Re: ${selected.subject}`,
      message: reply.trim(),
      sentAt: new Date().toISOString(),
    };
    setSending(true);
    try {
      await adminApi.replyMessage(selected.id, outgoing);
      await queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      setSelected((current: any) =>
        current?.id === selected.id
          ? { ...current, replies: [...(current.replies || []), outgoing], read: true, repliedAt: outgoing.sentAt }
          : current,
      );
      toast.success(t("done"));
      setReply("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={t("messages")}
        subtitle={error ? error.message : isLoading ? t("loading") : `${messages.filter((message: any) => !message.read).length}`}
      />
      <Card className="rounded-2xl border-border/60 shadow-[var(--shadow-soft)] overflow-hidden grid grid-cols-1 lg:grid-cols-[300px_1fr] h-[calc(100dvh-170px)] min-h-[560px]">
        <div className="border-r border-border/60 flex min-h-0 flex-col">
          <div className="p-3 border-b border-border/60 bg-secondary/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-9 h-9 bg-background" />
            </div>
          </div>
          <div className="min-h-0 overflow-y-auto divide-y">
            {messages.map((message: any) => (
              <button
                key={message.id}
                onClick={() => {
                  setSelected(message);
                  setReply("");
                }}
                className={cn(
                  "w-full text-left p-3 hover:bg-secondary/40 transition flex gap-2.5 items-start",
                  selected?.id === message.id && "bg-secondary/60",
                  !message.read && "border-l-2 border-l-[color:var(--gold)]",
                )}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-secondary text-xs">{message.name.split(" ").map((part: string) => part[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className={cn("truncate text-sm", !message.read && "font-semibold")}>{message.name}</div>
                    <div className="text-[10px] text-muted-foreground shrink-0">{format(new Date(message.date), "MMM d")}</div>
                  </div>
                  <div className="text-xs truncate mt-0.5">{message.subject}</div>
                  <div className="text-[11px] text-muted-foreground truncate mt-1">{message.message}</div>
                  <div className="mt-1.5"><StatusBadge status={message.priority} /></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex h-full min-h-0 flex-col">
          {selected ? (
            <>
              <div className="shrink-0 p-4 border-b border-border/60 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display text-xl truncate">{selected.subject}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    From <span className="text-foreground font-medium">{selected.name}</span> · {selected.email} · {selected.phone}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => deleteMessage(selected)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />{t("delete")}</Button>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-background to-secondary/20 p-4">
                <div className="space-y-4">
                  <div className="flex items-end gap-2">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-secondary text-xs">{selected.name.split(" ").map((part: string) => part[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="max-w-[78%] rounded-2xl rounded-bl-md border border-border/60 bg-background px-4 py-3 shadow-sm">
                      <div className="text-xs text-muted-foreground mb-1">{format(new Date(selected.date), "PPPp")}</div>
                      <p className="leading-relaxed text-sm whitespace-pre-wrap">{selected.message}</p>
                    </div>
                  </div>

                  {selected.replies?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-end">
                      <div className="max-w-[78%] rounded-2xl rounded-br-md bg-[color:var(--gold)] px-4 py-3 text-white shadow-[var(--shadow-gold)]">
                        <div className="text-xs text-white/75 mb-1">{format(new Date(item.sentAt), "PPPp")}</div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{item.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </div>
              <div className="shrink-0 p-3 border-t border-border/60 bg-secondary/30">
                <div className="flex items-end gap-2">
                  <Textarea
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        sendReply();
                      }
                    }}
                    placeholder="Type your reply..."
                    className="min-h-[44px] resize-none bg-background"
                    rows={2}
                  />
                  <Button
                    aria-label={t("sendReply")}
                    disabled={sending || !reply.trim()}
                    onClick={sendReply}
                    className="h-11 w-11 shrink-0 rounded-full border-0 p-0 text-white gold-gradient"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
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
