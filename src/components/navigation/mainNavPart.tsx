"use client"

import type React from "react"


import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Link } from "next-view-transitions"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/mentors", label: "Mentors" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
]

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center  space-x-4 lg:space-x-6", className)} {...props}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-primary" : "text-muted-foreground",
          )}
        >
          {item.href === pathname && (
            <motion.span
              className="absolute inset-0 z-[-1] bg-primary/10 rounded-md"
              layoutId="navbar-active"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

