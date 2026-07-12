import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAdminI18n } from "@/lib/i18n";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
  head: () => ({ meta: [{ title: "Forgot password — Amulet Admin" }] }),
});

function ForgotPassword() {
  const { t } = useAdminI18n();
  return (
    <div className="min-h-screen grid place-items-center bg-background p-6">
      <Card className="w-full max-w-md p-8 border-border/60 shadow-[var(--shadow-soft)] rounded-2xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-xl gold-gradient grid place-items-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="font-display text-xl">Amulet</div>
        </div>
        <h2 className="font-display text-3xl">{t("password")}</h2>
        <p className="text-sm text-muted-foreground mt-1">Contact support to reset an administrator password.</p>
        <form className="mt-8 space-y-4" onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const email = String(form.get("email") || "");
          window.location.href = `mailto:amuletarmenia@gmail.com?subject=Admin password reset&body=${encodeURIComponent(email)}`;
        }}>
          <div className="space-y-2">
            <Label>{t("email")}</Label>
            <Input name="email" type="email" placeholder="admin@amulet.co" required />
          </div>
          <Button className="w-full gold-gradient border-0 text-white h-11 rounded-xl">{t("sendEmail")}</Button>
        </form>
        <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      </Card>
    </div>
  );
}
