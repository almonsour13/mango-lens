"use client";

import { useCallback, useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useAuth } from "@/context/auth-context";
import { Tree, User } from "@/types/types";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    File,
    ArrowDownUp,
    MoreVertical,
    Search,
    SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

type Trees = Tree & User & { imagesLength: number };

export default function Page() {
    const [trees, setTrees] = useState<Trees[] | []>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { userInfo } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"Newest" | "Oldest">("Newest");
    const [filterStatus, setFilterStatus] = useState<0 | 1 | 2>(0);
    const [filterUser, setFilterUser] = useState<string | null>(null);

    const fetchTrees = useCallback(async () => {
        setLoading(true);
        console.log(error, loading)
        try {
            const response = await fetch(`/api/admin/${userInfo?.userID}/tree`);

            const data = await response.json();
            if (response.ok) {
                const { trees } = data;
                setTrees(trees);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setLoading(false);
            setError(error as string);
        }
    },[userInfo?.userID, error, loading]);

    useEffect(() => {
        fetchTrees();
    }, [fetchTrees]);

    const uniqueTreeUser = Array.from(
        new Set(trees.map((tree) => tree.fName + " " + tree.lName))
    ).sort();

    const filteredTrees = trees
        .filter((tree) => {
            const matchesSearch =
                tree.treeCode
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                `${tree.fName} ${tree.lName}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                filterStatus === 0 || tree.status === filterStatus;

            const matchesUser =
                filterUser === null ||
                `${tree.fName} ${tree.lName}` === filterUser;

            return matchesSearch && matchesStatus && matchesUser;
        })
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

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <h1 className="text-md">Tree</h1>
                </div>
                <div className="flex items-center gap-2"></div>
            </div>
            <PageWrapper>
                <CardHeader className="p-0">
                    <CardTitle>User Trees</CardTitle>
                    <CardDescription>
                        A comprehensive list of user trees.
                    </CardDescription>
                </CardHeader>
                {/* <TreeAnalytics trees={trees} /> */}
                <div className="flex items-center justify-between gap-2">
                    <div className="relative h-10 flex items-center">
                        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search disease..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
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
                                                    : "Inactive"
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
                                {uniqueTreeUser.map((tree) => (
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
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                        <Button
                            variant="outline"
                            className="w-10 md:w-auto gap-1"
                        >
                            <File className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Export
                            </span>
                        </Button>
                    </div>
                </div>
                <Card className="overflow-hidden shadow-none">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-card">
                                <TableRow>
                                    <TableHead>Tree Code</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Images
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Status
                                    </TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Added Date
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTrees.map((tree) => (
                                    <TableRow key={tree.treeID}>
                                        <TableCell>{tree.treeCode}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {tree.imagesLength}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {tree.status == 1
                                                ? "Acitve"
                                                : "Inactive"}
                                        </TableCell>
                                        <TableCell>
                                            {tree.fName + " " + tree.lName}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {format(
                                                tree.addedAt,
                                                "MMM dd, yyyy p"
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <ActionMenu />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </PageWrapper>
        </>
    );
}

const ActionMenu = () => {
    return (
        <Button variant="outline" className="w-10">
            <MoreVertical />
        </Button>
    );
};

// interface TreeAnalyticsProps {
//     trees: Trees[];
// }

// export function TreeAnalytics({ trees }: TreeAnalyticsProps) {
//     const totalTrees = trees.length;
//     const activeTrees = trees.filter((tree) => tree.status === 1).length;
//     const inactiveTrees = trees.filter((tree) => tree.status === 2).length;

//     const treeMetrics = [
//         { name: "Total Trees", value: totalTrees },
//         { name: "Active Trees", value: activeTrees },
//         { name: "Inactive Trees", value: inactiveTrees },
//         // { name: "Average Images", value: inactiveTrees },
//     ];
//     return (
//         <div className="grid gap-2 md:gap-4 grid-cols-2 lg:grid-cols-4">
//             {treeMetrics.map((metrics, index) => (
//                 <Card key={index} className="bg-card shadow-none">
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                         <CardTitle className="text-sm font-medium">
//                             {metrics.name}
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-2xl font-bold">
//                             {metrics.value}
//                         </div>
//                     </CardContent>
//                 </Card>
//             ))}
//         </div>
//     );
// }
