"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useFarmData } from "@/hooks/use-farm-data";
import { ArrowLeft, Info, Plus, TreeDeciduous, Trees } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { addTree, generateTreeCode } from "@/stores/tree";
import { toast } from "@/hooks/use-toast";

export default function ({ params }: { params: Promise<{ farmID: string }> }) {
    const unwrappedParams = React.use(params);
    const { farmID } = unwrappedParams;
    const { farm, setFarm, trees, loading } = useFarmData(farmID);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const router = useRouter();
  const [isAddingTree, setIsAddingTree] = useState(false)

    const addNewTree = async () => {
        setIsAddingTree(true)
        const newTreeCode = await generateTreeCode(farmID);

        if (newTreeCode) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
            const res = await addTree(farmID, newTreeCode, "");
            if (res.success) {
                toast({
                    title: "Success",
                    description: "New tree code generated successfully",
                });
                router.push(`/user/scan/${farmID}/${res.data.treeID}`)
            } else {
                toast({
                    title: "Error",
                    description: "Failed to generate new tree code",
                    variant: "destructive",
                });
            }
            setIsAddingTree(false)
        }

        // alert(res)
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <button onClick={handleBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <Separator orientation="vertical" />
                    <h1 className="text-md">Tree Selection</h1>
                </div>
                <Popover open={isInfoOpen} onOpenChange={setIsInfoOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Info className="h-4 w-4 text-primary" />
                            <span>About Tree Codes</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="end">
                        <div className="p-4 pb-2">
                            <div className="flex items-center gap-2 mb-1">
                                <Info className="h-5 w-5 text-primary" />
                                <h4 className="font-medium">
                                    Automatic Tree Code Generation
                                </h4>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                                How tree codes work in our system
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-4">
                            <div className="space-y-3">
                                <p className="text-sm">
                                    When you add a new tree, a unique tree code
                                    will be automatically generated. You don't
                                    need to create one yourself.
                                </p>

                                <div className="bg-background/80 rounded p-3 border border-border/50">
                                    <p className="text-xs font-medium mb-1">
                                        How it works:
                                    </p>
                                    <ul className="text-xs text-muted-foreground space-y-1.5">
                                        <li className="flex items-start gap-2">
                                            <div className="min-w-4 mt-0.5">
                                                1.
                                            </div>
                                            <div>
                                                Click "Add New Tree" button
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="min-w-4 mt-0.5">
                                                2.
                                            </div>
                                            <div>
                                                System automatically generates a
                                                unique tree code
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="min-w-4 mt-0.5">
                                                3.
                                            </div>
                                            <div>
                                                New tree is added to your farm
                                                with this code
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    Tree codes follow a standardized format to
                                    ensure uniqueness and traceability across
                                    your farm.
                                </p>
                            </div>

                            <div className="mt-3 pt-3 border-t border-primary/10">
                                <div className="flex items-center gap-1.5 text-xs text-primary">
                                    <Info className="h-3.5 w-3.5" />
                                    <span>
                                        You can reference trees by their code in
                                        all analysis reports
                                    </span>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <PageWrapper>
                <CardHeader className="p-0">
                    {/* <CardTitle>Image Gallery</CardTitle> */}
                    <CardDescription>
                        Select a tree code from the selected farm or add a new
                        one
                    </CardDescription>
                </CardHeader>
                {farm && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Farm:</span>
                        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded">
                            <Trees className="h-3.5 w-3.5 text-primary" />
                            <span className="text-sm font-medium">
                                {farm.farmName}
                            </span>
                        </div>
                    </div>
                )}

                <CardContent className="p-0 flex-1">
                    {trees && trees.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                            {trees.map((tree, index) => (
                                <Link
                                    href={`/user/scan/${farmID}/${tree.treeID}`}
                                    key={index}
                                >
                                    <Card className="hover:border-primary/50 hover:bg-muted/50">
                                        <CardHeader>
                                            <CardTitle className="text-lg">
                                                {tree.treeCode}
                                            </CardTitle>
                                            {/* <CardDescription className="flex items-center gap-1 text-xs">
                                                <MapPin className="h-3 w-3" />
                                                {tree.}
                                            </CardDescription> */}
                                        </CardHeader>
                                    </Card>
                                </Link>
                            ))}
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full h-full flex flex-col gap-0 p-4 border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                                onClick={addNewTree}
                            >
                                <div className="flex">
                                    {!isAddingTree && <Plus className="w-5 h-5 mr-3" />}
                                    <span className="font-medium">
                                        {!isAddingTree?"Add New Tree":"Generating tree code..."}
                                    </span>
                                </div>
                            </Button>
                        </div>
                    ) : (
                        <Card className="border-fashed ">
                            <CardContent className="p-4 pt-4 text-center">
                                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <TreeDeciduous className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <div className="space-y-3 mb-8">
                                    <h3 className="text-xl font-semibold text-foreground">
                                        No Trees Available
                                    </h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                                        Get started by adding your first tree to
                                        this farm to begin leaf analysis
                                    </p>
                                    <div className="flex items-center justify-center gap-2 text-sm text-primary">
                                        <Info className="h-4 w-4" />
                                        <span>
                                            Tree codes are automatically
                                            generated when you add a new tree
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full h-full p-4 border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                                    onClick={addNewTree}
                                >
                                    {!isAddingTree && <Plus className="w-5 h-5 mr-3" />}
                                    <span className="font-medium">
                                        {!isAddingTree?"Add Your First Tree":"Generating tree code..."}
                                    </span>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </PageWrapper>
        </>
    );
}
