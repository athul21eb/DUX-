'use client'

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { type LucideIcon, Home, User, Clock, MessageSquare, Key, Wallet } from "lucide-react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VisuallyHidden } from "../ui/vishually-hidden";
import DUX from "../ui/Dux";


type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/user", icon: Home },
  { title: "Profile", href: "/user/profile", icon: User },
  { title: "Sessions", href: "/user/sessions", icon: Clock },
  { title: "Chats", href: "/user/chats", icon: MessageSquare },
  { title: "Change Password", href: "/user/change-password", icon: Key },
  { title: "Wallet", href: "/user/wallet", icon: Wallet },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <ShadcnSidebar>
      <SidebarHeader className="p-4">
        <DUX />

{/* 
        {session?.user && (
          <div className="flex items-center space-x-4 mb-4">
            <Avatar>
              <AvatarImage src={session.user.image || undefined} />
              <AvatarFallback>{session.user.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-xs text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
        )} */}

      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton asChild className={`relative ${isActive ? "bg-primary/10 rounded-md" : ""}`}>
                    <a className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 z-10 bg-primary/10 rounded-md"
                    layoutId="sidebar-highlight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        {session ? (
          <Button onClick={() => signOut()} className="w-full">
            Sign Out
          </Button>
        ) : (
          <Link href="/login" passHref legacyBehavior>
            <Button asChild className="w-full">
              <a>Sign In</a>
            </Button>
          </Link>
        )}
      </SidebarFooter>
    </ShadcnSidebar>
  );
}