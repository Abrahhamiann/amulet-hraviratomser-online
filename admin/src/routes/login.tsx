import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/api";
import { useAdminI18n, type AdminLang } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in - Amulet Admin" }] }),
});

function LoginPage() {
  const { lang, setLang, t } = useAdminI18n();
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      nav({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex relative overflow-hidden gold-gradient p-12 flex-col justify-between text-white">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur grid place-items-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="font-display text-2xl">Amulet</div>
        </div>
        <div className="relative z-10">
          <div className="text-[10px] uppercase tracking-[0.28em] opacity-80">Admin Panel</div>
          <h1 className="font-display text-5xl leading-tight mt-4 max-w-md">
            Craft unforgettable moments with elegant digital invitations.
          </h1>
          <p className="mt-4 max-w-md text-white/85">
            Manage weddings, engagements, baptisms, birthdays, and corporate events from one refined workspace.
          </p>
        </div>
        <div className="text-xs text-white/70">© {new Date().getFullYear()} Amulet. All rights reserved.</div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <Card className="w-full max-w-md p-8 border-border/60 shadow-[var(--shadow-soft)] rounded-2xl">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="h-9 w-9 rounded-xl gold-gradient grid place-items-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="font-display text-xl">Amulet</div>
          </div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-3xl">{t("welcome")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("signInSubtitle")}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline" size="sm">{lang.toUpperCase()}</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {[
                  ["hy", "Հայերեն"],
                  ["ru", "Русский"],
                  ["en", "English"],
                ].map(([code, label]) => (
                  <DropdownMenuItem key={code} onClick={() => setLang(code as AdminLang)}>{label}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("password")}</Label>
                <Link to="/forgot-password" className="text-xs text-[color:var(--gold)] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox defaultChecked /> {t("rememberMe")}
            </label>
            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
            <Button type="submit" disabled={loading} className="w-full gold-gradient border-0 text-white h-11 rounded-xl">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Signing in...
                </>
              ) : (
                t("signIn")
              )}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-6">
            Protected by Amulet security. Sessions expire after 24h of inactivity.
          </p>
        </Card>
      </div>
    </div>
  );
}
