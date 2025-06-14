"use client"
import { getFarmByUser } from "@/stores/farm";
import { loadingStore$ } from "@/stores/loading-store";
import { getTreeByUser } from "@/stores/tree";
import { Farm, Tree } from "@/types/types";
import { useState, useEffect, useCallback } from "react";

interface FarmProps extends Farm{
    totalTrees: number;
    healthyTrees: number;
    diseasedTrees: number;
    activeTrees: number;
    inactiveTrees: number;
    diseaseCount: {[diseaseName: string]: number},
    farmHealth: number;
}

export const useFarms = () => {
    const [farms, setFarms] = useState<FarmProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [farmLoading, setFarmLoading] = useState(true);
    const [treeLoading, setTreeLoading] = useState(true);
    const [imageLoading, setImageLoading] = useState(true);
    const [analysisLoading, setAnalysisLoading] = useState(true);

    useEffect(() => {
        // Fixed: Changed from loadingStore$.tree to loadingStore$.farm for farm loading
        const unsubscribeFarm = loadingStore$.farm.onChange(({ value }) => setFarmLoading(value))
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

    const fetchFarm = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getFarmByUser();
            if (res.success) {
                setFarms(res.data as FarmProps[])
            }
        } catch (error) {
            console.error("Error fetching farms:", error);
        } finally {
            setLoading(false);
        }
    }, [imageLoading, treeLoading, analysisLoading, farmLoading]);

    useEffect(() => {
        fetchFarm();
    }, [fetchFarm]);

    return { farms, setFarms, loading };
};