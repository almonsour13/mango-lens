"use client";
import AddFarmModal from "@/components/modal/add-farm-modal";
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
import { getFarmByUser } from "@/stores/farm";
import { Farm } from "@/types/types";
import { MapPin, Plus, Trees } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
                            {farms.map((farm, index) => (
                                <Link
                                    href={`/user/scan/${farm.farmID}`}
                                    key={index}
                                >
                                    <Card className="hover:border-primary/50 hover:bg-muted/50">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg">
                                                {farm.farmName}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="">
                                            <div className="flex flex-col gap-1 text-xs">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                                    <span className="truncate">
                                                        {farm.address ||
                                                            "No address specified"}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Trees className="h-3.5 w-3.5 flex-shrink-0" />
                                                    <span>
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
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
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
                                    // onClick={onAddFarmClick}
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
// export default function Page() {
//     return (
//         <AuthProvider>
//             <Suspense fallback={<div>loading</div>}>
//                 <UploadField />
//             </Suspense>
//         </AuthProvider>
//     );
// }
