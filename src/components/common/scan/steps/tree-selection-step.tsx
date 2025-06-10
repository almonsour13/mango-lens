"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, TreePine, Loader2, Sparkles, MapPin } from "lucide-react";
import type { Farm, Tree } from "@/types/types";

interface TreeSelectionStepProps {
    selectedFarm: Farm | null;
    trees: Tree[];
    selectedTree: Tree | null;
    loadingTrees: boolean;
    onTreeSelect: (tree: Tree) => void;
    onGenerateNewTreeCode: () => void;
}

export default function TreeSelectionStep({
    selectedFarm,
    trees,
    selectedTree,
    loadingTrees,
    onTreeSelect,
    onGenerateNewTreeCode,
}: TreeSelectionStepProps) {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                        Select a Tree Code
                    </h2>
                    <p className="text-muted-foreground">
                        Select a tree code from the selected farm or generate a new one
                    </p>
                </div>
                <Badge variant="outline" className="px-4 py-2 text-sm">
                    <MapPin className="w-4 h-4 mr-2  text-green-600" />
                    {selectedFarm?.farmName}
                </Badge>
            </div>

            {/* Content */}
            {loadingTrees ? (
                /* Loading State */
                <Card>
                    <CardContent className="p-16 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-6 text-primary" />
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">
                                Loading Trees
                            </h3>
                            <p className="text-muted-foreground">
                                Please wait while we fetch your trees...
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : trees.length > 0 ? (
                <div className="space-y-4">
                    {/* Tree Grid */}
                    <div className="grid gap-2">
                        {trees.map((tree) => (
                            <Card
                                key={tree.treeID}
                                className={`group cursor-pointer transition-all duration-200 hover:shadow-md ${
                                    selectedTree?.treeCode === tree.treeCode
                                        ? "ring-2 ring-primary/20 border-primary bg-primary/5"
                                        : "border-border hover:border-primary/30"
                                }`}
                                onClick={() => onTreeSelect(tree)}
                            >
                                <CardContent className="p-2">
                                    <div className="flex items-center gap-4">
                                        {/* Icon */}
                                        <div
                                            className={`flex-shrink-0 w-12 h-12 rounded flex items-center justify-center transition-colors ${
                                                selectedTree?.treeCode ===
                                                tree.treeCode
                                                    ? "bg-primary/15 text-primary"
                                                    : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                            }`}
                                        >
                                            <TreePine className="w-5 h-5" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-foreground text-lg leading-tight">
                                                {tree.treeCode}
                                            </h3>
                                        </div>

                                        {/* Selection Indicator */}
                                        {selectedTree?.treeCode ===
                                            tree.treeCode && (
                                            <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Generate Tree Button */}
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full h-12 border-dashed border-2 hover:border-green-500 hover:bg-green-50/50 transition-all duration-200"
                        onClick={onGenerateNewTreeCode}
                        disabled={loadingTrees}
                    >
                        <Sparkles className="w-5 h-5 mr-3 text-green-600" />
                        <span className="font-medium">
                            Generate New Tree Code
                        </span>
                    </Button>
                </div>
            ) : (
                /* Empty State */
                <Card className="border-dashed border-2">
                    <CardContent className="p-12 text-center">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <TreePine className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="space-y-3 mb-8">
                            <h3 className="text-xl font-semibold text-foreground">
                                No Trees Available
                            </h3>
                            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                                Generate your first tree code for this farm to
                                get started
                            </p>
                        </div>
                        <Button
                            onClick={onGenerateNewTreeCode}
                            disabled={loadingTrees}
                            size="lg"
                            className="px-8"
                        >
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generate First Tree Code
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
