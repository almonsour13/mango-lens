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

const chartData = [
    { month: "January", healthy: 186, diseased: 80 },
    { month: "February", healthy: 305, diseased: 200 },
    { month: "March", healthy: 237, diseased: 120 },
    { month: "April", healthy: 73, diseased: 190 },
    { month: "May", healthy: 209, diseased: 130 },
    { month: "June", healthy: 214, diseased: 140 },
];

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
interface ImageStatistic{
    month:string,
    year:string;
    diseasedCount:number;
    healthyCount:number;
}
export default function ImageStatistic({
    DateRange,
}: {
    DateRange: DateRange | null;
}) {
    const pathname = usePathname();
    const { userInfo } = useAuth();
    const [chartData, setChartData] = useState<{
        month: string;
        healthy: number;
        diseased: number;
    }[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchImages = useCallback(async () => {
        setLoading(true);
        if (!userInfo?.userID || !DateRange) return;
        const data = imageStatistic(
            DateRange?.from,
            DateRange?.to,
                userInfo?.userID)
                if (data) {
                    const formattedData = data.map(
                        (item:{
                            month:number,
                            year:number;
                            diseasedCount:number;
                            healthyCount:number;
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
    }, [userInfo?.userID, DateRange]);

    useEffect(() => {
        if (userInfo?.userID) {
            fetchImages();
        }
    }, [userInfo?.userID, DateRange, fetchImages]);
    return (
        <div className="w-full flex flex-col gap-2 flex-1">
            <div className="w-full flex items-center justify-between">
                <h2 className="text-lg font-semibold">Image Statistics</h2>
                <Link
                    href={`${pathname}/tree`}
                    className="text-sm text-primary"
                >
                    See All
                </Link>
            </div>
            <Card className="bg-card border-0 shadow-none">
                <CardHeader>
                    {/* <CardTitle className="text-lg">Images Added</CardTitle> */}
                    <CardDescription>
                        {DateRange?.from
                            ? format(new Date(DateRange.from), 'MMM, dd yyyy')
                            : ""}
                        {" - "}
                        {DateRange?.to
                            ? format(new Date(DateRange.to),'MMM, dd yyyy')
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
                    <div className="flex gap-2 font-medium leading-none">
                        +5 this month <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                        Showing total visitors for the last 6 months
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
