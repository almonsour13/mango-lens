"use client";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useCallback, useEffect, useState } from "react";
import { Image as img } from "@/type/types";
import { TreeImageCard } from "@/components/card/tree-image-card";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { ArrowDownUp, Grid, List, Plus, SlidersHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import Link from "next/link";
import { TreeImageSkeletonCard } from "@/components/skeleton/skeleton-card";

type images = img & {analyzedImage:string|null} & { treeCode: number } & {
    diseases: { likelihoodScore: number; diseaseName: string }[];
};

export default function Gallery() {
    const [images, setImages] = useState<images[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<"Newest" | "Oldest">("Newest");
    const [filterTreeCode, setFilterTreeCode] = useState<number | null>(null);
    const [filterStatus, setFilterStatus] = useState<0 | 1 | 2>(0)
    const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
    const { userInfo } = useAuth();

    const fetchImages = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/user/${userInfo?.userID}/images`,
            );
            if (response.ok) {
                const data = await response.json();
                setImages(data.images);
            }
        } catch (error) {
            console.error("Error fetching trees:", error);
        } finally {
            setLoading(false);
        }
    },[userInfo?.userID]);

    useEffect(() => {
        fetchImages();
    }, [userInfo?.userID, fetchImages]);

    const uniqueTreeCodes = Array.from(new Set(images.map(img => img.treeCode))).sort((a, b) => a - b);

    const filteredImages = images
        .filter((image) => (filterTreeCode === null || image.treeCode === filterTreeCode))
        .filter((image) => 
            filterStatus === 0 ||
            filterStatus === 1 && image.diseases.some((disease) => disease.diseaseName === "Healthy" && disease.likelihoodScore > 50) ||
            filterStatus === 2 && image.diseases.some((disease) => disease.diseaseName !== "Healthy" && disease.likelihoodScore > 50)
        )    
        .sort((a, b) => {
            if (sortBy === "Newest") {
                return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
            } else {
                return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
            }
        });

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <h1 className="text-md">Gallery</h1>
                </div>
                
                <Link href={`/user/scan`}>
                    <Button
                        variant="outline"
                        className="w-10 md:w-auto">
                        <Plus className="h-5 w-5"/>
                        <span className="hidden md:block text-sm">
                            Scan New Image
                        </span>
                    </Button>
                </Link>
            </div>
            <PageWrapper>
                <CardHeader className="p-0">
                    <CardTitle>Image Gallery</CardTitle>
                    <CardDescription>
                        Browse and manage images for all trees
                    </CardDescription>
                </CardHeader>
                <div className="flex justify-between items-center">
                    <div className="flex w-full gap-2 justify-between">
                        <div className="flex gap-2 md:gap-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="gap-1 w-10 md:w-auto"
                                    >
                                        <ArrowDownUp className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                            {sortBy}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuLabel>Sort by: </DropdownMenuLabel>
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
                                        className={`gap-1 w-10 md:w-auto ${(filterStatus != 0 || filterTreeCode != null) && "border-primary"}`}
                                    >
                                        <SlidersHorizontal className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                { filterTreeCode ==  null &&  filterStatus == 0?
                                                    "Filter" :
                                                    filterTreeCode == null && filterStatus != 0?filterStatus == 1?"Healthy":"Diseases" :
                                                    filterTreeCode !== null && filterStatus == 0?filterTreeCode:`${filterTreeCode} | ${filterStatus == 1?"Healthy":"Diseaeses"}`

                                                }
                                            </span>
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuLabel>TreeCode: </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem
                                        checked={filterTreeCode === null}
                                        onCheckedChange={() => setFilterTreeCode(null)}
                                    >
                                        All
                                    </DropdownMenuCheckboxItem>
                                    {uniqueTreeCodes.map(code => (
                                        <DropdownMenuCheckboxItem
                                            key={code}
                                            checked={filterTreeCode === code}
                                            onCheckedChange={() => setFilterTreeCode(code)}
                                        >
                                            {code}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>Status: </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem 
                                        checked={filterStatus == 0}
                                        onCheckedChange={() => setFilterStatus(0)}
                                    >
                                        All
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem 
                                        checked={filterStatus == 1}
                                        onCheckedChange={() => setFilterStatus(1)}
                                    >
                                        Healthy
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem 
                                        checked={filterStatus == 2}
                                        onCheckedChange={() => setFilterStatus(2)}
                                    >
                                        Diseases
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                                                            
                        </div>
                        <Toggle
                            aria-label="Toggle view"
                            pressed={viewMode === "grid"}
                            onPressedChange={(pressed) =>
                                setViewMode(pressed ? "grid" : "table")
                            }
                            variant="outline"
                            className="bg-transparent"
                        >
                            {viewMode === "table" ? (
                                <Grid className="h-4 w-4" />
                            ) : (
                                <List className="h-4 w-4" />
                            )}
                        </Toggle>
                    </div>
                </div>
                <CardContent className="p-0">
                    {loading?(
                        <TreeImageSkeletonCard/>
                    ):(
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                        {filteredImages.map((image) => (
                            <TreeImageCard key={image.imageID} image={image} />
                        ))}
                    </div>
                    )}
                </CardContent>
            </PageWrapper>
        </>
    );
}

