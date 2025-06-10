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
import { useFarmData } from "@/hooks/use-farm-data";
import TreeCard from "@/components/card/tree-card";

export default function FarmProfile({
    params,
}: {
    params: Promise<{ farmID: string }>;
}) {
    const [showMore, setShowMore] = useState(false);
    const unwrappedParams = React.use(params);
    const { farmID } = unwrappedParams;
    const { farm, setFarm, trees, loading } = useFarmData(farmID);
    const router = useRouter();

    const [sortBy, setSortBy] = useState<"Newest" | "Oldest">("Newest");
    const [filterStatus, setFilterStatus] = useState<0 | 1 | 2>(0);

    const filteredTree = trees
        .filter((tree) => filterStatus == 0 || tree.status == filterStatus)
        .sort((a, b) => {
            if (sortBy === "Newest") {
                return (
                    new Date(b.addedAt).getTime() -
                    new Date(a.addedAt).getTime()
                );
            } else {
                return (
                    new Date(a.addedAt).getTime() -
                    new Date(b.addedAt).getTime()
                );
            }
        });

    const handleBack = () => {
        router.back();
    };
    const handleAction = async (e: any, action: string, treeID: string) => {};

    const farmHealth = farm?.farmHealth;
    const isActive = farm?.status === 1;

    const sortedDiseases = Object.entries(farm?.diseaseCount || {})
        .sort(([, a], [, b]) => b - a)
        .filter(([disease, count], index) => disease !== "Healthy");

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <button onClick={handleBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <Separator orientation="vertical" />
                    <h1 className="text-md">{farm?.farmName || "unknown"}</h1>
                </div>

                <Link href={`/user/tree/add?farmID=${farmID}`}>
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
                    {farm !== null && farm && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <h2 className="text-xl lg:text-2xl font-bold">
                                        {farm.farmName}
                                    </h2>
                                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {farm.address}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {/* {formatDate(
                                                farm.addedAt,
                                                "MMM dd, yyyy"
                                            )} */}
                                        </div>
                                        <Badge
                                            variant={
                                                farm.status === 1
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {farm.status === 1
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
                                {farm.description && (
                                    <>
                                        {farm.description.length > 150 ? (
                                            <>
                                                {!showMore ? (
                                                    <>
                                                        {farm.description.slice(
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
                                                        {farm.description}{" "}
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
                                            farm.description
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex flex-col max-w-lg gap-4">
                                <div className="grid grid-cols-3 gap-4 ">
                                    <div className="text-center p-1 bg-muted/10  rounded-lg border">
                                        <div className="text-lg font-bold ">
                                            {farm.totalTrees || 0}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Total Trees
                                        </div>
                                    </div>
                                    <div className="text-center p-1 bg-primary/10 rounded-lg border">
                                        <div className="text-lg font-bold text-primary">
                                            {farm.healthyTrees}
                                        </div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">
                                            Healthy
                                        </div>
                                    </div>
                                    <div className="text-center p-1 bg-destructive/10 rounded-lg border">
                                        <div className="text-lg font-bold text-destructive">
                                            {farm.diseasedTrees}
                                        </div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">
                                            Diseased
                                        </div>
                                    </div>
                                </div>

                                {/* Farm Health */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Farm Health
                                            </span>
                                        </div>
                                        <span
                                            className={`text-sm font-bold text-primary`}
                                        >
                                            {farm.farmHealth}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 bg-primary`}
                                            style={{
                                                width: `${farm.farmHealth}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col max-w-lg gap-4">
                            {sortedDiseases.length > 0 ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-foreground">
                                                Disease Found:
                                            </span>
                                        </div>
                                    </div>

                                    {/* Disease List */}
                                    <div className="grid grid-cols-3 gap-2">
                                        {sortedDiseases.map(
                                            ([disease, count], index) => {
                                                return (
                                                    <div
                                                        key={disease}
                                                        className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded-lg hover:bg-destructive/10 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-medium text-sm text-foreground capitalize truncate">
                                                                    {disease
                                                                        .replace(
                                                                            /([A-Z])/g,
                                                                            " $1"
                                                                        )
                                                                        .trim()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            <div className="text-right">
                                                                <div className="text-sm font-bold text-destructive">
                                                                    {count}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-1 px-2 bg-muted border rounded hover:bg-destructive/10 transition-colors">
                                    <div className="font-medium text-xs text-foreground capitalize truncate">
                                        None
                                    </div>
                                </div>
                            )}
                            </div>
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

                    <CardContent className="p-0 flex-1">
                        {loading && trees.length === 0 ? (
                            <div className="flex-1 h-full w-full flex items-center justify-center">
                                loading
                            </div>
                        ) : trees && trees.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                                {filteredTree.map((tree, index) => (
                                    <TreeCard
                                        tree={tree}
                                        key={index}
                                        handleAction={handleAction}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 h-full w-full flex items-center justify-center">
                                No Trees
                            </div>
                        )}
                    </CardContent>
                </PageWrapper>
            )}
        </>
    );
}
