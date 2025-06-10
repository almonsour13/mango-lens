"use client";

import type React from "react";

import Link from "next/link";
import { Card } from "../ui/card";
import Image from "next/image";
import { Leaf, TreeDeciduous } from "lucide-react";
import type { Tree } from "@/types/types";
import { TreeActionMenu } from "../action menu/tree-action-menu";

interface TreeWithImage extends Tree {
    farmName: string;
    treeImage: string;
    recentImage: {
        imageData:string,
        diseaseName:string,
        likelihoodScore:number;
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

    return (
        <Link href={`/user/tree/${tree.treeID}`}>
            <Card className="overflow-hidden group bg-card border shadow-none">
                <div className="relative aspect-square">
                    {tree.recentImage && tree.recentImage ? (
                        <Image
                            src={tree.recentImage.imageData || "/placeholder.svg"}
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
                        <div className="flex items-center justify-between w-full">
                            <div
                                className={`${
                                    tree.status == 1
                                        ? "bg-primary"
                                        : "bg-destructive"
                                } text-white px-2.5 py-0.5 rounded-full text-xs flex items-center flex-shrink-0`}
                            >
                                {tree.status == 1 ? "Active" : "Inactive"}
                            </div>
                            <div className="bg-muted-foreground text-white px-2.5 py-0.5 rounded-full text-xs flex items-center flex-shrink-0">
                                <Leaf size={12} className="mr-1" />
                                {tree.imagesLength}
                            </div>
                        </div>
                        <div className="flex h-8 items-center gap-2 w-full min-w-0">
                            {tree.treeImage && (
                                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                    <Image
                                        src={
                                            tree.treeImage || "/placeholder.svg"
                                        }
                                        alt={tree.treeCode}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                            )}
                            <div className="flex items-center justify-between flex-1 min-w-0 gap-2">
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
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
