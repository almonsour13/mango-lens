"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useAuth } from "@/context/auth-context";

import { usePathname, useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Tree, Image as img } from "@/types/types";
import { formatDate } from "date-fns";
import {
    ArrowDownUp,
    ArrowLeft,
    Calendar,
    Eye,
    MoreVertical,
    SlidersHorizontal,
    TreeDeciduous,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { TreeImageSkeletonCard } from "@/components/skeleton/skeleton-card";
import { TreeImageCard } from "@/components/card/tree-image-card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import { GetImageHeathStatusBadge, GetImageStatusBadge } from "@/helper/get-badge";
import Image from "next/image";
import Link from "next/link";

type Images = img & { analyzedImage: string } & {
    diseases: { likelihoodScore: number; diseaseName: string }[];
};

export default function Page({
    params,
}: {
    params: Promise<{ treeID: string }>;
}) {
    const unwrappedParams = React.use(params);
    const { treeID } = unwrappedParams;
    const { userInfo } = useAuth();
    const [loading, setLoading] = useState(false);
    const [tree, setTree] = useState<(Tree & { treeImage?: string }) | null>(
        null
    );
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const fetchTreeByID = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `/api/admin/${userInfo?.userID}/tree/${treeID}`
                );
                const data = await res.json();
                if (res.ok) {
                    setTree(data.data);
                } else {
                }
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };
        fetchTreeByID();
    }, [treeID]);

    const [images, setImages] = useState<Images[] | []>([]);
    const [imageLoading, setImageLoading] = useState(false);
    const [sortBy, setSortBy] = useState<"Newest" | "Oldest">("Newest");
    const [filterStatus, setFilterStatus] = useState<0 | 1 | 2>(0);

    useEffect(() => {
        const fetchImagesByTreeID = async () => {
            try {
                setImageLoading(true);
                const res = await fetch(
                    `/api/admin/${userInfo?.userID}/tree/${treeID}/images`
                );
                const data = await res.json();
                if (res.ok) {
                    setImages(data.data);
                    console.log(data.data);
                } else {
                }
            } catch (error) {
            } finally {
                setImageLoading(false);
            }
        };
        fetchImagesByTreeID();
    }, [treeID]);

    const filteredImages =
        images &&
        images
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

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <button onClick={handleBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <Separator orientation="vertical" />
                    <h1 className="text-md">{tree?.treeCode || ""}</h1>
                </div>
                <div className="flex items-center gap-2"></div>
            </div>
            <PageWrapper>
                {tree !== null && tree && (
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
                            </div>
                        </div>
                        <div className="text-sm text-wrap">
                            {tree?.description && (
                                <>
                                    {tree.description.length > 200 ? (
                                        <>
                                            {!showMore ? (
                                                <>
                                                    {tree.description.slice(
                                                        0,
                                                        200
                                                    )}
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
                    <div className=""></div>
                </div>
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="">
                                        Image
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell text-center">
                                        Tree Status
                                    </TableHead>
                                    <TableHead className="table-cell text-center">
                                        Health Status
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell text-center">
                                        Analyzed At
                                    </TableHead>
                                    <TableHead className="text-right md:text-center">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {imageLoading ? (
                                    <TableSkeleton />
                                ) : filteredImages.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center"
                                        >
                                            No images
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredImages.map((img) => (
                                        <TableRow className="group">
                                            <TableCell className="text-center">
                                                <Image
                                                    src={img.imageData}
                                                    alt={img.imageID}
                                                    className="h-12 w-12 group-hover:hidden rounded"
                                                    width={100}
                                                    height={100}
                                                    objectFit="cover"
                                                />
                                                <Image
                                                    src={img.analyzedImage}
                                                    alt={img.imageID}
                                                    className="h-12 w-12 hidden group-hover:block rounded"
                                                    width={100}
                                                    height={100}
                                                    objectFit="cover"
                                                />
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-center">
                                                {GetImageStatusBadge(
                                                    img.status
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {GetImageHeathStatusBadge(
                                                    img.diseases
                                                )}
                                            </TableCell>

                                            <TableCell className="hidden md:table-cell text-center">
                                                { formatDate(
                                                        img.uploadedAt,
                                                        "MMM dd, yyyy k:m"
                                                    )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <ActionMenu imageID={img.imageID}/>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </PageWrapper>
        </>
    );
}
interface ActionMenuProps {
    imageID: string;
}
const ActionMenu = ({imageID}:ActionMenuProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-10">
                    <MoreVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <Link href={`/admin/images/${imageID}`}>
                    <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
