"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useModel } from "@/context/model-context";
import { useScanResult } from "@/context/scan-result-context";
import { useFarmData } from "@/hooks/use-farm-data";
import { toast } from "@/hooks/use-toast";
import { useTreeData } from "@/hooks/use-tree-data";
import {
    ArrowLeft,
    CheckCircle2,
    ImagePlus,
    Info,
    Lightbulb,
    TreeDeciduous,
    Trees,
    X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function TreeDetailsPage({
    params,
}: {
    params: Promise<{ farmID: string; treeID: string }>;
}) {
    const [image, setImage] = useState<string | null>(null);
    const unwrappedParams = React.use(params);
    const { farmID, treeID } = unwrappedParams;
    const { farm, loading } = useFarmData(farmID);
    const { tree, images } = useTreeData(treeID);
    const [isScanning, setIsScanning] = useState(false);
    const [isProTipsOpen, setIsProTipsOpen] = useState(false);
    const { tfPredict } = useModel();
    const { setScanResult } = useScanResult();

    const router = useRouter();

    const validateImage = (imageUrl: string): Promise<boolean> => {
        return new Promise((resolve) => {
            const img = new window.Image();
            img.onload = () => {
                const isValid = img.width > 0 && img.height > 0;
                console.log(
                    `Image dimensions: ${img.width}x${img.height}, Valid: ${isValid}`
                );
                resolve(isValid);
            };
            img.onerror = () => {
                console.error("Failed to load image for validation");
                resolve(false);
            };
            img.src = imageUrl;
        });
    };
    const scanImage = async (imageUrl: string) => {
        if (!imageUrl) {
            toast({
                title: "No Image",
                description: "Please upload an image before scanning.",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsScanning(true);

            // Validate image before processing
            const isValidImage = await validateImage(imageUrl);
            if (!isValidImage) {
                throw new Error(
                    "Invalid image dimensions or corrupted image data"
                );
            }

            console.log("Starting image scan...");
            const result = await tfPredict(imageUrl);
            if (result && result.originalImage && result.analyzedImage) {
                setScanResult({
                    ...result,
                    treeID: treeID,
                    treeCode: tree?.treeCode as string,
                    farmName: farm?.farmName as string,
                    originalImage: result.originalImage,
                    analyzedImage: result.analyzedImage,
                    diseases: result.diseases || [],
                });
            }
            toast({
                title: "Scan Complete",
                description: "Image analysis completed successfully.",
                variant: "default",
            });
        } catch (error) {
            console.error("Scanning error:", error);
            toast({
                title: "Scanning Failed",
                description:
                    error instanceof Error
                        ? error.message
                        : "Error during scanning.",
                variant: "destructive",
            });
        } finally {
            setIsScanning(false);
        }
    };
    const handleImageUpload = async (file: File) => {
        // Validate file before processing
        if (!file.type.startsWith("image/")) {
            toast({
                title: "Invalid File",
                description: "Please select a valid image file.",
                variant: "destructive",
            });
            return;
        }

        // Check file size (optional: limit to reasonable size, e.g., 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast({
                title: "File Too Large",
                description: "Please select an image smaller than 10MB.",
                variant: "destructive",
            });
            return;
        }

        const reader = new FileReader();

        reader.onload = async (e) => {
            const result = e.target?.result;
            if (typeof result === "string") {
                console.log("Image loaded, data URL length:", result.length);
                setImage(result);

                const res = await scanImage(result);
            } else {
                toast({
                    title: "Upload Failed",
                    description: "Failed to read the image file.",
                    variant: "destructive",
                });
            }
        };

        reader.onerror = () => {
            toast({
                title: "Upload Failed",
                description: "Failed to read the image file.",
                variant: "destructive",
            });
        };

        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleImageUpload(e.target.files[0]);
        }
    };
    const handleBack = () => {
        router.back();
    };

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <button onClick={handleBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <Separator orientation="vertical" />
                    <h1 className="text-md">Upload an image</h1>
                </div>

                <Popover open={isProTipsOpen} onOpenChange={setIsProTipsOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Lightbulb className="h-4 w-4 text-primary" />
                            <span>Pro Tips</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="end">
                        <div className="p-4 pb-2">
                            <div className="flex items-center gap-2 mb-1">
                                <Lightbulb className="h-5 w-5 text-primary" />
                                <h4 className="font-medium">
                                    Pro Tips for Best Results
                                </h4>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                                Follow these tips to get the most accurate leaf
                                analysis
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-4">
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <div className="mt-0.5">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-xs">
                                            Natural Light
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Capture images in natural daylight
                                            for accurate detection
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-2">
                                    <div className="mt-0.5">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-xs">
                                            Clean Background
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Use a white or neutral background
                                            for better results
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-2">
                                    <div className="mt-0.5">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-xs">
                                            Full Visibility
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Ensure the entire leaf is visible in
                                            the frame
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-2">
                                    <div className="mt-0.5">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-xs">
                                            Focus & Clarity
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Take sharp, in-focus images showing
                                            leaf details clearly
                                        </p>
                                    </div>
                                </li>
                            </ul>

                            <div className="mt-3 pt-3 border-t border-primary/10">
                                <div className="flex items-center gap-1.5 text-xs text-primary">
                                    <Info className="h-3.5 w-3.5" />
                                    <span>
                                        Better images lead to more accurate
                                        analysis
                                    </span>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <PageWrapper className="flex-1">
                <CardHeader className="p-0">
                    {/* <CardTitle>Image Gallery</CardTitle> */}
                    <CardDescription>
                        Upload a clear leaf image for automatic scanning and
                        analysis
                    </CardDescription>
                </CardHeader>
                <div className="flex items-center justify-between"></div>
                {tree && farm && (
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <span>Farm:</span>
                            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded">
                                <Trees className="h-3.5 w-3.5 text-primary" />
                                <span className="text-sm font-medium">
                                    {farm.farmName}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Tree:</span>
                            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded">
                                <TreeDeciduous className="h-3.5 w-3.5 text-primary" />
                                <span className="text-sm font-medium">
                                    {tree.treeCode}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                <CardContent className="p-0 flex-1 h-full">
                    <Card className="p-0 h-full md:p-4 border-0 bg-transparent md:border flex flex-col gap-4 shadow-none">
                        <CardContent
                            className={`relative  h-auto md:h-full aspect-square md:aspect-auto p-0 flex items-center justify-center overflow-hidden border rounded-lg`}
                        >
                            {image ? (
                                <div className="h-full w-auto aspect-square overflow-hidden flex item-center justify-center relative">
                                    <Image
                                        src={image || "/placeholder.svg"}
                                        alt="Uploaded"
                                        className="h-full w-auto object-fill aspect-square"
                                        width={256}
                                        height={256}
                                    />
                                    {isScanning && (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/80 to-transparent animate-scan" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                {/* <div className="bg-black/50 text-white px-3 py-1 rounded-md text-sm">
                                            Analyzing...
                                        </div> */}
                                            </div>
                                        </>
                                    )}
                                    {!isScanning && (
                                        <div className="absolute top-2 right-2 flex space-x-2">
                                            {/* <Button
                                        onClick={handleManualScan}
                                        size="sm"
                                        variant="secondary"
                                        className="rounded-full bg-secondary/80 hover:opacity-100 transition-opacity"
                                    >
                                        Scan Again
                                    </Button> */}
                                            <Button
                                                onClick={() => {
                                                    setImage("");
                                                    document
                                                        .getElementById(
                                                            "input-image"
                                                        )
                                                        ?.click();
                                                }}
                                                size="icon"
                                                variant="destructive"
                                                className="rounded transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Remove image
                                                </span>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div
                                    className={`flex-1 cursor-pointer flex bg-muted/50 hover:bg-muted flex-col items-center justify-center relative h-full w-full rounded-lg `}
                                    onClick={() =>
                                        document
                                            .getElementById("input-image")
                                            ?.click()
                                    }
                                >
                                    <div className="flex flex-col gap-2 text-center">
                                        <div className="flex justify-center text-foreground">
                                            <div className="rounded-full bg-primary p-4">
                                                <ImagePlus className="h-8 w-8 text-white" />
                                            </div>
                                        </div>
                                        <div className="space-y-0">
                                            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">
                                                Click to add image
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                or drag and drop
                                            </p>
                                            <div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    name="image"
                                                    id="input-image"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </CardContent>
            </PageWrapper>
        </>
    );
}
