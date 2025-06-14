"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MapPin,
    MoreVertical,
    Eye,
    Edit,
    TreeDeciduous,
    Bug,
    ChevronRight,
    AlertTriangle,
    CheckCircle,
    Clock,
} from "lucide-react";
import Link from "next/link";
import type { Farm } from "@/types/types";
import { format } from "date-fns";

interface FarmProps extends Farm {
    totalTrees: number;
    healthyTrees: number;
    diseasedTrees: number;
    activeTrees: number;
    inactiveTrees: number;
    diseaseCount: { [diseaseName: string]: number };
    farmHealth: number;
}

export function FarmCard({ farm }: { farm: FarmProps }) {
    const farmHealth = farm.farmHealth;
    const isActive = farm.status === 1;
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
            <Card className="overflow-hidden bg-card/50 border transition-all duration-200 hover:border-primary h-full flex flex-col">
                {/* Status Bar with gradient */}
                {/* <div
                    className={`h-1.5 ${
                        isActive
                            ? "bg-gradient-to-r from-primary/80 via-primary to-primary/80"
                            : "bg-gradient-to-r from-destructive/80 via-destructive to-destructive/80"
                    }`}
                /> */}

                <CardHeader className="pb-3 relative">
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 rounded hover:bg-muted"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                        <span className="sr-only">
                                            Open menu
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-52"
                                >
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={`/user/farm/${farm.farmID}`}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View Details
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={`/user/farm/${farm.farmID}/edit`}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <Edit className="h-4 w-4" />
                                            Edit Farm
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={`/user/tree/add?farmID=${farm.farmID}`}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <TreeDeciduous className="h-4 w-4" />
                                            Add Tree
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* {farm.description && (
                        <CardDescription className="mt-2 line-clamp-2 text-xs indent-5">
                            {farm.description}
                        </CardDescription>
                    )} */}
                </CardHeader>

                <CardContent className="space-y-2 flex-grow pb-0">
                    {/* Statistics Grid */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-card/50 rounded-lg border">
                            <div className="text-lg font-bold">
                                {farm.totalTrees || 0}
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-">
                                    {/* <div className="h-2 w-2 rounded-full bg-primary"></div> */}
                                    <span className="text-primary font-medium">
                                        {farm.activeTrees || 0}
                                    </span>
                                </div>
                                <div className="text-muted-foreground flex items-center gap-">
                                    <span>Total Trees</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {/* <div className="h-2 w-2 rounded-full bg-destructive"></div> */}
                                    <span className="text-destructive font-medium">
                                        {farm.inactiveTrees || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center p-2 bg-primary/10 rounded-lg border border-primary/20">
                            <div className="text-lg font-bold text-primary">
                                {farm.healthyTrees || 0}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                <span>Healthy</span>
                            </div>
                        </div>
                        <div className="text-center p-2 bg-destructive/10 rounded-lg border border-destructive/20">
                            <div className="text-lg font-bold text-destructive">
                                {farm.diseasedTrees || 0}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                <span>Diseased</span>
                            </div>
                        </div>
                    </div>

                    {/* Farm Health */}
                    <div className="flex flex-col gap-1.5 bg-muted/20 p-3 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                    Farm Health
                                </span>
                            </div>
                            <span className="text-sm font-bold">
                                {farmHealth}%
                            </span>
                        </div>
                        <div className="w-full bg-muted-foreground/10 rounded-full h-2.5 overflow-hidden">
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

                    {/* Disease Breakdown */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium flex items-center gap-1.5">
                                <Bug className="h-4 w-4 text-destructive" />
                                Disease Found
                            </span>
                            {sortedDiseases.length > 0 && (
                                <Badge
                                    variant="outline"
                                    className="text-xs font-normal"
                                >
                                    {sortedDiseases.length}{" "}
                                    {sortedDiseases.length === 1
                                        ? "type"
                                        : "types"}
                                </Badge>
                            )}
                        </div>

                        {sortedDiseases.length > 0 ? (
                            <div className="flex gap-2">
                                {sortedDiseases
                                    .slice(0, 2)
                                    .map(([disease, count]) => (
                                        <div
                                            key={disease}
                                            className="flex flex-1 items-center justify-between p-2 bg-destructive/5 border border-destructive/20 rounded hover:bg-destructive/10 transition-colors"
                                        >
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <div className="h-2 w-2 rounded-full bg-destructive"></div>
                                                <div className="font-medium text-xs text-foreground capitalize truncate">
                                                    {disease
                                                        .replace(
                                                            /([A-Z])/g,
                                                            " $1"
                                                        )
                                                        .trim()}
                                                </div>
                                            </div>
                                            <div className="text-xs font-bold text-destructive">
                                                {count}
                                            </div>
                                        </div>
                                    ))}
                                {sortedDiseases.length > 2 && (
                                    <div className="border p-2 flex items-center justify-center text-xs rounded bg-muted/20">
                                        +{" "}
                                        <span className="font-bold">
                                            {sortedDiseases.length - 2}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-2 bg-primary/5 border border-primary/20 rounded-md">
                                <div className="flex items-center gap-2">
                                    <div className="font-medium text-xs text-foreground">
                                        No diseases detected
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="flex items-center justify-between text-muted-foreground p-2 px-4 mt-4 border-t">
                    <div className="flex items-center text-xs gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {farm.addedAt
                            ? format(new Date(farm.addedAt), "MMM dd, yyyy")
                            : "Recently added"}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs gap-1 group-hover:text-primary group-hover:bg-primary/5 transition-colors"
                    >
                        View Details
                        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                </CardFooter>
            </Card>
        </Link>
    );
}
