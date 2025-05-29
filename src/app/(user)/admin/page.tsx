"use client";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useAuth } from "@/context/auth-context";
import {
    GetImageHeathStatusBadge,
    GetImageStatusBadge,
    GetTreeStatusBadge,
} from "@/helper/get-badge";
import { useMetrics } from "@/hooks/use-metrics";
import useRecentAnalysis from "@/hooks/use-recent-analysis";
import { removeOldDatabase } from "@/stores/indexeddb";
import { loadingStore$ } from "@/stores/loading-store";
import { Image as Img, Tree, User } from "@/types/types";
import { format } from "date-fns";
import {
    Eye,
    ImageIcon,
    LucideIcon,
    MessageSquare,
    SquareArrowOutUpRight,
    TreeDeciduous,
    User2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const { userInfo, resetToken } = useAuth();

    const handleLogout = async () => {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            window.location.href = "/signin";
            resetToken();
        }
    };
    return (
        <>
            <div className="w-full flex flex-col items-center justify-center">
                <div className="px-4 h-14 w-full items-center flex justify-between">
                    <div className="flex items-center">
                        {/* <h1 className="text-md">Dashboard</h1> */}
                        <h1 className="text-md">
                            <span>
                                {"Hi Admin "}
                                {userInfo?.fName},
                            </span>
                            {/* {treeLoading && imageLoading ? "loading" : "loaded"} */}
                        </h1>
                        
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="cursor-pointer h-8 w-8 border">
                                    {/* <AvatarImage
                                        src={userInfo?.profileImage}
                                        alt={`${userInfo?.fName} ${userInfo?.lName}`}
                                    /> */}
                                    <AvatarFallback className="text-xs">
                                        {(userInfo?.fName?.charAt(0) ?? "") +
                                            (userInfo?.lName?.charAt(0) ?? "")}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-40 md:w-56"
                                align="end"
                            >
                                <DropdownMenuLabel className="flex flex-col">
                                    <span className="text-md font-medium">
                                        {userInfo?.fName} {userInfo?.lName}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {userInfo?.email}
                                    </span>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    Log out
                                    <DropdownMenuShortcut>
                                        ⇧⌘Q
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {/* welcome admin section */}
            <Welcome />
            <PageWrapper>
                <Metrics />
                <div className="w-full flex flex-col md:flex-row gap-4">
                    <RecentTrees />
                    <RecentImages />
                </div>
            </PageWrapper>
        </>
    );
}
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
};
const Welcome = () => {
    return (
        <div className="w-full px-4 py-0 flex flex-col items-center justify-center">
            <div className="w-full flex flex-col md:gap-2">
                <h1 className="text-2xl font-bold">
                    <span>Good {getGreeting()}</span>
                </h1>
                <p className="text-sm text-muted-foreground">
                    {"Here's"} an overview of the system.
                </p>
            </div>
        </div>
    );
};
interface Metric {
    name: string;
    value: number;
    detail: string;
    icon: LucideIcon;
    link: string;
}
const Metrics = () => {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState<Metric[]>([]);

    const { userInfo } = useAuth();
    const metricInfo = [
        { name: "Total User", icon: User2Icon, link: "/admin/users" },
        { name: "Total Images", icon: ImageIcon, link: "/admin/images" },
        { name: "Total Trees", icon: TreeDeciduous, link: "/admin/trees" },
        {
            name: "Total Feedback",
            icon: MessageSquare,
            link: "/admin/feedbacks",
        },
    ];

    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/admin/${userInfo?.userID}/dashboard/metrics`
                );
                if (response.ok) {
                    const { data } = await response.json();
                    const formattedMetrics = (data as Metric[]).map(
                        (metric) => ({
                            ...metric,
                            icon:
                                metricInfo.find(
                                    (info) => info.name === metric.name
                                )?.icon || TreeDeciduous,
                            link:
                                metricInfo.find(
                                    (info) => info.name === metric.name
                                )?.link || "/admin/dashboard",
                        })
                    );
                    setMetrics(formattedMetrics);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    return (
        <Card className="border-0 p-0 shadow-none">
            <div className="grid gap-2 md:gap-4 grid-cols-2 lg:grid-cols-4">
                {loading
                    ? Array.from({ length: 4 }).map((_, index) => (
                          <Skeleton
                              key={index}
                              className="h-28 border w-full flex items-center justify-center p-8 animate-pulse bg-muted"
                          />
                      ))
                    : metrics.map((metric, index) => (
                          <Card key={index} className="bg-caard shadow-none">
                              <CardHeader className="flex flex-row items-center justify-between pb-0">
                                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                                      {metric.name}
                                  </CardTitle>
                                  <metric.icon className="text-primary h-5 w-5" />
                              </CardHeader>
                              <CardContent>
                                  <div className="text-2xl font-bold">
                                      {metric.value}
                                  </div>
                                  <div className="flex justify-between items-center">
                                      <p className="text-xs text-muted-foreground">
                                          {metric.detail}
                                      </p>
                                      <Link
                                          href={metric.link}
                                          className="flex items-center gap-1 text-xs"
                                      >
                                          <SquareArrowOutUpRight className="text-primary h-5 w-5" />
                                      </Link>
                                  </div>
                              </CardContent>
                          </Card>
                      ))}
            </div>
        </Card>
    );
};

type Trees = Tree & User & { imagesLength: number };
const RecentTrees = () => {
    const [loading, setLoading] = useState(true);
    const [trees, setTrees] = useState<Trees[]>([]);

    const { userInfo } = useAuth();

    useEffect(() => {
        const fetchRecentTrees = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/admin/${userInfo?.userID}/tree`
                );
                if (response.ok) {
                    const { data } = await response.json();
                    console.log(data);
                    setTrees((data as Trees[]).slice(0, 5));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentTrees();
    }, []);

    return (
        <Card className="border-0 p-0 shadow-none flex-1">
            <div className="py-2 w-full flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Recent Trees
                </CardTitle>
                <Link href="/admin/trees" className="flex items-center">
                    <span className="text-sm text-primary">View more</span>
                </Link>
            </div>
            <CardContent className="p-0 border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-card">
                        <TableRow>
                            <TableHead>Tree Code</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead className="hidden md:table-cell">
                                Status
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableSkeleton />
                        ) : trees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    No Trees
                                </TableCell>
                            </TableRow>
                        ) : (
                            trees.map((tree) => (
                                <TableRow key={tree.treeID} className="h-12">
                                    <TableCell className="h-12">
                                        <Link
                                            href={`/admin/tree/${tree.treeID}`}
                                            className="hover:underline"
                                        >
                                            {tree.treeCode}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="h-12">
                                        <Link
                                            href={`/admin/user/${tree.userID}`}
                                            className="hover:underline"
                                        >
                                            {tree.fName + " " + tree.lName}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {GetTreeStatusBadge(tree.status)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
type Images = Img & {
    analyzedImage: string;
    treeID: string;
    treeCode: string;
    userID: string;
    userName: string;
    diseases: { likelihoodScore: number; diseaseName: string }[];
};
const RecentImages = () => {
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<Images[]>([]);

    const { userInfo } = useAuth();

    useEffect(() => {
        const fetchRecentImages = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/admin/${userInfo?.userID}/images`
                );
                if (response.ok) {
                    const { data } = await response.json();
                    setImages((data as Images[]).slice(0, 5));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentImages();
    }, []);

    return (
        <Card className="border-0 p-0 shadow-none flex-1">
            <div className="py-2 w-full flex items-center justify-between">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                    Recent Images
                </CardTitle>
                <Link href="/admin/images" className="flex items-center">
                    <span className="text-sm text-primary">View more</span>
                </Link>
            </div>

            <CardContent className="p-0 border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Image</TableHead>
                            <TableHead className="hidden md:table-cell text-center">
                                Tree Code
                            </TableHead>
                            <TableHead className="hidden md:table-cell text-center">
                                Tree Status
                            </TableHead>
                            <TableHead className="table-cell text-center">
                                Health Status
                            </TableHead>

                            <TableHead className="hidden md:table-cell text-center">
                                User
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableSkeleton />
                        ) : images && images.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    No images
                                </TableCell>
                            </TableRow>
                        ) : (
                            images &&
                            images.map((img, index) => (
                                <TableRow className="group" key={index}>
                                    <TableCell className="">
                                        <Image
                                            src={img.imageData}
                                            alt={img.imageID}
                                            className="h-8 w-8 group-hover:hidden rounded"
                                            width={100}
                                            height={100}
                                            objectFit="cover"
                                        />
                                        <Image
                                            src={img.analyzedImage}
                                            alt={img.imageID}
                                            className="h-8 w-8 hidden group-hover:block rounded"
                                            width={100}
                                            height={100}
                                            objectFit="cover"
                                        />
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-center">
                                        <Link
                                            href={`/admin/trees/${img.treeID}`}
                                            className="hover:underline"
                                        >
                                            {img.treeCode}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-center">
                                        {GetImageStatusBadge(img.status)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {GetImageHeathStatusBadge(img.diseases)}
                                    </TableCell>

                                    <TableCell className="hidden md:table-cell text-center">
                                        <Link
                                            href={`/admin/users/${img.userID}`}
                                            className="hover:underline"
                                        >
                                            {img.userName}
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
