"use client";

import { getFarmByID } from "@/stores/farm";
import { loadingStore$ } from "@/stores/loading-store";
import { getTreesByFarmID } from "@/stores/tree";
import type { Farm, Tree } from "@/types/types";
import { useState, useEffect, useCallback } from "react";

interface treeDataProps extends Tree {
    farmName: string;
    treeImage: string;
    recentImage: {
        imageData:string,
        diseaseName:string,
        likelihoodScore:number;
    };
    imagesLength: number;
}
interface FarmProps extends Farm {
    totalTrees: number;
    healthyTrees: number;
    diseasedTrees: number;
    farmHealth: number;
}
export const useFarmData = (farmID: string) => {
    const [farm, setFarm] = useState<FarmProps | null>(null);
    const [trees, setTrees] = useState<treeDataProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [farmLoading, setFarmLoading] = useState(true);
    const [treeLoading, setTreeLoading] = useState(true);
    const [imageLoading, setImageLoading] = useState(true);
    const [analysisLoading, setAnalysisLoading] = useState(true);

    useEffect(() => {
        const unsubscribeFarm = loadingStore$.farm.onChange(({ value }) =>
            setFarmLoading(value)
        );
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
            unsubscribeFarm();
            unsubscribeTree();
            unsubscribeImage();
            unsubscribeAnalysis();
        };
    }, []);

    const fetchTreesByFarmID = useCallback(async () => {
        setLoading(true);
        try {
            const farmData = await getFarmByID(farmID);
            const treeData = await getTreesByFarmID(farmID);
            if (farmData) {
                setFarm(farmData.data);
                setTrees(treeData.data as treeDataProps[]);
            }
        } catch (error) {
            console.error("Error fetching trees:", error);
        } finally {
            setLoading(false);
        }
    }, [farmID]);

    useEffect(() => {
        fetchTreesByFarmID();
    }, [
        farmLoading,
        imageLoading,
        treeLoading,
        analysisLoading,
        fetchTreesByFarmID,
    ]);

    return { farm, setFarm, trees, loading };
};
