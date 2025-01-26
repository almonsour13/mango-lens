"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";
const ResultImageCard = ({
    label,
    originalImage,
    analyzedImage,
}: {
    label: string;
    originalImage?: string;
    analyzedImage?: string;
}) => {
    const [showOriginal, setShowOriginal] = useState(false);
    const [hoveredDisease, setHoveredDisease] = useState<string | null>(null);

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
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white text-center">
                <p className="text-sm font-semibold">{label}</p>
            </div>
        </div>
    );
};

export default ResultImageCard;
