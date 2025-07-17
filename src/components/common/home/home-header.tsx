"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import {
    LayoutDashboard,
    MenuIcon,
    Moon,
    Sun,
    User,
    ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { MetaData } from "@/constant/metaData";
import { useAuth } from "@/context/auth-context";

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
    const { userInfo } = useAuth(); // Declare useAuth hook

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

    const ThemeIcon = theme === "dark" ? Moon : Sun;

    return (
        <header
            className={`fixed z-30 top-0 w-full transition-all duration-300 ${
                !isScrolling
                    ? "backdrop-blur-lg bg-background/90 border-b border-border shadow-sm"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto h-16 md:h-20 flex items-center justify-between">
                {/* Left side - Logo and Mobile Menu */}
                <div className="flex items-center gap-4">
                    <button
                        className="lg:hidden p-2 -ml-2 rounded-md hover:bg-muted transition-colors"
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <MenuIcon className="h-5 w-5 text-foreground" />
                    </button>

                    <Link href="/" className="flex gap-2 items-center group">
                        <div className="relative overflow-hidden rounded-lg flex items-center justify-center">
                            <Image
                                src="/assets/icon/icon.png"
                                alt="MangoCare icon"
                                width={24}
                                height={24}
                                className="w-6 h-6 transition-transform group-hover:scale-110"
                            />
                        </div>
                        <h2 className="text-xl hidden md:block font-bold text-primary transition-all group-hover:text-primary/80">
                            {MetaData.title}
                        </h2>
                    </Link>
                </div>

                {/* Center - Navigation */}
                <nav className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 bg-card/50 backdrop-blur-md rounded-full px-2 py-1.5 shadow-sm border">
                    {sections.map((title) => (
                        <Link
                            key={title}
                            href={`#${title.replaceAll(" ", "-")}`}
                            className={`relative h-9 px-4 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                                activeLink === title
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-primary hover:bg-muted"
                            }`}
                            onClick={() => setActiveLink(title)}
                        >
                            {title.charAt(0).toUpperCase() + title.slice(1)}

                            <AnimatePresence>
                                {activeLink === title && (
                                    <motion.span
                                        className="absolute inset-0 rounded-full bg-primary/10 -z-10"
                                        layoutId="navBackground"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                )}
                            </AnimatePresence>
                        </Link>
                    ))}
                </nav>

                {/* Right side - Theme Toggle and Auth */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-9 h-9 rounded border bg-card"
                        onClick={() => {
                            setTheme(theme === "dark" ? "light" : "dark");
                        }}
                    >
                        {ThemeIcon && (
                            <ThemeIcon className="h-4 w-4 text-foreground" />
                        )}
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {userInfo ? (
                        <Button variant="default" className="gap-2 h-9">
                            <Link href="/signin" className="flex items-center ">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Dashboard
                            </Link>
                        </Button>
                    ) : (
                        <Button
                            variant="default"
                            size="sm"
                            className="gap-2 h-9 rounded"
                        >
                            <Link href="/signin" className="flex items-center">
                                <User className="h-4 w-4 sm:mr-1" />
                                <span className="hidden sm:inline">
                                    Sign in
                                </span>
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
