"use client";

import AddFarmModal from "@/components/modal/add-farm-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useFarms } from "@/hooks/use-farm";
import { MapPin, Plus, Trees } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
    const { farms, setFarms, loading } = useFarms();
    const [addFarmModalOpen, setAddFarmModalOpen] = useState(false);

    const handleBack = () => {};

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    {/* <Separator orientation="vertical" /> */}
                    <h1 className="text-md">Farm Selection</h1>
                </div>
            </div>
            <PageWrapper>
                <CardHeader className="p-0">
                    {/* <CardTitle>Image Gallery</CardTitle> */}
                    <CardDescription>
                        Select a farm for leaf analysis or add a new one
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex-1">
                    {farms && farms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                            {farms.map((farm, index) => {
                                const isActive = farm.status === 1;

                                const FarmCardContent = (
                                    <Card
                                        key={farm.farmID}
                                        className={`
                                            bg-card/50 shadow-none
                                            ${
                                            isActive
                                                ? "hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
                                                : "opacity-60 cursor-not-allowed"
                                        } transition-all relative`}
                                    >
                                        {!isActive && (
                                            <div className="absolute inset-0 bg-background/50 backdrop-blur-[0.7px] rounded-lg flex items-center justify-center z-10">
                                                <div className="text-center p-4">
                                                    <h1 className="text-sm font-bold mb-1">
                                                        Cannot be selected
                                                    </h1>
                                                    <div className="text-xs text-muted-foreground">
                                                        This farm is currently inactive
                                                    </div>
                                                    <Link
                                                       href={`/user/farm/${farm.farmID}/edit`}
                                                       className="text-xs text-primary underline"
                                                    >
                                                        Click here to activate
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                        <CardHeader className="">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-lg font-semibold truncate">
                                                        {farm.farmName}
                                                    </CardTitle>
                                                    <div className="">
                                                        <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                                                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                                            <span className="text-xs truncate">
                                                                {farm.address ||
                                                                    "No address specified"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                                                            <Trees className="w-3.5 h-3.5 flex-shrink-0" />
                                                            <span className="text-xs truncate">
                                                                {farm.totalTrees ? (
                                                                    <>
                                                                        {
                                                                            farm.totalTrees
                                                                        }{" "}
                                                                        {farm.totalTrees ===
                                                                        1
                                                                            ? "tree"
                                                                            : "trees"}
                                                                    </>
                                                                ) : (
                                                                    "No trees"
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 ml-3">
                                                    <Badge
                                                        variant={
                                                            farm.status === 1
                                                                ? "default"
                                                                : "destructive"
                                                        }
                                                        className={`font-medium text-xs px-2 py-0.5`}
                                                    >
                                                        {farm.status === 1
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                );

                                return isActive ? (
                                    <Link
                                        href={`/user/scan/${farm.farmID}`}
                                        key={index}
                                    >
                                        {FarmCardContent}
                                    </Link>
                                ) : (
                                    <div
                                        key={index}
                                        title="This farm is inactive and cannot be selected"
                                    >
                                        {FarmCardContent}
                                    </div>
                                );
                            })}
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full h-full p-4 border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                                onClick={() => {
                                    setAddFarmModalOpen(true);
                                }}
                            >
                                <Plus className="w-5 h-5 mr-3" />
                                <span className="font-medium">
                                    Add New Farm
                                </span>
                            </Button>
                        </div>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="p-12 text-center">
                                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Trees className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <div className="space-y-3 mb-8">
                                    <h3 className="text-xl font-semibold text-foreground">
                                        No Farms Available
                                    </h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                                        Get started by adding your first farm to
                                        begin leaf analysis
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full h-full p-4 border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                                    onClick={() => {
                                        setAddFarmModalOpen(true);
                                    }}
                                >
                                    <Plus className="w-5 h-5 mr-3" />
                                    <span className="font-medium">
                                        Add Your First Farm
                                    </span>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </PageWrapper>
            <AddFarmModal
                farm={farms}
                setFarm={setFarms}
                openDialog={addFarmModalOpen}
                setOpenDialog={setAddFarmModalOpen}
            />
        </>
    );
}
