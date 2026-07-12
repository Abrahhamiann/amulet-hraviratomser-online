import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CheckCircle2, Clock, Download, ExternalLink, Eye, MoreHorizontal, Search, ShoppingBag, Trash2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminApi, currency } from "@/lib/api";
import { useAdminI18n } from "@/lib/i18n";
import { useOrders } from "@/hooks/useAdminData";

export const Route = createFileRoute("/admin/orders")({ component: OrdersPage });

function OrdersPage() {
  const { t } = useAdminI18n();
  const { data: orders, isLoading, error } = useOrders();
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [payment, setPayment] = useState("all");
  const [status, setStatus] = useState("all");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filtered = useMemo(
    () =>
      orders.filter((order: any) =>
        (q === "" ||
          String(order.id).toLowerCase().includes(q.toLowerCase()) ||
          String(order.customer).toLowerCase().includes(q.toLowerCase()) ||
          String(order.email).toLowerCase().includes(q.toLowerCase())) &&
        (payment === "all" || order.payment === payment) &&
        (status === "all" || order.status === status)
      ),
    [orders, q, payment, status],
  );

  const updateStatus = async (order: any, nextStatus: string) => {
    try {
      await adminApi.updateOrderStatus(order.id, nextStatus);
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success(t("done"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    }
  };

  const deleteOrder = async (order: any) => {
    if (!confirm(`Իրո՞ք ցանկանում եք ջնջել այս պատվերը: ${order.invitation || order.customer}`)) return;
    try {
      await adminApi.deleteOrder(order.id);
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
      if (selectedOrder?.id === order.id) setDetailsOpen(false);
      toast.success(t("done"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    }
  };

  const deleteAllOrders = async () => {
    if (!orders.length) return;
    if (!confirm("Իրո՞ք ցանկանում եք ջնջել բոլոր պատվերները։ Այս գործողությունը հնարավոր չէ հետ վերադարձնել։")) return;
    try {
      const result = await adminApi.deleteAllOrders();
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
      setDetailsOpen(false);
      toast.success(`${t("done")}: ${result.deleted ?? 0}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failed"));
    }
  };

  const exportCsv = () => {
    const rows = [["id", "customer", "email", "amount", "payment", "status", "date"], ...filtered.map((order: any) => [order.id, order.customer, order.email, order.amount, order.payment, order.status, order.date])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const openDetails = (order: any) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  return (
    <div>
      <PageHeader
        title={t("orders")}
        subtitle={error ? error.message : isLoading ? t("loading") : t("orders")}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button onClick={deleteAllOrders} disabled={!orders.length} variant="outline" className="rounded-full border-destructive/30 text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4 mr-2" />Ջնջել բոլորը
            </Button>
            <Button onClick={exportCsv} variant="outline" className="rounded-full border-border/60"><Download className="h-4 w-4 mr-2" />{t("exportCsv")}</Button>
          </div>
        }
      />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={t("totalOrders")} value={orders.length} icon={<ShoppingBag className="h-5 w-5" />} />
        <StatCard label="Completed" value={orders.filter((order: any) => order.status === "completed").length} tone="success" icon={<CheckCircle2 className="h-5 w-5" />} />
        <StatCard label="In progress" value={orders.filter((order: any) => order.status === "in_progress").length} tone="warning" icon={<Clock className="h-5 w-5" />} />
        <StatCard label="Cancelled" value={orders.filter((order: any) => order.status === "cancelled").length} tone="destructive" icon={<XCircle className="h-5 w-5" />} />
      </div>

      <Card className="rounded-2xl border-border/60 shadow-[var(--shadow-soft)] overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-border/60 bg-secondary/30">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search orders..." className="pl-9 bg-background" />
          </div>
          <Select value={payment} onValueChange={setPayment}>
            <SelectTrigger className="w-40 bg-background"><SelectValue placeholder="Payment" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payments</SelectItem>
              {["paid", "pending", "failed"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40 bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {["new", "in_progress", "completed", "cancelled"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/20 hover:bg-secondary/20 border-border/60">
                <TableHead className="w-10"><Checkbox /></TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Invitation</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order: any) => (
                <TableRow key={order.id} className="border-border/60 hover:bg-secondary/30">
                  <TableCell><Checkbox /></TableCell>
                  <TableCell className="font-mono text-xs">{String(order.id).slice(-8).toUpperCase()}</TableCell>
                  <TableCell>
                    <div className="font-medium">{order.customer}</div>
                    <div className="text-xs text-muted-foreground">{order.email}</div>
                  </TableCell>
                  <TableCell>{order.invitation}</TableCell>
                  <TableCell className="font-medium">{currency(order.amount)}</TableCell>
                  <TableCell><StatusBadge status={order.payment} /></TableCell>
                  <TableCell><StatusBadge status={order.status} /></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{format(new Date(order.date), "MMM d")}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openDetails(order)}><Eye className="h-4 w-4 mr-2" />{t("viewDetails")}</DropdownMenuItem>
                        {["new", "in_progress", "completed", "cancelled"].map((item) => (
                          <DropdownMenuItem key={item} onClick={() => updateStatus(order, item)}>
                            {t("updateStatus")}: <StatusBadge status={item} />
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem onClick={() => deleteOrder(order)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />{t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[calc(100dvh-72px)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{t("viewDetails")}</DialogTitle>
          </DialogHeader>
          {selectedOrder ? (
            <div className="grid gap-5">
              <div className="rounded-2xl border border-border/60 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-xs text-muted-foreground">{String(selectedOrder.id).toUpperCase()}</div>
                    <h3 className="mt-1 text-lg font-semibold">{selectedOrder.invitation || "-"}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusBadge status={selectedOrder.payment} />
                      <StatusBadge status={selectedOrder.status} />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">{t("amount")}</div>
                    <div className="font-semibold">{currency(selectedOrder.amount)}</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Detail label={t("customer")} value={selectedOrder.customer} />
                <Detail label={t("email")} value={selectedOrder.email} />
                <Detail label={t("phone")} value={selectedOrder.phone || "-"} />
                <Detail label="Template" value={selectedOrder.template || "-"} />
                <Detail label="Event type" value={selectedOrder.eventType || "-"} />
                <Detail label="Language" value={selectedOrder.preferredLanguage || "-"} />
                <Detail label={t("date")} value={selectedOrder.eventDate ? format(new Date(selectedOrder.eventDate), "PPP") : "-"} />
                <Detail label={t("time")} value={selectedOrder.eventTime || "-"} />
                <Detail label={t("location")} value={selectedOrder.eventLocation || "-"} />
                <Detail label="Created" value={selectedOrder.date ? format(new Date(selectedOrder.date), "PPPp") : "-"} />
              </div>

              {selectedOrder.mapLink ? (
                <a
                  href={selectedOrder.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center rounded-full border border-border/70 px-4 py-2 text-sm hover:bg-secondary/50"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />Open map link
                </a>
              ) : null}

              <div className="grid gap-4">
                <LongDetail label={t("message")} value={selectedOrder.eventMessage || "-"} />
                <LongDetail label="Notes" value={selectedOrder.notes || "-"} />
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl border border-border/60 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 break-words font-medium">{value}</div>
    </div>
  );
}

function LongDetail({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl border border-border/60 p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">{value}</p>
    </div>
  );
}
