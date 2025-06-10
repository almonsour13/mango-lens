"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Check, MapPin, Trees } from "lucide-react";
import type { Farm } from "@/types/types";

interface FarmSelectionStepProps {
    farms: Farm[];
    selectedFarm: Farm | null;
    onFarmSelect: (farm: Farm) => void;
    onAddFarmClick: () => void;
}

export default function FarmSelectionStep({
    farms,
    selectedFarm,
    onFarmSelect,
    onAddFarmClick,
}: FarmSelectionStepProps) {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    Select Your Farm
                </h2>
                <p className="text-muted-foreground">
                    Select a farm for leaf analysis or add a new one
                </p>
            </div>

            {/* Content */}
            {farms.length > 0 ? (
                <div className="space-y-4">
                    {/* Farm Grid */}
                    <div className="grid gap-3">
                        {farms.map((farm) => (
                            <Card
                                key={farm.farmID}
                                className={`group cursor-pointer transition-all duration-200 hover:shadow-md ${
                                    selectedFarm?.farmID === farm.farmID
                                        ? "ring-2 ring-primary/20 border-primary bg-primary/5"
                                        : "border-border hover:border-primary/30"
                                }`}
                                onClick={() => onFarmSelect(farm)}
                            >
                                <CardContent className="p-2">
                                    <div className="flex items-center gap-4">
                                        {/* Icon */}
                                        <div
                                            className={`flex-shrink-0 w-12 h-12 rounded flex items-center justify-center transition-colors ${
                                                selectedFarm?.farmID ===
                                                farm.farmID
                                                    ? "bg-primary/15 text-primary"
                                                    : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                            }`}
                                        >
                                            <MapPin className="w-5 h-5" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-foreground text-lg leading-tight">
                                                {farm.farmName}
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {farm.address}
                                            </p>
                                        </div>

                                        {/* Selection Indicator */}
                                        {selectedFarm?.farmID ===
                                            farm.farmID && (
                                            <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-primary-foreground" />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Add Farm Button */}
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                        onClick={onAddFarmClick}
                    >
                        <Plus className="w-5 h-5 mr-3" />
                        <span className="font-medium">Add New Farm</span>
                    </Button>
                </div>
            ) : (
                /* Empty State */
                <Card className="border-dashed border-2">
                    <CardContent className="p-12 text-center">
                        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trees className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-3 mb-8">
                            <h3 className="text-xl font-semibold text-foreground">
                                No Farms Available
                            </h3>
                            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                                Get started by adding your first farm to begin
                                leaf analysis
                            </p>
                        </div>
                        <Button
                            onClick={onAddFarmClick}
                            size="lg"
                            className="px-8"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Your First Farm
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
