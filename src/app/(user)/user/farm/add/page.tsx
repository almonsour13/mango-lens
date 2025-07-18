"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
import { addFarm } from "@/stores/farm";

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
});

export default function AddFarm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            farmName: "",
            address: "",
            description: "",
        },
    });

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        setError(null);

        try {
            await addFarm(
                values.farmName,
                values.address,
                values.description
            );

            toast({
                title: "Farm Added",
                description: "Your farm has been successfully created.",
            });
            router.push("/user/farm");
        } catch (error) {
            console.log(error);
            setError("Failed to add farm. Please try again.");
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
                    <h1 className="text-md">Add New Farm</h1>
                </div>
            </div>

            <PageWrapper>
                <CardHeader className="p-0">
                    <CardDescription>Add farm information.</CardDescription>
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
                                            A unique name for your farm (e.g.,
                                            Sunny Acres)
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
                                            Describe your farm, what you grow,
                                            farming practices, etc.
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
                                        !form.getValues().farmName ||
                                        !form.getValues().address
                                    }
                                >
                                    {loading ? "Adding..." : "Add Farm"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </PageWrapper>
        </>
    );
}
