import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Bell, ChevronDown, Globe, LogOut, Moon, Search, Settings, Sun, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNotifications } from "@/hooks/useAdminData";
import { clearToken } from "@/lib/api";
import { useAdminI18n, type AdminLang } from "@/lib/i18n";

const titles: Record<string, string> = {
  "/admin": "dashboard",
  "/admin/invitations": "invitations",
  "/admin/templates": "templates",
  "/admin/orders": "orders",
  "/admin/customers": "customers",
  "/admin/payments": "payments",
  "/admin/reviews": "reviews",
  "/admin/messages": "messages",
  "/admin/categories": "categories",
  "/admin/languages": "languages",
  "/admin/notifications": "notifications",
  "/admin/administrators": "administrators",
  "/admin/settings": "settings",
};

export function TopHeader() {
  const pathname = useRouterState({ select: (route) => route.location.pathname });
  const { lang, setLang, t } = useAdminI18n();
  const title = t((titles[pathname] ?? "dashboard") as any);
  const { data: notifications } = useNotifications();
  const unread = notifications.filter((item: any) => !item.read).length;
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/85 backdrop-blur-md px-4 md:px-6">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-xl md:text-2xl leading-none truncate">{title}</h1>
        <p className="hidden sm:block text-xs text-muted-foreground mt-1">{t("welcome")}</p>
      </div>

      <div className="hidden md:flex relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder={t("searchPlaceholder")} className="pl-9 bg-secondary/50 border-border/60" />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {[
            ["hy", "Հայերեն"],
            ["ru", "Русский"],
            ["en", "English"],
          ].map(([code, label]) => (
            <DropdownMenuItem key={code} onClick={() => setLang(code as AdminLang)}>
              <span className={lang === code ? "font-semibold text-[color:var(--gold)]" : ""}>{label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setDark((value) => !value)}>
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-4 w-4" />
            {unread > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[color:var(--gold)] ring-2 ring-background" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="font-medium text-sm">{t("notifications")}</div>
            <Badge variant="secondary" className="text-[10px]">{unread}</Badge>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y">
            {notifications.slice(0, 5).map((item: any) => (
              <div key={item.id} className="flex gap-3 px-4 py-3 hover:bg-secondary/50 transition">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: item.read ? "var(--border)" : "var(--gold)" }} />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{item.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{item.desc}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-secondary/70 transition">
            <Avatar className="h-8 w-8 ring-2 ring-[color:var(--gold-soft)]">
              <AvatarFallback className="gold-gradient text-white text-xs font-medium">A</AvatarFallback>
            </Avatar>
            <div className="hidden lg:flex flex-col items-start leading-tight">
              <span className="text-xs font-medium">Admin</span>
              <span className="text-[10px] text-muted-foreground">{t("adminPanel")}</span>
            </div>
            <ChevronDown className="hidden lg:block h-3 w-3 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem><User className="h-4 w-4 mr-2" />{t("profile")}</DropdownMenuItem>
          <DropdownMenuItem><Settings className="h-4 w-4 mr-2" />{t("settings")}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => {
              clearToken();
              window.location.assign("/login");
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />{t("logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
