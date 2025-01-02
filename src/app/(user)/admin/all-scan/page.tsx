"use client"
import { CardContent } from "@/components/ui/card";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useAuth } from "@/context/auth-context";

export default function Page() {
    const { userInfo } = useAuth();

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <h1 className="text-md">Gallery</h1>
                </div>
                <div className="flex items-center gap-2">
                    
                </div>
            </div>
            <PageWrapper>
                <CardContent>
                    
                </CardContent>
            </PageWrapper>
        </>
    );
}
