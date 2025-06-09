"use client";
import { Button } from "@/components/ui/button";
import {
    Activity,
    ArrowDownUp,
    ArrowLeft,
    Calendar,
    Edit,
    MapPin,
    Percent,
    Plus,
    SlidersHorizontal,
    TreeDeciduous,
} from "lucide-react";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "date-fns/format";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Farm } from "@/types/types";
import { getFarmByID } from "@/stores/farm";

interface FarmProfileProps extends Farm {
    totalTrees: number;
    healthyTrees: number;
    healthRate: number;
}
export default function FarmProfile({
    params,
}: {
    params: Promise<{ farmID: string }>;
}) {
    const [showMore, setShowMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const unwrappedParams = React.use(params);
    const { farmID } = unwrappedParams;
    const router = useRouter();
    const [sortBy, setSortBy] = useState<"Newest" | "Oldest" | "Health">(
        "Newest"
    );
    const [filterStatus, setFilterStatus] = useState<0 | 1 | 2>(0);
    const [farmData, setFarmData] = useState<FarmProfileProps | null>(null);

    useEffect(() => {
        const fetchFarmData = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await getFarmByID(farmID);
                if (res.success) {
                    setFarmData(res.data);
                } else {
                    setError(res.message || "Failed to fetch farm data");
                }
            } catch (error) {
                console.error("Error fetching farm data:", error);
                setError("Failed to load farm data. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchFarmData();
    }, [farmID]);
    const handleBack = () => {
        router.back();
    };
    const getHealthStatusColor = (health: number) => {
        if (health >= 90) return "text-emerald-600";
        if (health >= 75) return "text-green-600";
        if (health >= 60) return "text-amber-600";
        return "text-red-600";
    };
    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <button onClick={handleBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <Separator orientation="vertical" />
                    <h1 className="text-md">
                        {farmData?.farmName || "unknown"}
                    </h1>
                </div>

                <Link  href={`/user/tree/add?farmID=${farmID}`}>
                    <Button variant="outline" className="w-10 md:w-auto">
                        <Plus className="h-5 w-5" />
                        <span className="hidden md:block text-sm">
                            Add Tree
                        </span>
                    </Button>
                </Link>
            </div>
            {loading ? (
                <div className="flex-1 w-full flex items-center justify-center">
                    loading
                </div>
            ) : (
                <PageWrapper className="gap-4">
                    {farmData !== null && farmData && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <h2 className="text-xl lg:text-3xl font-bold">
                                        {farmData.farmName}
                                    </h2>
                                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {farmData.address}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(
                                                farmData.addedAt,
                                                "MMM dd, yyyy"
                                            )}
                                        </div>
                                        <Badge
                                            variant={
                                                farmData.status === 1
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {farmData.status === 1
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </div>
                                </div>
                                <Link href={`/user/farm/${farmID}/edit`}>
                                    <Button
                                        variant="outline"
                                        className="w-10 md:w-auto"
                                        // onClick={() => setOpenDialog(true)}
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span className="hidden md:block">
                                            Edit Farm
                                        </span>
                                    </Button>
                                </Link>
                            </div>

                            {/* Description */}
                            <div className="text-sm text-muted-foreground">
                                {farmData.description && (
                                    <>
                                        {farmData.description.length > 150 ? (
                                            <>
                                                {!showMore ? (
                                                    <>
                                                        {farmData.description.slice(
                                                            0,
                                                            150
                                                        )}
                                                        ...{" "}
                                                        <Button
                                                            variant="link"
                                                            className="p-0 h-auto text-xs"
                                                            onClick={() =>
                                                                setShowMore(
                                                                    true
                                                                )
                                                            }
                                                        >
                                                            Show more
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {farmData.description}{" "}
                                                        <Button
                                                            variant="link"
                                                            className="p-0 h-auto text-xs"
                                                            onClick={() =>
                                                                setShowMore(
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            Show less
                                                        </Button>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            farmData.description
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3  gap-4">
                                {/* Total Trees */}
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-0">
                                        <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                                            Total Trees
                                        </CardTitle>
                                        <TreeDeciduous className="w-4 h-4 text-primary" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {farmData.totalTrees?.toLocaleString() ||
                                                0}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Trees in this farm
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Healthy Trees */}
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-0">
                                        <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                                            Healthy Trees
                                        </CardTitle>
                                        <Activity className="w-4 h-4 text-primary" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {farmData.healthyTrees?.toLocaleString() ||
                                                0}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Trees in good condition
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Health Rate */}
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-0">
                                        <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                                            Health Rate
                                        </CardTitle>
                                        <Activity className="w-4 h-4 text-primary" />
                                    </CardHeader>
                                    <CardContent className="flex flex-col">
                                        <div className="flex-1 flex flex-row w-full justify-between">
                                            <div className="mt-2">
                                                <Progress
                                                    value={
                                                        farmData.healthRate || 0
                                                    }
                                                    className="h-2"
                                                    style={{
                                                        background:
                                                            "rgb(243 244 246)",
                                                    }}
                                                />
                                            </div>
                                            <div
                                                className={`text-2xl font-bold ${getHealthStatusColor(
                                                    farmData.healthRate || 0
                                                )}`}
                                            >
                                                {farmData.healthRate || 0}%
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Overall farm health
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* <Progress value={healthRate} className="h-2 w-full max-w-md" /> */}
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 md:gap-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-10 md:w-auto gap-1"
                                    >
                                        <ArrowDownUp className="h-3.5 w-3.5" />
                                        <span className="hidden md:block">
                                            {sortBy}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                        Sort by:{" "}
                                    </DropdownMenuLabel>
                                    <DropdownMenuCheckboxItem
                                        checked={sortBy == "Newest"}
                                        onCheckedChange={() => {
                                            setSortBy("Newest");
                                        }}
                                    >
                                        Newest to oldest
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={sortBy == "Oldest"}
                                        onCheckedChange={() => {
                                            setSortBy("Oldest");
                                        }}
                                    >
                                        Oldest to newest
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`w-10 md:w-auto gap-1 ${
                                            filterStatus != 0 &&
                                            "border-primary"
                                        }`}
                                    >
                                        <SlidersHorizontal className="h-3.5 w-3.5" />
                                        <span className="hidden md:block">
                                            {filterStatus == 1
                                                ? "Healthy"
                                                : filterStatus == 2
                                                ? "Diseases"
                                                : "Filter"}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuLabel>
                                        Filter by:{" "}
                                    </DropdownMenuLabel>
                                    <DropdownMenuCheckboxItem
                                        checked={filterStatus == 0}
                                        onCheckedChange={() =>
                                            setFilterStatus(0)
                                        }
                                    >
                                        All
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={filterStatus == 1}
                                        onCheckedChange={() =>
                                            setFilterStatus(1)
                                        }
                                    >
                                        Healthy
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={filterStatus == 2}
                                        onCheckedChange={() =>
                                            setFilterStatus(2)
                                        }
                                    >
                                        Diseases
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className=""></div>
                    </div>
                </PageWrapper>
            )}
        </>
    );
}
