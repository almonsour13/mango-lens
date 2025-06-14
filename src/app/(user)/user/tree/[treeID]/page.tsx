"use client";
import { CardContent } from "@/components/ui/card";
import React, { useState } from "react";

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageWrapper from "@/components/wrapper/page-wrapper";

import { TreeImageCard } from "@/components/card/tree-image-card";
import { TreeImageSkeletonCard } from "@/components/skeleton/skeleton-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "date-fns";
import {
    ArrowDownUp,
    ArrowLeft,
    Calendar,
    Edit,
    Plus,
    SlidersHorizontal,
    TreeDeciduous,
    Trees,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTreeData } from "@/hooks/use-tree-data";
import { format } from "date-fns";

export default function TreeProfile({
    params,
}: {
    params: Promise<{ treeID: string }>;
}) {
    const pathname = usePathname();
    const unwrappedParams = React.use(params);
    const { treeID } = unwrappedParams;
    const { tree, setTree, images, loading } = useTreeData(treeID);

    const [openDialog, setOpenDialog] = useState(false);
    const [sortBy, setSortBy] = useState<"Newest" | "Oldest">("Newest");
    const [filterStatus, setFilterStatus] = useState<0 | 1 | 2>(0);
    const filteredImages =
        images &&
        images
            .filter(
                (image) =>
                    filterStatus === 0 ||
                    (filterStatus === 1 &&
                        image.disease.diseaseName === "Healthy") ||
                    (filterStatus === 2 &&
                        image.disease.diseaseName !== "Healthy")
            )
            .sort((a, b) => {
                if (sortBy === "Newest") {
                    return (
                        new Date(b.uploadedAt).getTime() -
                        new Date(a.uploadedAt).getTime()
                    );
                } else {
                    return (
                        new Date(a.uploadedAt).getTime() -
                        new Date(b.uploadedAt).getTime()
                    );
                }
            });

    const router = useRouter();

    const handleBack = () => {
        router.back();
    };
    const pathSegments = pathname.split("/");

    // const handleTreeAction = (value: Tree) => {
    //     setTree(value);
    // };
    const [showMore, setShowMore] = useState(false);
    const isActive = tree?.status === 1;

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <button onClick={handleBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <Separator orientation="vertical" />
                    <h1 className="text-md">{tree?.treeCode}</h1>
                </div>
                <Link
                    href={`${pathSegments[0] + "/" + pathSegments[1]}/scan/${
                        tree?.farmID
                    }/${tree?.treeID}`}
                >
                    <Button variant="outline" className="w-10 md:w-auto bg-card/50">
                        <Plus className="h-5 w-5" />
                        <span className="hidden md:block text-sm">
                            Scan New Image
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
                    <div className="space-y-6">
                        {tree !== null && tree && (
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
                                    <div className="flex gap-4">
                                        <Avatar
                                            className={`h-24 w-24 rounded-md ${
                                                isActive
                                                    ? "bg-primary/10"
                                                    : "bg-destructive/10"
                                            }`}
                                        >
                                            <AvatarImage
                                                src={
                                                    tree?.treeImage ||
                                                    "/placeholder.svg"
                                                }
                                                alt={tree?.treeCode}
                                                className="object-cover"
                                            />
                                            <AvatarFallback
                                                className={`${
                                                    isActive
                                                        ? "bg-primary/10"
                                                        : "bg-destructive/10"
                                                }`}
                                            >
                                                <TreeDeciduous
                                                    className={`h-12 w-12 ${
                                                        isActive
                                                            ? "text-primary"
                                                            : "text-destructive"
                                                    }`}
                                                />
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <h2 className="text-xl font-bold">
                                                        {tree?.treeCode}
                                                    </h2>
                                                    <Link
                                                        href={`${pathname}/edit`}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="bg-card/50"
                                                        >
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            <span className="hidden md:inline">
                                                                Edit Tree
                                                            </span>
                                                        </Button>
                                                    </Link>
                                                </div>

                                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Trees className="w-4 h-4" />
                                                        <span>
                                                            {tree.farmName}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>
                                                            {format(
                                                                new Date(
                                                                    tree.addedAt
                                                                ),
                                                                "MMM dd, yyyy"
                                                            )}
                                                        </span>
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            isActive
                                                                ? "default"
                                                                : "destructive"
                                                        }
                                                        className={`font-medium text-xs px-2 py-0.5`}
                                                    >
                                                        {isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {tree.description && (
                                        <div className="text-sm text-muted-foreground mt-4">
                                            {tree.description.length > 200 &&
                                            !showMore
                                                ? `${tree.description.slice(
                                                      0,
                                                      200
                                                  )}... `
                                                : tree.description}
                                            {tree.description.length > 200 && (
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
                        )}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2 md:gap-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-10 md:w-auto gap-1 bg-card/50"
                                            >
                                                <ArrowDownUp className="h-3.5 w-3.5" />
                                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
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
                                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
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
                                    {filteredImages?.length || 0}{" "}
                                    {(filteredImages?.length || 0) === 1
                                        ? "image"
                                        : "images"}
                                </div>
                            </div>
                            <CardContent className="p-0">
                                {loading ? (
                                    <TreeImageSkeletonCard />
                                ) : filteredImages &&
                                  filteredImages.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                                        {filteredImages.map((image) => (
                                            <TreeImageCard
                                                key={image.imageID}
                                                image={image}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center p-4 text-muted-foreground">
                                        No images available for this tree.
                                    </div>
                                )}
                            </CardContent>
                        </div>
                    </div>
                </PageWrapper>
            )}
        </>
    );
}
