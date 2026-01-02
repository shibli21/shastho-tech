"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Upload, Users, Settings, LogOut, Activity, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

interface LabSidebarProps {
  organizationName?: string;
}

const navItems = [
  {
    title: "Dashboard",
    href: "/lab/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/lab/orders",
    icon: Package,
  },
  {
    title: "Upload Reports",
    href: "/lab/reports",
    icon: Upload,
  },
  {
    title: "Team",
    href: "/lab/team",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/lab/settings",
    icon: Settings,
  },
];

export function LabSidebar({ organizationName }: LabSidebarProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/sign-in";
        },
      },
    });
  };

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-card">
      {/* Logo & Lab Name */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="rounded-lg bg-primary p-1.5">
          <Activity className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-tight">
            Shastho<span className="text-primary">Tech</span>
          </span>
          <span className="text-xs text-muted-foreground">Lab Portal</span>
        </div>
      </div>

      {/* Organization Name */}
      {organizationName && (
        <div className="border-b px-6 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium truncate">{organizationName}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
