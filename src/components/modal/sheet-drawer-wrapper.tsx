import {
    Bar,
    BarChart,
    CartesianGrid,
    Label,
    Pie,
    PieChart,
    XAxis,
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";

const PieChartData = [
    { status: "Healthy", count: 130, fill: "var(--color-healthy)" },
    { status: "Diseased", count: 70, fill: "var(--color-diseased)" },
];

const PieChartConfig = {
    count: {
        label: "Images",
    },
    healthy: {
        label: "Healthy",
        color: "hsl(var(--primary))",
    },
    diseased: {
        label: "Diseased",
        color: "hsl(var(--destructive))",
    },
} satisfies ChartConfig;
export default function ImageStatistic() {
    const totalImages = React.useMemo(() => {
        return PieChartData.reduce((acc, curr) => acc + curr.count, 0);
    }, []);

    return (
        <div className="flex flex-col flex-1 gap-2">
            <div className="w-full flex items-center justify-between">
                <h2 className="text-lg font-semibold">Image Statistics</h2>
            </div>
            <div className="flex-1 pb-0 bg-card rounded-lg">
                <ChartContainer
                    config={PieChartConfig}
                    className="mx-auto aspect-square md:h-80"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={PieChartData}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (
                                        viewBox &&
                                        "cx" in viewBox &&
                                        "cy" in viewBox
                                    ) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalImages.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Total Images
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </div>
        </div>
    );
}
