"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Image as img } from "@/types/types";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
    ArrowDownUp,
    Eye,
    MoreVertical,
    RefreshCcw,
    Save,
    SlidersHorizontal,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import {
    GetImageHeathStatusBadge,
    GetImageStatusBadge,
} from "@/helper/get-badge";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Images = img & {
    analyzedImage: string;
    treeID: string;
    treeCode: string;
    userID: string;
    userName: string;
    diseases: { likelihoodScore: number; diseaseName: string }[];
};

export default function Images() {
    const [images, setImages] = useState<Images[] | []>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sortBy, setSortBy] = useState<"Newest" | "Oldest">("Newest");
    const [filterStatus, setFilterStatus] = useState<0 | 1 | 2 | 3 | 4>(0);
    const [filterUser, setFilterUser] = useState<string | null>(null);
    const { userInfo } = useAuth();

    const fetchImages = async () => {
        try {
            setLoading(true);

            const res = await fetch(`/api/admin/${userInfo?.userID}/images`);
            const data = await res.json();
            if (res.ok) {
                setImages(data.data);
            } else {
                toast({
                    description: `${data.error}`,
                });
            }
        } catch (error) {
            toast({
                description: `${error}`,
            });
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchImages();
    }, []);

    const uniqueTreeUser = images && Array.from(
        new Set(images.map((image) => image.userName + " " + image.userName))
    ).sort();

    const filteredImages =
        images &&
        images
        .filter((tree) => { 
            const matchesStatus = 
                filterStatus === 0 || tree.status === filterStatus;


            return matchesStatus;
        })
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
                    <h1 className="text-md">Images</h1>
                </div>
            </div>
            <PageWrapper>
                <CardHeader className="p-0">
                    <CardDescription>
                        Manage users images and view image details.
                    </CardDescription>
                </CardHeader>

                <div className="flex items-center justify-between gap-2">
                    {/* <div className="relative h-10 flex items-center"></div> */}
                    <div className="flex items-center space-x-2">
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
                                    className={`gap-1 w-10 md:w-auto ${
                                        (filterStatus != 0 ||
                                            filterUser != null) &&
                                        "border-primary"
                                    }`}
                                >
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                            {filterUser == null &&
                                            filterStatus == 0
                                                ? "Filter"
                                                : filterUser == null &&
                                                  filterStatus != 0
                                                ? filterStatus == 1
                                                    ? "Active"
                                                    : filterStatus == 2
                                                    ? "Inactive"
                                                    : filterStatus == 3
                                                    ? "Temporary Deleted"
                                                    : "Permanently Deleted"
                                                : filterUser !== null &&
                                                  filterStatus == 0
                                                ? filterUser
                                                : ``}
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
                                    checked={filterUser === null}
                                    onCheckedChange={() => setFilterUser(null)}
                                >
                                    All
                                </DropdownMenuCheckboxItem>
                                {uniqueTreeUser && uniqueTreeUser.map((tree) => (
                                    <DropdownMenuCheckboxItem
                                        key={tree}
                                        checked={filterUser === tree}
                                        onCheckedChange={() =>
                                            setFilterUser(tree)
                                        }
                                    >
                                        {tree}
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
                                    Active
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={filterStatus == 2}
                                    onCheckedChange={() => setFilterStatus(2)}
                                >
                                    Inactive
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={filterStatus == 3}
                                    onCheckedChange={() => setFilterStatus(3)}
                                >
                                    Temporarily Deleted
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={filterStatus == 4}
                                    onCheckedChange={() => setFilterStatus(4)}
                                >
                                    Permanantly Deleted
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">
                                        Image
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell text-center">
                                        Tree Code
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell text-center">
                                        Tree Status
                                    </TableHead>
                                    <TableHead className="table-cell text-center">
                                        Health Status
                                    </TableHead>

                                    <TableHead className="hidden md:table-cell text-center">
                                        User
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableSkeleton />
                                ) : filteredImages && filteredImages.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center"
                                        >
                                            No images
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredImages &&
                                    filteredImages.map((img) => (
                                        <TableRow className="group">
                                            <TableCell className="">
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
                                                <Link
                                                    href={`/admin/trees/${img.treeID}`}
                                                    className="hover:underline"
                                                >
                                                    {img.treeCode}
                                                </Link>
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
                                                <Link
                                                    href={`/admin/users/${img.userID}`}
                                                    className="hover:underline"
                                                >
                                                    {img.userName}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <ActionMenu
                                                    imageID={img.imageID}
                                                />
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
const ActionMenu = ({ imageID }: ActionMenuProps) => {
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
