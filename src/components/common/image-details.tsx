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
import { ImageAnalysisDetails } from "@/types/types";
import { formatDate } from "date-fns";
import {
    ArrowDownToLine,
    ArrowLeft,
    Calendar,
    Edit,
    MessageCircle,
    MoreVertical,
    Trash2,
    TreeDeciduous,
    Trees,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { generateImage } from "@/actions/generate-image-analysis-report";
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
import { getImageByImageID } from "@/stores/image";
import { moveToTrash } from "@/stores/trash";
import { useImageDetails } from "@/hooks/use-image-details";
import AddFeedBackModel from "../modal/feedback-modal";
import { v4 } from "uuid";
import { submitFeedback } from "@/stores/feedback";
import { Badge } from "../ui/badge";

export default function ImageDetails({ imageID }: { imageID: string }) {
    const { toast } = useToast();
    const router = useRouter();
    const { imageDetails, setImageDetails, loading } = useImageDetails(imageID);

    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [isMigrateModalOpen, setIsMigrateModalOpen] = useState(false);
    const [isFeedbackModel, setIsFeedbackModel] = useState(false);

    const { userInfo } = useAuth();

    const handleConfirmDelete = async () => {
        try {
            if (!imageDetails) return null;
            const res = await moveToTrash(imageDetails.imageID, 2);
            toast({
                description: res.message,
            });
            if (res.success) {
                router.back();
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

    const handleMigrateImage = async (treeID: string, newTreeCode: string) => {
        setImageDetails((prevDetails) =>
            prevDetails
                ? { ...prevDetails, treeCode: newTreeCode, treeID: treeID }
                : null
        );
    };

    const onSubmitFeedback = async (content: string) => {
        if (!userInfo?.userID) return;
        const newFeedback = {
            feedbackID: v4(),
            content,
            userID: userInfo.userID,
            status: 1,
            feedbackAt: new Date(),
            responses: [],
        };

        const res = await submitFeedback(newFeedback);

        toast({
            description: res.message,
        });
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
                        {imageDetails?.treeCode + " - Image Details" ||
                            "Loading..."}
                    </h1>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-10 md:hidden">
                            <MoreVertical size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => setIsFeedbackModel(true)}
                        >
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
                        onClick={() => setIsFeedbackModel(true)}
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
                    <AddFeedBackModel
                        open={isFeedbackModel}
                        onClose={() => setIsFeedbackModel(false)}
                        onSubmitFeedback={onSubmitFeedback}
                    />
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
                            imageID: imageDetails?.imageID || "",
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
        <div className="flex-1 flex flex-col gap-4">
            <Card className="border-0 p-0 space-y-2">
                <CardContent className="space-y-4 p-0">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/user/farm/${imageDetails.farmID}`}
                            className="text-base font-semibold hover:underline"
                        >
                            <Badge
                                variant="outline"
                                className="px-4 py-2 text-sm"
                            >
                                <Trees className="h-4 w-4 mr-2 text-green-600" />
                                {imageDetails.farmName || "N/A"}
                            </Badge>
                        </Link>
                        <Link
                            href={`/user/tree/${imageDetails.treeID}`}
                            className="text-base font-semibold hover:underline"
                        >
                            <Badge
                                variant="outline"
                                className="px-4 py-2 text-sm"
                            >
                                <TreeDeciduous className="h-4 w-4 mr-2 text-green-600" />
                                {imageDetails.treeCode || "N/A"}
                            </Badge>
                        </Link>
                        <div className="flex items-center justify-center">
                            <Calendar className="h-4 w-4 mr-2 text-green-600" />
                            <span className="text-sm font-semibold">
                                {formatDate(
                                    imageDetails.analyzedAt,
                                    "MMM dd, yyyy"
                                )}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col gap-2 p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                    <span className="text-base font-medium">
                        Assign Classification:
                    </span>
                </div>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                    {imageDetails.disease && (
                        <div className="flex flex-col">
                            <div className="flex justify-between text-sm mb-1">
                                <span>{imageDetails.disease.diseaseName}</span>
                                <span>
                                    {imageDetails.disease.likelihoodScore}%
                                </span>
                            </div>
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
                                            imageDetails.disease
                                                .likelihoodScore * 1
                                        }%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
