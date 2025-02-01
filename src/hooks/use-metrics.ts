import { useEffect, useState } from "react";
import { loadingStore$ } from "@/stores/loading-store";
import { dashboardMetrics } from "@/stores/dashboard";
import { TreeDeciduous, ImageIcon, Radar, Percent } from "lucide-react";

interface Metric {
    name: string;
    value: number;
    detail: string;
    icon: React.ElementType;
}

export const useMetrics = () => {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [treeLoading, setTreeLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [analysisLoading, setAnalysisLoading] = useState(false);

    // Icons mapping
    const icons = [
        { name: "Total Trees", icon: TreeDeciduous },
        { name: "Total Images", icon: ImageIcon },
        { name: "Disease Detected", icon: Radar },
        { name: "Detection Rate", icon: Percent },
    ];

    // Listen for changes in loading states
    useEffect(() => {
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
                // await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
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
