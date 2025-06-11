"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useRecentAnalysis from "@/hooks/use-recent-analysis";
import { format } from "date-fns";
import { Eye, Trees } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const RecentAnalysis = () => {
    const { loading, analysis } = useRecentAnalysis();
    const router = useRouter();

    return (
        <Card className="border-0 p-0 shadow-none flex-1">
            <div className="py-2 w-full flex items-center justify-between">
                <CardTitle className="text-lg">Recent Analysis </CardTitle>
                {analysis && (
                    <Link
                        href={`/user/gallery`}
                        className="hover:underline text-primary"
                    >
                        View All
                    </Link>
                )}
            </div>
            <CardContent className="p-0 bg-carda border-0 rounded-md overflow-hidden">
                {loading && analysis.length === 0 ? (
                    <Skeleton className="flex-1 h-96" />
                ) : analysis ? (
                    <div className="space-y-2">
                        {analysis.slice(0, 5).map((image, index) => {
                            const isHealthy = image.diseases?.some(
                                (disease) =>
                                    disease.diseaseName === "Healthy" &&
                                    disease.likelihoodScore > 30
                            );
                            return (
                                <div
                                    key={image.imageID}
                                    className="flex items-center gap-4 p-4 bg-card/50  hover:bg-card cursor-pointer border rounded-lg"
                                    onClick={() =>
                                        router.push(
                                            `/user/gallery/${image.imageID}`
                                        )
                                    }
                                >
                                    <div className="relative group">
                                        <Image
                                            src={
                                                image.imageData ||
                                                "/placeholder.svg" ||
                                                "/placeholder.svg"
                                            }
                                            alt={`Tree ${image.treeCode}`}
                                            width={56}
                                            height={56}
                                            className="rounded object-cover border border-slate-200 dark:border-gray-700"
                                        />
                                        {image.analyzedImage && (
                                            <Image
                                                src={
                                                    image.analyzedImage ||
                                                    "/placeholder.svg" ||
                                                    "/placeholder.svg"
                                                }
                                                alt={`Tree ${image.imageID} Analyzed`}
                                                width={56}
                                                height={56}
                                                className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-slate-200 dark:border-gray-700"
                                            />
                                        )}
                                    </div>

                                    <div className="flex-1  space-y-1 min-w-0">
                                        <div className="flex items-center justify-between ">
                                            <h4 className="text-md font-medium">
                                                Tree {image.treeCode}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                {isHealthy ? (
                                                    <Badge
                                                        variant="default"
                                                        className="font-medium text-xs px-2 py-0.5"
                                                    >
                                                        {image.diseases?.find(
                                                            (disease) =>
                                                                disease.diseaseName ===
                                                                "Healthy"
                                                        )?.likelihoodScore || 0}
                                                        % Healthy
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="destructive"
                                                        className="font-medium text-xs px-2 py-0.5"
                                                    >
                                                        {image.diseases
                                                            .filter(
                                                                (di) =>
                                                                    di.diseaseName !==
                                                                    "Healthy"
                                                            )
                                                            .reduce(
                                                                (
                                                                    acc,
                                                                    disease
                                                                ) =>
                                                                    acc +
                                                                    disease.likelihoodScore,
                                                                0
                                                            )
                                                            .toFixed(1) +
                                                            "% Diseased"}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-muted-foreground gap-1">
                                                <Trees className="h-3 w-3" />
                                                {image.farmName && (
                                                    <p className="text-xs truncate">
                                                        {image.farmName}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {format(
                                                    image.uploadedAt,
                                                    "MMM d, h:mm a"
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex items-center justify-center">
                        No Recent Analysis
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
