"use client";
import React, { useEffect, useState } from "react";

import { Camera, LoaderCircle, Plus, Scan } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/context/auth-context";
import { useScanResult } from "@/context/scan-result-context";

import { useSearchParams } from "next/navigation";

import AddPendingModal from "@/components/modal/add-pending-modal";
import TreeModal from "@/components/modal/tree-modal";
import { useCameraContext } from "@/context/camera-context";
import { useModel } from "@/context/model-context";
import { usePendingProcess } from "@/context/pending-process-context";
import useOnlineStatus from "@/hooks/use-online";
import { toast } from "@/hooks/use-toast";
import { Tree } from "@/types/types";
import { getTreeByUser } from "@/stores/tree";

interface FooterProps {
    croppedImage: string | null;
    setCroppedImage: (value: string | null) => void;
    isScanning: boolean;
    setIsScanning: (isScanning: boolean) => void;
}
export const ImageUploadFooter: React.FC<FooterProps> = ({
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
                if(!userInfo?.userID) return;
                await new Promise((resolve) => setTimeout(resolve, 500));
                const res = await getTreeByUser();
                if(res){
                    setTrees(res.data as Tree[]);
                }
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

        setIsScanning(true);

        try {
            const result = await tfPredict(croppedImage || capturedImage);

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
        // await storePendingProcessItem(data);
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
                        ) : trees && trees.length ? (
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
                    !capturedImage || isScanning || !treeCode
                        ? " bg-primary/50"
                        : " bg-primary"
                }`}
                onClick={handleScan}
                disabled={!capturedImage || isScanning || !treeCode}
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
