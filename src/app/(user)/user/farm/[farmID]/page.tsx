"use client";

import { Button } from "@/components/ui/button";
import {
    AlertTriangle,
    ArrowDownUp,
    ArrowLeft,
    Bug,
    Calendar,
    CheckCircle,
    Edit,
    MapPin,
    Plus,
    SlidersHorizontal,
    TreeDeciduous,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    const { farm, trees, loading } = useFarmData(farmID);
    const router = useRouter();

    const [sortBy, setSortBy] = useState<"Newest" | "Oldest">("Newest");
    const [filterStatus, setFilterStatus] = useState<0 | 1 | 2>(0);

    const filteredTree =
        trees &&
        trees
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

    const isActive = farm?.status === 1;
    const healthPercentage = farm?.activeTrees
        ? (farm.healthyTrees / farm.activeTrees) * 100
        : 100;
    const diseasePercentage = farm?.activeTrees
        ? (farm.diseasedTrees / farm.activeTrees) * 100
        : 0;

    const sortedDiseases = Object.entries(farm?.diseaseCount || {})
        .sort(([, a], [, b]) => b - a)
        .filter(([disease]) => disease !== "Healthy");

    return (
        <>
            {/* Header Navigation */}
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <button onClick={handleBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <Separator orientation="vertical" />
                    <h1 className="text-md">{farm?.farmName || "unknown"}</h1>
                </div>

                <Link href={`/user/tree/add?farmID=${farmID}`}>
                    <Button variant="outline" className="w-10 md:w-auto bg-card/50">
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
                        <div className="space-y-6">
                            {/* Farm Profile Header */}
                            <div className="relative">
                                {/* Status indicator */}
                                {/* <div
                                    className={`absolute top-0 left-0 w-1 h-full rounded-l-md ${
                                        isActive
                                            ? "bg-primary"
                                            : "bg-destructive"
                                    }`}
                                /> */}

                                <div className="pl- rounded-md">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-bold">
                                                {farm.farmName}
                                            </h2>
                                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {farm.address ||
                                                        "No address specified"}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {farm.addedAt
                                                        ? format(
                                                              new Date(
                                                                  farm.addedAt
                                                              ),
                                                              "MMM dd, yyyy"
                                                          )
                                                        : "Recently added"}
                                                </div>
                                                <Badge
                                                    variant={
                                                        isActive
                                                            ? "default"
                                                            : "destructive"
                                                    }
                                                    className={`font-medium`}
                                                >
                                                    {isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/user/farm/${farmID}/edit`}
                                        >
                                            <Button
                                                variant="outline"
                                                className="w-10 md:w-auto bg-card/50"
                                            >
                                                <Edit className="w-4 h-4" />
                                                <span className="hidden md:block">
                                                    Edit Farm
                                                </span>
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Description */}
                                    {farm.description && (
                                        <div className="text-sm text-muted-foreground mt-4">
                                            {farm.description.length > 150 &&
                                            !showMore
                                                ? `${farm.description.slice(
                                                      0,
                                                      150
                                                  )}... `
                                                : farm.description}
                                            {farm.description.length > 150 && (
                                                <Button
                                                    variant="link"
                                                    className="p-0 h-auto text-xs"
                                                    onClick={() =>
                                                        setShowMore(!showMore)
                                                    }
                                                >
                                                    {showMore
                                                        ? "Show less"
                                                        : "Show more"}
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Statistics Section - styled like the farm card */}
                            <div className="space-y-2">
                                {/* Statistics Grid */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="text-center p-2 bg-card/50 rounded-lg border">
                                        <div className="text-lg font-bold">
                                            {farm.totalTrees || 0}
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-1">
                                                <div className="h-2 w-2 rounded-full bg-primary hidden md:block"></div>
                                                <span className="text-primary font-medium">
                                                    {farm.activeTrees || 0}
                                                </span>
                                                <span className="text-primary hidden md:block">
                                                    Active
                                                </span>
                                            </div>
                                            <div className="text-muted-foreground flex items-center gap-1">
                                                <span>Total Trees</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="h-2 w-2 rounded-full bg-destructive hidden md:block"></div>
                                                <span className="text-destructive font-medium">
                                                    {farm.inactiveTrees || 0}
                                                </span>
                                                <span className="text-destructive hidden md:block">
                                                    Inactive
                                                </span>
                                            </div></div>
                                    </div>
                                    <div className="text-center p-2 bg-primary/10 rounded-lg border border-primary/20">
                                        <div className="text-lg font-bold text-primary">
                                            {farm.healthyTrees || 0}
                                        </div>
                                        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                            <span>Healthy</span>
                                        </div>
                                    </div>
                                    <div className="text-center p-2 bg-destructive/10 rounded-lg border border-destructive/20">
                                        <div className="text-lg font-bold text-destructive">
                                            {farm.diseasedTrees || 0}
                                        </div>
                                        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                            <span>Diseased</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Farm Health */}
                                <div className="flex flex-col gap-1.5 bg-card/50 p-3 rounded-lg border">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">
                                                Farm Health
                                            </span>
                                        </div>
                                        <span className="text-sm font-bold">
                                            {farm.farmHealth}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-muted-foreground/10 rounded-full h-2.5 overflow-hidden">
                                        <div className="flex h-full">
                                            <div
                                                className="h-full bg-primary transition-all duration-300"
                                                style={{
                                                    width: `${healthPercentage}%`,
                                                }}
                                            />
                                            <div
                                                className="h-full bg-destructive transition-all duration-300"
                                                style={{
                                                    width: `${diseasePercentage}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <span className="h-2 w-2 rounded-full bg-primary inline-block"></span>
                                            <span>
                                                Healthy:{" "}
                                                {healthPercentage.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="h-2 w-2 rounded-full bg-destructive inline-block"></span>
                                            <span>
                                                Diseased:{" "}
                                                {diseasePercentage.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Disease Breakdown */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium flex items-center gap-1.5">
                                            <Bug className="h-4 w-4 text-destructive" />
                                            Disease Found
                                        </span>
                                        {sortedDiseases.length > 0 && (
                                            <Badge
                                                variant="outline"
                                                className="text-xs font-normal"
                                            >
                                                {sortedDiseases.length}{" "}
                                                {sortedDiseases.length === 1
                                                    ? "type"
                                                    : "types"}
                                            </Badge>
                                        )}
                                    </div>

                                    {sortedDiseases.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin">
                                            {sortedDiseases.map(
                                                ([disease, count]) => (
                                                    <div
                                                        key={disease}
                                                        className="flex items-center justify-between p-2 bg-destructive/5 border border-destructive/20 rounded-md hover:bg-destructive/10 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                                            <div className="h-2 w-2 rounded-full bg-destructive"></div>
                                                            <div className="font-medium text-xs text-foreground capitalize truncate">
                                                                {disease
                                                                    .replace(
                                                                        /([A-Z])/g,
                                                                        " $1"
                                                                    )
                                                                    .trim()}
                                                            </div>
                                                        </div>
                                                        <div className="text-xs font-bold text-destructive">
                                                            {count}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-2.5 bg-primary/5 border border-primary/20 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                <div className="font-medium text-sm text-foreground">
                                                    No diseases detected
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Tree Filtering Controls */}
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2 md:gap-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-10 md:w-auto gap-1 bg-card/50"
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
                                                    className={`w-10 md:w-auto gap-1 bg-card/50 ${
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
                                    <div className="text-sm text-muted-foreground">
                                        {filteredTree?.length || 0}{" "}
                                        {(filteredTree?.length || 0) === 1
                                            ? "tree"
                                            : "trees"}
                                    </div>
                                </div>

                                {/* Trees List */}
                                <div>
                                    {loading && trees.length === 0 ? (
                                        <div className="flex-1 h-full w-full flex items-center justify-center p-8 border rounded-lg bg-muted/10">
                                            loading
                                        </div>
                                    ) : trees && trees.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                                            {filteredTree.map((tree, index) => (
                                                <TreeCard
                                                    tree={tree}
                                                    key={index}
                                                    handleAction={handleAction}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex-1 h-40 w-full flex items-center justify-center border rounded-lg bg-muted/10">
                                            <div className="text-center space-y-2">
                                                <TreeDeciduous className="h-8 w-8 mx-auto text-muted-foreground" />
                                                <p className="text-muted-foreground">
                                                    No trees found
                                                </p>
                                                <Link
                                                    href={`/user/tree/add?farmID=${farmID}`}
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="gap-1"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                        <span>Add Tree</span>
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </PageWrapper>
            )}
        </>
    );
}
