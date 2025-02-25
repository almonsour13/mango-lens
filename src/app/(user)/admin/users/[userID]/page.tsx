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
import { Tree, User } from "@/types/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { GetTreeStatusBadge } from "@/helper/get-badge";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Trees = Tree  & { imagesLength: number };

export default function Page({
    params,
}: {
    params: Promise<{ userID: string }>;
}) {
    const unwrappedParams = React.use(params);
    const { userID } = unwrappedParams;
    const [trees, setTrees] = useState<Trees[] | []>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { userInfo } = useAuth();

    useEffect(() => {
        const fetchTreeByUserID = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `/api/admin/${userInfo?.userID}/user/${userID}/trees`
                );
                const data = await res.json();
                if (res.ok) {
                    setTrees(data.data);
                    console.log(data.data)
                } else {
                    setError(data.error);
                }
            } catch (error) {
                setError(error as string);
            } finally {
                setLoading(false);
            }
        };
        fetchTreeByUserID();
    }, []);

    return (
        <Card className="overflow-hidden shadow-none">
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-card">
                        <TableRow>
                            <TableHead>Tree Code</TableHead>
                            <TableHead className="text-center">
                                Images
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                Status
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                Added Date
                            </TableHead>
                            <TableHead className="text-center">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                                                            <TableSkeleton />
                        ) : trees && trees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    No Trees
                                </TableCell>
                            </TableRow>
                        ) : (
                            trees.map((tree) => (
                                <TableRow key={tree.treeID}>
                                    <TableCell>
                                        <Link
                                            href={`/admin/tree/${tree.treeID}`}
                                            className="hover:underline"
                                        >
                                            {tree.treeCode}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {tree.imagesLength}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                                                                    {GetTreeStatusBadge(tree.status)}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {format(tree.addedAt, "MMM dd, yyyy p")}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <ActionMenu treeID={tree.treeID}/>
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
    treeID: string;
}
const ActionMenu = ({ treeID }: ActionMenuProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-10">
                    <MoreVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <Link href={`/admin/trees/${treeID}`}>
                    <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
