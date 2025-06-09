"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageWrapper from "@/components/wrapper/page-wrapper";
import {
    Plus,
    MapPin,
    Calendar,
    MoreVertical,
    Eye,
    Edit,
    TreeDeciduous,
    Activity,
    Percent,
} from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Farm } from "@/types/types";
import { useEffect, useState } from "react";
import { getFarmByUser } from "@/stores/farm";
import { formatDate } from "date-fns";

interface FarmProps extends Farm{
    totalTrees: number;
    healthyTrees: number;
    healthRate: number;
}
export default function Farms() {
    const [farms, setFarms] = useState<FarmProps[]>([]);

    useEffect(() => {
        const getFarmData = async () => {
            try {
                const res = await getFarmByUser();
                if (res.success) {
                    setFarms(res.data as FarmProps[]);
                } else {
                    console.error("Failed to fetch farms:", res.message);
                }
            } catch (error) {
                console.error("Error fetching farms:", error);
            }
        };
        getFarmData();
    }, []);
    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <h1 className="text-md font-semibold">Farms</h1>
                    <Badge variant="outline" className="text-xs">
                        {farms.length}
                    </Badge>
                </div>

                <Link href={`/user/farm/add`}>
                    <Button variant="outline" className="w-10 md:w-auto">
                        <Plus className="h-5 w-5" />
                        <span className="hidden md:block text-sm">
                            Add New Farm
                        </span>
                    </Button>
                </Link>
            </div>
            <PageWrapper>
                <CardHeader className="p-0">
                    <CardDescription>
                        Manage and monitor your farm properties
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex-1">
                    {farms.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Plus className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">
                                No farms yet
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Get started by adding your first farm
                            </p>
                            <Link href="/user/farm/add">
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Farm
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {farms.map((farm) => {
                                const healthRate = 50;
                                return (
                                    <Link href={`/user/farm/${farm.farmID}`} key={farm.farmID}>
                                        <Card
                                            
                                            className="overflow-hidden hover:shadow-md transition-shadow border-muted"
                                        >
                                            <div
                                                className={`h-1 
                                                ${
                                                    farm.status === 1
                                                        ? "bg-primary"
                                                        : "bg-secondary"
                                                }`}
                                            />
                                            <CardHeader className="pb-2">
                                                <div className="flex items-start justify-between">
                                                    <CardTitle className="text-lg font-medium">
                                                        {farm.farmName}
                                                    </CardTitle>
                                                    <div
                                                        className={`${
                                                            farm.status == 1
                                                                ? "bg-primary"
                                                                : "bg-secondary"
                                                        } text-white px-2.5 py-0.5 rounded-full text-xs flex items-center`}
                                                    >
                                                        {farm.status == 1
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                    <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                                                    <span className="truncate">
                                                        {farm.address}
                                                    </span>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pb-4">
                                                {farm.description && (
                                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10">
                                                        {farm.description}
                                                    </p>
                                                )}

                                                <div className="space-y-3 mb-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1.5 text-sm">
                                                            <TreeDeciduous className="h-4 w-4 text-primary" />
                                                            <span>
                                                                Total Trees
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-medium">
                                                            {farm.totalTrees || 0}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1.5 text-sm">
                                                            <Activity className="h-4 w-4 text-primary" />
                                                            <span>
                                                                Healthy Trees
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-medium">
                                                            21212
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1.5 text-sm">
                                                            <Percent className="h-4 w-4 text-primary" />
                                                            <span>
                                                                Health Rate
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-medium">
                                                            {healthRate}%
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <div className="w-full bg-muted rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                                healthRate > 70
                                                                    ? "bg-primary"
                                                                    : healthRate >
                                                                      50
                                                                    ? "bg-secondary"
                                                                    : "bg-destructive"
                                                            }`}
                                                            style={{
                                                                width: `${healthRate}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center text-xs text-muted-foreground">
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        Added{" "}
                                                        {formatDate(
                                                            farm.addedAt,
                                                            " MMM dd, yyyy"
                                                        )}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <span className="sr-only">
                                                                        Open
                                                                        menu
                                                                    </span>
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent
                                                                align="end"
                                                                className="w-48"
                                                            >
                                                                <DropdownMenuItem
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={`/user/farm/${farm.farmID}`}
                                                                        className="flex items-center gap-2"
                                                                    >
                                                                        <MapPin className="h-4 w-4" />
                                                                        View
                                                                        Details
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={`/user/farm/${farm.farmID}/edit`}
                                                                        className="flex items-center gap-2"
                                                                    >
                                                                        <Activity className="h-4 w-4" />
                                                                        Edit
                                                                        Farm
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={`/user/tree/add?farmID=${farm.farmID}`}
                                                                        className="flex items-center gap-2"
                                                                    >
                                                                        <TreeDeciduous className="h-4 w-4" />
                                                                        Add Tree
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </PageWrapper>
        </>
    );
}
