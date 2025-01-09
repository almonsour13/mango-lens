"use client";
import React, { useState, useCallback, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Crop, X, ImagePlus } from "lucide-react";
import Image from "next/image";
import ImageCropper from "./crop-image";
// import { useCaptureImageContext } from "@/context/capture-image-context";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { ImageUploadFooter } from "./upload-image-footer";
import { useCameraContext } from "@/context/camera-context";

export default function UploadField() {
    const { capturedImage, setCapturedImage } = useCameraContext();
    const [isScanning, setIsScanning] = useState(false);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [isNonSquare, setIsNonSquare] = useState(false);

    useEffect(() => {
        const checkImageAspectRatio = async () => {
            try {
                const img = document.createElement("img");
                img.src = capturedImage;
                img.onload = () => {
                    const isSquare = img.naturalWidth === img.naturalHeight;
                    setIsNonSquare(!isSquare);
                };

                img.onerror = (error) => {
                    console.error("Error loading image:", error);
                };
            } catch (error) {
                console.error("Error checking image aspect ratio:", error);
            }
        };
        if (capturedImage && !croppedImage) {
            checkImageAspectRatio();
        } else {
            setIsNonSquare(false);
        }
    }, [capturedImage, croppedImage]);

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <h1 className="text-md">Scan</h1>
                </div>
            </div>
            <PageWrapper>
                <Card className="p-0 md:p-4 border-0 bg-transparent md:border flex flex-col gap-4 shadow-none">
                    <CardContent
                        className={`relative h-80 p-0 flex items-center justify-center overflow-hidden bg-card border rounded-lg`}
                    >
                        {isNonSquare && (
                            <div className="absolute bottom-0 left-0 right-0 bg-secondary/80 text-white p-1 text-center text-xs z-20">
                                Warning: Image is not square (1:1 aspect ratio)
                            </div>
                        )}

                        <UploadImage
                            isNonSquare={isNonSquare}
                            croppedImage={croppedImage}
                            setCroppedImage={setCroppedImage}
                            isScanning={isScanning}
                            setIsScanning={setIsScanning}
                        />
                    </CardContent>
                    <CardFooter className="flex-1 p-0">
        <Suspense fallback={<div>sad</div>}>
                        <ImageUploadFooter
                            isNonSquare={isNonSquare}
                            croppedImage={croppedImage}
                            setCroppedImage={setCroppedImage}
                            isScanning={isScanning}
                            setIsScanning={setIsScanning}
                        />
        </Suspense>
                    </CardFooter>
                </Card>
            </PageWrapper>
        </>
    );
}

interface UploadImageProps {
    isNonSquare: boolean;
    croppedImage: string | null;
    setCroppedImage: (value: string | null) => void;
    isScanning: boolean;
    setIsScanning: (isScanning: boolean) => void;
}
const UploadImage: React.FC<UploadImageProps> = ({
    isNonSquare,
    croppedImage,
    setCroppedImage,
    isScanning,
    setIsScanning,
}) => {
    const { capturedImage, setCapturedImage } = useCameraContext();
    const [dragActive, setDragActive] = useState(false);
    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    };

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => setCapturedImage(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleImageUpload(e.target.files[0]);
        }
    };
    const handleRemoveImage = () => {
        setCapturedImage("");
        setCroppedImage(null);
        setIsScanning(false);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
    };

    const handleCropComplete = useCallback(
        (croppedImage: string) => {
            setCroppedImage(croppedImage);
            setIsCropping(false);
        },
        [setCroppedImage]
    );

    return (
        <>
            {capturedImage ? (
                <div className="h-80 w-auto aspect-square overflow-hidden flex item-center justify-center relative">
                    {isCropping ? (
                        <>
                            <ImageCropper
                                image={capturedImage!}
                                // croppedImage={croppedImage}
                                // setCroppedImage={setCroppedImage}
                                crop={crop}
                                setCrop={setCrop}
                                zoom={zoom}
                                setZoom={setZoom}
                                onCropComplete={handleCropComplete}
                                onCropCancel={() => {
                                    setIsCropping(false), setCroppedImage(null);
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <Image
                                src={croppedImage || capturedImage}
                                alt="Uploaded"
                                className="h-80 w-auto object-cover"
                                width={256}
                                height={256}
                            />
                            {isScanning && (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/80 to-transparent animate-scan" />
                                </>
                            )}
                        </>
                    )}
                    {!isScanning && !isCropping && (
                        <div className="absolute top-2 right-2 flex space-x-2">
                            <Button
                                onClick={() => setIsCropping(true)}
                                size="icon"
                                variant="outline"
                                className="rounded-full bg-background/80 hover:opacity-100 transition-opacity"
                            >
                                <Crop className="h-4 w-4" />
                                <span className="sr-only">Crop image</span>
                            </Button>
                            <Button
                                onClick={handleRemoveImage}
                                size="icon"
                                variant="destructive"
                                className="rounded-full bg-destructive/80 hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove image</span>
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div
                    className={`flex-1 cursor-pointer flex bg-card hover:bg-muted flex-col items-center justify-center relative h-full w-full rounded-lg ${
                        dragActive ? "bg-muted" : ""
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() =>
                        document.getElementById("input-image")?.click()
                    }
                >
                    {!dragActive && (
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
                    )}
                </div>
            )}
        </>
    );
};
