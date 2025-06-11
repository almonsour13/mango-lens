"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
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
    Calendar,
    Bug,
} from "lucide-react";
import Link from "next/link";
import type { Farm } from "@/types/types";
import { formatDate } from "date-fns";

interface FarmProps extends Farm {
    totalTrees: number;
    healthyTrees: number;
    diseasedTrees: number;
    diseaseCount: { [diseaseName: string]: number };
    farmHealth: number;
}
export function FarmCard({ farm }: { farm: FarmProps }) {
    const farmHealth = farm.farmHealth;
    const isActive = farm.status === 1;

    const sortedDiseases = Object.entries(farm.diseaseCount)
        .sort(([, a], [, b]) => b - a)
        .filter(([disease, count], index) => disease !== "Healthy");

    return (
        <Link href={`/user/farm/${farm.farmID}`}>
            <Card className="group overflow-hidden border bg-card/50">
                {/* Status Bar */}
                <div
                    className={`h-1 ${
                        isActive ? "bg-primary" : "bg-destructive"
                    }`}
                />

                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-semibold truncate">
                                {farm.farmName}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm text-muted-foreground truncate">
                                    {farm.address}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                            <Badge variant={isActive ? "default" : "secondary"}>
                                {isActive ? "Active" : "Inactive"}
                            </Badge>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                >
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={`/user/farm/${farm.farmID}`}
                                            className="flex items-center gap-2"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View Details
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={`/user/farm/${farm.farmID}/edit`}
                                            className="flex items-center gap-2"
                                        >
                                            <Edit className="h-4 w-4" />
                                            Edit Farm
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={`/user/tree/add?farmID=${farm.farmID}`}
                                            className="flex items-center gap-2"
                                        >
                                            <TreeDeciduous className="h-4 w-4" />
                                            Add Tree
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {farm.description && (
                        <CardDescription className="mt-2 line-clamp-2">
                            {farm.description}
                        </CardDescription>
                    )}
                </CardHeader>

                <CardContent className="space-y-3">
                    {/* Statistics Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-1 bg-muted/10 rounded-lg border">
                            <div className="text-lg font-bold">
                                {farm.totalTrees || 0}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Total Trees
                            </div>
                        </div>
                        <div className="text-center p-1 bg-primary/10 rounded-lg border">
                            <div className="text-lg font-bold text-primary">
                                {farm.healthyTrees}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Healthy
                            </div>
                        </div>
                        <div className="text-center p-1 bg-destructive/10 rounded-lg border">
                            <div className="text-lg font-bold text-destructive">
                                {farm.diseasedTrees}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Diseased
                            </div>
                        </div>
                    </div>

                    {/* Farm Health */}
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                    Farm Health
                                </span>
                            </div>
                            <span className="text-sm font-bold text-primary">
                                {farmHealth}%
                            </span>
                        </div>
                        <div className="w-full bg-primary rounded-full h-2">
                            <div
                                className="h-2 rounded-full transition-all duration-300 bg-destructive"
                                style={{
                                    width: `${
                                        (farm.diseasedTrees / farm.totalTrees) *
                                        100
                                    }%`,
                                }}
                            />
                        </div>
                        <div className="flex justify-end">
                            <span className="text-sm font-bold text-destructive">
                                {(
                                    (farm.diseasedTrees / farm.totalTrees) *
                                    100
                                ).toFixed(1)}
                                %
                            </span>
                        </div>
                    </div>

                    {/* Disease Breakdown */}
                    <div className="flex flex-col gap-1">
                        {" "}
                        <span className="text-sm font-medium">
                            Disease Found:
                        </span>
                        {sortedDiseases.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                {sortedDiseases.map(
                                    ([disease, count], index) => {
                                        return (
                                            <div
                                                key={disease}
                                                className="flex items-center justify-between p-2 bg-destructive/5 border border-destructive/20 rounded hover:bg-destructive/10 transition-colors"
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-sm text-foreground capitalize truncate">
                                                            {disease
                                                                .replace(
                                                                    /([A-Z])/g,
                                                                    " $1"
                                                                )
                                                                .trim()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <div className="text-right">
                                                        <div className="text-sm font-bold text-destructive">
                                                            {count}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-2 bg-muted border rounded hover:bg-destructive/10 transition-colors">
                                <div className="font-medium text-sm text-foreground capitalize truncate">
                                    None
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            Added {formatDate(farm.addedAt, "MMM dd, yyyy")}
                        </div>
                        <Link href={`/user/farm/${farm.farmID}`}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                            >
                                View Details
                                <Eye className="h-3 w-3 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
