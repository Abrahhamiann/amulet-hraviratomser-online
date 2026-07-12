import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  MoreHorizontal,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { currency } from "@/lib/api";
import { useAdminI18n } from "@/lib/i18n";
import { useDashboard } from "@/hooks/useAdminData";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

const CHART_COLORS = ["#C99A3D", "#8B6F3D", "#D4B26A", "#A67C3D", "#E5C88A"];

function Dashboard() {
  const { t } = useAdminI18n();
  const [period, setPeriod] = useState("all");
  const { data: dashboard, isLoading, error } = useDashboard(period);
  const stats = dashboard?.stats ?? {};
  const revenueByMonth = dashboard?.revenueByMonth ?? [];
  const categoryDistribution = dashboard?.categoryDistribution ?? [];
  const paymentMethodStats = dashboard?.paymentMethodStats ?? [];
  const latest = dashboard?.latestOrders ?? [];
  const topTemplates = dashboard?.topTemplates ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard")}
        subtitle={
          error
            ? error.message
            : isLoading
              ? t("loading")
              : t("liveOverview")
        }
        actions={
          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList className="bg-secondary/60">
              <TabsTrigger value="zero">Zero</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard label={t("totalRevenue")} value={currency(stats.revenue)} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard label={t("totalOrders")} value={stats.orders ?? 0} icon={<ShoppingBag className="h-5 w-5" />} />
        <StatCard label={t("invitations")} value={stats.invitations ?? 0} icon={<FileText className="h-5 w-5" />} />
        <StatCard label={t("customers")} value={stats.customers ?? 0} icon={<Users className="h-5 w-5" />} />
        <StatCard label={t("pendingOrders")} value={stats.pendingOrders ?? 0} tone="warning" icon={<Clock className="h-5 w-5" />} />
        <StatCard label={t("messages")} value={stats.unreadMessages ?? 0} tone="destructive" icon={<MessageSquare className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6 rounded-2xl border-border/60 shadow-[var(--shadow-soft)]">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-display text-xl">Revenue overview</h3>
              <p className="text-xs text-muted-foreground mt-1">Monthly performance from real orders</p>
            </div>
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="h-3 w-3" /> Live
            </Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C99A3D" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#C99A3D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e2d4" vertical={false} />
                <XAxis dataKey="month" stroke="#77716A" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#77716A" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e8e2d4", background: "white" }} />
                <Area type="monotone" dataKey="revenue" stroke="#C99A3D" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl border-border/60 shadow-[var(--shadow-soft)]">
          <h3 className="font-display text-xl">Category distribution</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Templates by event type</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {categoryDistribution.map((_: unknown, index: number) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e8e2d4", background: "white" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryDistribution.map((category: any, index: number) => (
              <div key={category.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: CHART_COLORS[index % CHART_COLORS.length] }} />
                  <span>{category.name}</span>
                </div>
                <span className="text-muted-foreground">{category.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 rounded-2xl border-border/60 shadow-[var(--shadow-soft)]">
          <h3 className="font-display text-xl">Orders trend</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Order volume over the year</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByMonth} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e2d4" vertical={false} />
                <XAxis dataKey="month" stroke="#77716A" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#77716A" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e8e2d4", background: "white" }} />
                <Bar dataKey="orders" fill="#C99A3D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl border-border/60 shadow-[var(--shadow-soft)]">
          <h3 className="font-display text-xl">Payment methods</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Distribution by orders</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentMethodStats} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e2d4" horizontal={false} />
                <XAxis type="number" stroke="#77716A" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#77716A" fontSize={11} tickLine={false} axisLine={false} width={70} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e8e2d4", background: "white" }} />
                <Bar dataKey="value" fill="#C99A3D" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl border-border/60 shadow-[var(--shadow-soft)]">
          <h3 className="font-display text-xl">Pending tasks</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Requires your attention</p>
          <ul className="space-y-3">
            {[
              { icon: AlertCircle, tone: "text-destructive bg-destructive/10", text: `${stats.pendingOrders ?? 0} pending orders` },
              { icon: Clock, tone: "text-[color:var(--warning)] bg-[color:var(--warning)]/15", text: `${stats.invitations ?? 0} invitations in the system` },
              { icon: MessageSquare, tone: "text-[color:var(--gold)] bg-[color:var(--cream)]", text: `${stats.unreadMessages ?? 0} contact messages` },
              { icon: CheckCircle2, tone: "text-[color:var(--success)] bg-[color:var(--success)]/10", text: `${stats.rsvps ?? 0} RSVP responses` },
            ].map((task, index) => (
              <li key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition">
                <div className={`h-9 w-9 grid place-items-center rounded-lg ${task.tone}`}>
                  <task.icon className="h-4 w-4" />
                </div>
                <span className="text-sm flex-1">{task.text}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6 rounded-2xl border-border/60 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-xl">Latest orders</h3>
              <p className="text-xs text-muted-foreground mt-1">Most recent orders from MongoDB</p>
            </div>
            <Button variant="ghost" size="sm">View all</Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/60">
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latest.map((order: any) => (
                  <TableRow key={order.id} className="border-border/60">
                    <TableCell className="font-medium">{String(order.id).slice(-8).toUpperCase()}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{currency(order.amount)}</TableCell>
                    <TableCell><StatusBadge status={order.payment} /></TableCell>
                    <TableCell><StatusBadge status={order.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl border-border/60 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-xl">Top templates</h3>
              <p className="text-xs text-muted-foreground mt-1">Most used templates</p>
            </div>
            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
          </div>
          <ul className="space-y-4">
            {topTemplates.map((template: any, index: number) => (
              <li key={template.id} className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 rounded-xl bg-secondary overflow-hidden">
                  {template.cover ? <img src={template.cover} alt={template.name} className="h-full w-full object-cover" /> : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{template.name}</div>
                  <div className="text-xs text-muted-foreground">{template.category} · {template.usage} uses</div>
                </div>
                <div className="text-sm font-medium text-[color:var(--gold)]">#{index + 1}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
