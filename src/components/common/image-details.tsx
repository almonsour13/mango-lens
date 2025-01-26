"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useToast } from "@/hooks/use-toast";
import {
    ImageAnalysisDetails
} from "@/types/types";
import { formatDate } from "date-fns";
import {
    ArrowDownToLine,
    ArrowLeft,
    Calendar,
    Edit,
    MessageCircle,
    MoreVertical,
    Trash2,
    Trees
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { generateImage } from "@/actions/generate-image-analysis-report";
import { DiseaseColor } from "@/constant/color";
import { useAuth } from "@/context/auth-context";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import ConfirmationModal from "../modal/confirmation-modal";
import MigrateImageModal from "../modal/migrate-image-modal";
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import ResultImage from "./result-image";
import AnalysisCarousel from "./result-image-carousel";
import { getImageByID } from "@/stores/image";

export default function ImageDetails({ imageID }: { imageID: string }) {
    const { toast } = useToast();
    const router = useRouter();
    const [imageDetails, setImageDetails] =
        useState<ImageAnalysisDetails | null>(null);
    const { userInfo } = useAuth();
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [isMigrateModalOpen, setIsMigrateModalOpen] = useState(false);

    useEffect(() => {
        const fetchImageDetails = async () => {
            try {
                const i = await getImageByID(imageID);
                console.log(i)
                setImageDetails(i as ImageAnalysisDetails);
                // const response = await fetch(
                //     `/api/user/${userInfo?.userID}/images/${imageID}`
                // );
                // if (!response.ok)
                //     throw new Error("Failed to fetch image details");
                // const data = await response.json();
                // setImageDetails(data);
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
    }, [imageID, userInfo?.userID, toast]);

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

    const handleDownload = async () => {
        if (!imageDetails) return;
        await generateImage(imageDetails);
    };

    const handleMoveToTrash = () => {
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

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <button onClick={handleBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <Separator orientation="vertical" />
                    <h1 className="text-md">
                        {imageDetails &&
                            formatDate(
                                imageDetails?.analyzedAt,
                                "MMM dd, yyyy"
                            )}
                    </h1>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-10 md:hidden">
                            <MoreVertical size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Feedback
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload()}>
                            <ArrowDownToLine className="mr-2 h-4 w-4" />
                            Export
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setIsMigrateModalOpen(true)}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Migrate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleMoveToTrash()}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Move to trash
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="hidden md:flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleDownload()}
                        className="w-10 md:w-auto"
                    >
                        <MessageCircle className="h-5 w-5" />
                        <span className="hidden md:block text-sm">
                            Feedback
                        </span>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleDownload()}
                        className="w-10 md:w-auto"
                    >
                        <ArrowDownToLine className="h-5 w-5" />
                        <span className="hidden md:block text-sm">Export</span>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setIsMigrateModalOpen(true)}
                        className="w-10 md:w-auto"
                    >
                        <Edit className=" h-5 w-5" />
                        <span className="hidden md:block text-sm">Migrate</span>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleMoveToTrash()}
                        className="w-10 md:w-auto text-destructive"
                    >
                        <Trash2 className="h-5 w-5" />
                        <span className="hidden md:block text-sm">
                            Move to Trash
                        </span>
                    </Button>
                </div>
            </div>
            {!imageDetails ? (
                <div className="flex-1 h-full w-full flex items-center justify-center">
                    loading
                </div>
            ) : (
                <>
                    <PageWrapper>
                        <CardHeader className="p-0">
                            <CardTitle>Image Details</CardTitle>
                            {/* <CardDescription>
                                View and manage your tree collection
                            </CardDescription> */}
                        </CardHeader>
                        <CardContent className="flex flex-col  gap-4 px-0 mt-2">
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
                            imageID: imageDetails?.imageID || '',
                            currentTreeCode: imageDetails?.treeCode || "",
                        }}
                    />
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
            <div className="flex flex-col md:flex-row gap-2">
                <div className="flex space-x-2">
                    <Trees className="h-5 w-5 text-muted-foreground" />
                    {/* <span className="text-base font-medium">Tree Code:</span> */}
                    <Link
                        href={`/user/tree/${imageDetails.treeID}`}
                        className="text-base font-semibold hover:underline"
                    >
                        {imageDetails.treeCode || "N/A"}
                    </Link>
                </div>
                <div className="flex space-x-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    {/* <span className="text-base font-medium">
                        Date Processed:
                    </span> */}
                    <span className="text-base font-semibold">
                        {formatDate(imageDetails.analyzedAt, "MMM dd, yyyy")}
                    </span>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                    {/* <CircleAlert className="h-5 w-5 text-muted-foreground" /> */}
                    <span className="text-base font-medium">
                        Assign Classification:
                    </span>
                </div>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                    {imageDetails.diseases.map((disease, index) => {
                        const color: string = DiseaseColor(disease.diseaseName);
                        return (
                            <div className="flex flex-col" key={index}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{disease.diseaseName}</span>
                                        <span>
                                            {disease.likelihoodScore.toFixed(1)}
                                            %
                                        </span>
                                    </div>
                                    <Progress
                                        value={disease.likelihoodScore * 100}
                                        className="h-2"
                                    />
                                </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
