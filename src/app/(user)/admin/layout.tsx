"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/side-bar";
import BottomNav from "@/components/layout/bottom-nav";
import { ScanResultProvider } from "@/context/scan-result-context";
// import ResultDisplay from "@/components/common/scan/scan-result"
import { Toaster } from "@/components/ui/toaster";
// import { useCameraContext } from "@/context/user-camera-context";
import { AuthProvider } from "@/context/auth-context";
import { OnlineStatusToast } from "@/components/common/online-status-toast";
import ResultDisplay from "@/components/common/scan/result/result-dislpay";
import { PendingProcessProvider } from "@/context/pending-process-context";
import { CameraProvider } from "@/context/camera-context";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const pathname = usePathname();

    useEffect(() => {
        const segments = pathname.split("/")

        if (segments.length < 3) {
            document.title = "Home"
        } else if (segments[2] === "user") {
            document.title = "Home"
        } else {
            document.title = segments[2].charAt(0).toUpperCase() + segments[2].slice(1)
        }
    },[pathname])
    
    return (
        <AuthProvider>
            <CameraProvider>
                <Main>{children}</Main>
            </CameraProvider>
        </AuthProvider>
    );
}
const Main = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="flex h-auto min-h-screen relative bg-background">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="w-full flex-1 flex flex-col overflow-hidden relative">
                <OnlineStatusToast />
                <ScanResultProvider>
                    <PendingProcessProvider>
                        <main className="flex-1 overflow-y-auto">
                            {children}
                            <ResultDisplay />
                        </main>
                    </PendingProcessProvider>
                </ScanResultProvider>
                <BottomNav />
                <Toaster />
            </div>
        </div>
    );
};
