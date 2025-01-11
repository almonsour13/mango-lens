import React from "react";
import { Trees } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DiseaseColor } from "@/constant/color";
import { Tree, diseaseIdentified, Disease } from "@/types/types";


type boundingBox = {diseaseName:string, x:number, y:number, w:number, h:number}
type ScanResultType = ({tree:Tree, originalImage:string, analyzedImage:string, boundingBoxes:boundingBox[], diseases: (diseaseIdentified & Disease)[]})

export default function ResultDetails({ scanResult }: { scanResult: ScanResultType }) {
    return (
        <div className="flex-1 flex flex-col gap-4 border p-4 rounded-lg bg-card">
            <div className="flex items-center space-x-2">
                <Trees className="h-5 w-5 text-muted-foreground" />
                <span className="text-base font-medium">Tree Code:</span>
                <span className="text-base font-semibold">{scanResult.tree.treeCode || 'N/A'}</span>
            </div>  
            <div className="flex flex-col gap-4">
                <div className="flex items-center space-x-2">
                    <span className="text-base font-medium">Disease Detected</span>
                </div>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                    {scanResult.diseases && scanResult.diseases.length > 0 && scanResult.diseases.map((disease) => {
                        const color = DiseaseColor(disease.diseaseName);
                        return (
                            <Card key={disease.diseaseID} className={`border ${'border-'+color}`}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-semibold">{disease.diseaseName}</CardTitle>
                                    <CardDescription>
                                        Likelihood: {disease.likelihoodScore.toFixed(2)}%
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{disease.description}</p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

