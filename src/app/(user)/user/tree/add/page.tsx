"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// UI Components
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

// Icons
import { ArrowLeft, TreeDeciduous } from "lucide-react";

// Contexts
import { useAuth } from "@/context/auth-context";
import { useCameraContext } from "@/context/camera-context";

// Utils
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { toast } from "@/hooks/use-toast";
import "@legendapp/state/react";
import { useRouter } from "next/navigation";
import React from "react";
import { addTree } from "@/stores/tree";
// import { addTree } from "@/stores/tree";

interface Message {
    id: string;
    text: string;
    timestamp: string;
}

const formSchema = z.object({
    treeCode: z
        .string()
        .min(2, { message: "Tree code must be at least 2 characters." })
        .max(10, { message: "Tree code must not exceed 10 characters." }),
    description: z.string().or(z.literal("")),
    treeImage: z.string().optional(),
});

export default function Page() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            treeCode: "",
            description: "",
            treeImage: "",
        },
    });

    const { userInfo } = useAuth();
    const { setIsCameraOpen } = useCameraContext();

    const router = useRouter();
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
        setLoading(true);
        if (!userInfo?.userID) return;
        const payload = {
            userID: userInfo?.userID,
            treeCode: values.treeCode,
            description: values.description,
            // treeImage: values.treeImage,
        };
        try {
            const res = await addTree(values.treeCode, values.description, values.treeImage);
            toast({
                title: res.success ? "Tree Added" : "Failed to Add Tree",
                description: res.message,
            });
            if (res.success) {
                router.back();
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
    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <button onClick={handleBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <Separator orientation="vertical" />
                    <h1 className="text-md">Add New Tree</h1>
                </div>
            </div>
            <PageWrapper>
                <CardHeader className="px-0">
                    <CardTitle>Add Tree Details</CardTitle>
                    <CardDescription>
                        Add the information for this tree in the monitoring
                        system.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col md:flex-row gap-8"
                        >
                            <div className="w-full md:w-1/3 ">
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
                                                            src={field.value}
                                                            alt="Profile picture"
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
                            <div className="w-full md:w-2/3 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="treeCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tree Code</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter tree code"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                A unique identifier for the tree
                                                (e.g., TR001)
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
                                                Tree Description(optional):
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter tree description"
                                                    {...field}
                                                    className="min-h-36"
                                                />
                                            </FormControl>
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
                                            !form.getValues().treeCode
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
