"use client";

import React, { useEffect, useState } from "react";
import ResultImageCard from "./scan/result-image-card";
import { BoundingBox } from "@/types/types";

interface ResultImageProps {
    originalImage: string;
    analyzedImage: string;
    boundingBoxes?: BoundingBox[];
}
export default function ResultImage({
    originalImage,
    analyzedImage,
    boundingBoxes,
}: ResultImageProps) {
    const [currentImage, setCurrentImage] = useState<"original" | "analyzed">(
        "original"
    );

    const toggleImage = () => {
        setCurrentImage((prev) =>
            prev === "original" ? "analyzed" : "original"
        );
    };

    return (
        <div className="hidden md:flex gap-4">
            <ResultImageCard originalImage={originalImage} label="Original" />
            <ResultImageCard
                originalImage={originalImage}
                analyzedImage={analyzedImage}
                label="Analyzed Image"
                boundingBoxes={boundingBoxes}
            />
        </div>
    );
}
