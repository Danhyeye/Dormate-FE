"use client"

import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChart3,
  FileCodeIcon,
  FileTextIcon,
  HelpCircleIcon,
  Home,
  Package,
  Settings,
  Shield,
  Users,
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Quản lý người dùng",
      url: "/management-users",
      icon: Users,
    },
    {
      title: "Quản lý gói",
      url: "/management-packages",
      icon: Package,
    },
    {
      title: "Quản lý phòng",
      url: "/management-rooms",
      icon: BarChart3,
    },
  ],
  
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props} className="z-10 bg-white">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin">
                <Shield className="h-5 w-5" />
                <span className="text-base font-semibold">Dormate Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
} 