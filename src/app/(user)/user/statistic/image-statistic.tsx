import {
    Bar,
    BarChart,
    CartesianGrid,
    Label,
    LabelList,
    Pie,
    PieChart,
    XAxis,
} from "recharts";

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import React, { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/context/auth-context";
import { imageStatistic } from "@/stores/statistic";
import { useImageStatistic } from "@/hooks/use-statistic";

const chartConfig = {
    healthy: {
        label: "Healthy",
        color: "hsl(var(--primary))",
    },
    diseased: {
        label: "Diseased",
        color: "hsl(var(--destructive))",
    },
} satisfies ChartConfig;
interface DateRange {
    from: string;
    to: string;
}
interface ImageStatistic {
    month: string;
    year: string;
    diseasedCount: number;
    healthyCount: number;
}
export default function ImageStatistic({
    DateRange,
}: {
    DateRange: DateRange | null;
}) {
    const pathname = usePathname();

    const { chartData } = useImageStatistic(DateRange);
    return (
        <div className="w-full flex flex-col gap-2 flex-1">
            <div className="w-full flex items-center justify-between">
                <h2 className="text-lg font-semibold">Image Statistics</h2>
                {/* <Link
                    href={`${pathname}/tree`}
                    className="text-sm text-primary"
                >
                    See All
                </Link> */}
            </div>
            <Card className="bg-card border shadow-none">
                <CardHeader>
                    {/* <CardTitle className="text-lg">Images Added</CardTitle> */}
                    <CardDescription>
                        {DateRange?.from
                            ? format(new Date(DateRange.from), "MMM, dd yyyy")
                            : ""}
                        {" - "}
                        {DateRange?.to
                            ? format(new Date(DateRange.to), "MMM, dd yyyy")
                            : ""}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent indicator="dashed" />
                                }
                            />
                            <Bar
                                dataKey="healthy"
                                fill="var(--color-healthy)"
                                radius={4}
                            />
                            <Bar
                                dataKey="diseased"
                                fill="var(--color-diseased)"
                                radius={4}
                            />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="leading-none text-muted-foreground">
                        Showing total tree added from{" "}
                        {DateRange?.from
                            ? format(new Date(DateRange.from), "MMM, dd yyyy")
                            : ""}
                        {" to "}
                        {DateRange?.to
                            ? format(new Date(DateRange.to), "MMM, dd yyyy")
                            : ""}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
