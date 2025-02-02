"use client";

import { Progress } from "@/components/ui/progress";
import { DiseaseColor } from "@/constant/color";
import { ScanResult } from "@/types/types";
import { Trees } from "lucide-react";

export default function ResultDetails({
    scanResult,
}: {
    scanResult: ScanResult;
}) {
    return (
        <div className="flex-1 flex flex-col gap-4 border p-4 rounded-lg bg-">
            <div className="flex items-center space-x-2">
                <Trees className="h-5 w-5 text-muted-foreground" />
                {/* <span className="text-base font-medium">Tree Code:</span> */}
                <span className="text-base font-semibold">
                    {scanResult.treeCode || "N/A"}
                </span>
            </div>
            <div className="flex flex-col gap-2">
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
                                            disease.diseaseName === "Healthy"
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
