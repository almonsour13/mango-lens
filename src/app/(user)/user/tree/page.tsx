"use client";
import { useEffect, useState } from "react";
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import PageWrapper from "@/components/wrapper/page-wrapper";
import {
    ArrowDownUp,
    Grid,
    List,
    Plus,
    PlusIcon,
    SlidersHorizontal,
} from "lucide-react";
import { Tree } from "@/type/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import TreeModal from "@/components/modal/tree-modal";
import ConfirmationModal from "@/components/modal/confirmation-modal";
import { Toggle } from "@/components/ui/toggle";
import TreeCard from "@/components/card/tree-card";
import { TreeSkeletonCard } from "@/components/skeleton/skeleton-card";
import { TreeTable } from "@/components/table/tree-table";

interface TreeWithImage extends Tree {
    treeImage:string;
    recentImage: string;
    imagesLength: number;
}

export default function TreePage() {
    const [trees, setTrees] = useState<TreeWithImage[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const pathname = usePathname();
    const { userInfo } = useAuth();
    const [loading, setLoading] = useState(true);
    const [editingTrees, setEditingTrees] = useState<{
        treeID: number;
        treeCode: string;
        description: string;
        imagesLength: number;
        status: number;
    } | null>(null);

    const [sortBy, setSortBy] = useState<"Newest" | "Oldest">("Newest");
    const [filterStatus, setFilterStatus] = useState<0 | 1 | 2>(0);

    const [viewMode, setViewMode] = useState<"table" | "grid">("grid");

    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [selectedTreeID, setSelectedTreeID] = useState(0);

    const fetchTrees = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/user/${userInfo?.userID}/tree`);
            if (!response.ok) {
                throw new Error("Failed to fetch image details");
            }
            const data = await response.json();
            setTrees(data.treeWidthImage);
        } catch (error) {
            console.error("Error fetching trees:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrees();
    }, [userInfo?.userID]);

    const filteredTree = trees
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

    const { toast } = useToast();

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(
                `/api/user/${userInfo?.userID}/trash`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ treeID: selectedTreeID }),
                }
            );

            const result = await response.json();

            if (result.success) {
                setTrees((prevTrees) =>
                    prevTrees.filter((tree) => tree.treeID !== selectedTreeID)
                );
                toast({
                    title: `Tree Move to trash`,
                    description: `Move to Trash action performed on tree ${selectedTreeID}`,
                });
            }
        } catch (error) {
            console.error("Error deleting disease:", error);
        }
        setSelectedTreeID(0);
        setConfirmationModalOpen(false);
    };

    const handleAction = async (e: any, action: string, treeID: number) => {
        e.preventDefault();
        switch (action) {
            case "Delete":
                setSelectedTreeID(treeID);
                setConfirmationModalOpen(true);
                break;
            case "Edit":
                const filterTrees = trees.filter(
                    (tree) => tree.treeID == treeID
                );
                setEditingTrees({
                    treeID: filterTrees[0].treeID,
                    treeCode: filterTrees[0].treeCode,
                    description: filterTrees[0].description,
                    imagesLength: filterTrees[0].imagesLength,
                    status: filterTrees[0].status,
                });
                setOpenDialog(true);
                console.log(`Editing tree ${treeID} ${openDialog}`);
                break;
            default:
                toast({
                    title: `${action} Tree`,
                    description: `${action} action performed on tree ${treeID}`,
                });
        }
    };

    const handleTreeAction = (value: Tree, action: number, status?: number) => {
        console.log(value);
        console.log(action);
        console.log(status);
        if (action == 1) {
            // add
            setTrees([
                { ...value, recentImage: null, imagesLength: 0 },
                ...trees,
            ] as TreeWithImage[]);
        } else if (action == 2) {
            //update
            setTrees(
                trees.map((tree) =>
                    tree.treeID === value?.treeID
                        ? {
                              ...tree,
                              treeCode: value.treeCode,
                              description: value.description,
                              status: status,
                          }
                        : tree
                ) as TreeWithImage[]
            );
        } else if (action == 3) {
            //delete
            let updatedTrees = [...trees];
            updatedTrees = updatedTrees.filter(
                (tree) => tree.treeID !== value?.treeID
            );
            setTrees(updatedTrees);
        }
    };

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <h1 className="text-md">Tree</h1>
                </div>
                <Link href={`${pathname}/add`}>
                <Button
                    variant="outline"
                    className="w-10 md:w-auto"
                >
                    <Plus className="h-5 w-5" />
                    <span className="hidden md:block text-sm">
                        Add New Tree
                    </span>
                </Button>
                </Link>
            </div>
            <PageWrapper className="gap-4">
                <CardHeader className="p-0">
                    <CardTitle>Your Tree Collection</CardTitle>
                    <CardDescription>
                        View and manage your trees
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
                                            filterStatus != 0 &&
                                            "border-primary"
                                        }`}
                                    >
                                        <SlidersHorizontal className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                            {filterStatus == 1
                                                ? "Active"
                                                : filterStatus == 2
                                                ? "Inactive"
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
                                        Active
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={filterStatus == 2}
                                        onCheckedChange={() =>
                                            setFilterStatus(2)
                                        }
                                    >
                                        Inactive
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
                    {loading ? (
                        <TreeSkeletonCard />
                    ) : trees && trees.length > 0 ? (
                        viewMode === "grid" ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                                {filteredTree.map((tree) => (
                                    <TreeCard
                                        tree={tree}
                                        key={tree.treeID}
                                        handleAction={handleAction}
                                    />
                                ))}
                            </div>
                        ) : (
                            <TreeTable
                                trees={filteredTree}
                                handleAction={handleAction}
                            />
                        )
                    ) : (
                        <div className="flex items-center justify-center">
                            No Trees
                        </div>
                    )}
                </CardContent>
            </PageWrapper>
            <AddButton setOpenDialog={setOpenDialog} />
            <TreeModal
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                editingTrees={editingTrees}
                setEditingTrees={setEditingTrees}
                handleTreeAction={handleTreeAction}
            />
            <ConfirmationModal
                open={confirmationModalOpen}
                onClose={() => setConfirmationModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={`Are you sure you want to delete tree ${
                    trees.find((tree) => tree.treeID === selectedTreeID)
                        ?.treeCode ?? "Unknown"
                } ?`}
                content={`This action cannot be undone. The tree contains ${
                    trees.find((tree) => tree.treeID === selectedTreeID)
                        ?.imagesLength
                } image(s).`}
            />
        </>
    );
}

function AddButton({
    setOpenDialog,
}: {
    setOpenDialog: (value: boolean) => void;
}) {
    return (
        <Button
            variant="default"
            className="absolute h-12 w-12 hidden md:flex bottom-20 md:bottom-4 right-2 md:right-4"
            onClick={() => setOpenDialog(true)}
        >
            <PlusIcon />
        </Button>
    );
}
