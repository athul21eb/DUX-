"use client";

import { usePathname } from "next/navigation";
import { User, Key, Home, MessageSquare, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Link } from "next-view-transitions";
import { useSession } from "next-auth/react";

const menuItems = [
  { href: "/user", icon: Home, label: "Dashboard" }, // Home
  { href: "/user/change-password", icon: Key, label: "Change Password" }, // Key
  { href: "/user/sessions", icon: User, label: "Sessions" }, // User
  { href: "/user/wallet", icon: Wallet, label: "Wallet" }, // Wallet
  { href: "/user/chats", icon: MessageSquare, label: "Chats" }, // MessageSquare
];

export function DashboardSidebar() {
  const pathname = usePathname();

 const { data: session } = useSession();

  if (!session) {
    return null;
  }


  return (
    <>
      <SidebarHeader className="border-b p-4 mt-20">
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Avatar>
         <AvatarImage
            src={session?.user?.image || "/dux.png"}
            alt="User avatar"
            onError={(e) => (e.currentTarget.src = "/dux.png")} // Fallback on error
          />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-sm font-semibold">{session?.user?.name??"USER"}</h2>
            <p className="text-xs text-muted-foreground">{session?.user?.email??"john@example.com"}</p>
          </div>
        </motion.div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href} className="flex items-center">
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                    {item.label === "User" && (
                      <Badge variant="secondary" className="ml-auto">
                        New
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </motion.div>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
