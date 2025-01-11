"use client";

import React, { useState } from "react";
import ResultImageCard from "./scan/result-image-card";

type boundingBox = {
    diseaseName: string;
    x: number;
    y: number;
    w: number;
    h: number;
};
interface ResultImageProps {
    originalImage: string;
    analyzedImage: string;
    boundingBoxes?: boundingBox[];
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
