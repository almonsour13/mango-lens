"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PageWrapper from "@/components/wrapper/page-wrapper";
import {
    Shield,
    Bell,
    User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsLayoutProps {
    children: React.ReactNode;
}

export default function UserSettingsLayout({ children }: SettingsLayoutProps) {
    const pathname = usePathname();

    const navItems = [
        // { name: "General", href: "/user/settings", icon: Settings },
        { name: "Profile", href: "/user/settings", icon: User },
        { name: "Account", href: "/user/settings/account", icon: Shield },
    ];

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <h1 className="text-md">Settings</h1>
                </div>
            </div>
            <PageWrapper>
                <div className="w-full">
                    <div className="flex flex-col md:flex-row gap-4">
                        <nav className="w-full md:w-64 space-y-2">
                            {navItems.map((item) => (
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
                                        <span>{item.name}</span>
                                    </Button>
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
        </>
    );
}
