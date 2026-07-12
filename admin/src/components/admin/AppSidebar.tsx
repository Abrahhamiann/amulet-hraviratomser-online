import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FileText, LayoutTemplate, ShoppingBag, Users, CreditCard,
  Star, MessageSquare, FolderTree, Languages, Bell, ShieldCheck,
  Settings, LogOut, Sparkles,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { clearToken } from "@/lib/api";
import { useAdminI18n } from "@/lib/i18n";

const mainNav = [
  { title: "dashboard", url: "/admin", icon: LayoutDashboard, exact: true },
  { title: "invitations", url: "/admin/invitations", icon: FileText },
  { title: "templates", url: "/admin/templates", icon: LayoutTemplate },
  { title: "orders", url: "/admin/orders", icon: ShoppingBag },
  { title: "customers", url: "/admin/customers", icon: Users },
  { title: "payments", url: "/admin/payments", icon: CreditCard },
  { title: "reviews", url: "/admin/reviews", icon: Star },
  { title: "messages", url: "/admin/messages", icon: MessageSquare },
];

const configNav = [
  { title: "categories", url: "/admin/categories", icon: FolderTree },
  { title: "languages", url: "/admin/languages", icon: Languages },
  { title: "notifications", url: "/admin/notifications", icon: Bell },
  { title: "administrators", url: "/admin/administrators", icon: ShieldCheck },
  { title: "settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { t } = useAdminI18n();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  const renderItems = (items: typeof mainNav) =>
    items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          isActive={isActive(item.url, item.exact)}
          className="data-[active=true]:bg-secondary data-[active=true]:text-foreground data-[active=true]:font-medium hover:bg-secondary/70"
        >
          <Link to={item.url} className="flex items-center gap-3">
            <item.icon className="h-4 w-4 shrink-0 text-[color:var(--gold)]" />
            {!collapsed && <span className="truncate">{t(item.title as any)}</span>}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader className="border-b border-border/60 py-4">
        <Link to="/admin" className="flex items-center gap-2 px-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gold-gradient shadow-[var(--shadow-gold)]">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-display text-xl leading-none tracking-tight">Amulet</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
                {t("adminPanel")}
              </div>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {t("overview")}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(mainNav)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {t("configuration")}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(configNav)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/60">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-destructive/10 hover:text-destructive">
              <Link to="/login" onClick={clearToken} className="flex items-center gap-3">
                <LogOut className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{t("logout")}</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
