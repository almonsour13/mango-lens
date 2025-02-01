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
    return (
        <div className="hidden md:flex gap-4">
            <ResultImageCard imageData={originalImage} label="Original" />
            <ResultImageCard
            imageData={analyzedImage}
                label="Analyzed Image"
            />
        </div>
    );
}
