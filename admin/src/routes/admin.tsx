import { createFileRoute, Outlet, useNavigate, Navigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { TopHeader } from "@/components/admin/TopHeader";
import { Toaster } from "@/components/ui/sonner";
import { getToken } from "@/lib/api";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  notFoundComponent: () => <Navigate to="/admin/" replace />,
});

function AdminLayout() {
  const nav = useNavigate();

  useEffect(() => {
    if (!getToken()) {
      nav({ to: "/login" });
    }
  }, [nav]);

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
