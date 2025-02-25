"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, MenuIcon, Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { MetaData } from "@/constant/metaData";

interface HomeHeaderProps {
    sections: string[];
    activeLink: string;
    setActiveLink: (link: string) => void;
    toggleSidebar: () => void;
}

export default function HomeHeader({
    sections,
    activeLink,
    setActiveLink,
    toggleSidebar,
}: HomeHeaderProps) {
    const [isScrolling, setScrolling] = useState(true);
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const { userInfo } = useAuth();

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolling(window.scrollY === 0);
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const ThemeIcon = (theme === "dark" ? Moon : Sun) ;

    return (
        <header
            className={`fixed z-30 top-0 w-full bg-gradient-to-b from-background via-transparent to-transparent h-14 transition-all duration-300 ${
                !isScrolling
                    ? "backdrop-blur-lg supports-[backdrop-filter]:bg-background/80"
                    : ""
            }`}
        >
            <div
                id=""
                className="w-full h-full px-4 md:px-12 lg:px-16 flex items-center justify-between bg-transparent"
            >
                <div className="flex items-center justify-center gap-2">
                    <button
                        className="lg:hidden p-0"
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <MenuIcon className="h-5 w-5" />
                    </button>
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/assets/icon/icon.png"
                            alt="MangoCare icon"
                            width={24}
                            height={24}
                            className="w-6 h-6 mr-1"
                        />
                        <h2 className="text-xl line-clamp-2 hidden md:block font-bold bg-gradient-to-r from-green-900 via-green-500 to-yellow-400 text-transparent bg-clip-text">
                            {MetaData.title}
                        </h2>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <nav className="hidden lg:flex gap-1">
                        {sections.map((title) => (
                            <React.Fragment key={title}>
                                <Link
                                    key={title}
                                    href={`#${title.replaceAll(" ", "-")}`}
                                    className={`relative h-8 px-4 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                                        activeLink === title
                                            ? "text-primary"
                                            : "text-muted-foreground hover:text-primary hover:bg-accent"
                                    }`}
                                    onClick={() => setActiveLink(title)}
                                >
                                    {title}

                                    <AnimatePresence>
                                        {activeLink === title && (
                                            <motion.span
                                                className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-primary"
                                                layoutId="underline"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}
                                    </AnimatePresence>
                                </Link>
                            </React.Fragment>
                        ))}
                    </nav>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-10">
                                {ThemeIcon && <ThemeIcon className="h-4 w-4" />}
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                <Sun className="mr-2 h-4 w-4" />
                                <span>Light</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                <Moon className="mr-2 h-4 w-4" />
                                <span>Dark</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setTheme("system")}
                            >
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>System</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button asChild variant="default">
                        <Link
                            href={
                                userInfo
                                    ? `/${
                                          userInfo?.role === 1
                                              ? "admin"
                                              : "user"
                                      }/`
                                    : "/signin"
                            }
                        >
                            {userInfo ? (
                                <>
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </>
                            ) : (
                                <>
                                    <User className="h-4 w-4" />
                                    <span>Sign in</span>
                                </>
                            )}
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
