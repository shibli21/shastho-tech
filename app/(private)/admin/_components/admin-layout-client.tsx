"use client";

import { AdminSidebar } from "@/components/navigation/admin-sidebar";
import { DashboardHeader } from "@/components/navigation/dashboard-header";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
