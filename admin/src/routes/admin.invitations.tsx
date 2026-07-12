import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Download, MoreHorizontal, Plus, Search, Trash2, Upload } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminApi } from "@/lib/api";
import { useAdminI18n } from "@/lib/i18n";
import { useInvitations, useOrders } from "@/hooks/useAdminData";

export const Route = createFileRoute("/admin/invitations")({ component: InvitationsPage });

const emptyInvitation = {
  orderId: "",
  names: "",
  eventType: "wedding",
  date: "",
  time: "18:00",
  location: "",
  language: "hy",
  message: "",
};

function InvitationsPage() {
  const { t } = useAdminI18n();
  const { data: invitations, isLoading, error } = useInvitations();
  const { data: orders } = useOrders();
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyInvitation);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(
    () =>
      invitations.filter((invitation: any) =>
        (q === "" ||
          invitation.title.toLowerCase().includes(q.toLowerCase()) ||
          invitation.customer.toLowerCase().includes(q.toLowerCase())) &&
        (status === "all" || invitation.status === status)
      ),
    [invitations, q, status],
  );

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin", "invitations"] });
    await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    await queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
  };

  const createInvitation = async () => {
    setSaving(true);
    try {
      await adminApi.createInvitation({
        ...form,
        date: form.date ? new Date(form.date) : undefined,
      });
      await refresh();
      toast.success(t("done"));
      setOpen(false);
      setForm(emptyInvitation);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    } finally {
      setSaving(false);
    }
  };

  const updateInvitation = async (invitation: any, isPublished: boolean) => {
    try {
      await adminApi.updateInvitation(invitation.id, { isPublished });
      await refresh();
      toast.success(t("done"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    }
  };

  const deleteInvitation = async (invitation: any) => {
    if (!confirm(`${t("delete")}: ${invitation.title}?`)) return;
    try {
      await adminApi.deleteInvitation(invitation.id);
      await refresh();
      toast.success(t("done"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    }
  };

  return (
    <div>
      <PageHeader
        title={t("invitations")}
        subtitle={error ? error.message : isLoading ? t("loading") : t("invitations")}
        actions={
          <>
            <Button variant="outline" className="rounded-full border-border/60"><Download className="h-4 w-4 mr-2" />{t("exportCsv")}</Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gold-gradient border-0 text-white rounded-full"><Plus className="h-4 w-4 mr-2" />{t("newInvitation")}</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle className="font-display text-2xl">{t("newInvitation")}</DialogTitle></DialogHeader>
                <InvitationForm form={form} setForm={setForm} orders={orders} />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>{t("cancel")}</Button>
                  <Button disabled={saving || (!form.orderId && (!form.names || !form.location || !form.date))} onClick={createInvitation} className="gold-gradient border-0 text-white">{t("save")}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <Card className="rounded-2xl border-border/60 shadow-[var(--shadow-soft)] overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-border/60 bg-secondary/30">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search invitations..." className="pl-9 bg-background" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40 bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="draft"><StatusBadge status="draft" /></SelectItem>
              <SelectItem value="published"><StatusBadge status="published" /></SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/20 hover:bg-secondary/20 border-border/60">
                <TableHead className="w-10"><Checkbox /></TableHead>
                <TableHead>ID</TableHead>
                <TableHead>{t("customers")}</TableHead>
                <TableHead>{t("title")}</TableHead>
                <TableHead>{t("category")}</TableHead>
                <TableHead>{t("templates")}</TableHead>
                <TableHead>{t("languages")}</TableHead>
                <TableHead>Event date</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((invitation: any) => (
                <TableRow key={invitation.id} className="border-border/60 hover:bg-secondary/30">
                  <TableCell><Checkbox /></TableCell>
                  <TableCell className="font-mono text-xs">{String(invitation.id).slice(-8).toUpperCase()}</TableCell>
                  <TableCell>{invitation.customer}</TableCell>
                  <TableCell className="font-medium">{invitation.title}</TableCell>
                  <TableCell>{invitation.category}</TableCell>
                  <TableCell>{invitation.template}</TableCell>
                  <TableCell><span className="text-xs px-2 py-0.5 rounded bg-secondary">{invitation.language}</span></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{format(new Date(invitation.eventDate), "MMM d, yyyy")}</TableCell>
                  <TableCell><StatusBadge status={invitation.status} /></TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => updateInvitation(invitation, invitation.status !== "published")}>
                          <Upload className="h-4 w-4 mr-2" />{invitation.status === "published" ? t("unpublish") : t("publish")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteInvitation(invitation)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />{t("delete")}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

function InvitationForm({ form, setForm, orders }: any) {
  const { t } = useAdminI18n();
  const set = (key: string, value: any) => setForm((current: any) => ({ ...current, [key]: value }));
  return (
    <div className="grid gap-4 sm:grid-cols-2 py-2">
      <div className="space-y-2 sm:col-span-2">
        <Label>{t("orders")}</Label>
        <Select value={form.orderId || "manual"} onValueChange={(value) => set("orderId", value === "manual" ? "" : value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="manual">Manual</SelectItem>
            {orders.map((order: any) => <SelectItem key={order.id} value={order.id}>{order.customer} - {order.invitation}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {!form.orderId && (
        <>
          <div className="space-y-2"><Label>{t("name")}</Label><Input value={form.names} onChange={(event) => set("names", event.target.value)} /></div>
          <div className="space-y-2"><Label>{t("category")}</Label><Input value={form.eventType} onChange={(event) => set("eventType", event.target.value)} /></div>
          <div className="space-y-2"><Label>Date</Label><Input type="date" value={form.date} onChange={(event) => set("date", event.target.value)} /></div>
          <div className="space-y-2"><Label>Time</Label><Input value={form.time} onChange={(event) => set("time", event.target.value)} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Location</Label><Input value={form.location} onChange={(event) => set("location", event.target.value)} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Message</Label><Textarea value={form.message} onChange={(event) => set("message", event.target.value)} /></div>
        </>
      )}
    </div>
  );
}
