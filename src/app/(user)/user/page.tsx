"use client";
import { Farms } from "@/components/common/dashboard/farm-list";
import { RecentAnalysis } from "@/components/common/dashboard/recent-analysis";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useAuth } from "@/context/auth-context";
import { useMetrics } from "@/hooks/use-metrics";
import { getFarmByUser } from "@/stores/farm";
import { removeOldDatabase } from "@/stores/indexeddb";
import {
    AlertTriangle,
    BarChart3,
    Leaf,
    LucideIcon,
    Moon,
    Sun,
    TreeDeciduous,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button";


export default function Dashboard() {
    const { userInfo, resetToken } = useAuth();

    const handleLogout = async () => {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            window.location.href = "/signin";
            resetToken();
            removeOldDatabase();
        }
    };

    return (
        <>
            <div className="w-full flex flex-col items-center justify-center">
                <div className="px-4 h-14 w-full items-center flex justify-between">
                    <div className="flex items-center">
                        {/* <h1 className="text-md">Dashboard</h1> */}
                        <h1 className="text-md">
                            <span>
                                {"Hi "}
                                {userInfo?.fName},
                            </span>
                            {/* {treeLoading && imageLoading ? "loading" : "loaded"} */}
                        </h1>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <ThemeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="cursor-pointer h-8 w-8 border">
                                    {/* <AvatarImage
                                        src={userInfo?.profileImage}
                                        alt={`${userInfo?.fName} ${userInfo?.lName}`}
                                    /> */}
                                    <AvatarFallback className="text-xs">
                                        {(userInfo?.fName?.charAt(0) ?? "") +
                                            (userInfo?.lName?.charAt(0) ?? "")}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-40 md:w-56"
                                align="end"
                            >
                                <DropdownMenuLabel className="flex flex-col">
                                    <span className="text-md font-medium">
                                        {userInfo?.fName} {userInfo?.lName}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {userInfo?.email}
                                    </span>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <Link href="/user/settings">
                                        <DropdownMenuItem>
                                            Profile
                                            <DropdownMenuShortcut>
                                                ⌘P
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link href="/user/feedback">
                                        <DropdownMenuItem>
                                            Feedback
                                            <DropdownMenuShortcut>
                                                ⌘F
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link href="/user/settings/account">
                                        <DropdownMenuItem>
                                            Account
                                            <DropdownMenuShortcut>
                                                ⌘A
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link href="/user/settings">
                                        <DropdownMenuItem>
                                            Settings
                                            <DropdownMenuShortcut>
                                                ⌘S
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </Link>
                                </DropdownMenuGroup>
                                <DropdownMenuItem onClick={handleLogout}>
                                    Log out
                                    <DropdownMenuShortcut>
                                        ⇧⌘Q
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            <Welcome />
            <PageWrapper className="gap-2">
                <Metrics />
                <Farms />
                <div className="flex flex-col md:flex-row gap-4">
                    <RecentAnalysis />
                    {/* <RecentActivities /> */}
                </div>
            </PageWrapper>
        </>
    );
}
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="h-9 w-9 px-0 hover:bg-accent"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
};
const Welcome = () => {
    return (
        <div className="w-full px-4 py-0 flex flex-col items-center justify-center">
            <div className="w-full flex flex-col md:gap-2">
                <h1 className="text-2xl font-bold">
                    <span>Good {getGreeting()}</span>
                </h1>
                <p className="text-sm text-muted-foreground">
                    Here is a quick overview of your account and the progress
                    you have made.
                </p>
            </div>
        </div>
    );
};
interface Metric {
    name: string;
    value: number;
    detail: string;
    icon: LucideIcon;
}

const Metrics = () => {
    const { loading, metrics } = useMetrics();
    getFarmByUser();

    // Enhanced metrics with appropriate icons
    const enhancedMetrics = metrics.map((metric) => {
        let icon = metric.icon;
        const link = "";
        // Assign appropriate icons based on metric name if not already set
        if (!metric.icon) {
            if (metric.name.toLowerCase().includes("tree"))
                icon = TreeDeciduous;
            else if (metric.name.toLowerCase().includes("health")) icon = Leaf;
            else if (metric.name.toLowerCase().includes("disease"))
                icon = AlertTriangle;
            else icon = BarChart3;
        }
        return { ...metric, icon };
    });

    return (
        <div className="w-full">
            <div className="grid grid-cols-3 gap-2 md:gap-4">
                {loading
                    ? Array.from({ length: 3 }).map((_, index) => (
                          <Card key={index} className="border bg-card/50">
                              <CardContent className="p-4">
                                  <div className="flex items-center justify-between mb-3">
                                      <Skeleton className="h-4 w-16 bg-muted" />
                                      <Skeleton className="h-5 w-5 rounded bg-muted" />
                                  </div>
                                  <Skeleton className="h-8 w-12 mb-2 bg-muted" />
                                  <Skeleton className="h-3 w-20 bg-muted" />
                              </CardContent>
                          </Card>
                      ))
                    : enhancedMetrics.slice(0, 3).map((metric, index) => (
                          <Card
                              key={index}
                              className="border bg-card/50 hover:bg-card/70 transition-colors duration-200 shadow-none"
                          >
                              <CardContent className="p-4">
                                  <div className="flex items-center justify-between gap-3">
                                      <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground leading-tight">
                                          {metric.name}
                                      </CardTitle>
                                      <div className="flex-shrink-0 ml-2 hidden md:block">
                                          <metric.icon className="text-primary  h-4 w-4 md:h-5 md:w-5" />
                                      </div>
                                  </div>
                                  <div className="space-y-1">
                                      <div className="text-xl md:text-2xl font-bold text-foreground">
                                          {metric.value.toLocaleString()}
                                      </div>
                                      <p className="text-xs hidden md:block text-muted-foreground leading-tight">
                                          {metric.detail}
                                      </p>
                                  </div>
                              </CardContent>
                          </Card>
                      ))}
            </div>

            {/* Show additional metrics if more than 3 exist */}
            {!loading && enhancedMetrics.length > 3 && (
                <div className="grid grid-cols-3 gap-3 md:gap-4 mt-3 md:mt-4">
                    {enhancedMetrics.slice(3, 6).map((metric, index) => (
                        <Card
                            key={index + 3}
                            className="border bg-card/50 hover:bg-card/70 transition-colors duration-200"
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground leading-tight">
                                        {metric.name}
                                    </CardTitle>
                                    <div className="flex-shrink-0 ml-2">
                                        <metric.icon className="text-primary h-4 w-4 md:h-5 md:w-5" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xl md:text-2xl font-bold text-foreground">
                                        {metric.value.toLocaleString()}
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-tight">
                                        {metric.detail}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
