import type React from "react"
import DashboardSidebar from "@/components/shared/dashboard-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-screen">
      <DashboardSidebar />
      <SidebarInset className="flex-1 overflow-auto">
        <SidebarTrigger className="m-1" />
        <main className="p-4 w-full">
        {children}</main>
      </SidebarInset>
    </div>
  )
}

