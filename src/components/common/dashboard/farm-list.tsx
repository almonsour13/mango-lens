"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useFarms } from "@/hooks/use-farm";
import Link from "next/link";

import { DashboardFarmCard } from "@/components/card/dashboard-farm-card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import React, { useEffect } from "react";
export const Farms = () => {
    const { farms, setFarms, loading } = useFarms();
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <Card className="border-0 p-0 shadow-none flex-1">
            <div className="py-2 w-full flex items-center justify-between">
                <CardTitle className="text-lg">Farms</CardTitle>{" "}
                <Link
                    href={`/user/farm`}
                    className="hover:underline text-primary"
                >
                    View All
                </Link>
            </div>
            <CardContent className="p-0 bg-carda flex w-full border-0 rounded-md overflow-hidden">
                <div className="hidden md:grid gap-2 md:gap-4 grid-cols-2 lg:grid-cols-4 w-full">
                    {farms.slice(0, 4).map((farm, index) => (
                        <DashboardFarmCard farm={farm} key={index} />
                    ))}
                </div>

                <Carousel setApi={setApi} className="w-full md:hidden">
                    <CarouselContent>
                        {farms.slice(0, 4).map((farm, index) => (
                            <CarouselItem key={index} >
                                <DashboardFarmCard farm={farm} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="py-2 text-center space-x-1">
                        {farms.slice(0, 4).map((_, index) => (
                            <Button
                                key={index}
                                variant={
                                    current === index ? "default" : "outline"
                                }
                                size="sm"
                                className="w-2 h-2 rounded-full p-0 m-0"
                                onClick={() => api?.scrollTo(index)}
                            />
                        ))}
                    </div>
                </Carousel>
            </CardContent>
        </Card>
    );
};
