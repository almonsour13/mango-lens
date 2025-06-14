"use client";
import TreeCard from "@/components/card/tree-card";
import ConfirmationModal from "@/components/modal/confirmation-modal";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useTrees } from "@/hooks/use-trees";
import { moveToTrash } from "@/stores/trash";
import { ArrowDownUp, Plus, PlusIcon, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function TreePage() {
    const [openDialog, setOpenDialog] = useState(false);
    const pathname = usePathname();
    const { userInfo } = useAuth();
    const { trees, setTrees, loading } = useTrees();

    const [sortBy, setSortBy] = useState<"Newest" | "Oldest">("Newest");
    const [filterStatus, setFilterStatus] = useState<0 | 1 | 2>(0);
    const [selectedFarm, setSelectedFarm] = useState<string>("");

    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [selectedTreeID, setSelectedTreeID] = useState("");

    const filteredTree = trees
        .filter((tree) => selectedFarm === "" || tree.farmName === selectedFarm)
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

    const uniqueFarms = [
        ...new Set(trees.map((tree) => tree.farmName).filter(Boolean)),
    ];

    const { toast } = useToast();

    const handleConfirmDelete = async () => {
        try {
            const res = await moveToTrash(selectedTreeID, 1);
            if (res.success) {
                setTrees((prevTrees) =>
                    prevTrees.filter((tree) => tree.treeID !== selectedTreeID)
                );
                toast({
                    title: `Tree Move to trash`,
                    description: res.message,
                });
            }
        } catch (error) {
            console.error("Error deleting disease:", error);
        }
        setSelectedTreeID("");
        setConfirmationModalOpen(false);
    };

    const handleAction = async (e: any, action: string, treeID: string) => {
        e.preventDefault();
        switch (action) {
            case "Delete":
                setSelectedTreeID(treeID);
                setConfirmationModalOpen(true);
                break;
            case "Edit":
                break;
            default:
                toast({
                    title: `${action} Tree`,
                    description: `${action} action performed on tree ${treeID}`,
                });
        }
    };

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <h1 className="text-md">Tree</h1>
                </div>
                <Link href={`${pathname}/add`}>
                    <Button variant="outline" className="w-10 md:w-auto bg-card/50">
                        <Plus className="h-5 w-5" />
                        <span className="hidden md:block text-sm">
                            Add New Tree
                        </span>
                    </Button>
                </Link>
            </div>
            <PageWrapper className="gap-4">
                <CardHeader className="p-0">
                    {/* <CardTitle>Your Tree Collection</CardTitle> */}
                    <CardDescription>
                        Browse and manage your trees
                    </CardDescription>
                </CardHeader>
                <div className="flex justify-between items-center">
                    <div className="flex w-full gap-2 justify-between">
                        <div className="flex gap-2 md:gap-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="gap-1 w-10 md:w-auto bg-card/50"
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
                                        className={`gap-1 w-10 md:w-auto bg-card/50 ${
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

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="gap-1 w-10 md:w-auto bg-card/50"
                                    >
                                        <SlidersHorizontal className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                            Farm
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuLabel>
                                        Filter by Farm:
                                    </DropdownMenuLabel>
                                    <DropdownMenuCheckboxItem
                                        checked={selectedFarm === ""}
                                        onCheckedChange={() =>
                                            setSelectedFarm("")
                                        }
                                    >
                                        All Farms
                                    </DropdownMenuCheckboxItem>
                                    {uniqueFarms.map((farmName) => (
                                        <DropdownMenuCheckboxItem
                                            key={farmName}
                                            checked={selectedFarm === farmName}
                                            onCheckedChange={() =>
                                                setSelectedFarm(farmName)
                                            }
                                        >
                                            {farmName}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
                <CardContent className="p-0 flex-1">
                    {loading && trees.length === 0 ? (
                        <div className="flex-1 h-full w-full flex items-center justify-center">
                            loading
                        </div>
                    ) : trees && trees.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                            {filteredTree.map((tree, index) => (
                                <TreeCard
                                    tree={tree}
                                    key={index}
                                    handleAction={handleAction}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 h-full w-full flex items-center justify-center">
                            No Trees
                        </div>
                    )}
                </CardContent>
            </PageWrapper>
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
