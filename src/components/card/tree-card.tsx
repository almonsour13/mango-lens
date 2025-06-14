"use client";

import type React from "react";

import Link from "next/link";
import { Card } from "../ui/card";
import Image from "next/image";
import { Leaf, TreeDeciduous } from "lucide-react";
import type { Tree } from "@/types/types";
import { TreeActionMenu } from "../action menu/tree-action-menu";
import { Badge } from "../ui/badge";

interface TreeWithImage extends Tree {
    farmName: string;
    treeImage: string;
    recentImage: {
        imageData: string;
        diseaseName: string;
        likelihoodScore: number;
    };
    imagesLength: number;
}

export default function TreeCard({
    tree,
    handleAction,
}: {
    tree: TreeWithImage;
    handleAction: (
        e: React.MouseEvent<HTMLDivElement>,
        action: string,
        treeID: string
    ) => void;
}) {
    const isHealthy =
        tree.recentImage && tree.recentImage.diseaseName === "Healthy";
    return (
        <Link href={`/user/tree/${tree.treeID}`}>
            <Card className="overflow-hidden group bg-card border shadow-none">
                <div className="relative aspect-square">
                    {tree.recentImage && tree.recentImage ? (
                        <Image
                            src={
                                tree.recentImage.imageData || "/placeholder.svg"
                            }
                            alt={`Tree ${tree.treeCode}`}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex justify-center items-center p-8">
                            <TreeDeciduous className="h-full w-full opacity-10" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 flex flex-col justify-between p-2 md:p-2">
                        <div className="flex flex-row-reverse items-center justify-between w-full">
                            <Badge
                                variant={
                                    tree.status == 1 ? "default" : "destructive"
                                }
                                className="font-medium text-xs px-2 py-0.5"
                            >
                                {tree.status == 1 ? "Active" : "Inactive"}
                            </Badge>
                            {tree.recentImage && (
                                <Badge
                                    variant={
                                        isHealthy ? "default" : "destructive"
                                    }
                                    className="font-medium text-xs px-2 py-0.5"
                                >
                                    {tree.recentImage.likelihoodScore}%{" "}
                                    {isHealthy ? "Healthy" : "Diseased"}
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-col  items-start gap-2 w-full min-w-0">
                            <div className="bg-muted-foreground/50 text-white px-2.5 py-0.5 rounded-full text-xs flex items-center flex-shrink-0">
                                <Leaf size={12} className="mr-1" />
                                {tree.imagesLength}
                            </div>
                            <div className="flex w-full items-center justify-between gap-2 flex-1">
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="h-8 w-8 bg-muted rounded flex items-center justify-center flex-shrink-0">
                                        {tree.treeImage ? (
                                            <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={
                                                        tree.treeImage ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={tree.treeCode}
                                                    layout="fill"
                                                    objectFit="cover"
                                                />
                                            </div>
                                        ) : (
                                            <TreeDeciduous className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-medium text-sm truncate text-white">
                                            {tree.treeCode}
                                        </h3>
                                        {tree.farmName && (
                                            <p className="text-xs text-white/70 truncate">
                                                {tree.farmName}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <TreeActionMenu
                                        treeID={tree.treeID}
                                        treeCode={tree.treeCode}
                                        status={tree.status}
                                        handleAction={handleAction}
                                    />
                                </div>
                            </div>
                            {/* <div className="flex items-center justify-between flex-1 min-w-0 gap-2">
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-md text-white truncate leading-tight">
                                        {tree.treeCode}
                                    </h3>
                                    {tree.farmName && (
                                        <p className="text-xs text-gray-300 truncate leading-tight">
                                            {tree.farmName}
                                        </p>
                                    )}
                                </div>
                                <div className="flex-shrink-0">
                                    <TreeActionMenu
                                        treeID={tree.treeID}
                                        treeCode={tree.treeCode}
                                        status={tree.status}
                                        handleAction={handleAction}
                                    />
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
