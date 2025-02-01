"use client";

import { TrashCard } from "@/components/card/trash-card";
import { TrashSkeletonCard } from "@/components/skeleton/skeleton-card";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useAuth } from "@/context/auth-context";
import { useStoresLoading } from "@/context/loading-store-context";
import { toast } from "@/hooks/use-toast";
import { getTrashByUser, manageTrash } from "@/stores/trash";
import { Image as img, Tree, Trash as TRS } from "@/types/types";
import {
    ArrowDownUp,
    RefreshCw,
    SlidersHorizontal,
    SquareDashed,
    SquareDashedMousePointer,
    Trash2,
    X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type TrashItem = TRS & { item: Tree | img };

export default function Trash() {
    const [selected, setSelected] = useState<string[]>([]);
    const [isSelected, setIsSelected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [trashes, setTrashes] = useState<TrashItem[] | []>([]);
    const { userInfo } = useAuth();
    const { areStoresLoading } = useStoresLoading();

    const [sortBy, setSortBy] = useState<"Newest" | "Oldest">("Newest");
    const [filterType, setFilterType] = useState<0 | 1 | 2>(0);

    const fetchTrashes = useCallback(async () => {
        setLoading(true);
        try {
            if (!userInfo?.userID) return;
            await new Promise((resolve) => setTimeout(resolve, 500));
            const res = await getTrashByUser();
            if (res) {
                setTrashes(res);
            }
        } catch (error) {
            console.error("Error fetching trees:", error);
        } finally {
            setLoading(false);
        }
    }, [areStoresLoading]);

    useEffect(() => {
        if (!areStoresLoading.get()) {
            fetchTrashes();
        }
    }, [areStoresLoading]);
    const filteredTrashes = trashes
        .filter((trash) => filterType === 0 || trash.type === filterType)
        .sort((a, b) => {
            if (sortBy === "Newest") {
                return (
                    new Date(b.deletedAt).getTime() -
                    new Date(a.deletedAt).getTime()
                );
            } else {
                return (
                    new Date(a.deletedAt).getTime() -
                    new Date(b.deletedAt).getTime()
                );
            }
        });

    useEffect(() => {
        if (!isSelected) {
            setSelected([]);
        }
    }, [isSelected]);

    const handleAction = async (action: number, trashID: string) => {
        try {
            const res = await manageTrash([trashID], action);
            if (res) {
                setTrashes((prevTrashes) =>
                    prevTrashes.filter((trash) => trash.trashID !== trashID)
                );
            }

            toast({
                description: res.message,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleSelectedAction = async (action: number) => {
        try {
            const res = await manageTrash(selected, action);
            if (res) {
                setTrashes((prevTrashes) =>
                    prevTrashes.filter(
                        (trash) => !selected.includes(trash.trashID)
                    )
                );

                setSelected([]);
                setIsSelected(false);
            }

            toast({
                description: res.message,
            });
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    {isSelected && (
                        <>
                            <button onClick={() => setIsSelected(false)}>
                                <X className="h-5 w-5" />
                            </button>
                            <Separator orientation="vertical" />
                        </>
                    )}
                    <h1 className="text-md">
                        {!isSelected
                            ? "Trash"
                            : selected.length === 0
                            ? "Select"
                            : `${selected.length} selected`}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    {selected.length > 0 && (
                        <>
                            <Button
                                variant="outline"
                                className="w-10 md:w-auto border bg-opacity-50"
                                onClick={() => handleSelectedAction(1)}
                            >
                                <RefreshCw className="h-5 w-5" />
                                <span className="hidden md:block">Restore</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="w-10 md:w-auto px-2 text-destructive"
                                onClick={() => handleSelectedAction(2)}
                            >
                                <Trash2 className="h-5 w-5" />
                                <span className="hidden md:block">
                                    Delete Permanently
                                </span>
                            </Button>
                        </>
                    )}

                    {!isSelected ? (
                        trashes.length > 0 && (
                            <div
                                className="cursor-pointer"
                                onClick={() => setIsSelected((prev) => !prev)}
                            >
                                Select
                            </div>
                        )
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                className={`w-10 md:w-auto border ${
                                    selected.length === trashes.length
                                        ? "bg-opacity-100"
                                        : "bg-opacity-50"
                                }`}
                                onClick={() =>
                                    setSelected(
                                        selected.length === trashes.length
                                            ? []
                                            : trashes.map(
                                                  (trash) => trash.trashID
                                              )
                                    )
                                }
                            >
                                {selected.length === trashes.length ? (
                                    <>
                                        <SquareDashed className="h-5 w-5" />
                                        <span className="hidden md:block">
                                            Deselect All
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <SquareDashedMousePointer className="h-5 w-5" />
                                        <span className="hidden md:block">
                                            Select All
                                        </span>
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <PageWrapper>
                <CardHeader className="p-0">
                    <CardDescription>
                        Items in trash will be automatically deleted after 30
                        days
                    </CardDescription>
                </CardHeader>
                <div className={`flex justify-between items-center`}>
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
                                    className={`w-10 md:w-auto gap-1 ${
                                        filterType != 0 && "border-primary"
                                    }`}
                                >
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        {filterType == 0
                                            ? "Filter"
                                            : filterType == 1
                                            ? "Tree"
                                            : "Image"}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuLabel>
                                    Filter by:{" "}
                                </DropdownMenuLabel>
                                <DropdownMenuCheckboxItem
                                    checked={filterType == 0}
                                    onCheckedChange={() => {
                                        setFilterType(0);
                                    }}
                                >
                                    All
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={filterType == 1}
                                    onCheckedChange={() => {
                                        setFilterType(1);
                                    }}
                                >
                                    Tree
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={filterType == 2}
                                    onCheckedChange={() => {
                                        setFilterType(2);
                                    }}
                                >
                                    Image
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <CardContent className="p-0 flex-1">
                    {loading ? (
                        <div className="flex-1 h-full w-full flex items-center justify-center">
                            loading
                        </div>
                    ) : filteredTrashes && filteredTrashes.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                            {filteredTrashes.map((trash) => (
                                <TrashCard
                                    key={trash.trashID}
                                    trash={trash}
                                    isSelected={isSelected}
                                    selected={selected}
                                    setSelected={setSelected}
                                    handleAction={handleAction}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 h-full w-full flex items-center justify-center">
                            No Trash
                        </div>
                    )}
                </CardContent>
            </PageWrapper>
        </>
    );
}
