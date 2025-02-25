"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";

interface User {
    userID: string;
    fName: string;
    lName: string;
    email: string;
    role: number;
    status: number;
    createdAt: Date;
    profileImage: string | null;
}
export default function AdminLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ userID: string }>;
}>) {
    const unwrappedParams = React.use(params);
    const { userID } = unwrappedParams;
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [userLoading, setUserLoading] = useState(false);
    const { userInfo } = useAuth();
    const pathname = usePathname();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setUserLoading(true);
                const res = await fetch(
                    `/api/admin/${userInfo?.userID}/user/${userID}`
                );
                const data = await res.json();
                if (res.ok) {
                    setUser(data.data);
                }
                {
                    toast({
                        description: data.error,
                    });
                }
            } catch (error) {
            } finally {
                setUserLoading(false);
            }
        };
        fetchUser();
    }, []);

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <button onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <Separator orientation="vertical" />
                    <div className="flex gap-2 h-5 items-center">
                        <h1 className="text-md">User Details</h1>
                    </div>
                </div>
            </div>
            <PageWrapper>
                {!user ? (
                    <div className="">loading</div>
                ) : (
                    <div className="w-full h-full flex gap-2">
                        <div className="h-32 w-32 bg-muted rounded-full"></div>
                        <div className="flex-1 flex flex-col ">
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg">
                                    {user?.fName + " " + user?.lName}
                                </h1>
                                <div
                                    className={`h-2 w-2 rounded-full ${
                                        user.status === 1
                                            ? "bg-primary"
                                            : "bg-destructive"
                                    }`}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="default">
                                    {user.role === 1 ? "Admin" : "User"}
                                </Badge>
                                <span className="text-sm">
                                    Joined at{" "}
                                    {format(user.createdAt, "LLL d yyy")}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex-1 w-full h-full">
                    <div className="flex gap-2 h-12">
                        <Link
                            href={`/admin/users/${userID}`}
                            className={`
                                flex items-center justify-center w-24
                                ${pathname === `/admin/users/${userID}`
                                    ? "border-b-4 border-primary"
                                    : ""}
                            `}
                        >
                            Trees
                        </Link>
                        <Link href={`/admin/users/${userID}/images`} 
                            className={`
                                flex items-center justify-center w-24
                                ${pathname === `/admin/users/${userID}/images`
                                    ? "border-b-4 border-primary"
                                    : ""}
                            `}>
                            Images
                        </Link>
                        <Link href={`/admin/users/${userID}/feedbacks`} 
                            className={`
                                flex items-center justify-center w-24
                                ${pathname === `/admin/users/${userID}/feedbacks`
                                    ? "border-b-4 border-primary"
                                    : ""}
                            `}>
                            Feedbacks
                        </Link>
                    </div>
                </div>
                {children}
            </PageWrapper>
        </>
    );
}
