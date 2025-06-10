"use client";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Farm } from "@/types/types";
import Link from "next/link";

interface FarmProps extends Farm {
    totalTrees: number;
    healthyTrees: number;
    diseasedTrees: number;
    diseaseCount: { [diseaseName: string]: number };
    farmHealth: number;
}
export const DashboardFarmCard = ({ farm }: { farm: FarmProps }) => {
    const isActive = farm.status === 1;
    const farmHealth = farm.farmHealth;
    const sortedDiseases = Object.entries(farm.diseaseCount)
        .sort(([, a], [, b]) => b - a)
        .filter(([disease, count], index) => disease !== "Healthy");
    return (
        <Link href={`/user/farm/${farm.farmID}`}>
            <Card className="group overflow-hidden border bg-card/50">
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-semibold truncate">
                                {farm.farmName}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                {/* <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" /> */}
                                <span className="text-xs text-muted-foreground truncate">
                                    {farm.address}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                            <Badge variant={isActive ? "default" : "secondary"}>
                                {isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    {/* Farm Health */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Farm Health
                                </span>
                            </div>
                            <span className="text-sm font-bold text-primary">
                                {farmHealth}%
                            </span>
                        </div>
                        <div className="w-full bg-muted-foreground/20 rounded-full h-2">
                            <div
                                className="h-2 rounded-full transition-all duration-300 bg-primary"
                                style={{
                                    width: `${farmHealth}%`,
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        {" "}
                        <span className="text-xs font-medium text-muted-foreground">
                            Disease Found:
                        </span>
                        <div className="flex gap-2">
                            {sortedDiseases.length > 0 ? (
                                sortedDiseases
                                    .slice(0, 2)
                                    .map(([disease, count], index) => {
                                        return (
                                            <div
                                                key={disease}
                                                className="flex items-center justify-between p-1 px-2 bg-destructive/5 border border-destructive/20 rounded hover:bg-destructive/10 transition-colors"
                                            >
                                                <div className="font-medium text-xs text-foreground capitalize truncate">
                                                    {disease
                                                        .replace(
                                                            /([A-Z])/g,
                                                            " $1"
                                                        )
                                                        .trim()}
                                                </div>
                                            </div>
                                        );
                                    })
                            ) : (
                                <div className="flex items-center justify-between p-1 px-2 bg-muted border rounded hover:bg-destructive/10 transition-colors">
                                    <div className="font-medium text-xs text-foreground capitalize truncate">
                                        None
                                    </div>
                                </div>
                            )}
                            {sortedDiseases.length > 2 && (
                                <div className="flex items-center justify-between p-1 px-2 bg-muted border rounded hover:bg-destructive/10 transition-colors">
                                    <div className="font-medium text-xs text-foreground capitalize truncate">
                                        +{sortedDiseases.length - 2}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};
