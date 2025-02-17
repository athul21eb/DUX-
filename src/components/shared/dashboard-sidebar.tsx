"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  type LucideIcon,
  Home,
  Speech,
  User,
  Clock,
  MessageSquare,
  Key,
  Wallet,
  Users,
  Inbox,
  Paperclip,
  Award,
} from "lucide-react";
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
import { useSession, signOut, getSession } from "next-auth/react";

import DUX from "../ui/Dux";
import toast from "react-hot-toast";
import { Link } from "next-view-transitions";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useEffect } from "react";

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

const userNavItems: NavItem[] = [
  { title: "Dashboard", href: "/user", icon: Home },
  { title: "Profile", href: "/user/profile", icon: User },
  { title: "Sessions", href: "/user/sessions", icon: Clock },
  { title: "Chats", href: "/user/chats", icon: MessageSquare },
  { title: "Change Password", href: "/user/change-password", icon: Key },
  { title: "Wallet", href: "/user/wallet", icon: Wallet },
];

const mentorNavItems: NavItem[] = [
  { title: "Dashboard", href: "/mentor", icon: Home },
  { title: "Profile", href: "/mentor/profile", icon: User },
  { title: "Sessions", href: "/mentor/sessions", icon: Clock },
  { title: "Chats", href: "/mentor/chats", icon: MessageSquare },
  { title: "Change Password", href: "/mentor/change-password", icon: Key },
  { title: "Wallet", href: "/mentor/earnings", icon: Wallet },
];

const adminNavItems: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: Home },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Mentors", href: "/admin/mentors", icon: Speech },
  { title: "Approvals", href: "/admin/approvals", icon: Inbox },
  { title: "Skills", href: "/admin/skills", icon: Award },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();


  useEffect(() => {
    getSession();
  }, []);

  const handleSignOut = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      await signOut();
      toast.success("Logged out successfully!", {
        id: toastId,
        duration: 2000,
      });

    } catch (error) {
      toast.error("Error logging out!", { id: toastId, duration: 3000 });
    }
  };

  let navItems: NavItem[] = [];

  if (session?.user?.role === "admin") {
    navItems = adminNavItems;
  } else if (session?.user?.role === "mentor") {
    navItems = mentorNavItems;
  } else if (session?.user?.role === "user") {
    navItems = userNavItems;
  } else {
    return null;
  }

  return (
    <ShadcnSidebar className=" min-h-screen">
      <SidebarHeader className="p-4">
        <DUX />
        {session?.user && (
          <div className="flex items-center space-x-4 mt-6 p-3 rounded-lg  shadow">
            <Avatar className="w-12 h-12 border-2 border-primary rounded-full shadow-lg">
              <AvatarImage
                src={session.user.image|| "/default-avatar.png"}
                alt={session.user.name || "User"}
                className="w-full h-full rounded-full"
              />
             <AvatarFallback className="bg-primary text-muted font-semibold uppercase flex items-center justify-center w-full h-full rounded-full">
  {session.user.name?.charAt(0) || "U"}
</AvatarFallback>

            </Avatar>
            <div className="flex flex-col overflow-hidden">
  <p className="text-sm font-semibold truncate w-32">{session.user.name}</p>
  <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-32">
    {session.user.email}
  </p>
</div>

          </div>
        )}
      </SidebarHeader>

      {/* Divider */}
      <hr className="border-gray-300 dark:border-gray-700 my-4 mx-4" />

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    asChild
                    className={`relative text-center px-4 py-2 transition-all duration-200 ${
                      isActive ? "bg-primary/10 rounded-md" : ""
                    }`}
                  >
                    <a className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-primary" />
                      <span className="text-sm">{item.title}</span>
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

      {/* Divider */}
      <hr className="border-gray-300 dark:border-gray-700 my-4 mx-4" />

      <SidebarFooter className="p-4">
        {session ? (
          <Button onClick={handleSignOut} className="w-full">
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
