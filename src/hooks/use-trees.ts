import { loadingStore$ } from "@/stores/loading-store";
import { getTreeByUser } from "@/stores/tree";
import { Tree } from "@/types/types";
import { useState, useEffect, useCallback } from "react";

interface TreeWithImage extends Tree {
    farmName: string;
    treeImage: string;
    recentImage: string | null;
    imagesLength: number;
}
export const useTrees = () => {
    const [trees, setTrees] = useState<TreeWithImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [treeLoading, setTreeLoading] = useState(true);
    const [imageLoading, setImageLoading] = useState(true);
    const [analysisLoading, setAnalysisLoading] = useState(true);

    useEffect(() => {
        const unsubscribeTree = loadingStore$.tree.onChange(({ value }) => setTreeLoading(value));
        const unsubscribeImage = loadingStore$.image.onChange(({ value }) => setImageLoading(value));
        const unsubscribeAnalysis = loadingStore$.analysis.onChange(({ value }) => setAnalysisLoading(value));

        return () => {
            unsubscribeTree();
            unsubscribeImage();
            unsubscribeAnalysis();
        };
    }, []);

    const fetchTrees = useCallback(async () => {

        setLoading(true);
        try {
            const res = await getTreeByUser();
            if (res.success) {
                setTrees(res.data as TreeWithImage[]);
            }
        } catch (error) {
            console.error("Error fetching trees:", error);
        } finally {
            setLoading(false);
        }
    }, [imageLoading, treeLoading, analysisLoading]);

    useEffect(() => {
        fetchTrees();
    }, [fetchTrees]);

    return { trees, setTrees, loading };
};
