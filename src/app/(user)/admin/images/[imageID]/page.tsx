"use client";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Trees } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ImageAnalysisDetails } from "@/types/types";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/hooks/use-toast";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import AnalysisCarousel from "@/components/common/result-image-carousel";
import ResultImage from "@/components/common/result-image";
import { formatDate } from "date-fns";
import Link from "next/link";

export default function Page({
    params,
}: {
    params: Promise<{ imageID: string }>;
}) {
    const unwrappedParams = React.use(params);
    const { imageID } = unwrappedParams;
    const router = useRouter();
    const [imageDetails, setImageDetails] =
        useState<ImageAnalysisDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const { userInfo } = useAuth();

    useEffect(() => {
        const fetchImageDetailsByImageID = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `/api/admin/${userInfo?.userID}/images/${imageID}`
                );
                const data = await res.json();
                if (res.ok) {
                    setImageDetails(data.data);
                } else {
                    toast({
                        description: `${data.error}`,
                    });
                }
            } catch (error) {
                toast({
                    description: `${error}`,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchImageDetailsByImageID();
    }, [imageID]);
    const handleBack = () => {
        router.back();
    };
    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <button onClick={handleBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <Separator orientation="vertical" />
                    <h1 className="text-md font-medium">
                        {imageDetails?.treeCode &&
                            imageDetails?.treeCode + " - Image Details"}
                    </h1>
                </div>
                <div className="flex items-center gap-2"></div>
            </div>
            {!imageDetails ? (
                <div className="flex-1 h-full w-full flex items-center justify-center">
                    loading
                </div>
            ) : (
                <>
                    <PageWrapper>
                        <CardHeader className="p-0">
                            {/* <CardTitle>Image Details</CardTitle> */}
                            <CardDescription>
                                View detailed analysis results
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col  gap-2 md:gap-4 px-0">
                            <ResultImage
                                originalImage={imageDetails.imageData}
                                analyzedImage={imageDetails.analyzedImage || ""}
                                // boundingBoxes={imageDetails.boundingBoxes}
                            />
                            <AnalysisCarousel
                                originalImage={imageDetails.imageData}
                                analyzedImage={imageDetails.analyzedImage || ""}
                                // boundingBoxes={imageDetails.boundingBoxes}
                            />

                            <ResultDetails imageDetails={imageDetails} />
                        </CardContent>
                    </PageWrapper>
                </>
            )}
        </>
    );
}
function ResultDetails({
    imageDetails,
}: {
    imageDetails: ImageAnalysisDetails;
}) {
    return (
        <div className="flex-1 flex flex-col gap-4 border p-4 rounded-lg">
            <div className="flex flex-row justify-between md:justify-start gap-2">
                <div className="flex space-x-2">
                    <Trees className="h-5 w-5 text-muted-foreground" />
                    <Link
                        href={`/user/tree/${imageDetails.treeID}`}
                        className="text-base font-semibold hover:underline"
                    >
                        {imageDetails.treeCode || "N/A"}
                    </Link>
                </div>
                <div className="flex space-x-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-base font-semibold">
                        {formatDate(imageDetails.analyzedAt, "MMM dd, yyyy")}
                    </span>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                    <span className="text-base font-medium">
                        Assign Classification:
                    </span>
                </div>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                    <div className="flex flex-col">
                        <div className="flex justify-between text-sm mb-1">
                            <span>{imageDetails.disease.diseaseName}</span>
                            <span>
                                {imageDetails.disease.likelihoodScore.toFixed(
                                    1
                                )}
                                %
                            </span>
                        </div>
                        {/* <Progress
                                    value={disease.likelihoodScore * 100}
                                    className="h-2 bg-destructive"
                                /> */}
                        <div className="bg-muted h-2 w-full overflow-hidden rounded">
                            <div
                                className={`${
                                    imageDetails.disease.diseaseName ===
                                    "Healthy"
                                        ? "bg-primary"
                                        : "bg-destructive"
                                } h-2`}
                                style={{
                                    width: `${
                                        imageDetails.disease.likelihoodScore * 1
                                    }%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
