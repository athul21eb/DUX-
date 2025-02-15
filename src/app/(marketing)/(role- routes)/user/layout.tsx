"use client"

import type React from "react"

import { Sidebar } from "@/components/ui/sidebar"

import { motion } from "framer-motion"
import { DashboardSidebar } from "@/components/shared/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen mt-20">
      <Sidebar>
        <DashboardSidebar />
      </Sidebar>
      <motion.main
        className="flex-1 overflow-y-auto p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
    </div>
  )
}

