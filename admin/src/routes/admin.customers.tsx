import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Copy, Eye, Mail, Megaphone, MoreHorizontal, Search, Send, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminApi, currency } from "@/lib/api";
import { useAdminI18n } from "@/lib/i18n";
import { useCustomers } from "@/hooks/useAdminData";

export const Route = createFileRoute("/admin/customers")({ component: CustomersPage });

function CustomersPage() {
  const { t } = useAdminI18n();
  const { data: customers, isLoading, error } = useCustomers();
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [emailTarget, setEmailTarget] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "Useramulet2026" });
  const [emailForm, setEmailForm] = useState({ subject: "", message: "" });
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const filtered = useMemo(
    () => customers.filter((customer: any) => q === "" || customer.name.toLowerCase().includes(q.toLowerCase()) || customer.email.includes(q)),
    [customers, q],
  );

  const createCustomer = async () => {
    setSaving(true);
    try {
      await adminApi.createUser({ ...form, role: "user" });
      await queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
      toast.success(t("done"));
      setOpen(false);
      setForm({ name: "", email: "", password: "Useramulet2026" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    } finally {
      setSaving(false);
    }
  };

  const openProfile = async (customer: any) => {
    setProfileOpen(true);
    setProfile(null);
    try {
      const data = await adminApi.customer(customer.id);
      setProfile(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
      setProfileOpen(false);
    }
  };

  const openEmail = (customer: any) => {
    setEmailTarget(customer);
    setEmailForm({ subject: "", message: "" });
    setEmailOpen(true);
  };

  const sendEmail = async (broadcast = false) => {
    setSending(true);
    try {
      if (broadcast) {
        const result = await adminApi.broadcastEmail(emailForm);
        toast.success(`${t("done")}: ${result.sent}`);
        setBroadcastOpen(false);
      } else if (emailTarget) {
        await adminApi.sendCustomerEmail(emailTarget.id, emailForm);
        toast.success(t("done"));
        setEmailOpen(false);
      }
      setEmailForm({ subject: "", message: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    } finally {
      setSending(false);
    }
  };

  const copyValue = async (value?: string) => {
    if (!value) return;
    await navigator.clipboard?.writeText(value);
    toast.success(t("done"));
  };

  return (
    <div>
      <PageHeader
        title={t("customers")}
        subtitle={error ? error.message : isLoading ? t("loading") : t("customers")}
        actions={
          <div className="flex flex-wrap gap-2">
            <Dialog open={broadcastOpen} onOpenChange={setBroadcastOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full border-border/70"><Megaphone className="h-4 w-4 mr-2" />Broadcast</Button>
              </DialogTrigger>
              <EmailDialogContent
                title="Broadcast email"
                form={emailForm}
                setForm={setEmailForm}
                sending={sending}
                onCancel={() => setBroadcastOpen(false)}
                onSend={() => sendEmail(true)}
              />
            </Dialog>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gold-gradient border-0 text-white rounded-full"><UserPlus className="h-4 w-4 mr-2" />{t("addCustomer")}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle className="font-display text-2xl">{t("addCustomer")}</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="space-y-2"><Label>{t("name")}</Label><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
                  <div className="space-y-2"><Label>{t("email")}</Label><Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div>
                  <div className="space-y-2"><Label>{t("password")}</Label><Input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>{t("cancel")}</Button>
                  <Button disabled={saving || !form.name || !form.email || !form.password} onClick={createCustomer} className="gold-gradient border-0 text-white">{t("save")}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <Card className="rounded-2xl border-border/60 shadow-[var(--shadow-soft)] overflow-hidden">
        <div className="p-4 border-b border-border/60 bg-secondary/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search by name or email..." className="pl-9 bg-background" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/20 hover:bg-secondary/20 border-border/60">
                <TableHead>Customer</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((customer: any) => (
                <TableRow key={customer.id} className="border-border/60 hover:bg-secondary/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="gold-gradient text-white text-xs">
                          {customer.name.split(" ").map((part: string) => part[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{customer.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ProviderBadge provider={customer.provider} />
                  </TableCell>
                  <TableCell className="text-sm">{customer.phone || "-"}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{format(new Date(customer.joined), "MMM d, yyyy")}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell className="font-medium">{currency(customer.spent)}</TableCell>
                  <TableCell><StatusBadge status={customer.status} /></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{format(new Date(customer.lastActive), "MMM d, HH:mm")}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEmail(customer)}><Mail className="h-4 w-4 mr-2" />{t("sendEmail")}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openProfile(customer)}><Eye className="h-4 w-4 mr-2" />{t("viewProfile")}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <EmailDialogContent
          title={`${t("sendEmail")}: ${emailTarget?.name || ""}`}
          form={emailForm}
          setForm={setEmailForm}
          sending={sending}
          onCancel={() => setEmailOpen(false)}
          onSend={() => sendEmail(false)}
        />
      </Dialog>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-4xl max-h-[calc(100dvh-72px)] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display text-2xl">{t("viewProfile")}</DialogTitle></DialogHeader>
          {!profile ? (
            <div className="py-8 text-center text-muted-foreground">{t("loading")}</div>
          ) : (
            <div className="grid gap-5">
              <div className="grid gap-3 rounded-2xl border border-border/60 p-4 sm:grid-cols-2">
                <Info label={t("name")} value={profile.name} />
                <Info label={t("email")} value={profile.email} />
                <div>
                  <div className="text-xs text-muted-foreground">Provider</div>
                  <div className="mt-1"><ProviderBadge provider={profile.provider} /></div>
                </div>
                <Info label={t("phone")} value={profile.phone || "-"} />
                <Info label={t("spent")} value={currency(profile.spent)} />
                <Info label={t("joined")} value={format(new Date(profile.joined), "PPP")} />
                <Info label={t("status")} value={profile.isEmailVerified ? "Verified" : "Pending"} />
                <Info label="Role" value={profile.role || "user"} />
              </div>
              <div>
                <h3 className="font-display text-xl mb-3">{t("invitations")}</h3>
                {profile.invitations?.length ? (
                  <div className="grid max-h-64 gap-2 overflow-y-auto pr-1">
                    {profile.invitations.map((invitation: any) => (
                      <div key={invitation.id} className="rounded-xl border border-border/60 p-3 text-sm">
                        <div className="font-medium">{invitation.title || invitation.names || invitation.slug}</div>
                        <div className="text-muted-foreground">{invitation.eventType || "-"} / {invitation.slug || "-"}</div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground">No invitations</p>}
              </div>
              <div>
                <h3 className="font-display text-xl mb-3">{t("orders")}</h3>
                {profile.orders.length ? (
                  <div className="grid max-h-80 gap-2 overflow-y-auto pr-1">
                    {profile.orders.map((order: any) => (
                      <div key={order.id} className="rounded-xl border border-border/60 p-3 text-sm">
                        <div className="font-medium">{order.invitation}</div>
                        <div className="text-muted-foreground">{order.eventType} · {format(new Date(order.eventDate), "PPP")} · {order.eventLocation}</div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground">No orders</p>}
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="outline" onClick={() => copyValue(profile.email)} className="rounded-full">
                  <Copy className="h-4 w-4 mr-2" />Copy email
                </Button>
                {profile.phone ? (
                  <Button variant="outline" onClick={() => copyValue(profile.phone)} className="rounded-full">
                    <Copy className="h-4 w-4 mr-2" />Copy phone
                  </Button>
                ) : null}
                <Button onClick={() => openEmail(profile)} className="gold-gradient border-0 text-white rounded-full"><Mail className="h-4 w-4 mr-2" />{t("sendEmail")}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium break-words">{value}</div>
    </div>
  );
}

function ProviderBadge({ provider }: { provider?: string }) {
  const isGoogle = provider === "google";
  return (
    <Badge variant="outline" className={isGoogle ? "border-[color:var(--gold)] text-[color:var(--gold)] bg-[color:var(--gold-soft)]" : "border-border/70 text-muted-foreground"}>
      {isGoogle ? "Google" : "Email"}
    </Badge>
  );
}

function EmailDialogContent({ title, form, setForm, sending, onCancel, onSend }: any) {
  const { t } = useAdminI18n();
  return (
    <DialogContent>
      <DialogHeader><DialogTitle className="font-display text-2xl">{title}</DialogTitle></DialogHeader>
      <div className="grid gap-4 py-2">
        <div className="space-y-2"><Label>{t("title")}</Label><Input value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} /></div>
        <div className="space-y-2"><Label>{t("message")}</Label><Textarea rows={6} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>{t("cancel")}</Button>
        <Button disabled={sending || !form.subject || !form.message} onClick={onSend} className="gold-gradient border-0 text-white"><Send className="h-4 w-4 mr-2" />{t("sendEmail")}</Button>
      </DialogFooter>
    </DialogContent>
  );
}
