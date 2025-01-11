"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import { sidebarItems } from "@/constant/sidebar-item";
// import { ScrollArea } from '../ui/scroll-area';
//import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { useAuth } from "@/context/auth-context";
import { MetaData } from "@/constant/metaData";
//import { useAuth } from '@/context/auth-context';
//import { Skeleton } from '../ui/skeleton';

interface Sidebar {
    isOpen: boolean;
    toggleSidebar: () => void;
}
const Sidebar = ({ isOpen, toggleSidebar }: Sidebar) => {
    const pathname = usePathname();
    const { userInfo } = useAuth();
    // const router = useRouter();

    const items = sidebarItems(userInfo?.role);

    // const handleLogout = async () => {
    //   const response = await fetch('/api/auth/logout', {
    //     method: 'POST',

    //     headers: { 'Content-Type': 'application/json' },
    //   })
    //   if (response.ok) {
    //     router.push("/signin")
    //   }
    // }

    return (
        <div className="w-0 lg:w-64 relative">
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={toggleSidebar}
                    aria-hidden="true"
                />
            )}
            {/* Sidebar */}
            <div
                className={`fixed bg-card border-r inset-y-0 left-0 z-30 w-72 lg:w-64 transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full "
                } transition-all duration-300 ease-in-out lg:translate-x-0`}
            >
                {/* <ScrollArea className='h-screen'> */}
                <div className="h-14 flex items-center justify-between px-4 border-b">
                    <div className="flex gap-1 items-center justify-center px-3">
                        <Image
                            src={MetaData.icons.icon}
                            alt="icon"
                            width={48}
                            height={48}
                            className="w-6 h-6"
                        />
                        <h2 className="text-2xl font-bold text-foreground">
                            {MetaData.title}
                        </h2>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Close sidebar"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
                {/* Sidebar content wrapper */}
                <div className="flex flex-col h-[calc(100vh-56px)]">
                    {/* Navigation */}
                    <nav className="p-4 flex-grow">
                        {items.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={toggleSidebar}
                            >
                                <Button
                                    variant="ghost"
                                    className={`w-full item justify-start ${
                                        (pathname.startsWith(item.href) &&
                                            item.href.split("/").length > 2) ||
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
                    </nav>
                    {/* Account button at the bottom */}
                    <div className="px-4  mt-auto">
                        <Button
                            className={`w-full mb-4 h-12 text-left bg-transparent shadow-none text-foreground text-sm font-semibold p-2 py-4 rounded-lg group transition-colors hover:bg-background
                flex items-center justify-start gap-3`}
                            onClick={toggleSidebar}
                        >
                            <Avatar className="h-8 w-8 bg-background flex items-center justify-center rounded-full group-hover:bg-card">
                                <AvatarFallback className="text-xs">
                                    JD
                                </AvatarFallback>
                            </Avatar>
                            <p>AL monsour salida</p>
                        </Button>
                    </div>
                </div>
                {/* </ScrollArea> */}
            </div>
        </div>
    );
};
// const ItemSkeleton = () => {
//   return (
//     Array(10).fill(0).map((_, index) => (
//       <Skeleton
//         key={index}
//         className="w-100 h-9 px-3 py-2 rounded-lg bg-background animate-pulse"
//       />
//     ))
//   );
// };

export default Sidebar;
