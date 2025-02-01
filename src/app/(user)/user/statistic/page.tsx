"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import PageWrapper from "@/components/wrapper/page-wrapper";
import {
    AlertTriangle,
    Calendar1,
    Download,
    ImageIcon,
    Leaf,
    LucideIcon,
    TreeDeciduous,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ImageStatistic from "./image-statistic";
import TreeStatistic from "./tree-statistic";
import { useAuth } from "@/context/auth-context";
import { CustomDateRange } from "./date-range-picker";
import { format } from "date-fns";
import { overview } from "@/stores/statistic";

export default function Statistic() {
    const [openDownloadModal, setOpenDownloadModal] = useState(false);
    const [dateRange, setDateRange] = useState("3");
    const [formattedDateRange, setFormattedDateRange] = useState<{
        from: string;
        to: string;
    } | null>(null);
    const [isCustomDate, setIsCustomDate] = useState(false);
    const [customDate, setCustomDate] = useState<{
        from: string;
        to: string;
    } | null>(null);

    useEffect(() => {
        if (dateRange !== "custom") {
            setCustomDate(null);
            // Calculate the date 3 months ago
            const today = new Date();
            const monthsAgo = parseInt(dateRange, 10); // Get the date range value (e.g., "3")

            // Set the date to "monthsAgo" months before today
            const pastDate = new Date(
                today.setMonth(today.getMonth() - monthsAgo)
            );

            // Format the dates to the desired format (e.g., YYYY-MM-DD)
            const formattedFromDate = pastDate.toISOString().split("T")[0]; // YYYY-MM-DD
            const formattedToDate = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD

            setFormattedDateRange({
                from: formattedFromDate,
                to: formattedToDate,
            });
            // You can now use formattedFromDate and formattedToDate to filter or display data
        }
    }, [dateRange]);

    useEffect(() => {
        if (customDate) {
            setDateRange("custom");
            setFormattedDateRange(customDate);
        }
    }, [customDate]);

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <h1>Statistics</h1>
                </div>{" "}
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex items-center justify-center"
                            >
                                {customDate ? (
                                    <div className="flex gap-2">
                                        <span className="hidden md:block">
                                            {format(
                                                new Date(customDate.from),
                                                "MMM, dd yyyy"
                                            )}{" "}
                                            -{" "}
                                            {format(
                                                new Date(customDate.to),
                                                "MMM, dd yyyy"
                                            )}
                                        </span>{" "}
                                        <span className="font-semibold">
                                            Custom
                                        </span>
                                    </div>
                                ) : (
                                    <span>{`Last ${dateRange} months`}</span>
                                )}

                                <Calendar1 />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            {/* <DropdownMenuLabel>Range</DropdownMenuLabel>
                            <DropdownMenuSeparator /> */}
                            <DropdownMenuCheckboxItem
                                checked={dateRange == "3"}
                                onCheckedChange={() => {
                                    setDateRange("3");
                                }}
                            >
                                Last 3 months
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={dateRange == "6"}
                                onCheckedChange={() => {
                                    setDateRange("6");
                                }}
                            >
                                Last 6 months
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={dateRange == "12"}
                                onCheckedChange={() => {
                                    setDateRange("12");
                                }}
                            >
                                Last 12 months
                            </DropdownMenuCheckboxItem>

                            <DropdownMenuCheckboxItem
                                checked={
                                    dateRange == "custom" && customDate !== null
                                }
                                onClick={() => setIsCustomDate(true)}
                            >
                                custom
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button className="w-10 md:w-auto">
                        <Download className="" />
                        <span className="hidden md:block">Dowload Data</span>
                    </Button>
                </div>
            </div>
            <PageWrapper>
                <Overview />
                <div className="flex flex-col md:flex-row gap-4">
                    <TreeStatistic DateRange={formattedDateRange} />
                    <ImageStatistic DateRange={formattedDateRange} />
                </div>
            </PageWrapper>
            <CustomDateRange
                open={isCustomDate}
                setOpen={setIsCustomDate}
                setCustomDate={setCustomDate}
            />
        </>
    );
}
interface OverviewProps {
    label: string;
    value: number | string;
    icon: LucideIcon;
    description?: string;
}
const Overview = () => {
    const [overviewData, setOverviewData] = useState<OverviewProps[] | []>([]);

    const { userInfo } = useAuth();
    const fetchOverview = useCallback(async () => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 200));
            const overv = overview();
            if (overv) {
                const overviewData = [
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
                        label: "Healthy Leaves",
                        value: overv.healthyLeaves,
                        icon: Leaf,
                        description: "65% of total leaves",
                    },
                    {
                        label: "Diseased Leaves",
                        value: overv.healthyLeaves,
                        icon: AlertTriangle,
                        description: "35% of total leaves",
                    },
                ];
                setOverviewData(overviewData);
            }
        } catch (error) {
            console.error("Failed to fetch overview data:", error);
        }
    }, [userInfo?.userID]);

    useEffect(() => {
        if (userInfo?.userID) {
            fetchOverview();
        }
    }, [userInfo?.userID, fetchOverview]);
    return (
        <div className="w-full flex flex-col gap-2">
            <h2 className="text-lg font-semibold">Overview</h2>
            <div className="flex flex-col md:flex-row gap-2 rounded-lg">
                {overviewData && (
                    <>
                        <div className="flex-1 grid grid-cols-3 gap-2 p-0 rounded-lg">
                            {overviewData.slice(0, 3).map((overview, index) => (
                                <StatCard key={index} {...overview} />
                            ))}
                        </div>
                        <div className="flex-1 grid grid-cols-3 gap-2 p-0 rounded-lg">
                            {overviewData.slice(3, 6).map((overview, index) => (
                                <StatCard key={index} {...overview} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
interface statCardProps {
    label: string;
    value: number | string;
    icon: LucideIcon;
    description?: string;
}
const StatCard = ({ label, value, icon: Icon, description }: statCardProps) => (
    <Card className="shadow-none bg-card">
        {/* <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{label}</CardTitle>
        </CardHeader> */}
        <CardContent className="flex flex-col justify-center items-center p-4">
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground text-center">{label}</p>
            {/* <Icon className="h-4 w-4 text-muted-foreground" /> */}
            {/* {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )} */}
        </CardContent>
    </Card>
);
