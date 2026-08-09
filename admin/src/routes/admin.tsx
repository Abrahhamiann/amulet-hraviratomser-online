import { createFileRoute, Outlet, useNavigate, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { TopHeader } from "@/components/admin/TopHeader";
import { Toaster } from "@/components/ui/sonner";
import { adminApi, clearToken } from "@/lib/api";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  notFoundComponent: () => <Navigate to="/admin/" replace />,
});

function AdminLayout() {
  const nav = useNavigate();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    clearToken();
    let active = true;
    adminApi
      .me()
      .then((user) => {
        if (!active) return;
        if (["admin", "super_admin"].includes(user.role)) setAuthorized(true);
        else nav({ to: "/login", replace: true });
      })
      .catch(() => {
        if (active) nav({ to: "/login", replace: true });
      });
    return () => {
      active = false;
    };
  }, [nav]);

  if (!authorized)
    return (
      <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">
        Loading...
      </div>
    );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1 min-w-0 bg-background">
          <TopHeader />
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
          <Toaster richColors position="top-right" />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
