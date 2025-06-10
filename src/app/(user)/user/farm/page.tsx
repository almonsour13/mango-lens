"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageWrapper from "@/components/wrapper/page-wrapper";
import {
    Plus,
    MapPin,
    Calendar,
    MoreVertical,
    Eye,
    Edit,
    TreeDeciduous,
    Activity,
    Percent,
    CheckCircle,
    AlertTriangle,
    Bug,
    ChevronUp,
    ChevronDown,
} from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "date-fns";
import { useFarms } from "@/hooks/use-farm";
import { useState } from "react";
import { FarmCard } from "@/components/card/farm-card";

export default function Farms() {
    const { farms, setFarms, loading } = useFarms();

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <h1 className="text-md font-semibold">Farms</h1>
                    <Badge variant="outline" className="text-xs">
                        {farms.length}
                    </Badge>
                </div>

                <Link href={`/user/farm/add`}>
                    <Button variant="outline" className="w-10 md:w-auto">
                        <Plus className="h-5 w-5" />
                        <span className="hidden md:block text-sm">
                            Add New Farm
                        </span>
                    </Button>
                </Link>
            </div>
            <PageWrapper>
                <CardHeader className="p-0">
                    <CardDescription>
                        Manage and monitor your farm properties
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex-1">
                    {farms.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Plus className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">
                                No farms yet
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Get started by adding your first farm
                            </p>
                            <Link href="/user/farm/add">
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Farm
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {farms.map((farm, index) => (
                               <FarmCard key={index} farm={farm} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </PageWrapper>
        </>
    );
}
