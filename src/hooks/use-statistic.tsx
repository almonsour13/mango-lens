import { useCallback, useEffect, useState } from "react";
import { loadingStore$ } from "@/stores/loading-store";
import { imageStatistic, overview, treeStatistic } from "@/stores/statistic";
import {
    TreeDeciduous,
    ImageIcon,
    Leaf,
    AlertTriangle,
    LucideIcon,
} from "lucide-react";
import { format } from "date-fns";

interface OverviewProps {
    label: string;
    value: number | string;
    icon: LucideIcon;
    description?: string;
}

export const useStatisticOverview = () => {
    const [overviewData, setOverviewData] = useState<OverviewProps[]>([]);
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

    const fetchOverview = useCallback(async () => {
        try {
            setLoading(true);
            const overv = await overview();
            if (overv) {
                setOverviewData([
                    {
                        label: "Total Trees",
                        value: overv.totalTrees,
                        icon: TreeDeciduous,
                        description: "+5 this month",
                    },
                    {
                        label: "Healthy Trees",
                        value: overv.healthyTrees,
                        icon: TreeDeciduous,
                        description: "80% of total trees",
                    },
                    {
                        label: "Diseased Trees",
                        value: overv.diseasedTrees,
                        icon: TreeDeciduous,
                        description: "20% of total trees",
                    },
                    {
                        label: "Total Images",
                        value: overv.totalImages,
                        icon: ImageIcon,
                        description: "+5 this month",
                    },
                    {
                        label: "Healthy Images",
                        value: overv.healthyLeaves,
                        icon: Leaf,
                        description: "65% of total leaves",
                    },
                    {
                        label: "Diseased Images",
                        value: overv.diseasedLeaves, // Fix: Corrected property
                        icon: AlertTriangle,
                        description: "35% of total leaves",
                    },
                ]);
            }
        } catch (error) {
            console.error("Failed to fetch overview data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOverview();
    }, [fetchOverview, imageLoading, treeLoading, analysisLoading]); // Fix: Added fetchOverview to dependencies

    return { loading, overviewData };
};

interface DateRange {
    from: string;
    to: string;
}
export const useTreeStatistic = (DateRange: DateRange | null) => {
    const [chartData, setChartData] = useState<
        { month: string; treeCount: number }[]
    >([]);
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

    const fetchTree = useCallback(async () => {
        if (!DateRange) return;
        setLoading(true);

        try {
            const ch = await treeStatistic(DateRange.from, DateRange.to);
            if (ch) {
                const formattedData = ch.map(
                    (item: {
                        year: number;
                        month: number;
                        treeCount: number;
                    }) => ({
                        month: format(
                            new Date(item.year, item.month - 1),
                            "MMMM"
                        ),
                        treeCount: item.treeCount,
                    })
                );
                setChartData(formattedData);
            }
        } catch (error) {
            console.error("Error fetching tree statistics:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTree();
    }, [fetchTree, DateRange, imageLoading, treeLoading, analysisLoading]);

    return { chartData, loading };
};
export const useImageStatistic = (DateRange: DateRange | null) => {
    const [chartData, setChartData] = useState<
        {
            month: string;
            healthy: number;
            diseased: number;
        }[]
    >([]);
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
        if (!DateRange) return;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const data = imageStatistic(DateRange?.from, DateRange?.to);
        if (data) {
            const formattedData = data.map(
                (item: {
                    month: number;
                    year: number;
                    diseasedCount: number;
                    healthyCount: number;
                }) => {
                    const monthName = format(
                        new Date(item.year, item.month - 1),
                        "MMMM"
                    );
                    return {
                        month: monthName,
                        healthy: item.healthyCount,
                        diseased: item.diseasedCount,
                    };
                }
            );
            setChartData(formattedData);
        }
    }, []);

    useEffect(() => {
        fetchImages();
    }, [fetchImages, DateRange, imageLoading, treeLoading, analysisLoading]);
    return { chartData, loading };
};
