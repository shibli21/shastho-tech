"use client";

import { LabSidebar } from "@/components/navigation/lab-sidebar";
import { DashboardHeader } from "@/components/navigation/dashboard-header";

interface LabLayoutClientProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  organizationName?: string;
}

export function LabLayoutClient({ children, user, organizationName }: LabLayoutClientProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <LabSidebar organizationName={organizationName} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader user={user} organizationName={organizationName} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
