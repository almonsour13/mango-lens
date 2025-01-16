"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DiseaseColor } from "@/constant/color";
import { ScanResult } from "@/types/types";
import { Trees } from "lucide-react";

export default function ResultDetails({
    scanResult,
}: {
    scanResult: ScanResult;
}) {
    return (
        <div className="flex-1 flex flex-col gap-4 border p-4 rounded-lg bg-card">
            <div className="flex items-center space-x-2">
                <Trees className="h-5 w-5 text-muted-foreground" />
                <span className="text-base font-medium">Tree Code:</span>
                <span className="text-base font-semibold">
                    {scanResult.treeCode || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex items-center space-x-2">
                    <span className="text-base font-medium">
                        Disease Detected:
                    </span>
                </div>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                    {scanResult.diseases &&
                        scanResult.diseases.length > 0 &&
                        scanResult.diseases.map((disease) => {
                            const color = DiseaseColor(disease.diseaseName);
                            return (
                                <Card
                                    key={disease.diseaseID}
                                    className={`border ${"border-" + color}`}
                                >
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg font-semibold">
                                            {disease.diseaseName}
                                        </CardTitle>
                                        <CardDescription>
                                            Likelihood:{" "}
                                            {disease.likelihoodScore.toFixed(2)}
                                            %
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm">
                                            {disease.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
