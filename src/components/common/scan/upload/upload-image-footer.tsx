"use client";
import React, { useState, useEffect } from "react";

import { Plus, Camera, Scan, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useScanResult } from "@/context/scan-result-context";
import { useAuth } from "@/context/auth-context";

import { useSearchParams } from "next/navigation";

import { Tree } from "@/types/types";
import AddPendingModal from "@/components/modal/add-pending-modal";
import useOnlineStatus from "@/hooks/use-online";
import { toast } from "@/hooks/use-toast";
import TreeModal from "@/components/modal/tree-modal";
import { useCameraContext } from "@/context/camera-context";
import { storePendingProcessItem } from "@/utils/indexedDB/store/pending-store";

interface FooterProps {
    isNonSquare: boolean;
    croppedImage: string | null;
    setCroppedImage: (value: string | null) => void;
    isScanning: boolean;
    setIsScanning: (isScanning: boolean) => void;
}
export const ImageUploadFooter: React.FC<FooterProps> = ({
    isNonSquare,
    croppedImage,
    setCroppedImage,
    isScanning,
    setIsScanning,
}) => {
    const { capturedImage } = useCameraContext();
    const [loading, setLoading] = useState(true);
    const [treeCode, setTreeCode] = useState("");
    const { setScanResult } = useScanResult();
    const { setIsCameraOpen } = useCameraContext();

    const [trees, setTrees] = useState<Tree[]>([]);
    const searchParams = useSearchParams();
    const treeCodeParams = searchParams.get("treeCode");
    const { userInfo } = useAuth();

    const [openPendingModal, setOpenPendingModal] = useState(false);
    const isOnline = useOnlineStatus();

    const [openTreeModal, setOpenTreeModal] = useState(false);

    useEffect(() => {
        const fetchTrees = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/user/${userInfo?.userID}/tree?type=2`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch trees");
                }
                const data = await response.json();
                setTrees(data.treeWidthImage);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching trees:", error);
                setLoading(false);
            }
        };

        if (userInfo?.userID) {
            fetchTrees();
        }
    }, [userInfo?.userID]);

    useEffect(() => {
        if (treeCodeParams) {
            setTreeCode(treeCodeParams);
        }
    }, [treeCodeParams]);

    const handleSetNewTreeCode = async (treeCode: string) => {
        setTreeCode(treeCode);
    };
    
    // const handleScan = async () => {
    //     const data = {
    //         userID: userInfo?.userID,
    //         treeCode: treeCode,
    //         imageUrl: croppedImage || capturedImage,
    //     };

    //     if (!isOnline) {
    //         setOpenPendingModal(true);
    //         await storePendingProcessItem(data);
    //         return;
    //     }

    //     setIsScanning(true);

    //     // Configure timeout and retry settings
    //     const TIMEOUT_DURATION = 30000; // 30 seconds
    //     const MAX_RETRIES = 3;
    //     let currentTry = 0;

    //     const attemptScan = async () => {
    //         const controller = new AbortController();
    //         const timeoutId = setTimeout(
    //             () => controller.abort(),
    //             TIMEOUT_DURATION
    //         );

    //         try {
    //             const response = await fetch("/api/scan/newScan", {
    //                 method: "POST",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify(data),
    //                 signal: controller.signal,
    //             });

    //             clearTimeout(timeoutId);

    //             if (!response.ok) {
    //                 const { error } = await response.json();
    //                 throw new Error(error || "Something went wrong.");
    //             }

    //             const { result } = await response.json();
    //             if (result) {
    //                 setScanResult(result);
    //             }
    //             return true; // Successful scan
    //         } catch (error) {
    //             clearTimeout(timeoutId);

    //             if (error instanceof Error) {
    //                 if (error.name === "AbortError") {
    //                     throw new Error("Request timed out");
    //                 }
    //                 throw error;
    //             }
    //             throw new Error(
    //                 error instanceof Object
    //                     ? JSON.stringify(error)
    //                     : "An unknown error occurred"
    //             );
    //         }
    //     };

    //     while (currentTry < MAX_RETRIES) {
    //         try {
    //             await attemptScan();
    //             setIsScanning(false);
    //             return;
    //         } catch (error) {
    //             currentTry++;
    //             const errorMessage =
    //                 error instanceof Error
    //                     ? error.message
    //                     : "An unknown error occurred";
    //             console.error(
    //                 `Scan attempt ${currentTry} failed:`,
    //                 errorMessage
    //             );

    //             if (currentTry === MAX_RETRIES) {
    //                 toast({
    //                     title: "Scanning Failed",
    //                     description:
    //                         errorMessage === "Request timed out"
    //                             ? "The scan is taking longer than expected. Please try again."
    //                             : "Error during scanning. Please try again later.",
    //                     variant: "destructive",
    //                 });

    //                 // If all retries failed, store it as pending
    //                 if (errorMessage === "Request timed out") {
    //                     setOpenPendingModal(true);
    //                     await storePendingProcessItem(data);
    //                 }
    //             } else {
    //                 // Show retry toast
    //                 toast({
    //                     description: `Retrying scan attempt ${
    //                         currentTry + 1
    //                     }/${MAX_RETRIES}...`,
    //                 });
    //                 // Wait briefly before retrying
    //                 await new Promise((resolve) => setTimeout(resolve, 2000));
    //             }
    //         }
    //     }

    //     setIsScanning(false);
    // };

    interface ScanData {
        userID: string | undefined;
        treeCode: string;
        imageUrl: string;
    }
    
    interface ScanResult {
        result: any; // Replace 'any' with your actual result type
    }
    
    interface APIError {
        error: string;
    }
    
    const handleScan = async () => {
        const data = {
            userID: userInfo?.userID,
            treeCode: treeCode,
            imageUrl: croppedImage || capturedImage,
        };
    
        if (!isOnline) {
            setOpenPendingModal(true);
            await storePendingProcessItem(data);
            return;
        }
    
        setIsScanning(true);
        
        const TIMEOUT_DURATION = 60000; // 60 seconds
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);
    
        try {
            const response = await fetch("/api/scan/newScan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                signal: controller.signal
            });
    
            clearTimeout(timeoutId);
    
            if (!response.ok) {
                const errorData = await response.json() as APIError;
                throw new Error(errorData.error || "Something went wrong.");
            }
    
            const { result } = await response.json() as ScanResult;
            if (result) {
                setScanResult(result);
            }
        } catch (error) {
            clearTimeout(timeoutId);
            
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            console.error("Scan failed:", errorMessage);
    
            toast({
                title: "Scanning Failed",
                description: error instanceof Error && error.name === 'AbortError'
                    ? "The scan timed out after 60 seconds. Please try again."
                    : "Error during scanning. Please try again later.",
                variant: "destructive"
            });
    
            // If it's a timeout, store as pending
            if (error instanceof Error && error.name === 'AbortError') {
                setOpenPendingModal(true);
                await storePendingProcessItem(data);
            }
        } finally {
            setIsScanning(false);
        }
    };
    const confirmPending = async () => {
        setOpenPendingModal(false);
        toast({
            description: "Successfully added to the pending",
        });
    };
    const handleTreeAction = (value: Tree, action: number, status?: number) => {
        if (action == 1) {
            setTrees([...trees, value]);
        }
        console.log(status);
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            {!capturedImage && (
                <Button
                    variant="default"
                    className="w-full bg-transparent hover:bg-transparent border text-foreground shadow-none"
                    onClick={() => setIsCameraOpen(true)}
                >
                    <Camera className="w-4 h-4 mr-2" />
                    Use Camera
                </Button>
            )}
            <div className="flex-1 flex items-center w-full gap-2">
                <Select value={treeCode} onValueChange={setTreeCode}>
                    <SelectTrigger>
                        {loading ? (
                            <p className="p-1 px-2">Loading...</p>
                        ) : trees.length ? (
                            <SelectValue placeholder="Select tree code" />
                        ) : (
                            <p className="p-1 px-2">No trees available</p>
                        )}
                    </SelectTrigger>
                    <SelectContent>
                        {loading ? (
                            <p className="p-1 px-2">loading</p>
                        ) : trees.length ? (
                            <>
                                {trees.map((tree) => (
                                    <SelectItem
                                        key={tree.treeID}
                                        value={tree.treeCode}
                                    >
                                        {tree.treeCode}
                                    </SelectItem>
                                ))}
                            </>
                        ) : (
                            <p className="p-1 px-2">no tree</p>
                        )}
                    </SelectContent>
                </Select>
                <Button
                    onClick={() => setOpenTreeModal(true)}
                    variant="outline"
                    className="w-10"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <Button
                className={`w-full ${
                    !capturedImage || !treeCode || isScanning || isNonSquare
                        ? " bg-primary/50"
                        : " bg-primary"
                }`}
                onClick={handleScan}
                disabled={
                    !capturedImage || !treeCode || isScanning || isNonSquare
                }
            >
                {" "}
                {isScanning ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                    <Scan className="w-4 h-4 mr-2" />
                )}
                {isScanning ? "Scanning" : "Scan Image"}
            </Button>
            <TreeModal
                openDialog={openTreeModal}
                setOpenDialog={setOpenTreeModal}
                handleTreeAction={handleTreeAction}
                handleSetNewTreeCode={handleSetNewTreeCode}
            />
            <AddPendingModal
                open={openPendingModal}
                onClose={setOpenPendingModal}
                onConfirm={confirmPending}
            />
        </div>
    );
};
