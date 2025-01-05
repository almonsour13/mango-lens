"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";
interface BoundingBox {
    x: number;
    y: number;
    w: number;
    h: number;
    diseaseName: string;
}

const ResultImageCard = ({
    label,
    originalImage,
    analyzedImage,
    boundingBoxes,
}: {
    label: string;
    originalImage?: string;
    analyzedImage?: string;
    boundingBoxes?: BoundingBox[];
}) => {
    const [showOriginal, setShowOriginal] = useState(false);
    const [hoveredDisease, setHoveredDisease] = useState<string | null>(null);

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
                            onMouseEnter={() =>
                                setHoveredDisease(box.diseaseName)
                            }
                            onMouseLeave={() => setHoveredDisease(null)}
                            style={{ pointerEvents: "all", cursor: "pointer" }}
                        />
                        {hoveredDisease === box.diseaseName && (
                            <text
                                x={box.x + 5}
                                y={box.y + 15}
                                fill="white"
                                fontSize="10"
                                fontWeight="bold"
                            >
                                {box.diseaseName}
                            </text>
                        )}
                    </g>
                );
            })}
        </svg>
    );

    return (
        <div className="relative md:max-w-80 md:max-h-80 flex-1 aspect-square min-w-80 rounded-lg overflow-hidden shadow-lg cursor-pointer group ">
            <div className="relative w-full aspect-square">
                {(label === "Original" && originalImage) ||
                (label === "Analyzed Image" && analyzedImage) ? (
                    <Image
                        src={
                            label === "Analyzed Image"
                                ? showOriginal
                                    ? originalImage ?? ""
                                    : analyzedImage ?? ""
                                : originalImage ?? ""
                        }
                        className="hover:scale-105 transition-transform duration-300"
                        alt="Scanned mango leaf"
                        layout="responsive"
                        objectFit="contain"
                        width={244}
                        height={244}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full bg-card">
                        <p className="text-gray-500 text-center px-4 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Image not available
                        </p>
                        <p className="text-gray-400 text-sm">
                            Analysis processed from previous version
                        </p>
                    </div>
                )}
                {label === "Analyzed Image" &&
                    showOriginal &&
                    boundingBoxes?.length &&
                    renderBoundingBoxes()}
                {label === "Analyzed Image" &&
                    analyzedImage &&
                    boundingBoxes?.length && (
                        <div className="absolute top-4 right-4">
                            <Button
                                variant="default"
                                onClick={() => setShowOriginal(!showOriginal)}
                                className=" bg-black bg-opacity-50 w-8 h-8"
                            >
                                <RefreshCcw className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white text-center">
                <p className="text-sm font-semibold">{label}</p>
            </div>
        </div>
    );
};

export default ResultImageCard;
