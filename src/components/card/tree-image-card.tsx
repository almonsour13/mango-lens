import React from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Image as img } from "@/types/types";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "../ui/badge";
import { useAuth } from "@/context/auth-context";

type images = img & { analyzedImage: string } & { treeCode?: string } & {
    disease: { likelihoodScore: number; diseaseName: string };
};

export const TreeImageCard = ({ image }: { image: images }) => {
    const { userInfo } = useAuth();
    const pathname = usePathname();
    const isHealthy = image.disease.diseaseName === "Healthy";

    return (
        <Link
            key={image.imageID}
            href={`${
                userInfo?.role === 1 ? "/admin/images" : "/user/gallery"
            }/${image.imageID}`}
        >
            <Card className="overflow-hidden group border shadow-none">
                <div className="relative overflow-hidden rounded aspect-square">
                    {image.analyzedImage && (
                        <Image
                            src={image.analyzedImage}
                            alt={`Tree ${image.imageID} Analyzed`}
                            layout="fill"
                            objectFit="cover"
                            className="transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute inset-0 z-10"
                        />
                    )}
                    <Image
                        src={image.imageData}
                        alt={`Tree ${image.imageID}`}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20 flex items-end">
                        <div className="flex flex-col md:items-center md:flex-row gap-1 justify-between w-full p-2">
                            <div className="flex flex-col">
                                {image.treeCode &&
                                    pathname.includes("gallery") && (
                                        <Link
                                            href={`/user/tree/${image.treeID}`}
                                            className="font-semibold text-md text-white truncate hover:underline"
                                        >
                                            {image.treeCode}
                                        </Link>
                                    )}
                                <p className="text-xs text-white/70">
                                    {formatDistanceToNow(
                                        new Date(image.uploadedAt),
                                        { addSuffix: true }
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute left-2 top-2 z-30 flex gap-1 items-center">
                        <Badge variant={isHealthy ? "default" : "destructive"}>
                            {image.disease.likelihoodScore}%{" "}
                            {isHealthy ? "Healthy" : "Diseased"}
                        </Badge>
                    </div>
                </div>
            </Card>
        </Link>
    );
};
