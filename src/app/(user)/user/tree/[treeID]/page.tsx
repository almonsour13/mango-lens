"use client";
import React, { useEffect, useState } from "react";
import {
    CardContent
} from "@/components/ui/card";

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { Image as img, Tree } from "@/type/types";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    ArrowDownUp,
    ArrowLeft,
    Grid,
    List,
    Plus,
    SlidersHorizontal,
    TreeDeciduous,
    Calendar,
    Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import { Toggle } from "@/components/ui/toggle";
import { TreeImagesTable } from "@/components/table/tree-images-table";
import { TreeImageSkeletonCard } from "@/components/skeleton/skeleton-card";
import { TreeImageCard } from "@/components/card/tree-image-card";
import { Badge } from "@/components/ui/badge";
import TreeModal from "@/components/modal/tree-modal";
import { formatDate } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type images = img & { analyzedImage: string | null } & {
    diseases: { likelihoodScore: number; diseaseName: string }[];
};

export default function Page({
    params,
}: {
    params: Promise<{ treeID: string }>;
}) {
    const [tree, setTree] = useState<(Tree & { treeImage?: string }) | null>(
        null
    );
    const [images, setImages] = useState<images[]>([]);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const unwrappedParams = React.use(params);
    const { treeID } = unwrappedParams;
    const { userInfo } = useAuth();

    const [openDialog, setOpenDialog] = useState(false);

    const [sortBy, setSortBy] = useState<"Newest" | "Oldest">("Newest");
    const [filterStatus, setFilterStatus] = useState<0 | 1 | 2>(0);

    const [viewMode, setViewMode] = useState<"table" | "grid">("grid");

    useEffect(() => {
        const fetchTree = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/user/${userInfo?.userID}/tree/${treeID}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch image details");
                }
                const data = await response.json();
                if(response.ok){
                    setTree(data.tree);
                    setImages(data.images);
                }else{
                    alert(data.error)
                }
            } catch (error) {
                console.error("Error fetching trees:", error);
            } finally {
                setLoading(false);
            }
        };
        if (treeID && userInfo) {
            fetchTree();
        }
    }, [userInfo, treeID]);

    const filteredImages = images
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

    const router = useRouter();

    const handleBack = () => {
        router.back();
    };
    const pathSegments = pathname.split("/");

    const handleTreeAction = (value: Tree, action: number, status?: number) => {
        if (action == 2) {
            setTree(value);
        } else if (action == 3) {
            router.back();
        }
        console.log(status)
    };
    const [showMore, setShowMore] = useState(false);
    // if (!tree) return <>loading</>;
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
                    href={`${
                        pathSegments[0] + "/" + pathSegments[1]
                    }/scan/?treeCode=${tree?.treeCode}`}
                >
                    <Button variant="outline" className="w-10 md:w-auto">
                        <Plus className="h-5 w-5" />
                        <span className="hidden md:block text-sm">
                            Scan New Image
                        </span>
                    </Button>
                </Link>
            </div>
            {loading ? (
                <div className="min-h-screen w-full flex items-center justify-center">loading</div>
            ):(
            <PageWrapper className="gap-4">
                <div className="flex justify-between flex-col items-start gap-4">
                    <div className="flex w-full flex-row items-start justify-start gap-4">
                        
                        <Avatar className="h-28 md:h-32 w-28 md:w-32 aspect-square bg-primary/10">
                            <AvatarImage
                                src={tree?.treeImage}
                                alt="Profile picture"
                            />
                            <AvatarFallback className="bg-primary/10">
                                <TreeDeciduous className="h-16 w-16 text-primary" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="w-full flex-1 flex justify-between text-left space-y-2">
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold mt-4">
                                    {tree?.treeCode}
                                </h2>
                                <div className="flex flex-wrap justify-start gap-2">
                                    <Badge
                                        variant={
                                            tree?.status === 1
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {tree?.status === 1
                                            ? "Active"
                                            : "Inactive"}
                                    </Badge>
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        <p className="text-xs">
                                            {tree?.treeCode &&
                                                formatDate(
                                                    tree?.addedAt,
                                                    "MMM dd, yyyy"
                                                )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* <p className="text-muted-foreground text-wrap hidden md:block">
                                {tree?.description}
                            </p> */}
                            <Link href={`${pathname}/edit`}>
                                <Button
                                    variant="outline"
                                    className="w-10 md:w-auto"
                                    // onClick={() => setOpenDialog(true)}
                                >
                                    <Edit className="w-4 h-4" />
                                    <span className="hidden md:block">
                                        Edit Tree
                                    </span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="text-sm text-wrap">
                        {tree?.description && (
                            <>
                                {tree.description.length > 200 ? (
                                    <>
                                        {!showMore ? (
                                            <>
                                                {tree.description.slice(0, 200)}
                                                ...{" "}
                                                <Button
                                                    variant="link"
                                                    className="p-0 h-auto"
                                                    onClick={() =>
                                                        setShowMore(true)
                                                    }
                                                >
                                                    View More
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                {tree.description}{" "}
                                                <Button
                                                    variant="link"
                                                    className="p-0 h-auto"
                                                    onClick={() =>
                                                        setShowMore(false)
                                                    }
                                                >
                                                    View Less
                                                </Button>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    tree.description
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 md:gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-10 md:w-auto gap-1"
                                >
                                    <ArrowDownUp className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        {sortBy}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
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
                                    className={`w-10 md:w-auto gap-1 ${
                                        filterStatus != 0 && "border-primary"
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
                    <div className="">
                        <Toggle
                            aria-label="Toggle view"
                            variant="outline"
                            pressed={viewMode === "grid"}
                            onPressedChange={(pressed) =>
                                setViewMode(pressed ? "grid" : "table")
                            }
                        >
                            {viewMode === "table" ? (
                                <Grid className="h-4 w-4" />
                            ) : (
                                <List className="h-4 w-4" />
                            )}
                        </Toggle>
                    </div>
                </div>
                {/* <CardHeader>
                    <CardTitle>Image Gallery</CardTitle>
                    <CardDescription>
                        Browse and manage images for Tree {treeCode}
                    </CardDescription>
                </CardHeader> */}
                <CardContent className="p-0">
                    {loading ? (
                        <TreeImageSkeletonCard />
                    ) : filteredImages && filteredImages.length > 0 ? (
                        viewMode === "grid" ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                                {filteredImages.map((image) => (
                                    <TreeImageCard
                                        key={image.imageID}
                                        image={image}
                                    />
                                ))}
                            </div>
                        ) : (
                            <TreeImagesTable images={filteredImages} />
                        )
                    ) : (
                        <div className="flex items-center justify-center p-6 text-muted-foreground">
                            No images available for this tree.
                        </div>
                    )}
                </CardContent>
            </PageWrapper>)}
            <TreeModal
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                editingTrees={tree}
                handleTreeAction={handleTreeAction}
            />
        </>
    );
}
