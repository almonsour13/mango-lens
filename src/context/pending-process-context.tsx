"use client";

import { BoundingBox, PendingItem } from "@/types/types";
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
import {
    deleteSelectedPendingProcessItems,
    getAllPendingProcessItems,
    updatePendingProcessItem,
} from "@/utils/indexedDB/store/pending-store";
import {
    deleteProcessedResult,
    getProcessedResultItem,
    saveProcessedResult,
} from "@/utils/indexedDB/store/result-store";
import { predict } from "@/utils/api/predict";
import { usePendingActions } from "@/hooks/use-pending";

interface PendingProcessContextType {
    fetchPendings: () => void;
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
    const [isProcessing, setIsProcessing] = useState(false);

    const isOnline = true
    const { toast } = useToast();

    const pathname = usePathname();

    const {
        handleSingleProcess,
        handleBulkProcess,
        handleBulkDelete,
        handleDelete,
        handleView,
        handleSave,
    } = usePendingActions(
        pendings,
        setPendings,
        setProcessPendingID,
        setIsProcessing
    );

    const fetchPendings = useCallback(async () => {
        if (userInfo?.userID) {
            const pendings = await getAllPendingProcessItems(userInfo?.userID);
            setPendings(pendings);
        }
    },[pendings, userInfo?.userID]);
    useEffect(() => {
        fetchPendings();
    }, [userInfo?.userID, fetchPendings]);

    useEffect(() => {
        if (isOnline && !isProcessing) {
            const pendingItems = pendings.filter(item => item.status === 1);
            if (pendingItems.length > 0) {
                handleBulkProcess(pendingItems.map(item => item.pendingID));
            }
        }
    }, [isOnline, isProcessing, handleBulkProcess]);

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
        if (!isOnline && action === 1) {
            alert("No internet connection, cannot process");
            return;
        }
        switch (action) {
            case 1:
                await handleSingleProcess(pendingId);
                break;
            case 2:
                await handleDelete(pendingId);
                break;
            case 3:
                await handleView(pendingId);
                break;
            case 4:
                await handleSave(pendingId);
                break;
        }
    };
    const handleSelectedAction = async (action: number) => {
        if (!selected.length) return;

        if (action === 2) {
            await handleBulkDelete(selected);
            setSelected([]);
            setIsSelected(false);
        } else if (action === 1 && isOnline) {
            await handleBulkProcess(selected);
            setSelected([]);
            setIsSelected(false);
        } else if (!isOnline) {
            alert("No internet connection, cannot process");
        }
    };

    return (
        <PendingProcessContext.Provider
            value={{
                fetchPendings,
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
