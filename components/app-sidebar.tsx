"use client";

import * as React from "react";
import { IconInnerShadowTop, type Icon } from "@tabler/icons-react";

import Link from "next/link";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string;
    email: string;
    avatar?: string | null;
  };
  navMain: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
  navSecondary?: {
    title: string;
    url: string;
    icon: Icon;
  }[];
}

export function AppSidebar({ user, navMain, navSecondary, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href="/">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Shastho Tech</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navMain && <NavMain items={navMain} />}
        {navSecondary && <NavSecondary items={navSecondary} className="mt-auto" />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user.name,
            email: user.email,
            avatar: user.avatar || "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
