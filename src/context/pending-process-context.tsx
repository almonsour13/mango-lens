"use client";

import {
    PendingItem
} from "@/type/types";
import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
    useCallback,
} from "react";
import { useAuth } from "./auth-context";
import useOnlineStatus from "@/hooks/use-online";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useScanResult } from "./scan-result-context";
import { usePathname } from "next/navigation";
import { deleteSelectedPendingProcessItems, getAllPendingProcessItems, updatePendingProcessItem } from "@/utils/indexedDB/store/pending-store";
import { deleteProcessedResult, getProcessedResultItem, saveProcessedResult } from "@/utils/indexedDB/store/result-store";

interface PendingProcessContextType {
    processPendingID: number;
    setProcessPendingID: React.Dispatch<React.SetStateAction<number>>;
    pendings: PendingItem[];
    setPendings: React.Dispatch<React.SetStateAction<PendingItem[]>>;
    selected: number[];
    setSelected: React.Dispatch<React.SetStateAction<number[]>>;
    isSelected: boolean;
    setIsSelected: React.Dispatch<React.SetStateAction<boolean>>;
    handleAction: (action: number, pendingId: number) => void;
    handleSelectedAction: (action: number) => void;
}

const PendingProcessContext = createContext<
    PendingProcessContextType | undefined
>(undefined);

export const usePendingProcess = () => {
    const context = useContext(PendingProcessContext);
    if (context === undefined) {
        throw new Error(
            "usePendingProcess must be used within a PendingProcessProvider"
        );
    }
    return context;
};

export const PendingProcessProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [pendings, setPendings] = useState<PendingItem[]>([]);
    const [selected, setSelected] = useState<number[]>([]);
    const [isSelected, setIsSelected] = useState(false);
    const [processPendingID, setProcessPendingID] = useState(0);
    const { userInfo } = useAuth();
    const { setScanResult } = useScanResult();

    const isOnline = useOnlineStatus();
    const { toast } = useToast();

    const pathname = usePathname();

   

    useEffect(() => {
        const fetchPendings = async () => {
            if (userInfo?.userID) {
                const pendings = await getAllPendingProcessItems(userInfo?.userID);
                setPendings(pendings);
            }
        };
        fetchPendings();
    }, [userInfo?.userID]);

    const [isProcessing, setIsProcessing] = useState(false);
    const processPendings = useCallback( async () => {
        const pendingItems = pendings.filter((item) => item.status === 1);

        if (pendingItems.length === 0) {
            return;
        }

        setIsProcessing(true);
        toast({
            title: "Processing Pending Items",
            description: `Starting to process ${pendingItems.length} pending item(s).`,
        });

        for (let index = 0; index < pendingItems.length; index++) {
            const pending = pendingItems[index];

            // if (!isOnline) {
            //     alert("No internet connection, cannot process.");
            //     continue; // Skip current iteration, don't break the loop
            // }

            if (pending.status === 2) continue;

            setProcessPendingID(pending.pendingID);
            console.log(pending);

            try {
                const response = await fetch("/api/scan/newScan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userID: pending.userID,
                        treeCode: pending.treeCode,
                        imageUrl: pending.imageUrl,
                    }),
                });

                if (response.ok) {
                    const { result } = await response.json();
                    await updatePendingProcessItem(pending.pendingID, 2);
                    await saveProcessedResult(pending.pendingID, result);

                    setPendings((prevPending) =>
                        prevPending.map((item) =>
                            item.pendingID === pending.pendingID
                                ? { ...item, status: 2 }
                                : item
                        )
                    );
                }
            } catch (error) {
                console.error(
                    `Error during scanning for pendingID: ${pending.pendingID}`,
                    error
                );
            }

            await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay between each request
        }

        setIsProcessing(false);
        setProcessPendingID(0);
        if (!pathname.includes('"/user/pending"')) {
            toast({
                description: (
                    <div className="flex flex-col">
                        Finished processing {pendingItems.length} pending
                        item(s).
                        <Link
                            href="/user/pending"
                            className="font-medium text-primary hover:underline"
                        >
                            View
                        </Link>
                    </div>
                ),
            });
        } else {
            toast({
                description: `Finished processing ${pendingItems.length} pending item(s).`,
            });
        }
    },[ pathname, pendings, toast]);
    useEffect(() => {
        

        if (isOnline && !isProcessing) {
            processPendings();
        }
    }, [isOnline, processPendings, isProcessing]);

    useEffect(() => {
        if (selected.length == 0) {
            setIsSelected(false);
        }
    }, [selected]);

    useEffect(() => {
        setIsSelected(false);
        setSelected([]);
    }, [pathname]);

    const handleAction = async (action: number, pendingId: number) => {
        if (action == 1) {
            if (!isOnline) {
                alert("no internet connection cannot be process");
                return;
            }
            setProcessPendingID(pendingId);
            const pending = pendings.filter(
                (pending) => pending.pendingID == pendingId
            );
            try {
                const response = await fetch("/api/scan/newScan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userID: pending[0].userID,
                        treeCode: pending[0].treeCode,
                        imageUrl: pending[0].imageUrl,
                    }),
                });

                if (response.ok) {
                    const { result } = await response.json();
                    setPendings((prevPending) =>
                        prevPending.map((item) =>
                            item.pendingID === pendingId
                                ? { ...item, status: 2 }
                                : item
                        )
                    );
                    console.log(result)
                    await saveProcessedResult(pendingId, result);
                    await updatePendingProcessItem(pendingId, 2);

                    setProcessPendingID(0);
                    toast({
                        description: "Pending Processed Sucessfully",
                    });
                }
            } catch (error) {
                console.error(
                    `Error during scanning for pendingID: ${pendingId}`,
                    error
                );
            } finally {
                setProcessPendingID(0);
            }
        } else if (action == 2) {
            await deleteSelectedPendingProcessItems([pendingId]);
            await deleteProcessedResult([pendingId]);
            setPendings((prevPending) =>
                prevPending.filter((pending) => pending.pendingID !== pendingId)
            );
            toast({
                title: "Pending deleted Sucessfully",
            });
        } else if (action == 3) {
            const result = await getProcessedResultItem(pendingId);
            setScanResult(result);
        } else if (action == 4) {
            const result = await getProcessedResultItem(pendingId);
            try {
                const response = await fetch("/api/scan/save", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userID: userInfo?.userID,
                        scanResult: result,
                    }),
                });
                if (response.ok) {
                    setPendings((prevPending) =>
                        prevPending.filter(
                            (pending) => pending.pendingID !== pendingId
                        )
                    );
                    await deleteSelectedPendingProcessItems([pendingId]);
                    await deleteProcessedResult([pendingId]);

                    toast({
                        title: "Pending saved sucessfully",
                    });
                }
            } catch (error) {
                console.error("Error while saving scan result:", error);
                toast({
                    title: "Error",
                    description:
                        "Failed to save the scan result. Please try again.",
                });
            }
        }
    };

    const handleSelectedAction = async (action: number) => {
        if (selected && action == 2) {
            await deleteSelectedPendingProcessItems(selected);
            await deleteProcessedResult(selected);

            for (let index = 0; index < selected.length; index++) {
                const pendingID = selected[index];

                setPendings((prevPending) =>
                    prevPending.filter(
                        (pending) => pending.pendingID !== pendingID
                    )
                );
            }
            setSelected([]);
            setIsSelected(false);
            toast({
                title: "Selected pending items deleted successfully",
            });
        } else if (selected && action == 1) {
            if (!isOnline) {
                alert("no internet connection cannot be process");
                return;
            }
            (async () => {
                toast({
                    title: "Processing selected pending items",
                    description: `Starting to process ${selected.length} selected pending item(s).`,
                });
                for (let index = 0; index < selected.length; index++) {
                    const pendingID = selected[index];

                    const pending = pendings.find(
                        (pending) => pending.pendingID === pendingID
                    );

                    if (!pending || pending.status == 2) continue;
                    setProcessPendingID(pendingID);
                    console.log(pending);

                    try {
                        const response = await fetch("/api/scan/newScan", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                userID: pending.userID,
                                treeCode: pending.treeCode,
                                imageUrl: pending.imageUrl,
                            }),
                        });

                        if (response.ok) {
                            const { result } = await response.json();

                            setPendings((prevPending) =>
                                prevPending.map((pending) =>
                                    pending.pendingID === pendingID
                                        ? { ...pending, status: 2 }
                                        : pending
                                )
                            );
                            await saveProcessedResult(pendingID, result);
                            await updatePendingProcessItem(pendingID, 2);
                        }
                    } catch (error) {
                        console.error(
                            `Error during scanning for pendingID: ${pendingID}`,
                            error
                        );
                    }

                    await new Promise((resolve) => setTimeout(resolve, 2000));
                }

                if (!pathname.includes('"/user/pending"')) {
                    toast({
                        description: (
                            <div className="flex flex-col">
                                Finished processing {selected.length} selected
                                pending item(s).
                                <Link
                                    href="/user/pending"
                                    className="font-medium text-primary hover:underline"
                                >
                                    View
                                </Link>
                            </div>
                        ),
                    });
                } else {
                    toast({
                        description: `Finished processing ${selected.length} selected pending item(s).`,
                    });
                }
                setSelected([]);
                setProcessPendingID(0);
                setIsSelected(false);
            })();
        }
    };

    return (
        <PendingProcessContext.Provider
            value={{
                processPendingID,
                setProcessPendingID,
                pendings,
                setPendings,
                selected,
                setSelected,
                isSelected,
                setIsSelected,
                handleAction,
                handleSelectedAction,
            }}
        >
            {children}
        </PendingProcessContext.Provider>
    );
};
