"use client";

import React, { useState } from "react";
import ResultImageCard from "./scan/result-image-card";

type boundingBox = {diseaseName:string, x:number, y:number, w:number, h:number}
interface ResultImageProps {
    originalImage: string
    analyzedImage: string
    boundingBoxes?: boundingBox[]
}
export default function ResultImage({ originalImage, analyzedImage, boundingBoxes }: ResultImageProps) {
    const [currentImage, setCurrentImage] = useState<'original' | 'analyzed'>('original')

    const toggleImage = () => {
        setCurrentImage(prev => prev === 'original' ? 'analyzed' : 'original')
    }

    return (
        <div className="gap-4">
            <div className="md:hidden relative">
                <ResultImageCard
                    originalImage={originalImage} 
                    analyzedImage={analyzedImage}
                    label={currentImage === 'original' ? 'Original' : 'Analyzed Image'}
                    boundingBoxes={boundingBoxes}
                />
                <div className="flex justify-center absolute left-4 top-4">
                    <button onClick={toggleImage} className="flex hover items-center gap-1 p-2.5 py-1 bg-black bg-opacity-50 rounded md:text-sm font-medium text-white border-0">
                        {currentImage === 'original' ? (
                            <>
                                View Analyzed 
                            </>
                        ) : (
                            <>
                                View Original
                            </>
                        )}
                    </button>
                </div>
            </div>
            <div className="hidden md:flex gap-4">
                <ResultImageCard originalImage={originalImage} label="Original" />
                <ResultImageCard originalImage={originalImage} analyzedImage={analyzedImage} label="Analyzed Image" boundingBoxes={boundingBoxes}/>
            </div>
    </div>
    );
}
