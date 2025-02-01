"use client";
import { TreeImageCard } from "@/components/card/tree-image-card";
import { Button } from "@/components/ui/button";
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useAuth } from "@/context/auth-context";
import { useStoresLoading } from "@/context/loading-store-context";
import { getImagesByUserID } from "@/stores/image";
import { loadingStore$ } from "@/stores/loading-store";
import { Image as img } from "@/types/types";
import { ArrowDownUp, Plus, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type images = img & { analyzedImage: string } & { treeCode: string } & {
    diseases: { likelihoodScore: number; diseaseName: string }[];
};

export default function Gallery() {
    const [images, setImages] = useState<images[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<"Newest" | "Oldest">("Newest");
    const [filterTreeCode, setFilterTreeCode] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<0 | 1 | 2>(0);
    const { areStoresLoading } = useStoresLoading();

    const fetchImages = useCallback(async () => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const res = await getImagesByUserID();
            if (res.success) {
                setImages(res.data as images[]);
            }
        } catch (error) {
            console.error("Error fetching trees:", error);
        } finally {
            setLoading(false);
        }
    }, [areStoresLoading]);

    useEffect(() => {
        if (!areStoresLoading.get()) {
            fetchImages();
        }
    }, [areStoresLoading]);

    const uniqueTreeCodes = Array.from(
        new Set(images.map((img) => img.treeCode))
    ).sort((a, b) => a.localeCompare(b));

    const filteredImages = images
        .filter(
            (image) =>
                filterTreeCode === null || image.treeCode === filterTreeCode
        )
        .filter(
            (image) =>
                filterStatus === 0 ||
                (filterStatus === 1 &&
                    image.diseases.some(
                        (disease) =>
                            disease.diseaseName === "Healthy" &&
                            disease.likelihoodScore > 50
                    )) ||
                (filterStatus === 2 &&
                    image.diseases.some(
                        (disease) =>
                            disease.diseaseName !== "Healthy" &&
                            disease.likelihoodScore > 50
                    ))
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

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <h1 className="text-md">Gallery</h1>
                </div>

                <Link href={`/user/scan`}>
                    <Button variant="outline" className="w-10 md:w-auto">
                        <Plus className="h-5 w-5" />
                        <span className="hidden md:block text-sm">
                            Scan New Image
                        </span>
                    </Button>
                </Link>
            </div>
            <PageWrapper>
                <CardHeader className="p-0">
                    {/* <CardTitle>Image Gallery</CardTitle> */}
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
                                        className={`gap-1 w-10 md:w-auto ${
                                            (filterStatus != 0 ||
                                                filterTreeCode != null) &&
                                            "border-primary"
                                        }`}
                                    >
                                        <SlidersHorizontal className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                {filterTreeCode == null &&
                                                filterStatus == 0
                                                    ? "Filter"
                                                    : filterTreeCode == null &&
                                                      filterStatus != 0
                                                    ? filterStatus == 1
                                                        ? "Healthy"
                                                        : "Diseases"
                                                    : filterTreeCode !== null &&
                                                      filterStatus == 0
                                                    ? filterTreeCode
                                                    : `${filterTreeCode} | ${
                                                          filterStatus == 1
                                                              ? "Healthy"
                                                              : "Diseaeses"
                                                      }`}
                                            </span>
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuLabel>
                                        TreeCode:{" "}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem
                                        checked={filterTreeCode === null}
                                        onCheckedChange={() =>
                                            setFilterTreeCode(null)
                                        }
                                    >
                                        All
                                    </DropdownMenuCheckboxItem>
                                    {uniqueTreeCodes.map((code, index) => (
                                        <DropdownMenuCheckboxItem
                                            key={index}
                                            checked={filterTreeCode === code}
                                            onCheckedChange={() =>
                                                setFilterTreeCode(code)
                                            }
                                        >
                                            {code}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>
                                        Status:{" "}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
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
                    </div>
                </div>
                <CardContent className="p-0 flex-1">
                    {loading && images.length === 0 ? (
                        <div className="flex-1 h-full w-full flex items-center justify-center">
                            loading
                        </div>
                    ) : filteredImages.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                            {filteredImages.map((image) => (
                                <TreeImageCard
                                    key={image.imageID}
                                    image={image}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 h-full w-full flex items-center justify-center">
                            No Images
                        </div>
                    )}
                </CardContent>
            </PageWrapper>
        </>
    );
}
