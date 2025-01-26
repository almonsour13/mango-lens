"use client";

import React, { useEffect, useState } from "react";
import ResultImageCard from "./scan/result-image-card";

interface ResultImageProps {
    originalImage: string;
    analyzedImage: string;
}
export default function ResultImage({
    originalImage,
    analyzedImage,
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
            />
        </div>
    );
}
