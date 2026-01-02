"use client";

import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  IconDashboard,
  IconPackage,
  IconFileText,
  IconUsers,
  IconUser,
  IconSettings,
  IconHelp,
  IconSearch,
} from "@tabler/icons-react";

interface PatientLayoutClientProps {
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
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "My Orders",
    url: "/orders",
    icon: IconPackage,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: IconFileText,
  },
  {
    title: "Family Members",
    url: "/family",
    icon: IconUsers,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: IconUser,
  },
];

const navSecondary = [
  {
    title: "Settings",
    url: "/settings",
    icon: IconSettings,
  },
  {
    title: "Get Help",
    url: "/help",
    icon: IconHelp,
  },
  {
    title: "Search",
    url: "/search",
    icon: IconSearch,
  },
];

export function PatientLayoutClient({ children, user }: PatientLayoutClientProps) {
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
        <SiteHeader></SiteHeader>
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
