import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, CreditCard, Download, RotateCcw } from "lucide-react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { currency } from "@/lib/api";
import { formatAdminDate, useAdminI18n } from "@/lib/i18n";
import { usePayments } from "@/hooks/useAdminData";

export const Route = createFileRoute("/admin/payments")({ component: PaymentsPage });

const CHART_COLORS = ["#C99A3D", "#8B6F3D", "#D4B26A"];

function PaymentsPage() {
  const { lang, t } = useAdminI18n();
  const { data: payments, isLoading, error } = usePayments();
  const successful = payments.filter((payment: any) => payment.status === "paid").length;
  const refunded = payments.filter((payment: any) => payment.status === "refunded").length;
  const pending = payments.filter((payment: any) => payment.status === "pending").length;
  const revenue = payments.filter((payment: any) => payment.status === "paid").reduce((sum: number, payment: any) => sum + payment.amount, 0);
  const paymentMethodStats = ["Stripe", "Manual"].map((name) => ({ name: name === "Manual" ? t("manual") : name, value: payments.filter((payment: any) => payment.method === name).length })).filter((item) => item.value > 0);

  const exportCsv = () => {
    const rows = [["transaction", "customer", "order", "amount", "method", "status", "date"], ...payments.map((item: any) => [item.txId, item.customer, item.order, item.amount, item.method, item.status, item.date])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "payments.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title={t("payments")}
        subtitle={error ? error.message : isLoading ? t("loading") : t("payments")}
        actions={<Button onClick={exportCsv} variant="outline" className="rounded-full border-border/60"><Download className="h-4 w-4 mr-2" />{t("exportCsv")}</Button>}
      />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={t("totalRevenue")} value={currency(revenue)} icon={<CreditCard className="h-5 w-5" />} />
        <StatCard label={t("paidOrders")} value={successful} tone="success" icon={<CheckCircle2 className="h-5 w-5" />} />
        <StatCard label={t("refundedPayments")} value={refunded} icon={<RotateCcw className="h-5 w-5" />} />
        <StatCard label={t("pendingPayments")} value={pending} tone="warning" icon={<RotateCcw className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2 p-6 rounded-2xl border-border/60 shadow-[var(--shadow-soft)]">
          <h3 className="font-display text-xl">{t("recentTransactions")}</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">{t("transactionLedger")}</p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/60">
                  <TableHead>{t("transaction")}</TableHead>
                  <TableHead>{t("customer")}</TableHead>
                  <TableHead>{t("order")}</TableHead>
                  <TableHead>{t("amount")}</TableHead>
                  <TableHead>{t("method")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("date")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.slice(0, 10).map((payment: any) => (
                  <TableRow key={payment.txId} className="border-border/60 hover:bg-secondary/30">
                    <TableCell className="font-mono text-xs">{payment.txId}</TableCell>
                    <TableCell>{payment.customer}</TableCell>
                    <TableCell className="font-mono text-xs">{String(payment.order).slice(-8).toUpperCase()}</TableCell>
                    <TableCell className="font-medium">{currency(payment.amount)}</TableCell>
                    <TableCell>{payment.method === "Manual" ? t("manual") : payment.method}</TableCell>
                    <TableCell><StatusBadge status={payment.status} /></TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatAdminDate(payment.date, lang)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl border-border/60 shadow-[var(--shadow-soft)]">
          <h3 className="font-display text-xl">{t("paymentMethods")}</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">{t("distribution")}</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentMethodStats} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  {paymentMethodStats.map((_: unknown, index: number) => <Cell key={index} fill={CHART_COLORS[index]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
