"use client";

import type React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    ArrowLeft,
    TreeDeciduous,
    RefreshCw,
    AlertCircle,
    CheckCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { toast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { addTree, generateTreeCode } from "@/stores/tree";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Farm } from "@/types/types";
import { getFarmByUser } from "@/stores/farm";
import { useAuth } from "@/context/auth-context";
import { useCameraContext } from "@/context/camera-context";
import { Suspense } from "react"

const formSchema = z.object({
    farmID: z.string().min(1, { message: "Please select a farm." }),
    treeCode: z.string().min(1, { message: "Tree code is required." }),
    description: z.string().optional(),
    treeImage: z.string().optional(),
});

 function AddTreeContent() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [farms, setFarms] = useState<Farm[]>([]);
    const [codeValidation, setCodeValidation] = useState<{
        isChecking: boolean;
        isValid: boolean | null;
        message: string;
    }>({
        isChecking: false,
        isValid: null,
        message: "",
    });

    const searchParams = useSearchParams();
    const urlFarmID = searchParams.get("farmID");
    const router = useRouter();

    const { userInfo } = useAuth();
    const { setIsCameraOpen } = useCameraContext();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            farmID: urlFarmID || "",
            treeCode: "", // Will be set after generation
            description: "",
            treeImage: "",
        },
    });

    // Watch for farm ID changes in the form
    const selectedFarmID = form.watch("farmID");

    // Fetch farms data
    useEffect(() => {
        const getFarmData = async () => {
            try {
                const res = await getFarmByUser();
                if (res.success) {
                    setFarms(res.data as Farm[]);
                } else {
                    console.error("Failed to fetch farms:", res.message);
                    setError("Failed to load farms. Please try again.");
                }
            } catch (error) {
                console.error("Error fetching farms:", error);
                setError("Failed to load farms. Please try again.");
            }
        };
        getFarmData();
    }, []);

    // Set farmID from URL parameter only once on initial load
    useEffect(() => {
        if (urlFarmID) {
            form.setValue("farmID", urlFarmID);
        }
    }, [urlFarmID, form]);

    // Generate tree code when farm is selected or changed
    useEffect(() => {
        const initializeTreeCode = async () => {
            if (selectedFarmID) {
                setCodeValidation({
                    isChecking: true,
                    isValid: null,
                    message: "Generating code...",
                });
                try {
                    const code = await generateTreeCode(selectedFarmID);
                    form.setValue("treeCode", code);
                    setCodeValidation({
                        isChecking: false,
                        isValid: true,
                        message: "Tree code is available.",
                    });
                } catch (error) {
                    console.error("Error generating tree code:", error);
                    setCodeValidation({
                        isChecking: false,
                        isValid: null,
                        message: "Unable to generate tree code.",
                    });
                }
            }
        };

        if (selectedFarmID) {
            initializeTreeCode();
        }
    }, [selectedFarmID, form]);

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            form.setValue("treeImage", e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // Check if tree code is valid before submitting
        if (codeValidation.isValid === false) {
            setError(
                "Please generate a new tree code. The current code already exists."
            );
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await addTree(
                values.farmID,
                values.treeCode,
                values.description || "",
                values.treeImage || ""
            );

            toast({
                title: res.success ? "Tree Added" : "Failed to Add Tree",
                description: res.message,
            });

            if (res.success) {
                router.push(`/user/farm/${values.farmID}`);
            }
        } catch (error) {
            console.log(error);
            setError("Failed to add tree. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const selectedFarm = farms.find(
        (farm) => farm.farmID.toString() === selectedFarmID
    );

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <button onClick={handleBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <Separator orientation="vertical" />
                    <h1 className="text-md">
                        Add New Tree
                        {selectedFarm && (
                            <span className="text-muted-foreground ml-2">
                                to {selectedFarm.farmName}
                            </span>
                        )}
                    </h1>
                </div>
            </div>

            <PageWrapper>
                <CardHeader className="p-0">
                    <CardDescription>
                        Add tree information
                        {selectedFarm && (
                            <span className="ml-1">
                                to {selectedFarm.farmName} (
                                {selectedFarm.address})
                            </span>
                        )}
                        .
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col md:flex-row gap-8"
                        >
                            {/* Tree Image Section */}
                            <div className="w-full md:w-1/3">
                                <FormField
                                    control={form.control}
                                    name="treeImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Tree Image (optional)
                                            </FormLabel>
                                            <FormControl>
                                                <div className="flex flex-col items-center justify-center gap-4">
                                                    <Avatar className="w-48 md:w-4/6 h-auto aspect-square items-start">
                                                        <AvatarImage
                                                            src={
                                                                field.value ||
                                                                "/placeholder.svg"
                                                            }
                                                            alt="Tree image"
                                                        />
                                                        <AvatarFallback className="bg-primary/10">
                                                            <TreeDeciduous className="h-16 w-16 text-primary" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative flex items-center w-full">
                                                            <Input
                                                                type="file"
                                                                id="avatar-upload"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={
                                                                    handleAvatarChange
                                                                }
                                                            />
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    asChild
                                                                >
                                                                    <Button type="button">
                                                                        {field.value
                                                                            ? "Change"
                                                                            : "Upload"}
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent>
                                                                    <Label htmlFor="avatar-upload">
                                                                        <DropdownMenuItem className="h-10">
                                                                            Select
                                                                        </DropdownMenuItem>
                                                                    </Label>
                                                                    <DropdownMenuItem
                                                                        className="h-10"
                                                                        onClick={() =>
                                                                            setIsCameraOpen(
                                                                                true
                                                                            )
                                                                        }
                                                                    >
                                                                        Camera
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                        {field.value && (
                                                            <Button
                                                                variant="destructive"
                                                                type="button"
                                                                onClick={() => {
                                                                    form.setValue(
                                                                        "treeImage",
                                                                        ""
                                                                    );
                                                                }}
                                                            >
                                                                Remove
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Form Fields Section */}
                            <div className="w-full md:w-2/3 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="farmID"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Farm</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose a farm to add the tree to" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {farms.map((farm) => (
                                                        <SelectItem
                                                            key={farm.farmID}
                                                            value={farm.farmID.toString()}
                                                        >
                                                            <div className="flex flex-col items-start">
                                                                <span className="font-medium">
                                                                    {
                                                                        farm.farmName
                                                                    }
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {
                                                                        farm.address
                                                                    }
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                {urlFarmID
                                                    ? "Farm pre-selected from your navigation"
                                                    : "Select which farm this tree belongs to"}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="treeCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tree Code</FormLabel>
                                            <FormControl>
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <Input
                                                            {...field}
                                                            readOnly
                                                            className="bg-muted pr-10"
                                                        />
                                                        {codeValidation.isChecking && (
                                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                                                            </div>
                                                        )}
                                                        {!codeValidation.isChecking &&
                                                            codeValidation.isValid ===
                                                                true && (
                                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                                </div>
                                                            )}
                                                        {!codeValidation.isChecking &&
                                                            codeValidation.isValid ===
                                                                false && (
                                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                <span
                                                    className={`text-sm ${
                                                        codeValidation.isValid ===
                                                        true
                                                            ? "text-green-600"
                                                            : codeValidation.isValid ===
                                                              false
                                                            ? "text-red-600"
                                                            : "text-muted-foreground"
                                                    }`}
                                                >
                                                    {codeValidation.message ||
                                                        "Auto-incremented unique identifier (TR001, TR002, etc.). Click refresh to generate the next available code."}
                                                </span>
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Tree Description (optional)
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter tree description"
                                                    {...field}
                                                    className="min-h-36"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Describe the tree species,
                                                variety, or any other details
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {error && (
                                    <p
                                        className="text-sm text-red-500"
                                        role="alert"
                                    >
                                        {error}
                                    </p>
                                )}

                                <div className="flex justify-end gap-2 md:gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleBack}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={
                                            loading ||
                                            !form.getValues().farmID ||
                                            codeValidation.isChecking ||
                                            codeValidation.isValid === false
                                        }
                                    >
                                        {loading ? "Adding..." : "Add Tree"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </PageWrapper>
        </>
    );
}
export default function AddTreePage (){
    return (
    <Suspense fallback={<div>loading</div>}>
      <AddTreeContent />
    </Suspense>
  )
}
