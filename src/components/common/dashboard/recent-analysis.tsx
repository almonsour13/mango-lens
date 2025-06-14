"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useRecentAnalysis from "@/hooks/use-recent-analysis";
import { format } from "date-fns";
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    Eye,
    ShieldCheck,
    TreeDeciduous,
    Trees,
    TriangleAlert,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const RecentAnalysis = () => {
    const { loading, analysis } = useRecentAnalysis();
    const router = useRouter();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
                            const diseasePercentage = isHealthy
                                ? image.diseases?.find(
                                      (disease) =>
                                          disease.diseaseName === "Healthy"
                                  )?.likelihoodScore || 0
                                : image.diseases
                                      .filter(
                                          (di) => di.diseaseName !== "Healthy"
                                      )
                                      .reduce(
                                          (acc, disease) =>
                                              acc + disease.likelihoodScore,
                                          0
                                      )
                                      .toFixed(1);
                            return (
                                <div
                                    key={image.imageID}
                                    className="relative overflow-hidden bg-card/50 border rounded-lg transition-all duration-200 hover:border-primary"
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    onClick={() =>
                                        router.push(
                                            `/user/gallery/${image.imageID}`
                                        )
                                    }
                                >
                                    {/* Left border indicator */}
                                    {/* <div
                                        className={`absolute top-0 left-0 w-1 h-full ${
                                            isHealthy
                                                ? "bg-primary"
                                                : "bg-destructive"
                                        }`}
                                    /> */}

                                    <div className="flex items-center gap-4 p-3 pl-4 cursor-pointer">
                                        {/* Image with hover effect */}
                                        <div className="relative h-14 w-14 flex-shrink-0 rounded overflow-hidden">
                                            <Image
                                                src={
                                                    image.imageData ||
                                                    "/placeholder.svg"
                                                }
                                                alt={`Tree ${image.treeCode}`}
                                                width={56}
                                                height={56}
                                                className="object-cover h-full w-full"
                                            />
                                            {image.analyzedImage &&
                                                hoveredIndex === index && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-200">
                                                        <Image
                                                            src={
                                                                image.analyzedImage ||
                                                                "/placeholder.svg"
                                                            }
                                                            alt={`Tree ${image.imageID} Analyzed`}
                                                            width={56}
                                                            height={56}
                                                            className="object-cover h-full w-full opacity-90"
                                                        />
                                                    </div>
                                                )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 space-y-1.5 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <TreeDeciduous className="h-4 w-4 text-primary" />
                                                    <h4 className="text-sm font-medium">
                                                        {image.treeCode}
                                                    </h4>
                                                </div>
                                                <Badge
                                                    variant={
                                                        isHealthy
                                                            ? "default"
                                                            : "destructive"
                                                    }
                                                    className="font-medium text-xs px-2 py-0.5"
                                                >
                                                    {diseasePercentage}%{" "}
                                                    <span className="hidden md:block ml-1">
                                                        {isHealthy
                                                            ? "Healthy"
                                                            : "Diseased"}
                                                    </span>
                                                    {isHealthy ? (
                                                        <ShieldCheck className="h-4 w-3 ml-1 md:hidden" />
                                                    ) : (
                                                        <TriangleAlert className="h-3 w-3 ml-1 md:hidden" />
                                                    )}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Trees className="h-3.5 w-3.5" />
                                                    {image.farmName && (
                                                        <p className="truncate max-w-[150px]">
                                                            {image.farmName}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span>
                                                        {format(
                                                            new Date(
                                                                image.uploadedAt
                                                            ),
                                                            "MMM d, h:mm a"
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
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
