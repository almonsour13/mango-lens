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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TreeDeciduous, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { format } from "date-fns";
import { treeStatistic } from "@/stores/statistic";

const chartConfig = {
    treeCount: {
        label: "Trees Added",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;
interface DateRange {
    from: string;
    to: string;
}
export default function TreeStatistic({
    DateRange,
}: {
    DateRange: DateRange | null;
}) {
    const pathname = usePathname();
    const { userInfo } = useAuth();
    const [chartData, setChartData] = useState<
        { month: string; treeCount: number }[] | []
    >([]);
    const [loading, setLoading] = useState(false);

    const fetchTree = useCallback(async () => {
        setLoading(true);
        if (!userInfo?.userID || !DateRange) return;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const ch = treeStatistic(
            DateRange?.from,
            DateRange?.to,
            userInfo?.userID
        );
        if (ch) {
            const formattedData = ch.map(
                (item: { year: number; month: number; treeCount: number }) => {
                    const monthName = format(
                        new Date(item.year, item.month - 1),
                        "MMMM"
                    );
                    return { month: monthName, treeCount: item.treeCount };
                }
            );
            setChartData(formattedData);
        }
    }, [userInfo?.userID, DateRange]);

    useEffect(() => {
        if (userInfo?.userID) {
            fetchTree();
        }
    }, [userInfo?.userID, DateRange, fetchTree]);
    return (
        <div className="w-full flex flex-col gap-2 flex-1">
            <div className="w-full flex items-center justify-between">
                <h2 className="text-lg font-semibold">Tree Statistics</h2>
                <Link
                    href={`${pathname}/tree`}
                    className="text-sm text-primary"
                >
                    See All
                </Link>
            </div>
            <Card className="bg-card border-0 shadow-none">
                <CardHeader>
                    {/* <CardTitle className="text-lg">Tree Added</CardTitle> */}
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
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                top: 20,
                            }}
                        >
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
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar
                                dataKey="treeCount"
                                fill="var(--color-treeCount)"
                                radius={8}
                            >
                                <LabelList
                                    position="top"
                                    offset={12}
                                    className="fill-foreground"
                                    fontSize={12}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                        +5 this month <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                        Showing total tree added for the last 6 months
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
