import { useState, useEffect, useCallback } from "react";
import { loadingStore$ } from "@/stores/loading-store";
import { getImageByImageID } from "@/stores/image";
import { ImageAnalysisDetails } from "@/types/types";
import { toast } from "./use-toast";

export const useImageDetails = (imageID: string) => {
    const [loading, setLoading] = useState(true);
    const [imageDetails, setImageDetails] = useState<ImageAnalysisDetails | null>(null);

    const [treeLoading, setTreeLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [analysisLoading, setAnalysisLoading] = useState(false);

    // Subscribing to loading states from loadingStore$
    useEffect(() => {
        const unsubscribeTree = loadingStore$.tree.onChange(({ value }) =>
            setTreeLoading(value)
        );
        const unsubscribeImage = loadingStore$.image.onChange(({ value }) =>
            setImageLoading(value)
        );
        const unsubscribeAnalysis = loadingStore$.analysis.onChange(
            ({ value }) => setAnalysisLoading(value)
        );

        return () => {
            unsubscribeTree();
            unsubscribeImage();
            unsubscribeAnalysis();
        };
    }, []);

    // Fetch image details
    const fetchImageDetails = useCallback(async () => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500)); // Simulating delay
            const res = await getImageByImageID(imageID);
            if (res.success) {
                setImageDetails(res.data);
            }
        } catch (error) {
            console.error("Error fetching image details:", error);
            toast({
                title: "Error",
                description: "Failed to load image details. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [imageID]);

    // Trigger fetch when loading states change or when imageID changes
    useEffect(() => {
        if (!imageLoading && !treeLoading && !analysisLoading) {
            fetchImageDetails();
        }
    }, [imageLoading, treeLoading, analysisLoading, fetchImageDetails]);

    return { imageDetails, setImageDetails, loading };
};
