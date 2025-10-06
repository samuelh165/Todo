"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageCircle, LayoutDashboard, Flag } from "lucide-react"
import { cn } from "@/lib/utils"

export function NavBar() {
  const pathname = usePathname()

  const links = [
    {
      href: "/",
      label: "Home",
      icon: MessageCircle,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/actions",
      label: "Actions",
      icon: Flag,
    },
  ]

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">WhatsApp To-Do AI</span>
          </div>
          
          <div className="flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

