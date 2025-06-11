"use client";

import type React from "react";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MetaData } from "@/constant/metaData";
import {
    X,
    Home,
    Info,
    HelpCircle,
    Phone,
    Rocket,
    ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
    sections: string[];
    activeLink: string;
    setActiveLink: (link: string) => void;
    isOpen: boolean;
    toggleSidebar: () => void;
}

const HomeSidebar: React.FC<SidebarProps> = ({
    sections,
    activeLink,
    setActiveLink,
    isOpen,
    toggleSidebar,
}) => {
    const getSectionIcon = (section: string) => {
        switch (section.toLowerCase()) {
            case "home":
                return Home;
            case "about":
                return Info;
            case "how to use":
                return HelpCircle;
            case "contact us":
                return Phone;
            case "get started":
                return Rocket;
            default:
                return ChevronRight;
        }
    };

    return (
        <>
            {/* Backdrop Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
                        onClick={toggleSidebar}
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 200,
                        }}
                        className="fixed inset-y-0 left-0 z-40 w-80 bg-card border-r border-border shadow-xl lg:hidden"
                    >
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-border">
                                <Link
                                    href="/"
                                    className="flex items-center gap-3 group"
                                    onClick={toggleSidebar}
                                >
                                    <div className="relative w-10 h-10 overflow-hidden rounded-xl flex items-center justify-center group-hover:shadow-md transition-shadow">
                                        <Image
                                            src={
                                                MetaData.icons.icon ||
                                                "/placeholder.svg"
                                            }
                                            alt="MangoLens icon"
                                            width={24}
                                            height={24}
                                            className="w-6 h-6 transition-transform group-hover:scale-110"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-primary">
                                            {MetaData.title}
                                        </h2>
                                        <p className="text-xs text-muted-foreground">
                                            Disease Detection Platform
                                        </p>
                                    </div>
                                </Link>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleSidebar}
                                    className="w-8 h-8 rounded-full hover:bg-muted text-muted-foreground"
                                >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">
                                        Close sidebar
                                    </span>
                                </Button>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 p-4 space-y-2">
                                <div className="mb-4">
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                        Navigation
                                    </h3>
                                </div>

                                {sections.map((title, index) => {
                                    const Icon = getSectionIcon(title);
                                    const isActive = activeLink === title;

                                    return (
                                        <motion.div
                                            key={title}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Link
                                                href={`#${title.replaceAll(
                                                    " ",
                                                    "-"
                                                )}`}
                                                onClick={() => {
                                                    setActiveLink(title);
                                                    toggleSidebar();
                                                }}
                                                className="block"
                                            >
                                                <div
                                                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                                        isActive
                                                            ? "bg-primary/10 text-primary shadow-sm"
                                                            : "text-foreground hover:bg-muted hover:text-foreground"
                                                    }`}
                                                >
                                                    <div
                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                                            isActive
                                                                ? "bg-primary/20 text-primary"
                                                                : "bg-muted text-muted-foreground group-hover:bg-muted"
                                                        }`}
                                                    >
                                                        <Icon className="h-4 w-4" />
                                                    </div>

                                                    <span className="font-medium flex-1">
                                                        {title
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            title.slice(1)}
                                                    </span>

                                                    {isActive && (
                                                        <motion.div
                                                            layoutId="activeIndicator"
                                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                                                            transition={{
                                                                type: "spring",
                                                                damping: 25,
                                                                stiffness: 300,
                                                            }}
                                                        />
                                                    )}

                                                    <ChevronRight
                                                        className={`h-4 w-4 transition-transform ${
                                                            isActive
                                                                ? "text-primary"
                                                                : "text-muted-foreground"
                                                        } group-hover:translate-x-1`}
                                                    />
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </nav>

                            {/* Footer */}
                            <div className="p-6 border-t border-border">
                                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Rocket className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-foreground">
                                                Ready to start?
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                Protect your mango harvest
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        asChild
                                        size="sm"
                                        className="w-full"
                                        onClick={toggleSidebar}
                                    >
                                        <Link href="/signup">
                                            Get Started Free
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
};

export default HomeSidebar;
