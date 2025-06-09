"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
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
import { ArrowLeft } from "lucide-react";
import { CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { getFarmByID, updateFarm } from "@/stores/farm";
import React from "react";
import type { Farm } from "@/types/types";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
    farmName: z
        .string()
        .min(2, { message: "Farm name must be at least 2 characters." })
        .max(50, { message: "Farm name must not exceed 50 characters." }),
    address: z
        .string()
        .min(2, { message: "Location must be at least 2 characters." })
        .max(100, { message: "Location must not exceed 100 characters." }),
    description: z.string().optional(),
    status: z.number(),
});

export default function EditFarm({
    params,
}: {
    params: Promise<{ farmID: string }>;
}) {
    const unwrappedParams = React.use(params);
    const { farmID } = unwrappedParams;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [editFarm, setEditFarm] = useState<Farm | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            farmName: "",
            address: "",
            description: "",
            status: 1,
        },
    });

    // Watch form values to detect changes
    const watchedValues = form.watch();

    useEffect(() => {
        const fetchFarmData = async () => {
            try {
                setInitialLoading(true);
                setError(null);
                const res = await getFarmByID(farmID);
                if (res.success && res.data) {
                    // Populate form with existing data
                    setEditFarm(res.data);
                    form.setValue("farmName", res.data.farmName);
                    form.setValue("address", res.data.address);
                    form.setValue("description", res.data.description || "");
                    form.setValue("status", res.data.status);
                } else {
                    setError(res.message || "Failed to fetch farm data");
                }
            } catch (error) {
                console.error("Error fetching farm data:", error);
                setError("Failed to load farm data. Please try again.");
            } finally {
                setInitialLoading(false);
            }
        };
        fetchFarmData();
    }, [farmID, form]);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        setError(null);

        try {
            const res = await updateFarm(
                farmID,
                values.farmName,
                values.address,
                values.status,
                values.description
            );

            if (res.success) {
                toast({
                    title: "Farm Updated",
                    description: "Your farm has been successfully updated.",
                });
                router.back()
            } else {
                setError(res.message || "Failed to update farm");
            }
        } catch (error) {
            console.log(error);
            setError("Failed to update farm. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    // Check if form values match original values
    const isFormUnchanged = editFarm
        ? watchedValues.farmName === editFarm.farmName &&
          watchedValues.address === editFarm.address &&
          (watchedValues.description || "") === (editFarm.description || "") &&
          watchedValues.status === editFarm.status
        : false;

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <button onClick={handleBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <Separator orientation="vertical" />
                    <h1 className="text-md">Edit Farm</h1>
                </div>
            </div>
            {initialLoading || !editFarm ? (
                <div className="min-h-screen w-full flex items-center justify-center">
                    loading
                </div>
            ) : (
                <PageWrapper>
                    <CardHeader className="p-0">
                        <CardDescription>
                            Update your farm information below.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="farmName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Farm Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter farm name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                A unique name for your farm
                                                (e.g., Sunny Acres)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter address"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                The address of your farm (e.g.,
                                                California, USA)
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
                                                Farm Description (optional)
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter farm description"
                                                    {...field}
                                                    className="min-h-36"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Describe your farm, what you
                                                grow, farming practices, etc.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel className="text-base">
                                                Active Status
                                            </FormLabel>
                                            <div className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0.5">
                                                <FormDescription
                                                    className={
                                                        field.value === 2
                                                            ? "text-destructive"
                                                            : "text-primary"
                                                    }
                                                >
                                                    {field.value === 1
                                                        ? "Farm is currently active"
                                                        : "Farm is currently inactive"}
                                                </FormDescription>
                                                <FormControl>
                                                    <Switch
                                                        checked={
                                                            field.value === 1
                                                        }
                                                        onCheckedChange={(
                                                            checked
                                                        ) => {
                                                            field.onChange(
                                                                checked ? 1 : 2
                                                            );
                                                        }}
                                                    />
                                                </FormControl>
                                            </div>
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
                                        disabled={loading || isFormUnchanged}
                                    >
                                        {loading
                                            ? "Updating..."
                                            : "Update Farm"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </PageWrapper>
            )}
        </>
    );
}
