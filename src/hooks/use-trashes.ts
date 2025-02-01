import { useState, useEffect, useCallback } from "react";
import { loadingStore$ } from "@/stores/loading-store";
import { getTrashByUser } from "@/stores/trash";
import { Image, Tree, Trash } from "@/types/types";


type Trashes = Trash & { item: Tree | Image };

export const useTrashes = () => {
    const [trashes, setTrashes] = useState<Trashes[] | []>([]);
    const [loading, setLoading] = useState(true);
    const [treeLoading, setTreeLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [analysisLoading, setAnalysisLoading] = useState(false);

    // Subscribe to loading states from loadingStore$
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

    // Fetch trashes
    const fetchTrashes = useCallback(async () => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating delay
            const res = await getTrashByUser();
            if (res) {
                setTrashes(res);
            }
        } catch (error) {
            console.error("Error fetching trashes:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch trashes when image, tree, or analysis loading state changes
    useEffect(() => {
        if (!imageLoading && !treeLoading && !analysisLoading) {
            fetchTrashes();
        }
    }, [imageLoading, treeLoading, analysisLoading, fetchTrashes]);

    return { trashes, setTrashes, loading };
};
