"use client";

import { useCallback, useEffect, useState } from "react";
import { CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { Image as img, Tree, Trash as TRS } from "@/types/types";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    ArrowDownUp,
    Grid,
    List,
    RefreshCw,
    SlidersHorizontal,
    SquareDashed,
    SquareDashedMousePointer,
    Trash2,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { Toggle } from "@/components/ui/toggle";
import { TrashCard } from "@/components/card/trash-card";
import { toast } from "@/hooks/use-toast";
import { TrashTable } from "@/components/table/trash-table";
import { Separator } from "@/components/ui/separator";
import { TrashSkeletonCard } from "@/components/skeleton/skeleton-card";

type TrashItem = TRS & { item: Tree | img };

export default function Trash() {
    const [selected, setSelected] = useState<number[]>([]);
    const [isSelected, setIsSelected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [trashes, setTrashes] = useState<TrashItem[] | []>([]);
    const { userInfo } = useAuth();

    const [sortBy, setSortBy] = useState<'Newest' | 'Oldest'>('Newest');
    const [filterType, setFilterType] = useState<0 | 1 | 2>(0);

    const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
    
    const fetchTrashes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/user/${userInfo?.userID}/trash`);
            const data = await response.json();

            if(response.ok){
                setTrashes(data.trash);
            }
        } catch (error) {
            console.error("Error fetching trees:", error);
        } finally {
            setLoading(false);
        }
    },[userInfo?.userID])

    useEffect(()=>{
        fetchTrashes();
    },[userInfo?.userID, fetchTrashes])

    const filteredTrashes = trashes
        .filter((trash) => filterType === 0 || trash.type === filterType)
        .sort((a, b) => {
            if (sortBy === "Newest") {
                return new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime();
            } else {
                return new Date(a.deletedAt).getTime() - new Date(b.deletedAt).getTime();
            }
        });
    
    
    useEffect(() => {
        if (!isSelected) {
            setSelected([]);
        }
    }, [isSelected]);
    
    const handleAction = async (action:number, trashID:number) => {
        try {
            const response = await fetch(`/api/user/${userInfo?.userID}/trash/${trashID}`,{
                method:'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });
            
            if(response.ok){
                setTrashes(prevTrashes => prevTrashes.filter(trash => trash.trashID !== trashID));
                toast({
                    description: `${action == 1? 'Restored' : 'Deleted'} successfully.`,
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    const handleSelectedAction = async (action:number) => {
        try {
            const response = await fetch(`/api/user/${userInfo?.userID}/trash/`,{
                method:'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, selected }),
            });
            
            if(response.ok){
                setTrashes(prevTrashes => prevTrashes.filter(trash => !selected.includes(trash.trashID)));
                toast({
                    description: `Selected Trash ${action == 1? 'restored' : 'deleted'} successfully.`,
                })
                setSelected([])
                setIsSelected(false);
            }

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    {isSelected && (
                        <>
                        <button onClick={()=>setIsSelected(false)}>
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
                            : `${selected.length} selected`
                        }
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
                        trashes.length > 0 &&
                        <div
                            className="cursor-pointer"
                            onClick={() => setIsSelected((prev) => !prev)}
                        >
                            Select  
                        </div>
                    ):(
                        <>
                        <Button
                            variant="outline"
                            className={`w-10 md:w-auto border ${selected.length === trashes.length ? 'bg-opacity-100' : 'bg-opacity-50'}`}
                            onClick={() =>
                                setSelected(selected.length === trashes.length ? [] : trashes.map((trash) => trash.trashID))
                            }
                        >
                            {selected.length === trashes.length ? (
                                <>
                                    <SquareDashed    className="h-5 w-5" />
                                    <span className="hidden md:block">Deselect All</span>
                                </>
                            ) : (
                                <>
                                    <SquareDashedMousePointer className="h-5 w-5" />
                                    <span className="hidden md:block">Select All</span>
                                </>
                            )}
                        </Button>

                        </>
                    )
                    }
                </div>
            </div>
            <PageWrapper>
                <CardHeader className="p-0">
                    <CardDescription>
                        Items in trash will be automatically deleted after 30 days
                    </CardDescription>
                </CardHeader>
                <div className={`flex justify-between items-center`}>
                    <div className="flex gap-2 md:gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-10 md:w-auto gap-1">
                                <ArrowDownUp className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{sortBy}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Sort by: </DropdownMenuLabel>
                            <DropdownMenuCheckboxItem 
                                checked={sortBy == "Newest"}
                                onCheckedChange={() => {setSortBy("Newest")}}
                            >
                                Newest to oldest
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem 
                                checked={sortBy == "Oldest"}
                                onCheckedChange={() => {setSortBy("Oldest")}}
                                >
                                Oldest to newest
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className={`w-10 md:w-auto gap-1 ${filterType != 0 && "border-primary"}`}>
                                <SlidersHorizontal className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    {filterType == 0?"Filter":filterType == 1?"Tree":"Image"}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Filter by: </DropdownMenuLabel>
                            <DropdownMenuCheckboxItem 
                                checked={filterType == 0}
                                onCheckedChange={() => {setFilterType(0)}}
                            >
                                All
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem 
                                checked={filterType == 1}
                                onCheckedChange={() => {setFilterType(1)}}
                            >
                                Tree
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem 
                                checked={filterType == 2}
                                onCheckedChange={() => {setFilterType(2)}}
                                >
                                Image
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                    <div className="">
                        <Toggle
                            aria-label="Toggle view"
                            pressed={viewMode === 'grid'}
                            onPressedChange={(pressed) => setViewMode(pressed ? 'grid' : 'table')}
                        >
                            {viewMode === 'table' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
                        </Toggle>
                    </div>
                </div>
                <CardContent className="p-0">
                    {loading?(
                        <TrashSkeletonCard/>
                    ):filteredTrashes && filteredTrashes.length > 0?(
                        viewMode === 'grid' ? (
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
                        ):(
                            <TrashTable 
                                trashes={filteredTrashes} 
                                isSelected={isSelected}
                                selected={selected}
                                setSelected={setSelected}
                                handleAction={handleAction}
                            />
                        )
                        ):(
                            <div className="flex items-center justify-center">No Trees</div>
                        )
                    }
                </CardContent>
            </PageWrapper>
        </>
    );
}
