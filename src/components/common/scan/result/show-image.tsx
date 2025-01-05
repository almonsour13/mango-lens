import React, { useState } from "react";
import Image from "next/image";
import { RotateCw, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ShowImageProps {
    showImageDialog: boolean;
    setShowImageDialog: (value: boolean) => void;
    imageUrl: string;
}

const ShowImage: React.FC<ShowImageProps> = ({
    imageUrl = "/placeholder.svg?height=600&width=800",
    showImageDialog,
    setShowImageDialog,
}) => {
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);

    const handleZoomChange = (value: number[]) => setZoom(value[0]);
    const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "image.png";
        link.click();
    };

    return (
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
            <DialogContent className="w-full">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">
                        Detailed View
                    </DialogTitle>
                    <DialogDescription>
                        Zoom and rotate the image as needed.
                    </DialogDescription>
                </DialogHeader>
                <div className="relative flex flex-col items-center">
                    <Image
                        loading="lazy"
                        src={imageUrl}
                        alt="Detailed scan"
                        width={600}
                        height={400}
                        style={{
                            transform: `scale(${zoom}) rotate(${rotation}deg)`,
                            transition: "transform 0.2s",
                        }}
                    />
                    <div className="absolute top-2 right-2">
                        <Button
                            variant="secondary"
                            onClick={handleRotate}

                        >
                            <RotateCw className="h-4 w-4" />
                        </Button>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        onClick={handleDownload}
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Download Image</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <div className="my-4">
                    <Slider
                        defaultValue={[1]}
                        min={1}
                        max={5}
                        step={0.1}
                        value={[zoom]}
                        onValueChange={handleZoomChange}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShowImage;

