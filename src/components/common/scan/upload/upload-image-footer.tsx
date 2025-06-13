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
    const [isLoading, setIsLoading] = useState(false);
    const [treeCode, setTreeCode] = useState("");
    const { setScanResult } = useScanResult();
    const { setIsCameraOpen } = useCameraContext();

    const [trees, setTrees] = useState<Tree[]>([]);
    const searchParams = useSearchParams();
    const treeCodeParams = searchParams.get("treeCode");
    const { userInfo } = useAuth();

    const { tfPredict } = useModel();
    useEffect(() => {
        const fetchTrees = async () => {
            setIsLoading(true);
            try {
                if (!userInfo?.userID) return;
                await new Promise((resolve) => setTimeout(resolve, 500));
                const res = await getTreeByUser();
                if (res) {
                    setTrees(res.data as Tree[]);
                }
            } catch (error) {
                console.error("Error fetching trees:", error);
            } finally {
                setIsLoading(false);
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
    const handleTreeAction = (value: Tree) => {
        setTrees([...trees, value]);
        setTreeCode(value.treeCode);
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
                        {isLoading ? (
                            <p className="p-1 px-2">Loading...</p>
                        ) : trees && trees.length ? (
                            <SelectValue placeholder="Select Farm" />
                        ) : (
                            <p className="p-1 px-2">No Farms Available</p>
                        )}
                    </SelectTrigger>
                    <SelectContent>
                        {isLoading ? (
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
                            <p className="p-1 px-2">No Farm</p>
                        )}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex-1 flex items-center w-full gap-2">
                <Select value={treeCode} onValueChange={setTreeCode}>
                    <SelectTrigger>
                        {isLoading ? (
                            <p className="p-1 px-2">Loading...</p>
                        ) : trees && trees.length ? (
                            <SelectValue placeholder="Select tree code" />
                        ) : (
                            <p className="p-1 px-2">No trees available</p>
                        )}
                    </SelectTrigger>
                    <SelectContent>
                        {isLoading ? (
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
                    variant="outline"
                    className="w-10"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            {/* <Button
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
            </Button> */}
        </div>
    );
};
