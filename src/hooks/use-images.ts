import { useState, useEffect, useCallback } from "react";
import { loadingStore$ } from "@/stores/loading-store";
import { getImagesByUserID } from "@/stores/image";
import { Image } from "@/types/types";

type Images = Image & { analyzedImage: string } & { treeCode: string } & {
    disease: { likelihoodScore: number; diseaseName: string };
};

export const useImages = () => {
    const [images, setImages] = useState<Images[]>([]);
    const [loading, setLoading] = useState(true);
    const [treeLoading, setTreeLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [analysisLoading, setAnalysisLoading] = useState(false);

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

    const fetchImages = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getImagesByUserID();
            if (res.success) {
                setImages(res.data as Images[]);
            }
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchImages();
    }, [imageLoading, treeLoading, analysisLoading]);

    return { images, loading };
};
