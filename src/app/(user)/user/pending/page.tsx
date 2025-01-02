"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import PendingCard from "@/components/card/pending-card";
import { Card, CardContent } from "@/components/ui/card";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useAuth } from "@/context/auth-context";
import useOnlineStatus from "@/hooks/use-online";
import { toast } from "@/hooks/use-toast";
import {
    deleteProcessedResult,
    deleteSelectedPendingProcessItems,
    getAllPendingProcessItems,
    getProcessedResultItem,
    saveProcessedResult,
    updatePendingProcessItem,
} from "@/utils/indexedDB/indexedDB";
import { useEffect, useState } from "react";
import {
    ArrowDownUp,
    Filter,
    Grid,
    List,
    RefreshCw,
    SlidersHorizontal,
    SquareDashed,
    SquareDashedMousePointer,
    Trash2,
    X,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { PendingTable } from "@/components/table/pending-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useScanResult } from "@/context/scan-result-context";
import { usePendingProcess } from "@/context/pending-process-context";

interface PendingProcess {
    pendingID: number;
    userID?: number;
    treeCode: string;
    imageUrl: string;
    status: number;
    addedAt: Date;
}
export default function Pending() {
    // const [selected, setSelected] = useState<number[]>([]);
    // const [isSelected, setIsSelected] = useState(false);
    const {pendings, setPendings, processPendingID, setProcessPendingID, selected, setSelected, isSelected, setIsSelected, handleAction, handleSelectedAction} = usePendingProcess();
    // const [pendings, setPendings] = useState<PendingProcess[]>([]);

    const [sortBy, setSortBy] = useState<"Newest" | "Oldest">("Oldest");
    const [filterStatus, setFilterStatus] = useState<0 | 1 | 2>(0)

    const [viewMode, setViewMode] = useState<"table" | "grid">("grid");

    const { userInfo } = useAuth();

    const isOnline = useOnlineStatus();

    const { setScanResult } = useScanResult();

    useEffect(() => {
        if (!isSelected) {
            setSelected([]);
        }
    }, [isSelected]);
    
    useEffect(()=>{
        
        const pendingItems = pendings.filter(
            (item) => item.status == 1 || item.status !== 2
        );
        if(!pendingItems){
            setIsSelected(false);
        }
    },[pendings])

    const filteredPendings = pendings
        .filter((pending) => filterStatus == 0 || pending.status == filterStatus)
        .sort((a, b) => {
            if (sortBy === "Newest") {
                return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
            } else {
                return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
            }
        });

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
                            ? "Pending"
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
                                className="w-10 md:w-auto bg-opacity-50"
                                onClick={() => handleSelectedAction(1)}
                            >
                                <RefreshCw className="h-5 w-5" />
                                <span className="hidden md:block">Process</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="w-10 md:w-auto border text-destructive"
                                onClick={() => handleSelectedAction(2)}
                            >
                                <Trash2 className="h-5 w-5" />
                                <span className="hidden md:block">Delete</span>
                            </Button>
                        </>
                    )}
                    {!isSelected ? (
                        pendings.length > 0 && (
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
                                className={`w-10 md:w-auto border ${selected.length === pendings.length ? "bg-opacity-100" : "bg-opacity-50"}`}
                                onClick={() =>
                                    setSelected(
                                        selected.length === pendings.length
                                            ? []
                                            : pendings.map(
                                                  (pending) =>
                                                      pending.pendingID,
                                              ),
                                    )
                                }
                            >
                                {selected.length === pendings.length &&
                                selected.length != 0 ? (
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
                <div className={`flex justify-between items-center`}>
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
                                <DropdownMenuLabel>Sort by: </DropdownMenuLabel>
                                <DropdownMenuCheckboxItem
                                    checked={sortBy == "Newest"}
                                    onCheckedChange={(checked) => {
                                        setSortBy("Newest");
                                    }}
                                >
                                    Newest to oldest
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={sortBy == "Oldest"}
                                    onCheckedChange={(checked) => {
                                        setSortBy("Oldest");
                                    }}
                                >
                                    Oldest to newest
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className={`w-10 md:w-auto gap-1 ${filterStatus != 0 && "border-primary"}`}>
                                        <SlidersHorizontal className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                            {filterStatus == 1? "Pending":filterStatus == 2?"Processed":"Filter"}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuLabel>Filter by: </DropdownMenuLabel>
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
                                        Pending
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem 
                                        checked={filterStatus == 2}
                                        onCheckedChange={() => setFilterStatus(2)}
                                    >
                                        Processed
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                    </div>
                    <div className="">
                        <Toggle
                            aria-label="Toggle view"
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
                <CardContent className="p-0">
                    {pendings && pendings.length > 0 ? (
                        viewMode === "grid" ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                                {filteredPendings.map((pending) => (
                                    <PendingCard
                                        key={pending.pendingID}
                                        processPendingID={processPendingID}
                                        pending={pending}
                                        isSelected={isSelected}
                                        selected={selected}
                                        setSelected={setSelected}
                                        handleAction={handleAction}
                                    />
                                ))}
                            </div>
                        ) : (
                            <PendingTable
                                processPendingID={processPendingID}
                                pendings={filteredPendings}
                                isSelected={isSelected}
                                selected={selected}
                                setSelected={setSelected}
                                handleAction={handleAction}
                            />
                        )
                    ) : (
                        <div className="flex items-center justify-center">
                            No Pendings
                        </div>
                    )}
                </CardContent>
            </PageWrapper>
        </>
    );
}
