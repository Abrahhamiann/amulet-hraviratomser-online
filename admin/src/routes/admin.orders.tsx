import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CircleDollarSign, Download, ExternalLink, Eye, MoreHorizontal, Search, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminApi, currency } from "@/lib/api";
import { formatAdminDate, useAdminI18n } from "@/lib/i18n";
import { useOrders } from "@/hooks/useAdminData";

export const Route = createFileRoute("/admin/orders")({ component: OrdersPage });

function OrdersPage() {
  const { lang, t } = useAdminI18n();
  const { data: orders, isLoading, error } = useOrders();
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [payment, setPayment] = useState("all");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filtered = useMemo(
    () =>
      orders.filter((order: any) =>
        (q === "" ||
          String(order.id).toLowerCase().includes(q.toLowerCase()) ||
          String(order.customer).toLowerCase().includes(q.toLowerCase()) ||
          String(order.email).toLowerCase().includes(q.toLowerCase())) &&
        (payment === "all" || order.payment === payment)
      ),
    [orders, q, payment],
  );

  const deleteOrder = async (order: any) => {
    if (!confirm(`${t("confirmDeleteOrder")} ${order.invitation || order.customer}`)) return;
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
    if (!confirm(t("confirmDeleteAllOrders"))) return;
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
    const rows = [["id", "customer", "email", "amount", "payment", "date"], ...filtered.map((order: any) => [order.id, order.customer, order.email, order.amount, order.payment, order.date])];
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
              <Trash2 className="h-4 w-4 mr-2" />{t("deleteAll")}
            </Button>
            <Button onClick={exportCsv} variant="outline" className="rounded-full border-border/60"><Download className="h-4 w-4 mr-2" />{t("exportCsv")}</Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={t("totalOrders")} value={orders.length} icon={<ShoppingBag className="h-5 w-5" />} />
        <StatCard label={t("paidOrders")} value={orders.filter((order: any) => order.payment === "paid").length} tone="success" icon={<CircleDollarSign className="h-5 w-5" />} />
        <StatCard label={t("unpaidOrders")} value={orders.filter((order: any) => order.payment !== "paid").length} tone="warning" icon={<CircleDollarSign className="h-5 w-5" />} />
        <StatCard label={t("totalAmount")} value={currency(orders.reduce((sum: number, order: any) => sum + Number(order.amount || 0), 0))} icon={<CircleDollarSign className="h-5 w-5" />} />
      </div>

      <Card className="rounded-2xl border-border/60 shadow-[var(--shadow-soft)] overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-border/60 bg-secondary/30">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(event) => setQ(event.target.value)} placeholder={t("searchOrders")} className="pl-9 bg-background" />
          </div>
          <Select value={payment} onValueChange={setPayment}>
            <SelectTrigger className="w-44 bg-background"><SelectValue placeholder={t("payment")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allPayments")}</SelectItem>
              {["paid", "pending", "refunded"].map((item) => <SelectItem key={item} value={item}><StatusBadge status={item} /></SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/20 hover:bg-secondary/20 border-border/60">
                <TableHead>{t("order")}</TableHead>
                <TableHead>{t("customer")}</TableHead>
                <TableHead>{t("invitation")}</TableHead>
                <TableHead>{t("amount")}</TableHead>
                <TableHead>{t("payment")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order: any) => (
                <TableRow key={order.id} className="border-border/60 hover:bg-secondary/30">
                  <TableCell className="font-mono text-xs">{String(order.id).slice(-8).toUpperCase()}</TableCell>
                  <TableCell>
                    <div className="font-medium">{order.customer}</div>
                    <div className="text-xs text-muted-foreground">{order.email}</div>
                  </TableCell>
                  <TableCell>{order.invitation}</TableCell>
                  <TableCell className="font-medium">{currency(order.amount)}</TableCell>
                  <TableCell><StatusBadge status={order.payment} /></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatAdminDate(order.date, lang)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={t("actions")}><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openDetails(order)}><Eye className="h-4 w-4 mr-2" />{t("viewDetails")}</DropdownMenuItem>
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
          {!filtered.length && <div className="p-10 text-center text-sm text-muted-foreground">{t("noData")}</div>}
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
                <Detail label={t("templates")} value={selectedOrder.template || "-"} />
                <Detail label={t("eventType")} value={selectedOrder.eventType || "-"} />
                <Detail label={t("language")} value={selectedOrder.preferredLanguage || "-"} />
                <Detail label={t("date")} value={formatAdminDate(selectedOrder.eventDate, lang)} />
                <Detail label={t("time")} value={selectedOrder.eventTime || "-"} />
                <Detail label={t("location")} value={selectedOrder.eventLocation || "-"} />
                <Detail label={t("created")} value={formatAdminDate(selectedOrder.date, lang, { dateStyle: "long", timeStyle: "short" })} />
              </div>

              {selectedOrder.mapLink ? (
                <a
                  href={selectedOrder.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center rounded-full border border-border/70 px-4 py-2 text-sm hover:bg-secondary/50"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />{t("openMap")}
                </a>
              ) : null}

              <div className="grid gap-4">
                <LongDetail label={t("message")} value={selectedOrder.eventMessage || "-"} />
                <LongDetail label={t("notes")} value={selectedOrder.notes || "-"} />
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
