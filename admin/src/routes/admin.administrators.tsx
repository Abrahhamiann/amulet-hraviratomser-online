import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminApi } from "@/lib/api";
import { useAdminI18n } from "@/lib/i18n";
import { useAdministrators } from "@/hooks/useAdminData";

export const Route = createFileRoute("/admin/administrators")({ component: AdminsPage });

const permissions = ["View", "Create", "Edit", "Delete", "Publish", "Manage payments", "Manage admins"];
const roles = [
  { value: "super_admin", label: "Super Administrator" },
  { value: "admin", label: "Administrator" },
  { value: "content_manager", label: "Content Manager" },
  { value: "order_manager", label: "Order Manager" },
  { value: "support_manager", label: "Support Manager" },
];

const roleLabel = (role: string) => roles.find((item) => item.value === role)?.label || role;

const hasPermission = (role: string, permission: string) => {
  if (role === "super_admin") return true;
  if (role === "admin") return permission !== "Manage admins";
  return false;
};

function AdminsPage() {
  const { t } = useAdminI18n();
  const { data: admins, isLoading, error } = useAdministrators();
  const { data: me } = useQuery({ queryKey: ["admin", "me"], queryFn: adminApi.me, retry: false });
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin" });
  const [roleForm, setRoleForm] = useState("admin");
  const [saving, setSaving] = useState(false);
  const canManageAdmins = me?.role === "super_admin";

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "administrators"] });

  const createAdmin = async () => {
    if (!canManageAdmins) return toast.error("Super administrator access required");
    setSaving(true);
    try {
      await adminApi.createUser(form);
      await refresh();
      toast.success(t("done"));
      setOpen(false);
      setForm({ name: "", email: "", password: "", role: "admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    } finally {
      setSaving(false);
    }
  };

  const deleteAdmin = async (admin: any) => {
    if (!canManageAdmins) return toast.error("Super administrator access required");
    if (!confirm(`${t("delete")}: ${admin.email}?`)) return;
    try {
      await adminApi.deleteUser(admin.id);
      await refresh();
      toast.success(t("done"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    }
  };

  const openRoleEditor = (admin: any) => {
    setEditingAdmin(admin);
    setRoleForm(admin.role);
    setEditOpen(true);
  };

  const updateRole = async () => {
    if (!canManageAdmins || !editingAdmin) return toast.error("Super administrator access required");
    setSaving(true);
    try {
      await adminApi.updateUserRole(editingAdmin.id, roleForm);
      await refresh();
      toast.success(t("done"));
      setEditOpen(false);
      setEditingAdmin(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    } finally {
      setSaving(false);
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
              <Button disabled={!canManageAdmins} className="gold-gradient border-0 text-white rounded-full"><Plus className="h-4 w-4 mr-2" />{t("inviteAdmin")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display text-2xl">{t("inviteAdmin")}</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="space-y-2"><Label>{t("name")}</Label><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
                <div className="space-y-2"><Label>{t("email")}</Label><Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div>
                <div className="space-y-2"><Label>{t("password")}</Label><Input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></div>
                <div className="space-y-2">
                  <Label>{t("role")}</Label>
                  <Select value={form.role} onValueChange={(role) => setForm({ ...form, role })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {roles.slice(0, 2).map((role) => <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>{t("cancel")}</Button>
                <Button disabled={saving || !canManageAdmins || !form.name || !form.email || !form.password} onClick={createAdmin} className="gold-gradient border-0 text-white">{t("save")}</Button>
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
                      <Shield className="h-3 w-3" /> {roleLabel(admin.role)}
                    </span>
                  </TableCell>
                  <TableCell><StatusBadge status={admin.status} /></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{format(new Date(admin.lastActive), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" disabled={!canManageAdmins} onClick={() => openRoleEditor(admin)}><Edit className="h-4 w-4" /></Button>
                    <Button disabled={!canManageAdmins} onClick={() => deleteAdmin(admin)} variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{t("edit")} {t("role")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="rounded-2xl border border-border/60 p-4">
              <div className="font-medium">{editingAdmin?.name}</div>
              <div className="text-sm text-muted-foreground">{editingAdmin?.email}</div>
            </div>
            <div className="space-y-2">
              <Label>{t("role")}</Label>
              <Select value={roleForm} onValueChange={setRoleForm}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {roles.slice(0, 2).map((role) => <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>{t("cancel")}</Button>
            <Button disabled={saving || !canManageAdmins} onClick={updateRole} className="gold-gradient border-0 text-white">{t("save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="p-6 rounded-2xl border-border/60 shadow-[var(--shadow-soft)]">
        <h3 className="font-display text-xl">Roles & permissions</h3>
        <p className="text-xs text-muted-foreground mt-1 mb-4">{t("readOnly")}</p>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/60">
                <TableHead>Permission</TableHead>
                {roles.map((role) => <TableHead key={role.value} className="text-center text-xs">{role.label}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission} className="border-border/60">
                  <TableCell className="font-medium">{permission}</TableCell>
                  {roles.map((role) => (
                    <TableCell key={role.value} className="text-center">
                      <Checkbox disabled checked={hasPermission(role.value, permission)} />
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
