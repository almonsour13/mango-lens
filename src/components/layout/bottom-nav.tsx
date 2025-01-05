"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal, Scan } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { sidebarItems } from "@/constant/sidebar-item";
import { useAuth } from "@/context/auth-context";

export default function BottomNav() {
    const pathname = usePathname();
    
    const { userInfo } = useAuth();
    const items = sidebarItems(userInfo?.role);

    const visibleItems = [items[0], items[2], items[1], items[3]];
    const moreItems = items.slice(4);
    const isMoreActive = moreItems.some(
        (item) =>
            (pathname.startsWith(item.href) &&
                item.href.split("/").length > 2) ||
            item.href === pathname
    );

    return (
        <nav className="fixed border-t bottom-0 left-0 z-40 w-full backdrop-filter backdrop-blur-md supports-[backdrop-filter]:bg-card shadow-sm rounded-t-lg md:hidden">
            <div className="px-4">
                <div className="flex h-14 items-center justify-between gap-2">
                    {visibleItems.map(
                        (item) =>
                            item && (
                                <React.Fragment key={item.label}>
                                    {item.label !== "New Scan" ? (
                                        <NavItem
                                            item={item}
                                            pathname={pathname}
                                        />
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center"
                                        >
                                            <Scan className="h-6 w-6 text-white" />
                                        </Link>
                                    )}
                                </React.Fragment>
                            )
                    )}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`h-8 w-8 relative ${
                                    isMoreActive
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-primary"
                                }`}
                            >
                                <MoreHorizontal className="h-5 w-5" />
                                <AnimatePresence>
                                    {isMoreActive && (
                                        <motion.span
                                            className="absolute -bottom-1 left-0 h-1 w-8 rounded-full bg-primary"
                                            layoutId="bottomNav"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        />
                                    )}
                                </AnimatePresence>
                                <span className="sr-only">More menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="h-[50vh]">
                            <MoreMenu items={moreItems} pathname={pathname} />
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}

interface NavItemProps {
    item: {
        href: string;
        icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
        label: string;
    };
    pathname: string;
}

function NavItem({ item, pathname }: NavItemProps) {
    const isActive =
        (pathname.startsWith(item.href) && item.href.split("/").length > 2) ||
        pathname === item.href;

    return (
        <Link
            href={item.href}
            className={`relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                isActive
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-primary"
            }`}
            prefetch={true}
        >
            <item.icon className="h-5 w-5" />
            <AnimatePresence>
                {isActive && (
                    <motion.span
                        className="absolute -bottom-1 left-0 h-1 w-8 rounded-full bg-primary"
                        layoutId="bottomNav"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}
            </AnimatePresence>
        </Link>
    );
}

interface MoreMenuProps {
    items: {
        href: string;
        icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
        label: string;
    }[];
    pathname: string;
}

function MoreMenu({ items, pathname }: MoreMenuProps) {
    return (
        <ScrollArea className="h-full">
            <div className="space-y-4 py-4">
                <h2 className="px-2 text-lg font-semibold tracking-tight">
                    More Options
                </h2>
                <div className="space-y-1">
                    {items.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant="ghost"
                                className={`w-full item justify-start ${
                                    pathname === item.href
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-background"
                                }`}
                            >
                                <item.icon
                                    className="h-4 w-4 mr-4"
                                    aria-hidden="true"
                                />
                                <span>{item.label}</span>
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
        </ScrollArea>
    );
}
