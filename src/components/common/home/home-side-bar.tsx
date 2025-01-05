"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
    return (
        <>
            {isOpen && (
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden ${
                        isOpen ? "pointer-events-auto" : "pointer-events-none"
                    }`}
                    onClick={toggleSidebar}
                    aria-hidden="true"
                />
            )}
            <aside
                className={`fixed bg-card border-r inset-y-0 left-0 z-40 w-72 md:w-80 transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } transition-all duration-300 ease-in-out lg:hidden`}
            >
                <div className="w-full h-full p-4 flex flex-col gap-4">
                    <div className="flex items-center justify-start gap-1">
                        <Link href="/" aria-label="Home">
                            <Image
                                src="/assets/icon/icon.png"
                                alt=""
                                width={48}
                                height={48}
                                className="w-6 h-6"
                            />
                        </Link>
                        <div className="h-full flex items-end">
                            <h2 className="text-xl line-clamp-2 font-bold bg-gradient-to-r from-green-900 via-green-500 to-yellow-400 text-transparent bg-clip-text">
                                MangoCare
                            </h2>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-2">
                        {sections.map((title) => (
                            <Link
                                key={title}
                                href={`#${title.replaceAll(" ", "-")}`}
                                onClick={() => {
                                    setActiveLink(title);
                                    toggleSidebar();
                                }}
                            >
                                <Button
                                    variant="ghost"
                                    className={`w-full item justify-start ${
                                        activeLink === title
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-background"
                                    }`}
                                >
                                    <span>{title}</span>
                                </Button>
                            </Link>
                        ))}
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default HomeSidebar;
