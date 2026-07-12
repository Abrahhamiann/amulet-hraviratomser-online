import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Mail, MoreHorizontal, Search, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  const [form, setForm] = useState({ name: "", email: "", password: "Useramulet2026" });
  const [saving, setSaving] = useState(false);
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

  return (
    <div>
      <PageHeader
        title={t("customers")}
        subtitle={error ? error.message : isLoading ? t("loading") : t("customers")}
        actions={
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
                        <DropdownMenuItem onClick={() => window.location.href = `mailto:${customer.email}`}><Mail className="h-4 w-4 mr-2" />{t("sendEmail")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("viewProfile")}</DropdownMenuItem>
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
