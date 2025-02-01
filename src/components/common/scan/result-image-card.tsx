"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";
const ResultImageCard = ({
    label,
    imageData,
}: {
    label: string;
    imageData: string;
}) => {
    return (
        <div className="relative md:max-w-80 md:max-h-80 flex-1 aspect-square min-w-80 rounded-lg overflow-hidden shadow-lg cursor-pointer group ">
            <div className="relative w-full aspect-square">
                
                    <Image
                        src={
                            imageData
                        }
                        className="hover:scale-105 transition-transform duration-300"
                        alt="Scanned mango leaf"
                        layout="responsive"
                        objectFit="contain"
                        width={244}
                        height={244}
                    />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white text-center">
                <p className="text-sm font-semibold">{label}</p>
            </div>
        </div>
    );
};

export default ResultImageCard;
