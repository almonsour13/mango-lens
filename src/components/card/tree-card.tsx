import Link from "next/link";
import { Card } from "../ui/card";
import Image from "next/image";
import { Leaf, TreeDeciduous } from "lucide-react";
import { usePathname } from "next/navigation";
import { Image as img, Tree } from "@/type/types";
import { TreeActionMenu } from "../action menu/tree-action-menu";
import { formatDistanceToNow } from "date-fns";

interface TreeWithImage extends Tree {
    treeImage: string;
    recentImage: string;
    imagesLength: number;
}

export default function TreeCard({
    tree,
    handleAction,
}: {
    tree: TreeWithImage;
    handleAction: (e: any, action: string, treeID: number) => void;
}) {
    const pathname = usePathname();

    return (
        <Link href={`${pathname}/${tree.treeID}`}>
            <Card className="overflow-hidden group bg-card border shadow-none">
                <div className="relative aspect-square">
                    {tree.recentImage && tree.recentImage ? (
                        <Image
                            src={tree.recentImage}
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
                                } text-white px-2.5 py-0.5 rounded-full text-xs flex items-center`}
                            >
                                {tree.status == 1 ? "Active" : "Inactive"}
                            </div>
                            <div className="bg-muted-foreground  text-white px-2.5 py-0.5 rounded-full text-xs flex items-center">
                                <Leaf size={12} className="mr-1" />
                                {tree.imagesLength}
                            </div>
                        </div>
                        <div className="flex h-8 items-center gap-2 justify-between w-full">
                                {tree.treeImage && (
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                        <Image
                                            src={tree.treeImage}
                                            alt={tree.treeCode}
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </div>
                                )}
                                <div className="flex items-end justify-between flex-1">
                                <div className="truncate">
                                    <h3 className="font-semibold text-md text-white truncate">
                                        {tree.treeCode}
                                    </h3>
                                </div>
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
            </Card>
        </Link>
    );
}
