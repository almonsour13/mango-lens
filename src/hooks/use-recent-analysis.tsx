import { useState, useEffect } from "react";
import { recentAnalysis } from "@/stores/dashboard";
import { loadingStore$ } from "@/stores/loading-store";
import { Image } from "@/types/types";

type Images = Image & {
    analyzedImage: string | null;
    farmName:string,
    farmID:string
    treeCode: string;
    diseases: { likelihoodScore: number; diseaseName: string }[];
};
const useRecentAnalysis = () => {
    const [loading, setLoading] = useState(true);
    const [analysis, setAnalysis] = useState<Images[]>([]);
    const [farmLoading, setFarmLoading] = useState(false);
    const [treeLoading, setTreeLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [analysisLoading, setAnalysisLoading] = useState(false);

    useEffect(() => {
        const unsubscribeFarm = loadingStore$.farm.onChange(({ value }) => setFarmLoading(value));
        const unsubscribeTree = loadingStore$.tree.onChange(({ value }) => setTreeLoading(value));
        const unsubscribeImage = loadingStore$.image.onChange(({ value }) => setImageLoading(value));
        const unsubscribeAnalysis = loadingStore$.analysis.onChange(({ value }) => setAnalysisLoading(value));

        return () => {
            unsubscribeFarm()
            unsubscribeTree();
            unsubscribeImage();
            unsubscribeAnalysis();
        };
    }, []);

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            try {
                // await new Promise((resolve) => setTimeout(resolve, 500));
                const res = await recentAnalysis();
                if (res) {
                    setAnalysis(res.data as Images[]);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error retrieving images:", error);
            } 
        };
        
        if (!imageLoading && !treeLoading && !analysisLoading) {
            fetchImages();
        }
    }, [farmLoading, imageLoading, treeLoading, analysisLoading]);

    return { loading, analysis };
};

export default useRecentAnalysis;
