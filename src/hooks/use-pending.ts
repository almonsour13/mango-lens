import { useState, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { useScanResult } from "@/context/scan-result-context";
import { predict } from "@/utils/api/predict";
import {
    deleteSelectedPendingProcessItems,
    updatePendingProcessItem,
} from "@/utils/indexedDB/store/pending-store";
import {
    deleteProcessedResult,
    getProcessedResultItem,
    saveProcessedResult,
} from "@/utils/indexedDB/store/result-store";
import { ToastMessage } from "@/components/toast-message";
import { PendingItem } from "@/types/types";
import { usePathname } from "next/navigation";
import { useToast } from "./use-toast";

export const usePendingActions = (
    pendings: PendingItem[],
    setPendings: React.Dispatch<React.SetStateAction<PendingItem[]>>,
    setProcessPendingID: React.Dispatch<React.SetStateAction<number>>,
    setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>
) => {
    const { userInfo } = useAuth();
    const { setScanResult } = useScanResult();
    const { toast } = useToast();
    const pathname = usePathname();
    
    const handleSingleProcess = async (pendingId: number) => {
        const pending = pendings.find((p) => p.pendingID === pendingId);
        if (!pending) return;

        setProcessPendingID(pendingId);
        try {
            const result = await predict(pending.imageUrl);
            if (result) {
                await handleProcessSuccess(pending, result);
            } else {
                await handleProcessFailure(pendingId);
            }
        } catch (error) {
            console.error(`Error processing pending ${pendingId}:`, error);
            await handleProcessFailure(pendingId);
        } finally {
            setProcessPendingID(0);
        }
    };
    const handleBulkProcess = async (selectedIds: number[]) => {
        setIsProcessing(true);
        toast({
            title: "Processing selected pending items",
            description: `Starting to process ${selectedIds.length} selected pending item(s).`,
        });

        for (const pendingId of selectedIds) {
            const pending = pendings.find(p => p.pendingID === pendingId);
            if (!pending || pending.status === 2) continue;

            setProcessPendingID(pendingId);
            try {
                const result = await predict(pending.imageUrl);
                if (result) {
                    await handleProcessSuccess(pending, result);
                } else {
                    await handleProcessFailure(pendingId);
                }
            } catch (error) {
                console.error(`Error processing pending ${pendingId}:`, error);
                await handleProcessFailure(pendingId);
            }

            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        const failedPendings = pendings.filter(
            pending => pending.status === 1 || pending.status === 3
        );

        const showLink = !pathname.includes("/user/pending");

        setIsProcessing(false);
        setProcessPendingID(0);
    };
    const handleDelete = async (pendingId: number) => {
        await deleteSelectedPendingProcessItems([pendingId]);
        await deleteProcessedResult([pendingId]);
        setPendings(prev =>
            prev.filter(pending => pending.pendingID !== pendingId)
        );
        toast({
            title: "Pending deleted Successfully",
        });
    };
    const handleBulkDelete = async (selectedIds: number[]) => {
        await deleteSelectedPendingProcessItems(selectedIds);
        await deleteProcessedResult(selectedIds);
        setPendings(prev =>
            prev.filter(pending => !selectedIds.includes(pending.pendingID))
        );
        toast({
            title: "Selected pending items deleted successfully",
        });
    };
    const handleProcessSuccess = async (pending: PendingItem, result: any) => {
        setPendings((prev) =>
            prev.map((item) =>
                item.pendingID === pending.pendingID
                    ? { ...item, status: 2 }
                    : item
            )
        );
        await saveProcessedResult(pending.pendingID, {
            ...result,
            treeCode: pending.treeCode,
        });
        await updatePendingProcessItem(pending.pendingID, 2);
    };
    const handleProcessFailure = async (pendingId: number) => {
        setPendings((prev) =>
            prev.map((item) =>
                item.pendingID === pendingId ? { ...item, status: 3 } : item
            )
        );
        await updatePendingProcessItem(pendingId, 3);
    };
    const handleView = async (pendingId: number) => {
        const result = await getProcessedResultItem(pendingId);
        setScanResult(result);
    };
    const handleSave = async (pendingId: number) => {
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
                setPendings(prev =>
                    prev.filter(pending => pending.pendingID !== pendingId)
                );
                await deleteSelectedPendingProcessItems([pendingId]);
                await deleteProcessedResult([pendingId]);
                toast({
                    title: "Pending saved successfully",
                });
            }
        } catch (error) {
            console.error("Error saving scan result:", error);
            toast({
                title: "Error",
                description: "Failed to save the scan result. Please try again.",
            });
        }
    };
    return {
        handleSingleProcess,
        handleBulkProcess,
        handleBulkDelete,
        handleDelete,
        handleView,
        handleSave,
    };
};
