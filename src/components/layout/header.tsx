'use client'

import React from 'react'
import { useTheme } from "next-themes"
import Link from "next/link"
import { Bell, Settings, Menu, User, Scan, MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, 
  DropdownMenuSubContent, DropdownMenuSubTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'

interface Header {
  toggleSidebar: () => void
}

export default function Header({ toggleSidebar }: Header) {
  const {resetToken} = useAuth();
  const { setTheme, theme } = useTheme()
  const router = useRouter()

  const handleLogout = async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    if (response.ok) {
      router.push("/signin")
      setTimeout(()=>{
        resetToken()
      },1000)
    } 
  }

  return (
    <header className="top-0 right-0 left-0 lg:left-72 z-20 backdrop-filter backdrop-blur-md supports-[backdrop-filter]:bg-background/90">
      <div className="h-14 flex justify-between items-center px-4 md:px-6 border-b">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 h-auto text-foreground hidden md:block lg:hidden focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Breadcrumbs />
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/scan"
            className="text-foreground hover:text-primary transition-colors hidden md:block"
            aria-label="Upload"
          >
            <Scan className="h-5 w-5" />
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-foreground"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">New upload complete</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Analysis finished</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-primary justify-center">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  {theme === "dark" ? (
                    <SunIcon className="mr-2 h-4 w-4" />
                  ) : (
                    <MoonIcon className="mr-2 h-4 w-4" />
                  )}
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <button className='w-full' onClick={handleLogout}>Log out</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
import { usePathname } from 'next/navigation'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb'
import { ChevronRight } from 'lucide-react'

const Breadcrumbs = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(segment => segment !== '' && segment !== 'admin' && segment !== 'user')

  if (pathSegments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/admin' className="text-foreground font-medium">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="md:hidden">
          <BreadcrumbLink href={`/admin/${pathSegments[0]}`} className="text-foreground font-medium">
            {pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1).replace(/-/g, ' ')}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathSegments.map((segment, index) => {
          const href = `/admin/${pathSegments.slice(0, index + 1).join('/')}`
          const isLast = index === pathSegments.length - 1
          const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

          return (
            <BreadcrumbItem key={index} className={index === 0 ? 'hidden md:inline-flex' : 'hidden md:inline-flex'}>
              <BreadcrumbLink href={href} className={isLast ? "text-foreground font-medium" : ""}>
                {title}
              </BreadcrumbLink>
              {!isLast && <ChevronRight className='h-5 w-5'/>}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

