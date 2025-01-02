"use client";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    BarChart,
    Activity,
    Users,
    DollarSign,
    MoreVertical,
    Eye,
    Bell,
    AlertCircle,
    TreeDeciduous,
    ImageIcon,
    Radar,
    Percent,
    LucideIcon,
    FileText,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Image as Img } from "@/type/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { set } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { usePendingProcess } from "@/context/pending-process-context";
import { getPendingTotalCount } from "@/utils/indexedDB/store/pending-store";

export default function Dashboard() {
    const { userInfo,resetToken } = useAuth();

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

    const [pendingCount, setPendingCount] = useState<number>(0);

    useEffect(() => {
        const fetchPendingCount = async () => {
            const count = await getPendingTotalCount();
            setPendingCount(count);
        };
        fetchPendingCount();
    }, []);

    return (
        <>
            <div className="w-full flex flex-col items-center justify-center">
                <div className="px-4 h-14 w-full items-center flex justify-between">
                    <div className="flex items-center">
                        <h1 className="text-md">Dashboard</h1>
                        {/* <h1 className="text-md">Hi {userInfo?.fName},</h1> */}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <button
                            className="relative p-2 rounded-full hover:bg-accent"
                            aria-label="Notifications"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full" />
                        </button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="cursor-pointer h-8 w-8">
                                    <AvatarImage
                                        src={userInfo?.profileImage}
                                        alt="@shadcn"
                                    />
                                    <AvatarFallback className="text-xs">{(userInfo?.fName?.charAt(0) ?? '') + (userInfo?.lName?.charAt(0) ?? '')}</AvatarFallback>
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
                                <DropdownMenuGroup>
                                    <Link href="/user/settings/profile">
                                        <DropdownMenuItem>
                                            Profile
                                            <DropdownMenuShortcut>
                                                ⌘P
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link href="/user/settings/account">
                                        <DropdownMenuItem>
                                            Account
                                            <DropdownMenuShortcut>
                                                ⌘A
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link href="/user/settings">
                                        <DropdownMenuItem>
                                            Settings
                                            <DropdownMenuShortcut>
                                                ⌘S
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </Link>
                                </DropdownMenuGroup>
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
            <Welcome />
            <PageWrapper>
                <Metrics />
                <div className="flex flex-col md:flex-row gap-4">
                    <RecentAnalysis />
                    <RecentActivities />
                </div>
            </PageWrapper>
        </>
    );
}

const Welcome = () => {
    const { userInfo } = useAuth()
    const [pendingCount, setPendingCount] = useState(0)
    const [unsavedProcessedCount, setUnsavedProcessedCount] = useState(0)

    const { pendings } = usePendingProcess()

    useEffect(() => {
        if (pendings) {
            const updatedPending = pendings.filter((pending) => pending.status === 1)
            const updatedUnsaved = pendings.filter((pending) => pending.status === 2)
            setPendingCount(updatedPending.length)
            setUnsavedProcessedCount(updatedUnsaved.length)
        }
    }, [pendings])

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Morning"
        if (hour < 17) return "Afternoon"
        return "Evening"
    }

    const totalCount = pendingCount + unsavedProcessedCount

    return (
        <div className="w-full px-4 py-0 flex flex-col items-center justify-center">
            <div className="w-full flex flex-col md:gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Good {getGreeting()} {userInfo?.fName}
                </h1>
                <p className="text-sm text-muted-foreground">
                    Here's a quick overview of your account and the progress
                    you've made.
                </p>
                {totalCount > 0 && (
                    <div className="mt-4 bg-destructive/20 border-0 flex items-center p-4 rounded-lg gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <div className="text-current m-0 text-sm">
                            You have {totalCount} {totalCount === 1 ? 'item' : 'items'} that need attention:{' '}
                            {pendingCount > 0 && (
                                <span>{pendingCount} pending {pendingCount === 1 ? 'process' : 'processes'}</span>
                            )}
                            {pendingCount > 0 && unsavedProcessedCount > 0 && ' and '}
                            {unsavedProcessedCount > 0 && (
                                <span>{unsavedProcessedCount} unsaved {unsavedProcessedCount === 1 ? 'process' : 'processed'}</span>
                            )}. View{' '}
                            <Link
                                href="/user/pending"
                                className="underline underline-offset-4 hover:text-destructive-foreground/90"
                            >
                                here
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
interface Metric {
    name: string;
    value: number;
    detail: string;
    icon: LucideIcon;
}
const Metrics = () => {
    const { userInfo } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState<Metric[]>([]);

    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/user/${userInfo?.userID}/dashboard/metrics`
                );
                if (response.ok) {
                    const data = await response.json();
                    const metricsData = data.metrics as Metric[];
                    const icons = [
                        { name: "Total Trees", icon: TreeDeciduous },
                        { name: "Total Images", icon: ImageIcon },
                        { name: "Disease Detected", icon: Radar },
                        { name: "Detection Rate", icon: Percent },
                    ];
                    const updatedMetrics = metricsData.map((metric) => {
                        const iconConfig = icons.find(
                            (icon) => icon.name === metric.name
                        );
                        return {
                            name: metric.name,
                            value: metric.value,
                            detail: metric.detail,
                            icon: iconConfig?.icon || TreeDeciduous,
                        };
                    });
                    setMetrics(updatedMetrics);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error retrieving metrics:", error);
            }finally{
                setLoading(false)
            }
        };
        if (userInfo?.userID !== undefined && userInfo?.userID !== null) {
            fetchMetrics();
        }
    }, [userInfo?.userID]);

    return (
        <Card className="border-0 p-0 shadow-none">
            {/* <CardHeader className="px-0">
                <CardTitle className="text-lg">Metrics</CardTitle>
            </CardHeader> */}
            <div className="grid gap-2 md:gap-4 grid-cols-2 lg:grid-cols-4">
                {loading
                    ? Array.from({ length: 4 }).map(
                          (_: unknown, index: number) => (
                              <Card key={index} className="overflow-hidden">
                                  <div className="h-24 w-full flex items-center justify-center p-8 animate-pulse bg-muted"></div>
                              </Card>
                          )
                      )
                    : 
                      metrics.map((metric, index) => (
                          <Card key={index} className="bg-card border-0 shadow-none">
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                                      {metric.name}
                                  </CardTitle>
                                  <metric.icon className="text-primary h-5 w-5" />
                              </CardHeader>
                              <CardContent>
                                  <div className="text-2xl font-bold">
                                      {metric.value}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                      {metric.detail}
                                  </p>
                              </CardContent>
                          </Card>
                      ))}
            </div>
        </Card>
    );
};

type Images = Img & {
    analyzedImage: string | null;
    treeCode?: number;
    diseases: { likelihoodScore: number; diseaseName: string }[];
};
const RecentAnalysis = () => {
    const [loading, setLoading] = useState(true);
    const [analysis, setAnalysis] = useState<Images[]>([]);
    const { userInfo } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/user/${userInfo?.userID}/dashboard/recent-analysis`
                );

                if (response.ok) {
                    const data = await response.json();
                    setAnalysis(data.recentAnalysis);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error retrieving images:", error);
            }
        };
        if (userInfo?.userID !== undefined && userInfo?.userID !== null) {
            fetchImages();
        }
    }, [userInfo?.userID]);

    return (
        <Card className="border-0 p-0 shadow-none flex-1">
            <div className="py-4 w-full flex items-center justify-between">
                <CardTitle className="text-lg">Recent Analysis </CardTitle>
                <Link
                    href={`/user/gallery`}
                    className="hover:underline text-primary"
                >
                    View All
                </Link>
            </div>
            <CardContent className="p-0 bg-card border rounded-md overflow-hidden">
                {loading ? (
                    <Skeleton className="flex-1 h-96" />
                ) : (
                    <ScrollArea className="h-[300px] ">
                        <Table className="relative">
                            <TableHeader className="h-8">
                                <TableRow>
                                    <TableHead className="w-[100px]">
                                        Image
                                    </TableHead>
                                    <TableHead className="table-cell">
                                        Tree Code
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Analyzed At
                                    </TableHead>
                                    <TableHead className="text-right hidden md:table-cell"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {analysis.map((image) => {
                                    const isHealthy = image.diseases?.some(
                                        (disease) =>
                                            disease.diseaseName === "Healthy" &&
                                            disease.likelihoodScore > 50
                                    );
                                    return (
                                        <TableRow
                                            key={image.imageID}
                                            className="cursor-pointer"
                                            onClick={() =>
                                                router.push(
                                                    `/user/gallery/${image.imageID}`
                                                )
                                            }
                                        >
                                            <TableCell>
                                                <Image
                                                    src={image.imageData}
                                                    alt={`Tree ${image.treeCode}`}
                                                    width={64}
                                                    height={64}
                                                    className="rounded-md h-10 w-10 object-cover"
                                                />
                                            </TableCell>
                                            <TableCell className="table-cell font-medium">
                                                {image.treeCode}
                                            </TableCell>
                                            <TableCell>
                                                {isHealthy ? (
                                                    <Badge
                                                        variant="default"
                                                        className="whitespace-nowrap"
                                                    >
                                                        {image.diseases?.find(
                                                            (disease) =>
                                                                disease.diseaseName ===
                                                                "Healthy"
                                                        )?.likelihoodScore || 0}
                                                        % Healthy
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive">
                                                        Diseases
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {new Date(
                                                    image.uploadedAt
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right hidden md:table-cell">
                                                <Link
                                                    href={`/user/image/${image.imageID}`}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
};
type Activity = {
    id: string;
    type: "upload" | "analysis" | "report";
    description: string;
    timestamp: string;
};

const RecentActivities = () => {
    const activities: Activity[] = [
        {
            id: "1",
            type: "upload",
            description: "Uploaded 5 new images",
            timestamp: "2 hours ago",
        },
        {
            id: "2",
            type: "analysis",
            description: "Completed analysis of Tree #1234",
            timestamp: "4 hours ago",
        },
        {
            id: "3",
            type: "report",
            description: "Generated monthly health report",
            timestamp: "1 day ago",
        },
        {
            id: "4",
            type: "upload",
            description: "Uploaded 3 new images",
            timestamp: "2 days ago",
        },
        {
            id: "5",
            type: "analysis",
            description: "Completed analysis of Tree #5678",
            timestamp: "3 days ago",
        },
        {
            id: "6",
            type: "upload",
            description: "Uploaded 3 new images",
            timestamp: "2 days ago",
        },
        {
            id: "7",
            type: "analysis",
            description: "Completed analysis of Tree #5678",
            timestamp: "3 days ago",
        },
    ];
    const getIcon = (type: Activity["type"]) => {
        switch (type) {
            case "upload":
                return <ImageIcon className="h-4 w-4" />;
            case "analysis":
                return <TreeDeciduous className="h-4 w-4" />;
            case "report":
                return <FileText className="h-4 w-4" />;
        }
    };
    return (
        <Card className="flex-1 border-0">
            <div className="py-4 w-full flex items-center justify-between">
                <CardTitle className="text-lg">Recent Activity </CardTitle>
                <Link
                    href={`/user/images`}
                    className="hover:underline text-primary"
                >
                    View All
                </Link>
            </div>
            <CardContent className="p-0 bg-card rounded-md border overflow-hidden">
                <ScrollArea className="h-[300px]">
                    <ul className="space-y-4 relative p-4">
                        {activities.map((activity) => (
                            <li
                                key={activity.id}
                                className="flex items-start gap-4"
                            >
                                <div className="bg-primary/10 p-2 rounded-full">
                                    {getIcon(activity.type)}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        {activity.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {activity.timestamp}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};
