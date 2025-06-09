"use client";

import type React from "react";

import { Card, CardContent } from "@/components/ui/card";
import type { Farm, Tree } from "@/types/types";
import { ImagePlus, MapPin, TreePine, Trees, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useModel } from "@/context/model-context";
import { toast } from "@/hooks/use-toast";
import { useScanResult } from "@/context/scan-result-context";

interface UploadImageStepProps {
    image: string | null;
    setImage: (image: string) => void;
    isScanning: boolean;
    setIsScanning: (isScanning: boolean) => void;
    selectedFarm: Farm | null;
    selectedTree: Tree | null;
}

export default function UploadImageStep({
    image,
    setImage,
    isScanning,
    setIsScanning,
    selectedFarm,
    selectedTree,
}: UploadImageStepProps) {
    const { tfPredict } = useModel();
    const { setScanResult } = useScanResult();

    // Helper function to validate image dimensions
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
                    treeCode: selectedTree?.treeCode as string,
                    farmName: selectedFarm?.farmName as string,
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

    // Manual scan function for retry
    const handleManualScan = async () => {
        if (image) {
            await scanImage(image);
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="space-y-">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    Upload & Analyze
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                    Upload a clear image of the leaf for detailed analysis
                </p>
            </div>

            {/* Selection Summary */}
            <div className="flex gap-4">
                <Badge variant="outline" className="px-4 py-2 text-sm">
                    <MapPin className="w-4 h-4 mr-2  text-green-600" />
                    {selectedFarm?.farmName}
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-sm">
                    <TreePine className="w-4 h-4 mr-2 text-green-600" />
                    {selectedTree?.treeCode}
                </Badge>
            </div>

            {/* Selection Summary */}

            <Card className="p-0 md:p-4 border-0 bg-transparent md:border flex flex-col gap-4 shadow-none">
                <CardContent
                    className={`relative h-80 p-0 flex items-center justify-center overflow-hidden bg-card border rounded-lg`}
                >
                    {image ? (
                        <div className="h-80 w-auto aspect-square overflow-hidden flex item-center justify-center relative">
                            <Image
                                src={image || "/placeholder.svg"}
                                alt="Uploaded"
                                className="h-80 w-auto object-fill"
                                width={256}
                                height={256}
                            />
                            {isScanning && (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/80 to-transparent animate-scan" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-black/50 text-white px-3 py-1 rounded-md text-sm">
                                            Analyzing...
                                        </div>
                                    </div>
                                </>
                            )}
                            {!isScanning && (
                                <div className="absolute top-2 right-2 flex space-x-2">
                                    <Button
                                        onClick={handleManualScan}
                                        size="sm"
                                        variant="secondary"
                                        className="rounded-full bg-secondary/80 hover:opacity-100 transition-opacity"
                                    >
                                        Scan Again
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setImage("");
                                            document
                                                .getElementById("input-image")
                                                ?.click();
                                        }}
                                        size="icon"
                                        variant="destructive"
                                        className="rounded-full bg-destructive/80 hover:opacity-100 transition-opacity"
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
                            className={`flex-1 cursor-pointer flex bg-card hover:bg-muted flex-col items-center justify-center relative h-full w-full rounded-lg `}
                            onClick={() =>
                                document.getElementById("input-image")?.click()
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
        </div>
    );
}
