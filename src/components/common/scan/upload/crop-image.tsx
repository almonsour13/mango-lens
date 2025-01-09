"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import * as SliderPrimitive from "@radix-ui/react-slider";
import Cropper from "react-easy-crop";
import ModalDrawer from "@/components/modal/modal-drawer-wrapper";
import { RotateCcw } from "lucide-react";

interface CropArea {
    width: number;
    height: number;
    x: number;
    y: number;
}

interface Point {
    x: number;
    y: number;
}

interface ImageCropperProps {
    image: string;
    crop: Point;
    setCrop: (crop: Point) => void;
    zoom: number;
    setZoom: (value: number) => void;
    onCropComplete: (croppedImage: string) => void;
    onCropCancel: () => void;
}

const DEFAULT_CROP: Point = { x: 0, y: 0 };
const DEFAULT_ZOOM = 1;

export default function ImageCropper({
    image,
    crop,
    setCrop,
    zoom,
    setZoom,
    onCropComplete,
    onCropCancel,
}: ImageCropperProps) {
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);

    const onCrop = useCallback((croppedArea: Point, croppedAreaPixels: CropArea) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", (error) => reject(error));
            image.src = url;
        });

    const getCroppedImg = useCallback(async (
        imageSrc: string,
        pixelCrop: CropArea
    ): Promise<string> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("No 2d context");
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return canvas.toDataURL("image/jpeg");
    },[]);

    const handleCrop = useCallback(async () => {
        try {
            if (image && croppedAreaPixels) {
                const croppedImage = await getCroppedImg(
                    image,
                    croppedAreaPixels
                );
                onCropComplete(croppedImage);
            }
        } catch (error) {
            console.error("Error cropping image:", error);
        }
    }, [image, croppedAreaPixels, onCropComplete, getCroppedImg]);

    const handleReset = useCallback(() => {
        setCrop(DEFAULT_CROP);
        setZoom(DEFAULT_ZOOM);
    }, [setCrop, setZoom]);

    return (
        <ModalDrawer open={true} onOpenChange={onCropCancel}>
            <DialogHeader>
                <DialogTitle>Crop Your Image</DialogTitle>
                <DialogDescription>
                    Adjust the crop and click confirm when you&apos;re done.
                </DialogDescription>
            </DialogHeader>

            <div className="relative w-full h-80">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onCropComplete={onCrop}
                    onZoomChange={setZoom}
                />
            </div>

            <div className="mt-4 flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Zoom:</span>
                <SliderPrimitive.Root
                    className="relative flex items-center select-none touch-none w-full h-5"
                    min={1}
                    max={3}
                    step={0.01}
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                >
                    <SliderPrimitive.Track className="bg-muted relative flex-grow rounded-full h-2">
                        <SliderPrimitive.Range className="absolute bg-primary rounded-full h-full" />
                    </SliderPrimitive.Track>
                    <SliderPrimitive.Thumb
                        className="block w-4 h-4 bg-primary shadow-md rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        aria-label="Zoom"
                    />
                </SliderPrimitive.Root>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    className="ml-2"
                    title="Reset crop and zoom"
                >
                    <RotateCcw className="h-4 w-4" />
                </Button>
            </div>

            <DialogFooter className="flex-row justify-end space-x-2">
                <Button
                    variant="outline"
                    onClick={onCropCancel}
                >
                    Cancel
                </Button>
                <Button onClick={handleCrop}>
                    Save
                </Button>
            </DialogFooter>
        </ModalDrawer>
    );
}