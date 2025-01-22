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

import { BoundingBox, Tree } from "@/types/types";
import AddPendingModal from "@/components/modal/add-pending-modal";
import useOnlineStatus from "@/hooks/use-online";
import { toast } from "@/hooks/use-toast";
import TreeModal from "@/components/modal/tree-modal";
import { useCameraContext } from "@/context/camera-context";
import { storePendingProcessItem } from "@/utils/indexedDB/store/pending-store";
import { predict } from "@/utils/api/predict";
import { usePendingProcess } from "@/context/pending-process-context";
import { useModel } from "@/context/model-context";
import { getTreesByUser } from "@/stores/store";

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

    const { fetchPendings } = usePendingProcess();

    const { tfPredict } = useModel();
    useEffect(() => {
        const fetchTrees = async () => {
            setLoading(true);
            try {
                // const response = await fetch(
                //     `/api/user/${userInfo?.userID}/tree?type=2`
                // );
                // if (!response.ok) {
                //     throw new Error("Failed to fetch trees");
                // }
                // const data = await response.json();
                const t = getTreesByUser(userInfo?.userID || 0);
                setTrees(t);
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

    const handleScan = async () => {
        const data = {
            userID: userInfo?.userID,
            treeCode: treeCode,
            imageUrl: croppedImage || capturedImage,
        };

        if (!isOnline) {
            setOpenPendingModal(true);
            return;
        }

        setIsScanning(true);

        try {
            // const result = await predict(croppedImage || capturedImage);

            const result = await tfPredict(croppedImage || capturedImage);
            console.log(result);
            if (result && result.originalImage && result.analyzedImage) {
                setScanResult({
                    ...result,
                    treeCode: treeCode,
                    originalImage: result.originalImage,
                    analyzedImage: result.analyzedImage,
                    diseases: result.diseases || [],
                });
            }
        } catch (error) {
            toast({
                title: "Scanning Failed",
                description: "Error during scanning.",
                variant: "destructive",
            });

            // setOpenPendingModal(true);
        } finally {
            setIsScanning(false);
        }
    };
    const confirmPending = async () => {
        const data = {
            userID: userInfo?.userID,
            treeCode: treeCode,
            imageUrl: croppedImage || capturedImage,
        };
        setOpenPendingModal(false);
        await storePendingProcessItem(data);
        fetchPendings();
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
                    !capturedImage || isScanning
                        ? " bg-primary/50"
                        : " bg-primary"
                }`}
                onClick={handleScan}
                disabled={!capturedImage || isScanning}
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
