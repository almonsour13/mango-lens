import { Leaf, Trash2, TreeDeciduous } from "lucide-react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const TreeSkeletonCard = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
                <div className="relative overflow-hidden rounded aspect-square">
                    <Skeleton className="h-full w-full flex items-center justify-center p-8">
                        <TreeDeciduous className="h-full w-full opacity-10" />
                    </Skeleton>
                </div>
            </Card>
        ))}
    </div>
);
export const TreeImageSkeletonCard = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
                <div className="relative overflow-hidden rounded aspect-square">
                    <Skeleton className="h-full w-full flex items-center justify-center p-8">
                        <Leaf className="h-full w-full opacity-10" />
                    </Skeleton>
                </div>
            </Card>
        ))}
    </div>
);
export const TrashSkeletonCard = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
                <div className="relative overflow-hidden rounded aspect-square">
                    <Skeleton className="h-full w-full flex items-center justify-center p-8">
                        <Trash2 className="h-full w-full opacity-10" />
                    </Skeleton>
                </div>
            </Card>
        ))}
    </div>
);