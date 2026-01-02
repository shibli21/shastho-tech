"use client";

import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { DashboardHeader } from "@/components/navigation/dashboard-header";

interface PatientLayoutClientProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function PatientLayoutClient({ children, user }: PatientLayoutClientProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
