"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
    AlertTriangle,
    ArrowDownToLine,
    ArrowLeft,
    Calendar,
    CheckCircle,
    Edit,
    MessageCircle,
    MoreVertical,
    Trash2,
    TreeDeciduous,
    Trees,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { generateImage } from "@/actions/generate-image-analysis-report";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import ConfirmationModal from "../modal/confirmation-modal";
import MigrateImageModal from "../modal/migrate-image-modal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import ResultImage from "./result-image";
import AnalysisCarousel from "./result-image-carousel";
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

    const isHealthy = imageDetails?.disease?.diseaseName === "Healthy";

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
                            <CardDescription>
                                View detailed analysis results
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4 p-0">
                            {/* Image Analysis Card - styled like farm card */}

                            <CardContent className="p-0 space-y-4">
                                {/* Image Display */}
                                <div className="space-y-4">
                                    <ResultImage
                                        originalImage={imageDetails.imageData}
                                        analyzedImage={
                                            imageDetails.analyzedImage || ""
                                        }
                                    />
                                    <AnalysisCarousel
                                        originalImage={imageDetails.imageData}
                                        analyzedImage={
                                            imageDetails.analyzedImage || ""
                                        }
                                    />
                                </div>

                                {/* Farm and Tree Info */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <span>Farm:</span>
                                        <Link
                                            href={`/user/farm/${imageDetails.farmID}`}
                                            className="hover:underline"
                                        >
                                            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded">
                                                <Trees className="h-3.5 w-3.5 text-primary" />
                                                <span className="text-sm font-medium">
                                                    {imageDetails.farmName}
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>Tree:</span>
                                        <Link
                                            href={`/user/tree/${imageDetails.treeID}`}
                                            className="hover:underline"
                                        >
                                            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded">
                                                <TreeDeciduous className="h-3.5 w-3.5 text-primary" />
                                                <span className="text-sm font-medium">
                                                    {imageDetails.treeCode}
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded">
                                        <Calendar className="h-3.5 w-3.5 text-primary" />
                                        <span className="text-sm font-medium">
                                            {format(
                                                new Date(
                                                    imageDetails.analyzedAt
                                                ),
                                                "MMM dd, yyyy"
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Disease Classification */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">
                                                Analysis Result
                                            </span>
                                        </div>
                                        <Badge
                                            variant={
                                                isHealthy
                                                    ? "default"
                                                    : "outline"
                                            }
                                            className={`font-medium text-xs px-2 py-0.5 ${
                                                isHealthy
                                                    ? ""
                                                    : "text-destructive border-destructive/30"
                                            }`}
                                        >
                                            {isHealthy
                                                ? "Healthy"
                                                : "Disease Detected"}
                                        </Badge>
                                    </div>

                                    {imageDetails.disease && (
                                        <div className="flex flex-col gap-1.5 bg-muted/20 p-3 rounded-lg border">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {isHealthy ? (
                                                        <CheckCircle className="h-4 w-4 text-primary" />
                                                    ) : (
                                                        <AlertTriangle className="h-4 w-4 text-destructive" />
                                                    )}
                                                    <span className="text-sm font-medium capitalize">
                                                        {imageDetails.disease.diseaseName
                                                            .replace(
                                                                /([A-Z])/g,
                                                                " $1"
                                                            )
                                                            .trim()}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-bold">
                                                    {
                                                        imageDetails.disease
                                                            .likelihoodScore
                                                    }
                                                    %
                                                </span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                                                <div
                                                    className={`h-full ${
                                                        isHealthy
                                                            ? "bg-primary"
                                                            : "bg-destructive"
                                                    } transition-all duration-300`}
                                                    style={{
                                                        width: `${imageDetails.disease.likelihoodScore}%`,
                                                    }}
                                                />
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {isHealthy
                                                    ? "This leaf appears to be healthy with no signs of disease."
                                                    : "Disease detected. Consider treatment options."}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
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
