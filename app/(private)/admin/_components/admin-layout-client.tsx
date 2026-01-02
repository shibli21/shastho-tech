"use client";

import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  IconDashboard,
  IconChartBar,
  IconUsers,
  IconDatabase,
  IconBuildingHospital,
  IconPackage,
  IconSettings,
  IconHelp,
  IconSearch,
} from "@tabler/icons-react";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

const navMain = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: IconChartBar,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: IconUsers,
  },
  {
    title: "Diagnostic Tests",
    url: "/admin/tests",
    icon: IconDatabase,
  },
  {
    title: "Health Packages",
    url: "/admin/packages",
    icon: IconPackage,
  },
  {
    title: "Partner Labs",
    url: "/admin/labs",
    icon: IconBuildingHospital,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: IconPackage,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: IconSettings,
  },
];

const navSecondary = [
  {
    title: "System Logs",
    url: "/admin/logs",
    icon: IconDatabase,
  },
  {
    title: "Get Help",
    url: "/admin/help",
    icon: IconHelp,
  },
  {
    title: "Search",
    url: "/admin/search",
    icon: IconSearch,
  },
];

export function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        user={{
          name: user.name,
          email: user.email,
          avatar: user.image,
        }}
        navMain={navMain}
        navSecondary={navSecondary}
      />
      <SidebarInset>
        <SiteHeader>
          <h1 className="text-base font-semibold">Admin Dashboard</h1>
        </SiteHeader>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <main className="px-4 lg:px-6">{children}</main>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
