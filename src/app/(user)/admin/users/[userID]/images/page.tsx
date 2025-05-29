"use client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ArrowLeft, Eye, MoreVertical } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import { Image as img } from "@/types/types";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import {
    GetImageHeathStatusBadge,
    GetImageStatusBadge,
} from "@/helper/get-badge";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Images = img & {
    analyzedImage: string;
    treeID: string;
    treeCode: string;
    userID: string;
    userName: string;
    diseases: { likelihoodScore: number; diseaseName: string }[];
};
export default function Page({
    params,
}: {
    params: Promise<{ userID: string }>;
}) {
    const unwrappedParams = React.use(params);
    const { userID } = unwrappedParams;
    const { userInfo } = useAuth();
    const [images, setImages] = useState<Images[] | []>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchImagesByUserID = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `/api/admin/${userInfo?.userID}/user/${userID}/images`
                );

                const data = await res.json();
                if (res.ok) {
                    console.log(data);
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
        fetchImagesByUserID();
    }, [userID]);
    return (
        <Card className="w-full flex-1 overflow-hidden">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Image</TableHead>
                            <TableHead className="hidden md:table-cell text-center">
                                Tree Code
                            </TableHead>
                            <TableHead className="hidden md:table-cell text-center">
                                Image Status
                            </TableHead>
                            <TableHead className="table-cell text-center">
                                Health Status
                            </TableHead>

                            <TableHead className="hidden md:table-cell text-center">
                                User
                            </TableHead>
                            <TableHead className="text-right md:text-center">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableSkeleton />
                        ) : images.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    No images
                                </TableCell>
                            </TableRow>
                        ) : (
                            images.map((img, index) => (
                                <TableRow className="group" key={index}>
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
                                            href={`/admin/tree/${img.treeCode}`}
                                            className="hover:underline"
                                        >
                                            {img.treeCode}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-center">
                                        {GetImageStatusBadge(img.status)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {GetImageHeathStatusBadge(img.diseases)}
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
                                        <ActionMenu imageID={img.imageID} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
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
