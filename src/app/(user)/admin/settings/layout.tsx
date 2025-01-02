'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import PageWrapper from "@/components/wrapper/page-wrapper"
import { Settings, Shield, Link as LinkIcon, Bell, Zap } from "lucide-react"

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname()

  const navItems = [
    { name: "General", href: "/admin/settings", icon: Settings },
    { name: "Security", href: "/admin/settings/security", icon: Shield },
    { name: "Integrations", href: "/admin/settings/integrations", icon: LinkIcon },
    { name: "Notifications", href: "/admin/settings/notifications", icon: Bell },
    { name: "Advanced", href: "/admin/settings/advanced", icon: Zap },
  ]

  return (
    <PageWrapper>
      <div className="w-full">
        <div className="flex flex-col md:flex-row gap-8">
          <nav className="w-full md:w-64 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <item.icon className="mr-4 h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          <main className="flex-1">
            <div className="rounded-lg shadow-sm">
              {children}
            </div>
          </main>
        </div>
      </div>
    </PageWrapper>
  )
}