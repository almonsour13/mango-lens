import { useState, useEffect, useCallback } from "react";
import { loadingStore$ } from "@/stores/loading-store";
import { Image,Tree } from "@/types/types"; // Assuming correct types for 'images' and 'Tree'
import { getTreeByID } from "@/stores/tree";
import { getImagesByTreeID } from "@/stores/image";

type images = Image & { analyzedImage: string} & {
    diseases: { likelihoodScore: number; diseaseName: string }[];
};

export const useTreeData = (treeID: string) => {
    const [tree, setTree] = useState<(Tree & { treeImage?: string,  farmName:string }) | null>(null);
    const [images, setImages] = useState<images[]>([]);
    const [loading, setLoading] = useState(true);
    const [treeLoading, setTreeLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [analysisLoading, setAnalysisLoading] = useState(false);

    // Subscribe to loading store to track loading states
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

    // Function to fetch tree and images data
    const fetchTreeData = useCallback(async () => {
        setLoading(true); // Set loading state
        try {
            const treeData = await getTreeByID(treeID);
            const imagesData = await getImagesByTreeID(treeID);

            if (treeData) {
                setTree(treeData);
                setImages(imagesData.data as images[]);
            }
        } catch (error) {
            console.error("Error fetching tree and images:", error);
        } finally {
            setLoading(false); // Set loading to false when fetch is complete
        }
    }, [treeID]);

    // Fetch tree data when the relevant loading states are false
    useEffect(() => {
        if (!imageLoading && !treeLoading && !analysisLoading) {
            fetchTreeData();
        }
    }, [imageLoading, treeLoading, analysisLoading, fetchTreeData]);

    return { tree,setTree, images, loading };
};
