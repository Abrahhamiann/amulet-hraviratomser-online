import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { ChevronDown, Globe, LogOut, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { logout } from "@/lib/api";
import { useAdminI18n, type AdminLang } from "@/lib/i18n";

const titles: Record<string, string> = {
  "/admin": "dashboard",
  "/admin/templates": "templates",
  "/admin/orders": "orders",
  "/admin/customers": "customers",
  "/admin/payments": "payments",
  "/admin/promocodes": "promocodes",
  "/admin/messages": "messages",
  "/admin/administrators": "administrators",
};

export function TopHeader() {
  const pathname = useRouterState({ select: (route) => route.location.pathname });
  const { lang, setLang, t } = useAdminI18n();
  const title = t((titles[pathname] ?? "dashboard") as any);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/85 backdrop-blur-md px-4 md:px-6">
      <SidebarTrigger
        className="text-muted-foreground hover:text-foreground"
        aria-label={t("toggleSidebar")}
      />
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-xl md:text-2xl leading-none truncate">{title}</h1>
        <p className="hidden sm:block text-xs text-muted-foreground mt-1">{t("welcome")}</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label={t("changeLanguage")}
          >
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
              <span className={lang === code ? "font-semibold text-[color:var(--gold)]" : ""}>
                {label}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        aria-label={t("toggleTheme")}
        onClick={() => setDark((value) => !value)}
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-secondary/70 transition"
            aria-label={t("myAccount")}
          >
            <Avatar className="h-8 w-8 ring-2 ring-[color:var(--gold-soft)]">
              <AvatarFallback className="gold-gradient text-white text-xs font-medium">
                A
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:flex flex-col items-start leading-tight">
              <span className="text-xs font-medium">{t("administrator")}</span>
              <span className="text-[10px] text-muted-foreground">{t("adminPanel")}</span>
            </div>
            <ChevronDown className="hidden lg:block h-3 w-3 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={async () => {
              await logout();
              window.location.replace("/login");
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t("logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
