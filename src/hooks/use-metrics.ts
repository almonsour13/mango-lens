import { useEffect, useState } from "react";
import { loadingStore$ } from "@/stores/loading-store";
import { dashboardMetrics } from "@/stores/dashboard";
import { TreeDeciduous, ImageIcon, Radar, Percent, Trees } from "lucide-react";

interface Metric {
    name: string;
    value: number;
    detail: string;
    icon: React.ElementType;
}

export const useMetrics = () => {;
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [loading, setLoading] = useState(true)
    const [treeLoading, setTreeLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [analysisLoading, setAnalysisLoading] = useState(false);

    // Icons mapping
    const icons = [
        { name: "Total Farms", icon: Trees },
        { name: "Total Trees", icon: TreeDeciduous },
        { name: "Total Images", icon: ImageIcon },
    ];

    // Listen for changes in loading states
    useEffect(() => {
        const unsubscribeUser = loadingStore$.tree.onChange(({ value }) =>
            setUserLoading(value)
        );
        const unsubscribeTree = loadingStore$.tree.onChange(({ value }) =>
            setTreeLoading(value)
        );
        const unsubscribeImage = loadingStore$.image.onChange(({ value }) =>
            setImageLoading(value)
        );
        const unsubscribeAnalysis = loadingStore$.analysis.onChange(({ value }) =>
            setAnalysisLoading(value)
        );

        return () => {
            unsubscribeTree();
            unsubscribeImage();
            unsubscribeAnalysis();
        };
    }, []);

    // Fetch metrics when loading states allow it
    useEffect(() => {
        const loadMetrics = async () => {

            setLoading(true);
            try {
                const metricsData = await dashboardMetrics();
                const formattedMetrics = (metricsData as Metric[]).map((metric) => ({
                    ...metric,
                    icon:
                        icons.find((icon) => icon.name === metric.name)?.icon ||
                        TreeDeciduous,
                }));
                setMetrics(formattedMetrics);
            } catch (error) {
                console.error("Error loading metrics:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!imageLoading && !treeLoading && !analysisLoading) {
            loadMetrics();
        }
    }, [imageLoading, treeLoading, analysisLoading]);

    return { loading, metrics };
};
