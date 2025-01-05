"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "date-fns";
import {
    Edit,
    Trash2,
    Trees,
    Calendar,
    ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import PageWrapper from "@/components/wrapper/page-wrapper";
import {
    Tree,
    Image as Img,
    Analysis,
    diseaseIdentified,
    Disease,
} from "@/type/types";
import ResultImage from "./result-image";
import { Separator } from "../ui/separator";
import { useAuth } from "@/context/auth-context";
import ConfirmationModal from "../modal/confirmation-modal";
import { DiseaseColor } from "@/constant/color";
import MigrateImageModal from "../modal/migrate-image-modal";
import Link from "next/link";

type boundingBox = {
    diseaseName: string;
    x: number;
    y: number;
    w: number;
    h: number;
};

type ImageDetailsProps = Tree &
    Img & { analyzedImage: string | null } & {
        boundingBoxes: boundingBox[];
    } & Analysis & { diseases: (diseaseIdentified & Disease)[] };

export default function ImageDetails({ imageID }: { imageID: number }) {
    const { toast } = useToast();
    const router = useRouter();
    const [imageDetails, setImageDetails] = useState<ImageDetailsProps | null>(
        null
    );
    const { userInfo } = useAuth();
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [isMigrateModalOpen, setIsMigrateModalOpen] = useState(false);

    useEffect(() => {
        const fetchImageDetails = async () => {
            try {
                const response = await fetch(
                    `/api/user/${userInfo?.userID}/images/${imageID}`
                );
                if (!response.ok)
                    throw new Error("Failed to fetch image details");
                const data = await response.json();
                setImageDetails(data);
            } catch (error) {
                console.error("Error fetching image details:", error);
                toast({
                    title: "Error",
                    description:
                        "Failed to load image details. Please try again.",
                    variant: "destructive",
                });
            }
        };
        fetchImageDetails();
    },[imageID, userInfo?.userID, toast]);

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(
                `/api/user/${userInfo?.userID}/trash`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ imageID: imageDetails?.imageID }),
                }
            );

            const result = await response.json();
            router.back();
            if (result.success) {
                toast({
                    title: `Image Move to trash`,
                    description: `Move to Trash action performed on tree ${imageDetails?.imageID}`,
                });
            }
        } catch (error) {
            console.error("Error deleting disease:", error);
        }
        setConfirmationModalOpen(false);
    };
    const handleDelete = () => {
        setConfirmationModalOpen(true);
    };

    const handleBack = () => {
        router.back();
    };
    const handleMigrateImage = async (newTreeCode: string) => {
        setImageDetails((prevDetails) =>
            prevDetails ? { ...prevDetails, treeCode: newTreeCode } : null
        );
    };
    if (!imageDetails) return <div>Loading...</div>;

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <button onClick={handleBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <Separator orientation="vertical" />
                    <h1 className="text-md">
                        {formatDate(imageDetails.analyzedAt, "MMM dd, yyyy")}
                    </h1>
                </div>
                <div className="flex gap-2 ">
                    <Button
                        variant="outline"
                        onClick={() => handleDelete()}
                        className="w-10 md:w-auto text-destructive"
                    >
                        <Trash2 className="h-5 w-5" />
                        <span className="hidden md:block text-sm">
                            Move to Trash
                        </span>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setIsMigrateModalOpen(true)}
                        className="w-10 md:w-auto"
                    >
                        <Edit className=" h-5 w-5" />
                        <span className="hidden md:block text-sm">Migrate</span>
                    </Button>
                </div>
            </div>
            <PageWrapper>
                <CardHeader className="p-0">
                    <CardTitle>Image Details</CardTitle>
                    <CardDescription>
                        View and manage your tree collection
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col  gap-4 px-0 mt-4">
                    <ResultImage
                        originalImage={imageDetails.imageData}
                        analyzedImage={imageDetails.analyzedImage || ""}
                        boundingBoxes={imageDetails.boundingBoxes}
                    />
                    <ResultDetails imageDetails={imageDetails} />
                </CardContent>
                <CardFooter className="flex justify-end gap-2 px-0"></CardFooter>
            </PageWrapper>
            <ConfirmationModal
                open={confirmationModalOpen}
                onClose={() => setConfirmationModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={`Are you sure you want to delete this image? `}
                content={`This action cannot be undone.`}
            />
            <MigrateImageModal
                openDialog={isMigrateModalOpen}
                setOpenDialog={setIsMigrateModalOpen}
                onMigrate={handleMigrateImage}
                initialData={{
                    imageID: imageDetails?.imageID,
                    currentTreeCode: imageDetails?.treeCode,
                }}
            />
        </>
    );
}

function ResultDetails({ imageDetails }: { imageDetails: ImageDetailsProps }) {
    return (
        <div className="flex-1 flex flex-col gap-4 border p-4 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between gap-2">
                <div className="flex space-x-2">
                    <Trees className="h-5 w-5 text-muted-foreground" />
                    <span className="text-base font-medium">Tree Code:</span>
                    <Link
                        href={`/user/tree/${imageDetails.treeCode}`}
                        className="text-base font-semibold hover:underline"
                    >
                        {imageDetails.treeCode || "N/A"}
                    </Link>
                </div>
                <div className="flex space-x-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-base font-medium">
                        Analyzed Date:
                    </span>
                    <span className="text-base font-semibold">
                        {formatDate(imageDetails.analyzedAt, "MMM dd, yyyy")}
                    </span>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex items-center space-x-2">
                    {/* <CircleAlert className="h-5 w-5 text-muted-foreground" /> */}
                    <span className="text-base font-medium">
                        Disease Detected
                    </span>
                </div>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                    {imageDetails.diseases.map((disease) => {
                        const color: string = DiseaseColor(disease.diseaseName);
                        return (
                            <Card
                                key={disease.diseaseID}
                                className={`border border-${color} text-${color}`}
                            >
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-semibold">
                                        {disease.diseaseName}
                                    </CardTitle>
                                    <CardDescription>
                                        Likelihood:{" "}
                                        {disease.likelihoodScore.toFixed(2)}%
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">
                                        {disease.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
