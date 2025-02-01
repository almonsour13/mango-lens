import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";

interface AnalysisCarouselProps {
    originalImage: string;
    analyzedImage: string;
}

export default function AnalysisCarousel({
    originalImage,
    analyzedImage,
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
                                    <div className="absolute z-10 bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-center">
                                        <p className="text-sm font-semibold">
                                            {image.label}
                                        </p>
                                    </div>
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
