import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import { BoundingBox } from "@/types/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";

interface AnalysisCarouselProps {
    originalImage: string;
    analyzedImage: string;
    boundingBoxes?: BoundingBox[];
}

export default function AnalysisCarousel({
    originalImage,
    analyzedImage,
    boundingBoxes = [],
}: AnalysisCarouselProps) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [showBoundingBoxes, setShowBoundingBoxes] = useState(false);

    useEffect(() => {
        if (!api) {
            return;
        }

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    const images = [
        { src: originalImage, alt: "Original Image", label: "Original Image" },
        { src: analyzedImage, alt: "Analyzed Image", label: "Analyzed Image" },
    ];

    const renderBoundingBoxes = () => (
        <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox="0 0 244 244"
            style={{ pointerEvents: "none" }}
        >
            {boundingBoxes?.map((box, index) => {
                const color = "stroke-red-500";
                return (
                    <g key={index}>
                        <rect
                            x={box.x}
                            y={box.y}
                            width={box.w}
                            height={box.h}
                            fill="none"
                            className={`${color}`}
                            strokeWidth="2"
                            style={{ pointerEvents: "all", cursor: "pointer" }}
                        />
                    </g>
                );
            })}
        </svg>
    );
    return (
        <Carousel setApi={setApi} className="w-full md:w-80 mx-auto md:hidden">
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem key={index}>
                        <Card className="border-none">
                            <CardContent className="p-0">
                                <div className="relative aspect-square rounded-lg overflow-hidden">
                                    <Image
                                        src={
                                            index == 0
                                                ? image.src
                                                : index == 1 &&
                                                  !showBoundingBoxes
                                                ? image.src
                                                : images[0].src
                                        }
                                        alt={image.alt}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute z-10 bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white text-center">
                                        <p className="text-sm font-semibold">
                                            {image.label}
                                        </p>
                                    </div>
                                    {showBoundingBoxes &&
                                        index == 1 &&
                                        renderBoundingBoxes()}
                                    {image.label === "Analyzed Image" &&
                                        analyzedImage &&
                                        boundingBoxes?.length && (
                                            <div className="absolute top-4 right-4">
                                                <Button
                                                    variant="default"
                                                    onClick={() =>
                                                        setShowBoundingBoxes(
                                                            !showBoundingBoxes
                                                        )
                                                    }
                                                    className=" bg-black bg-opacity-50 w-8 h-8"
                                                >
                                                    <RefreshCcw className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                </div>
                            </CardContent>
                        </Card>
                    </CarouselItem>
                ))}
            </CarouselContent>
            {/* <CarouselPrevious />
            <CarouselNext /> */}
            <div className="py-2 text-center space-x-1">
                {images.map((_, index) => (
                    <Button
                        key={index}
                        variant={current === index ? "default" : "outline"}
                        size="sm"
                        className="w-2 h-2 rounded-full p-0 m-0"
                        onClick={() => api?.scrollTo(index)}
                    />
                ))}
            </div>
        </Carousel>
    );
}
