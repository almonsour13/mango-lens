"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DiseaseColor } from "@/constant/color";
import { ScanResult } from "@/types/types";
import { TreeDeciduous, Trees, TreesIcon } from "lucide-react";

export default function ResultDetails({
    scanResult,
}: {
    scanResult: ScanResult;
}) {
    return (
        <div className="flex-1 flex flex-col gap-4">
            {/* Farm and Tree Information */}
            <Card className="border-0 p-0 space-y-2">
                <CardContent className="space-y-4 p-0">
                    <div className="flex gap-4">
                        <Badge variant="outline" className="px-4 py-2 text-sm">
                            <Trees className="h-4 w-4 mr-2 text-green-600" />
                            {scanResult.farmName || "N/A"}
                        </Badge>
                        <Badge variant="outline" className="px-4 py-2 text-sm">
                            <TreeDeciduous className="h-4 w-4 mr-2 text-green-600" />
                            {scanResult.treeCode || "N/A"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
            <div className="flex flex-col gap-2 p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                    <span className="text-base font-medium">
                        Assign Classification:
                    </span>
                </div>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                    {scanResult.diseases &&
                        scanResult.diseases.length > 0 &&
                        scanResult.diseases.map((disease, index) => {
                            const color = DiseaseColor(disease.diseaseName);
                            return (
                                <div className="flex flex-col" key={index}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{disease.diseaseName}</span>
                                        <span>
                                            {disease.likelihoodScore.toFixed(1)}
                                            %
                                        </span>
                                    </div>
                                    <div className="bg-muted h-2 w-full overflow-hidden rounded">
                                        <div
                                            className={`${
                                                disease.diseaseName ===
                                                "Healthy"
                                                    ? "bg-primary"
                                                    : "bg-destructive"
                                            } h-2`}
                                            style={{
                                                width: `${
                                                    disease.likelihoodScore * 1
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                                // <Card
                                //     key={index}
                                //     className={`border-0 ${"border-" + color}`}
                                // >
                                //     <div className="pb-2">
                                //         <CardTitle className="text-lg font-semibold">
                                //             {disease.diseaseName}
                                //         </CardTitle>
                                //         <CardDescription>
                                //             Likelihood:{" "}
                                //             {disease.likelihoodScore.toFixed(2)}
                                //             %
                                //         </CardDescription>
                                //     </div>
                                //     <div>
                                //         <Progress
                                //             value={
                                //                 disease.likelihoodScore * 100
                                //             }
                                //             className="h-2"
                                //         />
                                //     </div>
                                // </Card>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
