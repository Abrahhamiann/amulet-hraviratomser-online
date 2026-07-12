import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { Edit, Plus, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminApi } from "@/lib/api";
import { useAdminI18n } from "@/lib/i18n";
import { useAdministrators } from "@/hooks/useAdminData";

export const Route = createFileRoute("/admin/administrators")({ component: AdminsPage });

const permissions = ["View", "Create", "Edit", "Delete", "Publish", "Manage payments", "Manage admins"];
const roles = ["Super Admin", "Admin", "Content Manager", "Order Manager", "Support Manager"];

function AdminsPage() {
  const { t } = useAdminI18n();
  const { data: admins, isLoading, error } = useAdministrators();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "administrators"] });

  const createAdmin = async () => {
    setSaving(true);
    try {
      await adminApi.createUser({ ...form, role: "admin" });
      await refresh();
      toast.success(t("done"));
      setOpen(false);
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    } finally {
      setSaving(false);
    }
  };

  const deleteAdmin = async (admin: any) => {
    if (!confirm(`${t("delete")}: ${admin.email}?`)) return;
    try {
      await adminApi.deleteUser(admin.id);
      await refresh();
      toast.success(t("done"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("administrators")}
        subtitle={error ? error.message : isLoading ? t("loading") : t("administrators")}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gold-gradient border-0 text-white rounded-full"><Plus className="h-4 w-4 mr-2" />{t("inviteAdmin")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display text-2xl">{t("inviteAdmin")}</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="space-y-2"><Label>{t("name")}</Label><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
                <div className="space-y-2"><Label>{t("email")}</Label><Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div>
                <div className="space-y-2"><Label>{t("password")}</Label><Input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>{t("cancel")}</Button>
                <Button disabled={saving || !form.name || !form.email || !form.password} onClick={createAdmin} className="gold-gradient border-0 text-white">{t("save")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="rounded-2xl border-border/60 shadow-[var(--shadow-soft)] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/20 hover:bg-secondary/20 border-border/60">
                <TableHead>{t("administrators")}</TableHead>
                <TableHead>{t("role")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin: any) => (
                <TableRow key={admin.id} className="border-border/60 hover:bg-secondary/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="gold-gradient text-white text-xs">{admin.name.split(" ").map((part: string) => part[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{admin.name}</div>
                        <div className="text-xs text-muted-foreground">{admin.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[color:var(--cream)] text-[color:var(--gold)] font-medium">
                      <Shield className="h-3 w-3" /> {admin.role}
                    </span>
                  </TableCell>
                  <TableCell><StatusBadge status={admin.status} /></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{format(new Date(admin.lastActive), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" disabled><Edit className="h-4 w-4" /></Button>
                    <Button onClick={() => deleteAdmin(admin)} variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card className="p-6 rounded-2xl border-border/60 shadow-[var(--shadow-soft)]">
        <h3 className="font-display text-xl">Roles & permissions</h3>
        <p className="text-xs text-muted-foreground mt-1 mb-4">{t("readOnly")}</p>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/60">
                <TableHead>Permission</TableHead>
                {roles.map((role) => <TableHead key={role} className="text-center text-xs">{role}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission} className="border-border/60">
                  <TableCell className="font-medium">{permission}</TableCell>
                  {roles.map((role, index) => (
                    <TableCell key={role} className="text-center">
                      <Checkbox disabled defaultChecked={index === 0 || (index === 1 && permission !== "Manage admins")} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
