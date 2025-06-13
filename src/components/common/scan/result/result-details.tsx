"use client";

import { Badge } from "@/components/ui/badge";
import { ScanResult } from "@/types/types";
import { AlertTriangle, CheckCircle, TreeDeciduous, Trees } from "lucide-react";
import Link from "next/link";

export default function ResultDetails({
    scanResult,
}: {
    scanResult: ScanResult;
}) {
    const isHealthy = scanResult?.diseases[0].diseaseName === "Healthy";
    return (
        <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <span>Farm:</span>
                    <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded">
                        <Trees className="h-3.5 w-3.5 text-primary" />
                        <span className="text-sm font-medium">
                            {scanResult.farmName}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span>Tree:</span>
                    <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded">
                        <TreeDeciduous className="h-3.5 w-3.5 text-primary" />
                        <span className="text-sm font-medium">
                            {scanResult.treeCode}
                        </span>
                    </div>
                </div>
            </div>

            {/* Disease Classification */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                            Analysis Result
                        </span>
                    </div>
                    <Badge
                        variant={isHealthy ? "default" : "outline"}
                        className={`font-medium text-xs px-2 py-0.5 ${
                            isHealthy
                                ? ""
                                : "text-destructive border-destructive/30"
                        }`}
                    >
                        {isHealthy ? "Healthy" : "Disease Detected"}
                    </Badge>
                </div>

                {scanResult.diseases && (
                    <div className="flex flex-col gap-1.5 bg-muted/20 p-3 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {isHealthy ? (
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                ) : (
                                    <AlertTriangle className="h-4 w-4 text-destructive" />
                                )}
                                <span className="text-sm font-medium capitalize">
                                    {scanResult.diseases[0].diseaseName
                                        .replace(/([A-Z])/g, " $1")
                                        .trim()}
                                </span>
                            </div>
                            <span className="text-sm font-bold">
                                {scanResult.diseases[0].likelihoodScore}%
                            </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                            <div
                                className={`h-full ${
                                    isHealthy ? "bg-primary" : "bg-destructive"
                                } transition-all duration-300`}
                                style={{
                                    width: `${scanResult.diseases[0].likelihoodScore}%`,
                                }}
                            />
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {isHealthy
                                ? "This leaf appears to be healthy with no signs of disease."
                                : "Disease detected. Consider treatment options."}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
