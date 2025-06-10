"use client";

import { useState, useEffect } from "react";
import { useCameraContext } from "@/context/camera-context";
import { useSearchParams } from "next/navigation";
import type { Farm, Tree } from "@/types/types";
import { getFarmByUser } from "@/stores/farm";
import { getTreesByFarmID, generateTreeCode, addTree } from "@/stores/tree";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import PageWrapper from "@/components/wrapper/page-wrapper";
import AddFarmModal from "@/components/modal/add-farm-modal";
import { toast } from "@/hooks/use-toast";
import StepIndicator from "../step-indicator";
import FarmSelectionStep from "../steps/farm-selection-step";
import TreeSelectionStep from "../steps//tree-selection-step";
import UploadImageStep from "../steps/upload-image-step";

type Step = "farms" | "trees" | "upload";

export default function UploadPage() {
    const searchParams = useSearchParams();
    const urlFarmID = searchParams.get("farmID");
    const urlTreeCode = searchParams.get("treeCode");

    const [currentStep, setCurrentStep] = useState<Step>("farms");
    const [farms, setFarms] = useState<Farm[]>([]);
    const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
    const [addFarmModalOpen, setAddFarmModalOpen] = useState(false);

    const [trees, setTrees] = useState<Tree[]>([]);
    const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
    const [loadingTrees, setLoadingTrees] = useState(false);

    const { capturedImage, setCapturedImage } = useCameraContext();
    const [image, setImage] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    // Initialize with URL parameters
    useEffect(() => {
        const initializeFromUrl = async () => {
            if (urlFarmID) {
                const res = await getFarmByUser();
                if (res.success) {
                    const allFarms = res.data as Farm[];
                    const farm = allFarms.find(
                        (f) => f.farmID.toString() === urlFarmID
                    );
                    if (farm) {
                        setSelectedFarm(farm);
                        setCurrentStep("trees");

                        const treeRes = await getTreesByFarmID(urlFarmID);
                        if (treeRes.success && treeRes.data) {
                            setTrees(treeRes.data as Tree[]);

                            if (urlTreeCode) {
                                const tree = (treeRes.data as Tree[]).find(
                                    (t) => t.treeCode === urlTreeCode
                                );
                                if (tree) {
                                    setSelectedTree(tree);
                                    setCurrentStep("upload");
                                }
                            }
                        }
                    }
                }
            }
        };

        initializeFromUrl();
    }, [urlFarmID, urlTreeCode]);

    // Fetch farms on component mount
    useEffect(() => {
        const fetchFarms = async () => {
            try {
                const res = await getFarmByUser();
                if (res.success) {
                    setFarms(res.data as Farm[]);
                }
            } catch (error) {
                console.error("Error fetching farms:", error);
            }
        };
        fetchFarms();
    }, []);

    const handleFarmSelect = async (farm: Farm) => {
        setSelectedFarm(farm);
        setSelectedTree(null);

        setLoadingTrees(true);
        try {
            const res = await getTreesByFarmID(farm.farmID.toString());
            if (res.success && res.data) {
                setTrees(res.data as Tree[]);
            } else {
                setTrees([]);
            }
        } catch (error) {
            console.error("Error fetching trees:", error);
            setTrees([]);
        } finally {
            setLoadingTrees(false);
        }
    };

    const handleTreeSelect = (tree: Tree) => {
        setSelectedTree(tree);
    };

    const generateNewTreeCode = async () => {
        if (!selectedFarm) return;

        try {
            const newTreeCode = await generateTreeCode(
                selectedFarm.farmID.toString()
            );
            if (newTreeCode) {
                const res = await addTree(selectedFarm.farmID, newTreeCode, "");
                if (res.success) {
                    toast({
                        title: "Success",
                        description: "New tree code generated successfully",
                    });
                    setTrees((prevTrees) => [...prevTrees, res.data]);
                    setSelectedTree(res.data);
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to generate new tree code",
                        variant: "destructive",
                    });
                }
            }
        } catch (error) {
            console.error("Error generating tree code:", error);
        }
    };

    const handleScanAnother = () => {
        setCurrentStep("farms");
        setSelectedFarm(null);
        setSelectedTree(null);
        setImage(null);
        setIsScanning(false);
    };

    const canProceedToTrees = selectedFarm !== null;
    const canProceedToUpload = selectedTree !== null;

    return (
        <>
            {/* Header */}
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <h1 className="text-md">Scan</h1>
                </div>
            </div>

            <PageWrapper>
                <div className=" ">
                    {/* Progress Section */}
                    <div className="mb-8 w-full flex flex-col">
                        <div className="text-left mb-6">
                            <p className="text-sm text-muted-foreground mx-auto ">
                                Follow these simple steps to select your farm
                                and tree, then upload a leaf image for detailed
                                analysis
                            </p>
                        </div>
                        <StepIndicator
                            currentStep={currentStep}
                            selectedFarm={selectedFarm}
                            selectedTree={selectedTree}
                        />
                    </div>

                    {/* Main Content */}
                    <div className=" mb-12">
                        {currentStep === "farms" && (
                            <FarmSelectionStep
                                farms={farms}
                                selectedFarm={selectedFarm}
                                onFarmSelect={handleFarmSelect}
                                onAddFarmClick={() => setAddFarmModalOpen(true)}
                            />
                        )}
                        {currentStep === "trees" && (
                            <TreeSelectionStep
                                selectedFarm={selectedFarm}
                                trees={trees}
                                selectedTree={selectedTree}
                                loadingTrees={loadingTrees}
                                onTreeSelect={handleTreeSelect}
                                onGenerateNewTreeCode={generateNewTreeCode}
                            />
                        )}
                        {currentStep === "upload" && (
                            <UploadImageStep
                                selectedFarm={selectedFarm}
                                selectedTree={selectedTree}
                                image={image}
                                setImage={setImage}
                                isScanning={isScanning}
                                setIsScanning={setIsScanning}
                            />
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => {
                                if (currentStep === "trees")
                                    setCurrentStep("farms");
                                if (currentStep === "upload")
                                    setCurrentStep("trees");
                            }}
                            disabled={currentStep === "farms"}
                            className="px-8"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>

                        <div className="flex items-center gap-4">
                            {currentStep === "upload" && (
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={handleScanAnother}
                                    disabled={isScanning}
                                    className="px-8"
                                >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Scan Another
                                </Button>
                            )}

                            {currentStep !== "upload" && (
                                <Button
                                    size="lg"
                                    onClick={() => {
                                        if (
                                            currentStep === "farms" &&
                                            canProceedToTrees
                                        ) {
                                            setCurrentStep("trees");
                                        } else if (
                                            currentStep === "trees" &&
                                            canProceedToUpload
                                        ) {
                                            setCurrentStep("upload");
                                        }
                                    }}
                                    disabled={
                                        (currentStep === "farms" &&
                                            !canProceedToTrees) ||
                                        (currentStep === "trees" &&
                                            !canProceedToUpload)
                                    }
                                    className="px-8"
                                >
                                    Continue
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </PageWrapper>

            <AddFarmModal
                farm={farms}
                setFarm={setFarms}
                openDialog={addFarmModalOpen}
                setOpenDialog={setAddFarmModalOpen}
            />
        </>
    );
}
