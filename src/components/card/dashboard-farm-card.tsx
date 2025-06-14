"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Farm } from "@/types/types";
import {
    MapPin,
    Bug,
    CheckCircle,
    AlertTriangle,
    ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface FarmProps extends Farm {
    totalTrees: number;
    healthyTrees: number;
    diseasedTrees: number;
    activeTrees: number;
    inactiveTrees: number;
    diseaseCount: { [diseaseName: string]: number };
    farmHealth: number;
}

export const DashboardFarmCard = ({ farm }: { farm: FarmProps }) => {
    const isActive = farm.status === 1;
    const farmHealth = farm.farmHealth;
    const healthPercentage = farm.activeTrees
        ? (farm.healthyTrees / farm.activeTrees) * 100
        : 100;
    const diseasePercentage = farm.activeTrees
        ? (farm.diseasedTrees / farm.activeTrees) * 100
        : 0;

    const sortedDiseases = Object.entries(farm.diseaseCount || {})
        .sort(([, a], [, b]) => b - a)
        .filter(([disease]) => disease !== "Healthy");

    return (
        <Link href={`/user/farm/${farm.farmID}`} className="block group">
            <Card className="overflow-hidden border bg-card/50 transition-all duration-200 hover:border-primary">
                {/* Status Bar with gradient - matching the FarmCard */}
                {/* <div
                    className={`h-1.5 ${
                        isActive
                            ? "bg-gradient-to-r from-primary/80 via-primary to-primary/80"
                            : "bg-gradient-to-r from-destructive/80 via-destructive to-destructive/80"
                    }`}
                /> */}

                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-semibold truncate">
                                {farm.farmName}
                            </CardTitle>
                            <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="text-xs truncate">
                                    {farm.address || "No address specified"}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                            <Badge
                                variant={isActive ? "default" : "outline"}
                                className={`font-medium text-xs px-2 py-0.5 ${
                                    isActive
                                        ? ""
                                        : "text-destructive border-destructive/30"
                                }`}
                            >
                                {isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                    {/* Farm Health - styled like the FarmCard */}
                    <div className="flex flex-col gap-1.5 bg-muted/20 p-2.5 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium">
                                    Farm Health
                                </span>
                            </div>
                            <span className="text-xs font-bold">
                                {farmHealth}%
                            </span>
                        </div>
                        <div className="w-full bg-muted-foreground/10 rounded-full h-2 overflow-hidden">
                            <div className="flex h-full">
                                <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{ width: `${healthPercentage}%` }}
                                />
                                <div
                                    className="h-full bg-destructive transition-all duration-300"
                                    style={{ width: `${diseasePercentage}%` }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-primary inline-block"></span>
                                <span>
                                    Healthy: {healthPercentage.toFixed(1)}%
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-destructive inline-block"></span>
                                <span>
                                    Diseased: {diseasePercentage.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Disease Found - styled like the FarmCard */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium flex items-center gap-1.5">
                                <Bug className="h-3.5 w-3.5 text-destructive" />
                                Disease Found
                            </span>
                            {sortedDiseases.length > 0 ? (
                                <Badge
                                    variant="outline"
                                    className="text-xs font-normal h-5 px-1.5"
                                >
                                    {sortedDiseases.length}{" "}
                                    {sortedDiseases.length === 1
                                        ? "type"
                                        : "types"}
                                </Badge>
                            ):(<Badge
                                    variant="outline"
                                    className="text-xs font-normal h-5 px-1.5"
                                >
                                    None
                                </Badge>
                            )}
                        </div>

                        {/* {sortedDiseases.length > 0 ? (
                            <div className="flex gap-1.5">
                                {sortedDiseases
                                    .slice(0, 2)
                                    .map(([disease, count]) => (
                                        <div
                                            key={disease}
                                            className="flex flex-1 items-center justify-between p-1.5 px-2 bg-destructive/5 border border-destructive/20 rounded-md hover:bg-destructive/10 transition-colors"
                                        >
                                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                                <div className="font-medium text-xs text-foreground capitalize truncate max-w-[80px]">
                                                    {disease
                                                        .replace(
                                                            /([A-Z])/g,
                                                            " $1"
                                                        )
                                                        .trim()}
                                                </div>
                                            </div>
                                            <div className="text-xs font-bold text-destructive ml-1.5">
                                                {count}
                                            </div>
                                        </div>
                                    ))}
                                {sortedDiseases.length > 2 && (
                                    <div className="border p-1.5 flex items-center justify-center text-xs rounded bg-muted/20">
                                        +{sortedDiseases.length - 2}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 p-2 bg-primary/5 border border-primary/20 rounded-md">
                                <span className="text-xs font-medium">
                                    No diseases detected
                                </span>
                            </div>
                        )} */}
                    </div>

                    {/* Stats Summary - styled like the FarmCard */}
                    {/* <div className="flex justify-between items-center pt-3 border-t mt-2">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs">
                                <span className="text-muted-foreground">
                                    Total:
                                </span>
                                <span className="font-medium">
                                    {farm.totalTrees || 0}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                                <AlertTriangle className="h-3 w-3 text-destructive" />
                                <span className="font-medium">
                                    {farm.diseasedTrees || 0}
                                </span>
                            </div>
                        </div>
                        <div className="text-xs text-primary flex items-center gap-1 group-hover:underline">
                            View details
                            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </div>
                    </div> */}
                </CardContent>
            </Card>
        </Link>
    );
};
